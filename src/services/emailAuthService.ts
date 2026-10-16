/**
 * Gmail SMTP 기반 이메일 인증 서비스 (React 클라이언트용)
 */

export interface EmailAuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

// 메모리 캐시로 토큰 보관 (서버리스 HMAC 검증 연동용)
let inMemoryToken = '';

/**
 * 6자리 인증번호 이메일 발송 요청
 */
export async function sendVerificationEmail(email: string): Promise<EmailAuthResponse> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const res = await fetch('/api/auth/send-verification-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: normalizedEmail }),
    });

    const rawText = await res.text();
    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      return {
        success: false,
        message: `메일 발송 서버 응답 형식 오류 (HTTP ${res.status}). 잠시 후 다시 시도해 주세요.`,
      };
    }

    if (data.token) {
      inMemoryToken = data.token;
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(`bizlens_auth_token_${normalizedEmail}`, data.token);
          sessionStorage.setItem('bizlens_last_auth_token', data.token);
        }
      } catch {
        // sessionStorage 차단 환경 대응
      }
    }

    return {
      success: Boolean(data.success),
      message: data.message || (data.success ? '인증 메일이 발송되었습니다.' : '메일 발송에 실패했습니다.'),
      token: data.token,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '네트워크 통신 오류가 발생했습니다.';
    return {
      success: false,
      message: msg,
    };
  }
}

/**
 * 사용자가 입력한 6자리 인증코드 검증 요청
 */
export async function verifyAuthCode(
  email: string,
  code: string,
  explicitToken?: string
): Promise<EmailAuthResponse> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    
    // 명시적 토큰 -> 세션스토리지 -> 인메모리 순으로 토큰 획득
    let resolvedToken = explicitToken || '';
    if (!resolvedToken && typeof sessionStorage !== 'undefined') {
      try {
        resolvedToken =
          sessionStorage.getItem(`bizlens_auth_token_${normalizedEmail}`) ||
          sessionStorage.getItem('bizlens_last_auth_token') ||
          '';
      } catch {
        // ignore
      }
    }
    if (!resolvedToken) {
      resolvedToken = inMemoryToken;
    }

    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        code: code.trim(),
        token: resolvedToken,
      }),
    });

    const rawText = await res.text();
    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      return {
        success: false,
        message: `인증 서버 응답 형식 오류 (HTTP ${res.status}). 잠시 후 다시 시도해 주세요.`,
      };
    }

    return {
      success: Boolean(data.success),
      message: data.message || (data.success ? '인증이 완료되었습니다.' : '인증번호가 일치하지 않습니다.'),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '네트워크 통신 오류가 발생했습니다.';
    return {
      success: false,
      message: msg,
    };
  }
}

