import crypto from 'node:crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'bizlens-email-verification-secret-2026';

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
    const rawCode = (body.code || '').toString();
    const cleanCode = rawCode.replace(/[^0-9]/g, '');
    const token = (body.token || '').trim();

    if (!email || !cleanCode) {
      return sendJson(res, 400, { success: false, message: '이메일과 6자리 인증코드를 모두 입력해 주세요.' });
    }

    let isValid = false;

    // 1) Stateless HMAC 토큰 검증 우선 수행
    if (token) {
      try {
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        if (tokenData.email?.toLowerCase() === email && Date.now() <= tokenData.expiresAt) {
          const expectedSignature = crypto
            .createHmac('sha256', AUTH_SECRET)
            .update(`${email}:${cleanCode}:${tokenData.expiresAt}`)
            .digest('hex');

          if (expectedSignature === tokenData.signature) {
            isValid = true;
          }
        }
      } catch {
        // 토큰 파싱 에러 시 메모리 폴백 진행
      }
    }

    // 2) 인메모리 폴백 검증 (동일 인스턴스거나 토큰 유실 시)
    if (!isValid) {
      const stored = codeStore.get(email);
      if (stored && Date.now() <= stored.expiresAt && stored.codes.includes(cleanCode)) {
        isValid = true;
        codeStore.delete(email);
      }
    }

    if (!isValid) {
      return sendJson(res, 400, {
        success: false,
        message: '인증번호 6자리가 일치하지 않거나 유효시간(10분)이 만료되었습니다. 다시 확인해 주세요.',
      });
    }

    return sendJson(res, 200, { success: true, message: '이메일 인증이 성공적으로 완료되었습니다.' });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : '인증 처리 중 오류가 발생했습니다.';
    return sendJson(res, 500, { success: false, message: errorMsg });
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

