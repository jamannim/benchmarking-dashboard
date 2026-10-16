import nodemailer from 'nodemailer';
import crypto from 'node:crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'bizlens-email-verification-secret-2026';
const GMAIL_USER = process.env.GMAIL_USER || 'jamannim@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'didgojyqtdmuaznh';

// 서버리스 컨테이너 재사용 시 인메모리 폴백용 저장소
const g = globalThis as unknown as { __bizlens_code_store?: Map<string, { codes: string[]; expiresAt: number }> };
if (!g.__bizlens_code_store) {
  g.__bizlens_code_store = new Map();
}
const codeStore = g.__bizlens_code_store;

export default async function handler(req: any, res: any) {
  // CORS 헤더 설정
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = await parseJson(req);
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return sendJson(res, 400, { success: false, message: '올바른 회사 이메일 주소를 입력해 주세요.' });
    }

    // 6자리 난수 인증코드 생성
    const authCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10분 유효시간

    // 인메모리 폴백 저장
    const existing = codeStore.get(email);
    const existingCodes = existing && existing.expiresAt > Date.now() ? existing.codes : [];
    codeStore.set(email, { codes: [...existingCodes, authCode], expiresAt });

    // Stateless HMAC 서명 생성 (서버리스 인스턴스 간 상태 불일치 원천 방지)
    const signature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(`${email}:${authCode}:${expiresAt}`)
      .digest('hex');

    const token = Buffer.from(JSON.stringify({ email, expiresAt, signature })).toString('base64');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
      connectionTimeout: 6000,
      greetingTimeout: 6000,
      socketTimeout: 6000,
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

    await transporter.sendMail({
      from: `"BIZLENS" <${GMAIL_USER}>`,
      to: email,
      subject: `[BIZLENS] 회원가입 인증번호 안내 (${authCode})`,
      html: htmlContent,
    });

    return sendJson(res, 200, {
      success: true,
      message: '인증 메일이 발송되었습니다. 수신함을 확인해 주세요.',
      token,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : '이메일 발송 중 오류가 발생했습니다.';
    return sendJson(res, 500, { success: false, message: `메일 발송 실패: ${errorMsg}` });
  }
}

function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

function sendJson(res: any, statusCode: number, payload: Record<string, any>) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

async function parseJson(req: any): Promise<Record<string, any>> {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  if (Buffer.isBuffer(req.body)) {
    try {
      return JSON.parse(req.body.toString('utf-8'));
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let bodyStr = '';
    const timer = setTimeout(() => resolve({}), 2000);
    req.on('data', (chunk: any) => {
      bodyStr += chunk.toString();
    });
    req.on('end', () => {
      clearTimeout(timer);
      try {
        resolve(bodyStr ? JSON.parse(bodyStr) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      clearTimeout(timer);
      resolve({});
    });
  });
}

