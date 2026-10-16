/**
 * Benchmarking Dashboard 분석 이벤트 트래킹 모듈 (명세서 6.0)
 * 
 * - 개인정보(이메일, 이름, 회사명 등 PII)는 일체 이벤트 파라미터로 전송하지 않습니다.
 * - GA4 gtag 및 브라우저 콘솔/로컬 이벤트 디스패치를 지원합니다.
 */

export type AnalyticsEventName =
  | 'landing_view'
  | 'hero_cta_click'
  | 'feature_section_view'
  | 'signup_start'
  | 'signup_validation_error'
  | 'email_verification_sent'
  | 'email_verification_complete'
  | 'signup_complete'
  | 'lead_form_start'
  | 'lead_submit'
  | 'dashboard_entry'
  | 'url_analysis_start'
  | 'url_verification_confirmed';

export interface AnalyticsParams {
  experiment_id?: string;
  variant?: 'A' | 'B';
  device_category?: 'mobile' | 'tablet' | 'desktop';
  source?: string;
  medium?: string;
  campaign?: string;
  error_type?: string;
  section_id?: string;
  cta_location?: string;
  [key: string]: unknown;
}

/**
 * 사용자 기기 카테고리 감지
 */
export function getDeviceCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * URL 파라미터에서 UTM 파라미터 추출
 */
export function getUtmParams(): { source?: string; medium?: string; campaign?: string } {
  if (typeof window === 'undefined') return {};
  const searchParams = new URLSearchParams(window.location.search);
  return {
    source: searchParams.get('utm_source') || undefined,
    medium: searchParams.get('utm_medium') || undefined,
    campaign: searchParams.get('utm_campaign') || undefined,
  };
}

/**
 * 분석 이벤트 기록 함수
 * PII(개인식별정보) 필터링 보증
 */
export function trackEvent(name: AnalyticsEventName, customParams: AnalyticsParams = {}): void {
  if (typeof window === 'undefined') return;

  const utm = getUtmParams();
  const baseParams: AnalyticsParams = {
    device_category: getDeviceCategory(),
    source: utm.source,
    medium: utm.medium,
    campaign: utm.campaign,
    ...customParams,
  };

  // PII 유출 방지: 이메일, 전화번호, 이름 등 금지 키 제거
  const forbiddenKeys = ['email', 'name', 'company', 'phone', 'password', 'user_id', 'personal_id'];
  for (const key of Object.keys(baseParams)) {
    if (forbiddenKeys.some((f) => key.toLowerCase().includes(f))) {
      delete baseParams[key];
    }
  }

  // 1. GA4 gtag 호출 (설치된 경우)
  if (typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', name, baseParams);
  }

  // 2. 브라우저 커스텀 이벤트 발행 (내부 리스너 또는 E2E 테스트용)
  try {
    const event = new CustomEvent('benchmarking:analytics', {
      detail: { eventName: name, params: baseParams, timestamp: Date.now() },
    });
    window.dispatchEvent(event);
  } catch {
    // ignore
  }

  // 3. 개발 모드 콘솔 로그 (디버깅용)
  if (import.meta.env?.DEV) {
    console.debug(`[Analytics Track] ${name}`, baseParams);
  }
}
