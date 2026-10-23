export type EmailDispatchStatus = 'SUCCESS' | 'FAILED' | 'RETRYING';
export type EmailProviderType = 'Gmail SMTP' | 'Supabase Auth Mailer' | 'Custom Relay';
export type EmailPurposeType = 
  | '비밀번호 재설정 인증코드' 
  | '회원가입 이메일 인증' 
  | '관리자 테스트 발송' 
  | '계정 보안 알림';

export interface EmailDispatchLog {
  id: string;
  timestamp: string; // ISO 8601 string
  formattedDate: string; // KST "2026.10.22 17:51:20"
  recipientEmail: string;
  purpose: EmailPurposeType;
  status: EmailDispatchStatus;
  statusCode: number; // 200, 500, 550, 429
  provider: EmailProviderType;
  senderAddress: string;
  verificationCode?: string;
  latencyMs: number;
  responseMessage: string;
  failureReason?: string;
  solutionNote?: string;
  metadata?: {
    clientIp?: string;
    smtpMessageId?: string;
    errorStack?: string;
    retryCount?: number;
  };
}

export interface EmailDispatchStats {
  totalAttempts: number;
  successCount: number;
  failedCount: number;
  successRate: number; // 0 ~ 100
  avgLatencyMs: number;
  lastFailureReason?: string;
}
