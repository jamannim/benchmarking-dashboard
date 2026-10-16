/**
 * 회사 이메일 검증 모듈 (명세서 3.0, 3.3)
 * 
 * - 개인용 무료 이메일 서비스 도메인 완전 일치 차단
 * - `gmail.com.example.org` 등 도메인 부분 포함 오차단 방지
 * - RFC 5322 간소화 정규식을 통한 형식 검증
 * - 권장 오류 문구 매핑 (3.5)
 */

export interface EmailValidationResult {
  isValid: boolean;
  errorType?: 'EMPTY' | 'INVALID_FORMAT' | 'PERSONAL_DOMAIN' | null;
  errorMessage?: string;
  normalizedEmail?: string;
  domain?: string;
}

/**
 * 알려진 개인용 무료 이메일 서비스 도메인 기본 차단 목록 (명세서 89행)
 * - 정확한 도메인 추출 후 완전 일치(Exact Match)로 비교
 */
export const PERSONAL_EMAIL_DOMAINS = new Set<string>([
  // Google
  'gmail.com',
  'googlemail.com',

  // Microsoft
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'windowslive.com',
  'outlook.kr',
  'hotmail.co.kr',

  // Yahoo
  'yahoo.com',
  'yahoo.co.kr',
  'ymail.com',
  'rocketmail.com',

  // Apple
  'icloud.com',
  'me.com',
  'mac.com',

  // 한국 대표 포털 메일
  'naver.com',
  'daum.net',
  'hanmail.net',
  'kakao.com',
  'nate.com',
  'empas.com',
  'korea.com',

  // 보안/기타 글로벌 무료 메일
  'aol.com',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'gmx.net',
  'mail.com',
  'zoho.com',
  'zohomail.com',
  'tutanota.com',
  'tutamail.com',
  'yandex.com',
  'yandex.ru'
]);

/**
 * 이메일 유효성 검증 함수
 */
export function validateCompanyEmail(rawEmail: string): EmailValidationResult {
  const trimmed = (rawEmail || '').trim();

  if (!trimmed) {
    return {
      isValid: false,
      errorType: 'EMPTY',
      errorMessage: '회사 이메일 주소를 입력해 주세요.',
    };
  }

  // 1. 기본 이메일 형식 검증 (RFC 5322 간소화 표준)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  const match = trimmed.match(emailRegex);

  if (!match) {
    return {
      isValid: false,
      errorType: 'INVALID_FORMAT',
      errorMessage: '올바른 이메일 주소를 입력해 주세요.',
    };
  }

  // 2. 도메인 정규화 및 분리 (소문자화)
  const normalizedEmail = trimmed.toLowerCase();
  const domainPart = normalizedEmail.split('@')[1];

  // 3. 개인용 무료 이메일 도메인 완전 일치(Exact Match) 검사
  // ※ `gmail.com.example.org` 등은 domainPart가 'gmail.com.example.org'이므로 차단되지 않음 (명세 90행 준수)
  if (PERSONAL_EMAIL_DOMAINS.has(domainPart)) {
    return {
      isValid: false,
      errorType: 'PERSONAL_DOMAIN',
      errorMessage: '회사 이메일 주소로 가입해 주세요. 개인용 이메일은 사용할 수 없습니다.',
      normalizedEmail,
      domain: domainPart,
    };
  }

  // 4. 유효한 업무용 이메일
  return {
    isValid: true,
    errorType: null,
    errorMessage: undefined,
    normalizedEmail,
    domain: domainPart,
  };
}

/**
 * 도메인이 차단 대상인지 여부만 단독 확인
 */
export function isPersonalEmailDomain(domain: string): boolean {
  if (!domain) return false;
  const cleanDomain = domain.trim().toLowerCase();
  return PERSONAL_EMAIL_DOMAINS.has(cleanDomain);
}
