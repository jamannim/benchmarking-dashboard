import type { SubpageTab, SubViewId } from '../components/Header';

export const TAB_PATH_MAP: Record<SubpageTab, string> = {
  landing: '/',
  overview: '/traffic',
  traffic: '/traffic',
  service: '/service',
  'marketing-status': '/marketing',
  ir: '/IR',
  gmv: '/IR',
  business: '/Business',
  sales: '/Sales',
  marketing: '/marketing_ING',
  app: '/marketing_ING',
  server: '/Server_fee',
  docs: '/docs',
  guide: '/guide',
};

export const TAB_TITLE_MAP: Record<SubpageTab, string> = {
  landing: '비즈렌즈 (BIZLENS) | 데이터로 발견하는 사업의 성장 기회',
  overview: '트래픽(현) | 비즈렌즈 (BIZLENS)',
  traffic: '트래픽(현) | 비즈렌즈 (BIZLENS)',
  service: '서비스 | 비즈렌즈 (BIZLENS)',
  'marketing-status': '마케팅 | 비즈렌즈 (BIZLENS)',
  ir: 'IR | 비즈렌즈 (BIZLENS)',
  gmv: 'IR | 비즈렌즈 (BIZLENS)',
  business: '사업전략 | 비즈렌즈 (BIZLENS)',
  sales: '영업전략 | 비즈렌즈 (BIZLENS)',
  marketing: '마케팅전략 | 비즈렌즈 (BIZLENS)',
  app: '마케팅전략 | 비즈렌즈 (BIZLENS)',
  server: '서버비용 | 비즈렌즈 (BIZLENS)',
  docs: '데이터 출처 & 아웃링크 검증 센터 | 비즈렌즈 (BIZLENS)',
  guide: '이용방법',
};

/**
 * 브라우저의 현재 pathname 및 hash를 분석하여 일치하는 탭 및 서브뷰를 반환합니다.
 * 루트(/) 기본 진입 시 랜딩페이지(landing)를 최우선 반환합니다.
 */
export function resolveRouteFromLocation(): { tab: SubpageTab; subView: SubViewId } {
  if (typeof window === 'undefined') {
    return { tab: 'landing', subView: 'main' };
  }

  const rawPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  const subParam = (searchParams.get('sub') || 'main') as SubViewId;
  const lowerPath = rawPath.toLowerCase();

  // 1. Pathname 기반 우선 매칭 (정확한 탭 경로)
  if (lowerPath !== '/' && lowerPath !== '/index.html') {
    if (lowerPath === '/landing') return { tab: 'landing', subView: subParam };
    if (lowerPath === '/docs' || lowerPath === '/sources' || lowerPath === '/data-sources') return { tab: 'docs', subView: subParam };
    if (lowerPath === '/guide' || lowerPath === '/how-to' || lowerPath === '/howto') return { tab: 'guide', subView: subParam };
    if (lowerPath === '/marketing_ing') return { tab: 'marketing', subView: subParam };
    if (lowerPath === '/server_fee' || lowerPath === '/server') return { tab: 'server', subView: subParam };
    if (lowerPath === '/traffic') return { tab: 'overview', subView: subParam };
    if (lowerPath === '/service') return { tab: 'service', subView: subParam };
    if (lowerPath === '/marketing') return { tab: 'marketing-status', subView: subParam };
    if (lowerPath === '/ir') return { tab: 'ir', subView: subParam };
    if (lowerPath === '/business') return { tab: 'business', subView: subParam };
    if (lowerPath === '/sales') return { tab: 'sales', subView: subParam };
  }

  // 2. Hash 기반 매칭 (SPA 해시 진입 호환성)
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash === 'landing') return { tab: 'landing', subView: subParam };
  if (hash === 'guide' || hash === 'how-to') return { tab: 'guide', subView: subParam };
  if (hash === 'docs' || hash === 'sources' || hash === 'data-sources') return { tab: 'docs', subView: subParam };
  if (hash === 'marketing_ing') return { tab: 'marketing', subView: subParam };
  if (hash === 'server_fee' || hash === 'server') return { tab: 'server', subView: subParam };
  if (hash === 'traffic') return { tab: 'overview', subView: subParam };
  if (hash === 'service') return { tab: 'service', subView: subParam };
  if (hash === 'marketing') return { tab: 'marketing-status', subView: subParam };
  if (hash === 'ir') return { tab: 'ir', subView: subParam };
  if (hash === 'business') return { tab: 'business', subView: subParam };
  if (hash === 'sales') return { tab: 'sales', subView: subParam };

  // 기본 루트(/) 진입 시 랜딩페이지(landing) 우선 노출
  return { tab: 'landing', subView: 'main' };
}

/**
 * 탭 변경 시 브라우저 주소창의 URL 경로를 표준 규격으로 즉시 동기화합니다.
 */
export function syncUrlWithTab(tab: SubpageTab, replace = false): void {
  if (typeof window === 'undefined') return;

  const targetPath = TAB_PATH_MAP[tab] || '/';
  const currentPath = window.location.pathname;

  // 브라우저 탭 타이틀 동기화
  if (TAB_TITLE_MAP[tab]) {
    document.title = TAB_TITLE_MAP[tab];
  }

  // 주소창 URL 동기화 (경로가 다르거나 해시가 남아있는 경우 즉시 정리)
  if (currentPath !== targetPath || window.location.hash) {
    if (replace) {
      window.history.replaceState({ tab }, '', targetPath);
    } else {
      window.history.pushState({ tab }, '', targetPath);
    }
  }
}
