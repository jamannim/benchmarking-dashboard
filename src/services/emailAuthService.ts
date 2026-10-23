import { addEmailDispatchLog } from './emailLogService';

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
export async function sendVerificationEmail(
  email: string,
  purpose: '비밀번호 재설정 인증코드' | '회원가입 이메일 인증' = '비밀번호 재설정 인증코드'
): Promise<EmailAuthResponse> {
  const startTime = Date.now();
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const res = await fetch('/api/auth/send-verification-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: normalizedEmail }),
    });

    const latencyMs = Date.now() - startTime;
    const rawText = await res.text();
    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      const errorMsg = res.status === 405 
        ? '서버 라우팅 오류 (HTTP 405): Vercel 서버리스 배포 갱신이 필요합니다.'
        : `메일 발송 서버 응답 오류 (HTTP ${res.status}). 잠시 후 다시 시도해 주세요.`;

      addEmailDispatchLog({
        recipientEmail: normalizedEmail,
        purpose,
        status: 'FAILED',
        statusCode: res.status,
        provider: 'Gmail SMTP',
        senderAddress: 'jamannim@gmail.com',
        latencyMs,
        responseMessage: errorMsg,
        failureReason: errorMsg,
        solutionNote: '서버 라우팅 및 엔드포인트 응답 상태 확인 필요',
      });

      return {
        success: false,
        message: errorMsg,
      };
    }

    if (!res.ok && !data.message) {
      const errorMsg = `메일 발송 실패 (HTTP ${res.status}). 잠시 후 다시 시도해 주세요.`;
      addEmailDispatchLog({
        recipientEmail: normalizedEmail,
        purpose,
        status: 'FAILED',
        statusCode: res.status,
        provider: 'Gmail SMTP',
        senderAddress: 'jamannim@gmail.com',
        latencyMs,
        responseMessage: errorMsg,
        failureReason: errorMsg,
        solutionNote: 'SMTP 서버 응답 및 자격증명 점검 필요',
      });

      return {
        success: false,
        message: errorMsg,
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

    const isSuccess = Boolean(data.success);
    const resultMsg = data.message || (isSuccess ? '인증 메일이 발송되었습니다.' : '메일 발송에 실패했습니다.');

    // 관리자 실시간 로그 기록
    addEmailDispatchLog({
      recipientEmail: normalizedEmail,
      purpose,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      statusCode: isSuccess ? 200 : res.status || 500,
      provider: 'Gmail SMTP',
      senderAddress: 'jamannim@gmail.com',
      latencyMs,
      responseMessage: resultMsg,
      failureReason: isSuccess ? undefined : resultMsg,
      solutionNote: isSuccess 
        ? '자체 Gmail SMTP 트랜스포터를 통해 수신 메일함으로 정상 전송 완료'
        : 'SMTP 네트워크 설정 및 수신자 주소 재확인 필요',
      metadata: {
        clientIp: '127.0.0.1',
      },
    });

    return {
      success: isSuccess,
      message: resultMsg,
      token: data.token,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const msg = err instanceof Error ? err.message : '네트워크 통신 오류가 발생했습니다.';

    addEmailDispatchLog({
      recipientEmail: email.trim().toLowerCase(),
      purpose,
      status: 'FAILED',
      statusCode: 500,
      provider: 'Gmail SMTP',
      senderAddress: 'jamannim@gmail.com',
      latencyMs,
      responseMessage: msg,
      failureReason: `클라이언트 요청 예외 (${msg})`,
      solutionNote: '로컬 네트워크 및 백엔드 포트(5173) 응답 상태 확인 필요',
    });

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
      if (res.status === 405) {
        return {
          success: false,
          message: '인증 라우팅 오류 (HTTP 405): Vercel 서버리스 배포 갱신이 필요합니다.',
        };
      }
      return {
        success: false,
        message: `인증 서버 응답 오류 (HTTP ${res.status}). 잠시 후 다시 시도해 주세요.`,
      };
    }

    if (!res.ok && !data.message) {
      if (res.status === 405) {
        return {
          success: false,
          message: '인증 라우팅 오류 (HTTP 405): Vercel 서버리스 배포 갱신이 필요합니다.',
        };
      }
      return {
        success: false,
        message: `인증 처리 실패 (HTTP ${res.status}).`,
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

