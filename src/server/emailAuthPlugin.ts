import type { Plugin } from 'vite';
import nodemailer from 'nodemailer';
import fs from 'node:fs';
import crypto from 'node:crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'bizlens-email-verification-secret-2026';

interface VerificationEntry {
  codes: string[]; // 유효한 코드 목록 (재발송 시 이전 코드도 유효시간 내 허용)
  expiresAt: number;
}

// Vite HMR 및 리로드 시에도 초기화되지 않도록 globalThis에 영속 보관
const g = globalThis as unknown as { 
  __bizlens_code_store?: Map<string, VerificationEntry>;
  __bizlens_email_logs?: Array<any>;
};
if (!g.__bizlens_code_store) {
  g.__bizlens_code_store = new Map<string, VerificationEntry>();
}
if (!g.__bizlens_email_logs) {
  g.__bizlens_email_logs = [];
}
const codeStore = g.__bizlens_code_store;
const serverEmailLogs = g.__bizlens_email_logs;

// .env 환경변수 로드 함수
function getEnvCredentials(): { user: string; pass: string } {
  let user = process.env.GMAIL_USER || '';
  let pass = process.env.GMAIL_APP_PASSWORD || '';

  if (!user || !pass) {
    try {
      if (fs.existsSync('.env')) {
        const envContent = fs.readFileSync('.env', 'utf-8');
        envContent.split('\n').forEach((line) => {
          const [k, ...v] = line.split('=');
          if (!k || !v.length) return;
          const key = k.trim();
          const val = v.join('=').trim();
          if (key === 'GMAIL_USER') user = val;
          if (key === 'GMAIL_APP_PASSWORD') pass = val;
        });
      }
    } catch {
      // ignore
    }
  }

  return {
    user: user || 'jamannim@gmail.com',
    pass: pass || 'didgojyqtdmuaznh',
  };
}

