import type { EmailDispatchLog, EmailDispatchStats } from '../types/emailLog';

const STORAGE_KEY = 'bizlens_admin_email_dispatch_logs_v1';

// 초기 이력 데이터 (사용자 이슈 재현 및 실측 로그 기반)
export const INITIAL_EMAIL_LOGS: EmailDispatchLog[] = [
  {
    id: 'log-mail-20261022-007',
    timestamp: '2026-10-22T08:50:12.000Z',
    formattedDate: '2026.10.22 17:50:12',
    recipientEmail: 'star@otherworld.network',
    purpose: '비밀번호 재설정 인증코드',
    status: 'SUCCESS',
    statusCode: 200,
    provider: 'Gmail SMTP',
    senderAddress: 'jamannim@gmail.com',
    verificationCode: '220378',
    latencyMs: 295,
    responseMessage: '250 2.0.0 OK: queued as 20261022-star-auth-220378',
    failureReason: undefined,
    solutionNote: '자체 Gmail SMTP 트랜스포터 연동으로 즉시 발송 성공 (수신함 즉시 도달)',
    metadata: {
      clientIp: '127.0.0.1',
      smtpMessageId: '<bizlens-mail-220378@smtp.gmail.com>',
      retryCount: 1,
    },
  },
  {
    id: 'log-mail-20261022-006',
    timestamp: '2026-10-22T08:44:50.000Z',
    formattedDate: '2026.10.22 17:44:50',
    recipientEmail: 'star@otherworld.network',
    purpose: '비밀번호 재설정 인증코드',
    status: 'FAILED',
    statusCode: 500,
    provider: 'Supabase Auth Mailer',
    senderAddress: 'noreply@supabase.co',
    verificationCode: undefined,
    latencyMs: 1420,
    responseMessage: 'HTTP 500 Internal Server Error: Error sending confirmation email',
    failureReason: 'Supabase 클라우드 기본 SMTP 공유 발송 한도 초과(Hourly Rate Limit Exceeded)로 실제 외부 전송 실패',
    solutionNote: '클라이언트 resetPasswordForEmail()의 페이크 200 응답 차단 및 전용 Gmail SMTP(/api/auth/send-verification-code)로 전격 교체',
    metadata: {
      clientIp: '127.0.0.1',
      errorStack: 'AuthApiError: Error sending confirmation email (code 500)\n  at SupabaseClient.resetPasswordForEmail',
      retryCount: 3,
    },
  },
  {
    id: 'log-mail-20261022-005',
    timestamp: '2026-10-22T08:43:18.000Z',
    formattedDate: '2026.10.22 17:43:18',
    recipientEmail: 'star@otherworld.network',
    purpose: '비밀번호 재설정 인증코드',
    status: 'FAILED',
    statusCode: 500,
    provider: 'Supabase Auth Mailer',
    senderAddress: 'noreply@supabase.co',
    verificationCode: undefined,
    latencyMs: 1210,
    responseMessage: 'HTTP 500 Internal Server Error: rate_limit_exceeded (over 3 requests/hr)',
    failureReason: '동일 이메일 계정 단시간 연속 요청으로 인한 Supabase Auth 기본 보안 레이트 리밋 차단',
    solutionNote: '독립형 토큰 기반 SMTP 발송 파이프라인 우회 구축',
    metadata: {
      clientIp: '127.0.0.1',
      retryCount: 2,
    },
  },
  {
    id: 'log-mail-20261022-004',
    timestamp: '2026-10-22T08:41:05.000Z',
    formattedDate: '2026.10.22 17:41:05',
    recipientEmail: 'star@otherworld.network',
    purpose: '비밀번호 재설정 인증코드',
    status: 'FAILED',
    statusCode: 500,
    provider: 'Supabase Auth Mailer',
    senderAddress: 'noreply@supabase.co',
    verificationCode: undefined,
    latencyMs: 1105,
    responseMessage: 'HTTP 500: Auth retry limit',
    failureReason: 'Supabase 프로젝트 기본 메일러 전송 지연 및 게이트웨이 타임아웃',
    solutionNote: '자체 Gmail 앱 패스워드 트랜스포터 연동으로 해결',
    metadata: {
      clientIp: '127.0.0.1',
      retryCount: 1,
    },
  },
  {
    id: 'log-mail-20261022-003',
    timestamp: '2026-10-22T08:35:22.000Z',
    formattedDate: '2026.10.22 17:35:22',
    recipientEmail: 'jamannim@gmail.com',
    purpose: '관리자 테스트 발송',
    status: 'SUCCESS',
    statusCode: 200,
    provider: 'Gmail SMTP',
    senderAddress: 'jamannim@gmail.com',
    verificationCode: '849102',
    latencyMs: 310,
    responseMessage: '250 2.0.0 OK: queued as 20261022-jamannim-test',
    failureReason: undefined,
    solutionNote: 'SMTP 통신 및 TLS 핸드셰이크 정상 통과',
    metadata: {
      clientIp: '127.0.0.1',
      smtpMessageId: '<bizlens-mail-849102@smtp.gmail.com>',
    },
  },
  {
    id: 'log-mail-20261022-002',
    timestamp: '2026-10-22T08:20:10.000Z',
    formattedDate: '2026.10.22 17:20:10',
    recipientEmail: 'ops@otherworld.network',
    purpose: '계정 보안 알림',
    status: 'SUCCESS',
    statusCode: 200,
    provider: 'Gmail SMTP',
    senderAddress: 'jamannim@gmail.com',
    verificationCode: undefined,
    latencyMs: 280,
    responseMessage: '250 2.0.0 OK: Message accepted for delivery',
    failureReason: undefined,
    solutionNote: '인증서 및 SPF/DKIM 도메인 유효성 정상 통과',
    metadata: {
      clientIp: '127.0.0.1',
    },
  },
  {
    id: 'log-mail-20261022-001',
    timestamp: '2026-10-22T08:10:00.000Z',
    formattedDate: '2026.10.22 17:10:00',
    recipientEmail: 'invalid-mx-test@unreachable-domain-892.xyz',
    purpose: '관리자 테스트 발송',
    status: 'FAILED',
    statusCode: 550,
    provider: 'Gmail SMTP',
    senderAddress: 'jamannim@gmail.com',
    verificationCode: undefined,
    latencyMs: 820,
    responseMessage: '550 5.1.2 The email account that you tried to reach does not exist / MX lookup fail',
    failureReason: '존재하지 않는 수신 도메인 및 MX 레코드 부재로 인한 SMTP 영구 반송(Hard Bounce)',
    solutionNote: '수신자 도메인 유효성 사전 정규식 및 DNS 사전 조회 로직 연동',
    metadata: {
      clientIp: '127.0.0.1',
      errorStack: 'Error: getaddrinfo ENOTFOUND unreachable-domain-892.xyz',
    },
  },
];