export function emailAuthServerPlugin(): Plugin {
  return {
    name: 'email-auth-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // 1. 인증번호 발송 API (POST /api/auth/send-verification-code)
        if (url.startsWith('/api/auth/send-verification-code') && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const email = (body.email || '').trim().toLowerCase();

            if (!email || !email.includes('@')) {
              sendJsonResponse(res, 400, { success: false, message: '올바른 이메일 주소를 입력해 주세요.' });
              return;
            }

            // 6자리 난수 인증코드 생성
            const authCode = Math.floor(100000 + Math.random() * 900000).toString();
            // 유효시간 10분 설정 (사용자 메일 수신 지연 고려)
            const expiresAt = Date.now() + 10 * 60 * 1000;

            const existing = codeStore.get(email);
            const existingCodes = existing && existing.expiresAt > Date.now() ? existing.codes : [];
            const updatedCodes = [...existingCodes, authCode];

            codeStore.set(email, { codes: updatedCodes, expiresAt });

            const { user, pass } = getEnvCredentials();

            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: { user, pass },
            });

            const htmlContent = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #0b1120; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #22d3ee; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">BIZLENS</h1>
                  <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">비즈니스 분석 & 벤치마킹 인텔리전스</p>
                </div>
                <div style="background-color: #1e293b; padding: 28px 20px; border-radius: 12px; border: 1px solid #334155; text-align: center;">
                  <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 16px 0; font-weight: 500;">
                    회원가입 이메일 인증번호입니다.
                  </p>
                  <div style="font-size: 34px; font-weight: 900; color: #38bdf8; letter-spacing: 8px; padding: 14px 24px; background-color: #0f172a; border-radius: 10px; border: 2px dashed #0284c7; display: inline-block;">
                    ${authCode}
                  </div>
                  <p style="color: #94a3b8; font-size: 12px; margin: 18px 0 0 0;">
                    인증번호 유효시간: <strong style="color: #f59e0b;">10분</strong>
                  </p>
                </div>
                <p style="color: #64748b; font-size: 11px; text-align: center; margin: 24px 0 0 0; line-height: 1.6;">
                  본 메일은 BIZLENS 회원가입 요청에 의해 자동 발송되었습니다.<br />
                  본인이 요청하지 않은 경우 이 메일을 무시해 주세요.
                </p>
              </div>
            `;

            const startTime = Date.now();
            await transporter.sendMail({
              from: `"BIZLENS" <${user}>`,
              to: email,
              subject: `[BIZLENS] 회원가입 인증번호 안내 (${authCode})`,
              html: htmlContent,
            });
            const latencyMs = Date.now() - startTime;

            console.log(`[Email Auth] Code ${authCode} sent to ${email}. Active valid codes: [${updatedCodes.join(', ')}]`);

            // 관리자 분석용 서버 이력 로그 누적
            serverEmailLogs.unshift({
              id: `log-srv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              timestamp: new Date().toISOString(),
              formattedDate: new Date().toLocaleString('ko-KR', { hour12: false }),
              recipientEmail: email,
              purpose: '비밀번호 재설정 인증코드',
              status: 'SUCCESS',
              statusCode: 200,
              provider: 'Gmail SMTP',
              senderAddress: user,
              verificationCode: authCode,
              latencyMs,
              responseMessage: '250 2.0.0 OK: queued as live-smtp',
              solutionNote: 'Gmail SMTP 트랜스포터를 통한 즉시 전달 완료',
            });

            // Stateless HMAC 서명 토큰 생성
            const signature = crypto
              .createHmac('sha256', AUTH_SECRET)
              .update(`${email}:${authCode}:${expiresAt}`)
              .digest('hex');
            const token = Buffer.from(JSON.stringify({ email, expiresAt, signature })).toString('base64');

            sendJsonResponse(res, 200, {
              success: true,
              message: '인증 메일이 발송되었습니다. 수신함을 확인해 주세요.',
              token,
            });
            return;
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : '이메일 발송 중 오류가 발생했습니다.';
            console.error('[Email Auth Error]', errorMsg);

            serverEmailLogs.unshift({
              id: `log-srv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              timestamp: new Date().toISOString(),
              formattedDate: new Date().toLocaleString('ko-KR', { hour12: false }),
              recipientEmail: 'unknown',
              purpose: '비밀번호 재설정 인증코드',
              status: 'FAILED',
              statusCode: 500,
              provider: 'Gmail SMTP',
              senderAddress: 'jamannim@gmail.com',
              latencyMs: 1200,
              responseMessage: errorMsg,
              failureReason: errorMsg,
              solutionNote: 'SMTP 네트워크 또는 자격증명 점검 필요',
            });

            sendJsonResponse(res, 500, { success: false, message: `메일 발송 실패: ${errorMsg}` });
            return;
          }
        }

        // 3. 관리자 메일 발송 로그 조회 API (GET /api/admin/email-logs)
        if (url.startsWith('/api/admin/email-logs') && req.method === 'GET') {
          sendJsonResponse(res, 200, {
            success: true,
            logs: serverEmailLogs,
          });
          return;
        }

        // 2. 인증코드 검증 API (POST /api/auth/verify-code)
        if (url.startsWith('/api/auth/verify-code') && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const email = (body.email || '').trim().toLowerCase();
            const rawCode = (body.code || '').toString();
            const cleanCode = rawCode.replace(/[^0-9]/g, '');
            const token = (body.token || '').trim();

            console.log(`[Email Auth Verify Request] Email: "${email}", Input Code: "${cleanCode}"`);

            if (!email || !cleanCode) {
              sendJsonResponse(res, 400, { success: false, message: '이메일과 6자리 인증코드를 모두 입력해 주세요.' });
              return;
            }

            // 1) Stateless HMAC 토큰 검증
            let tokenValid = false;
            if (token) {
              try {
                const tokenData = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
                if (tokenData.email.toLowerCase() === email && Date.now() <= tokenData.expiresAt) {
                  const expectedSig = crypto
                    .createHmac('sha256', AUTH_SECRET)
                    .update(`${email}:${cleanCode}:${tokenData.expiresAt}`)
                    .digest('hex');
                  if (expectedSig === tokenData.signature) {
                    tokenValid = true;
                    console.log(`[Email Auth Verify Success via Token] ${email}`);
                  }
                }
              } catch {
                // 토큰 파싱 실패 시 메모리 검증으로 폴백
              }
            }

            // 2) 인메모리 저장소 검증 (폴백)
            const stored = codeStore.get(email);
            const memoryValid = Boolean(stored && Date.now() <= stored.expiresAt && stored.codes.includes(cleanCode));

            if (!tokenValid && !memoryValid) {
              if (stored && Date.now() > stored.expiresAt) {
                codeStore.delete(email);
                sendJsonResponse(res, 400, {
                  success: false,
                  message: '인증번호 유효시간(10분)이 만료되었습니다. 다시 발송해 주세요.',
                });
                return;
              }

              console.warn(`[Email Auth Verify Failed] Mismatch for ${email}. Input: "${cleanCode}"`);
              sendJsonResponse(res, 400, {
                success: false,
                message: '인증번호 6자리가 일치하지 않습니다. 가장 최근 수신된 메일의 번호를 입력해 주세요.',
              });
              return;
            }

            // 인증 성공: 사용된 세션 정리
            if (stored) codeStore.delete(email);
            console.log(`[Email Auth Verify Success] ${email} verified successfully with code ${cleanCode}`);
            codeStore.delete(email);
            console.log(`[Email Auth Verify Success] ${email} verified successfully with code ${cleanCode}`);

            sendJsonResponse(res, 200, {
              success: true,
              message: '이메일 인증이 성공적으로 완료되었습니다.',
            });
            return;
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : '인증 처리 중 오류가 발생했습니다.';
            sendJsonResponse(res, 500, { success: false, message: errorMsg });
            return;
          }
        }

        next();
      });
    },
  };
}

// 헬퍼: Request Body JSON 파싱
function parseJsonBody(req: any): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    let bodyStr = '';
    req.on('data', (chunk: Buffer) => {
      bodyStr += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = bodyStr ? JSON.parse(bodyStr) : {};
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', (err: unknown) => reject(err));
  });
}

// 헬퍼: JSON 응답 전송
function sendJsonResponse(res: any, statusCode: number, data: Record<string, any>): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}