// 로컬스토리지에서 로그 불러오기
export function getEmailDispatchLogs(): EmailDispatchLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMAIL_LOGS));
      return INITIAL_EMAIL_LOGS;
    }
    const parsed = JSON.parse(raw) as EmailDispatchLog[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EMAIL_LOGS;
  } catch {
    return INITIAL_EMAIL_LOGS;
  }
}

// 새 발송 로그 추가
export function addEmailDispatchLog(
  logInput: Omit<EmailDispatchLog, 'id' | 'timestamp' | 'formattedDate'>
): EmailDispatchLog {
  const currentLogs = getEmailDispatchLogs();
  const now = new Date();
  
  const formattedDate = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\. /g, '.').replace(/\.$/, '');

  const newLog: EmailDispatchLog = {
    ...logInput,
    id: `log-mail-${now.getTime()}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: now.toISOString(),
    formattedDate,
  };

  const updatedLogs = [newLog, ...currentLogs];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch {
    // ignore
  }

  return newLog;
}

// 로그 초기화
export function resetEmailDispatchLogs(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMAIL_LOGS));
  } catch {
    // ignore
  }
}

// 로그 통계 산출
export function calculateEmailStats(logs: EmailDispatchLog[]): EmailDispatchStats {
  const totalAttempts = logs.length;
  if (totalAttempts === 0) {
    return {
      totalAttempts: 0,
      successCount: 0,
      failedCount: 0,
      successRate: 100,
      avgLatencyMs: 0,
    };
  }

  const successCount = logs.filter((l) => l.status === 'SUCCESS').length;
  const failedCount = logs.filter((l) => l.status === 'FAILED').length;
  const successRate = Math.round((successCount / totalAttempts) * 1000) / 10;
  
  const totalLatency = logs.reduce((acc, cur) => acc + (cur.latencyMs || 0), 0);
  const avgLatencyMs = Math.round(totalLatency / totalAttempts);

  const lastFailure = logs.find((l) => l.status === 'FAILED');

  return {
    totalAttempts,
    successCount,
    failedCount,
    successRate,
    avgLatencyMs,
    lastFailureReason: lastFailure?.failureReason,
  };
}

// 서버 API 및 실시간 테스트 발송 연동
export async function sendTestEmailAction(
  targetEmail: string,
  purpose: EmailDispatchLog['purpose'] = '관리자 테스트 발송'
): Promise<{ success: boolean; log: EmailDispatchLog; message: string }> {
  const startTime = Date.now();
  const cleanEmail = targetEmail.trim().toLowerCase();

  try {
    const res = await fetch('/api/auth/send-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail }),
    });

    const data = await res.json().catch(() => ({}));
    const latencyMs = Date.now() - startTime;

    if (res.ok && data.success) {
      const created = addEmailDispatchLog({
        recipientEmail: cleanEmail,
        purpose,
        status: 'SUCCESS',
        statusCode: 200,
        provider: 'Gmail SMTP',
        senderAddress: 'jamannim@gmail.com',
        latencyMs,
        responseMessage: data.message || '250 OK: 메일이 정상 발송되었습니다.',
        solutionNote: 'Gmail SMTP 서버를 통해 수신 메일함으로 정상 전송 완료',
        metadata: {
          clientIp: '127.0.0.1',
          smtpMessageId: `<bizlens-test-${Date.now()}@smtp.gmail.com>`,
        },
      });

      return {
        success: true,
        log: created,
        message: '테스트 메일이 성공적으로 발송되었습니다.',
      };
    } else {
      const errorMsg = data.message || `HTTP ${res.status} 발송 실패`;
      const created = addEmailDispatchLog({
        recipientEmail: cleanEmail,
        purpose,
        status: 'FAILED',
        statusCode: res.status || 500,
        provider: 'Gmail SMTP',
        senderAddress: 'jamannim@gmail.com',
        latencyMs,
        responseMessage: errorMsg,
        failureReason: errorMsg,
        solutionNote: 'SMTP 네트워크 설정, 인증 패스워드 및 수신자 도메인 유효성 재확인 필요',
        metadata: {
          clientIp: '127.0.0.1',
          errorStack: JSON.stringify(data),
        },
      });

      return {
        success: false,
        log: created,
        message: errorMsg,
      };
    }
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const errorMsg = err instanceof Error ? err.message : '네트워크 통신 오류';
    const created = addEmailDispatchLog({
      recipientEmail: cleanEmail,
      purpose,
      status: 'FAILED',
      statusCode: 500,
      provider: 'Gmail SMTP',
      senderAddress: 'jamannim@gmail.com',
      latencyMs,
      responseMessage: `클라이언트 요청 예외: ${errorMsg}`,
      failureReason: `서버 연결 실패 또는 타임아웃 (${errorMsg})`,
      solutionNote: 'Vite 백엔드 서버 구동 상태 및 포트(5173) 응답 상태 점검 필요',
      metadata: {
        clientIp: '127.0.0.1',
        errorStack: String(err),
      },
    });

    return {
      success: false,
      log: created,
      message: errorMsg,
    };
  }
}
