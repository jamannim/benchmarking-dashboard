import type { 
  TargetService, 
  TrafficMetrics, 
  AppMetrics, 
  CountryShare, 
  TopPage, 
  ConsistencyAudit, 
  CompetitorComparison, 
  BenchmarkingItem 
} from '../types/intelligence';

export const namaneService: TargetService = {
  domain: 'namanecard.com',
  appPackage: 'com.iaurora.cardforme',
  name: '나마네카드',
  category: '방한 외국인/팬덤 타겟 커스텀 선불·교통 올인원 카드',
  url: 'https://namanecard.com',
  appStoreUrl: 'https://play.google.com/store/apps/details?id=com.iaurora.cardforme',
  verifiedAt: '2026.10.06'
};

export const namaneTraffic: TrafficMetrics = {
  totalVisits: 78750,
  globalRank: 481240,
  categoryRank: 2398,
  categoryName: 'Ecommerce and Shopping - Other',
  bounceRate: 43.98,
  pagesPerVisit: 2.33,
  avgDuration: '01:26',
  searchShare: 82.06,
  directShare: 13.50,
  referralShare: 4.44
};

export const namaneApp: AppMetrics = {
  downloads: '10만+',
  rating: 4.7,
  reviewCount: '약 1,300개',
  category: '금융 / 여행 도구'
};

export const namaneCountries: CountryShare[] = [
  { code: 'JP', name: '일본', share: 25.13, flag: '🇯🇵' },
  { code: 'US', name: '미국', share: 20.27, flag: '🇺🇸' },
  { code: 'KR', name: '대한민국', share: 13.38, flag: '🇰🇷' },
  { code: 'VN', name: '베트남', share: 6.23, flag: '🇻🇳' },
  { code: 'TW', name: '대만', share: 4.93, flag: '🇹🇼' },
  { code: 'ETC', name: '기타 14개국', share: 30.06, flag: '🌐', chinaShare: 4.12, chinaShareOfEtc: 13.7 },
];

export const namaneTopPages: TopPage[] = [
  { path: '/namanekiosk (키오스크 위치 지도)', name: '오프라인 키오스크 찾기', share: 38.2, role: '방한 전/입국 직후 실물 카드 발급 거점 탐색' },
  { path: '/kpoppass (K-POP 패스 가이드)', name: '커스텀 카드 발급 매뉴얼', share: 26.5, role: '포토카드 제작 기능 확인 및 굿즈 수요 견인' },
  { path: '/service-manual-204 (해외카드 결제)', name: '해외 신용카드 충전 가이드', share: 19.4, role: '3DS 인증 및 앱 사전 충전 절차 숙지' },
  { path: '/service-manual-403 (잔액 전환)', name: '페이↔교통 잔액 이동 방법', share: 15.9, role: '분리된 잔액 관리 방식 이해 및 문제 해결' }
];

export const namaneConsistency: ConsistencyAudit = {
  score: 94,
  grade: 'High',
  statusText: '데이터 정합성 매우 높음',
  summary: '월 7.4만 건의 웹 검색 트래픽과 누적 10만+ 앱 다운로드 간 전환 퍼널이 외국인 인바운드 관광객의 행동 양식과 정확히 일치합니다.',
  evidenceItems: [
    '자연 검색 비율 82.06% 확인: 전형적인 목적형(방한 준비) 키워드 검색 유입 패턴',
    '국가별 유입 1위 일본(25.13%), 2위 미국(20.27%): K-POP 팬덤 및 방한 자유여행객 수요와 100% 부합',
    '스토어 평점 4.7★ (리뷰 1,300건): 와우패스(100만+) 대비 규모는 작으나 커스텀 디자인 만족도 면에서 락인 효과 뚜렷',
    '웹 방문자(연간 약 85만 명) 중 실제 방한 시 앱 설치 전환율(약 12%) 감안 시 10만+ 다운로드 수치는 매우 신뢰도 높음'
  ]
};

export const competitorRadar: CompetitorComparison[] = [
  {
    name: '나마네카드',
    scale: '10만+ 다운로드 (월 7.4만 웹 방문)',
    positioning: 'K-POP 굿즈 + 커스텀 디자인 선불카드',
    keyStrength: '세상에 단 하나뿐인 사진 인쇄, 앱 내 해외카드 즉시 충전, 자유로운 잔액 송금',
    weakness: '페이/교통 잔액 이원화로 인한 외국인 혼선, 오프라인 외화 지폐 투입 키오스크 부족',
    cardBase: '레일플러스'
  },
  {
    name: '와우패스',
    scale: '100만+ 가입자 (MAU 34만+)',
    positioning: '외화 무인 환전 + 결제/교통 올인원',
    keyStrength: '키오스크에 외화 지폐(달러/엔 등) 즉시 투입 원화 환전, 티머니 탑재, 호텔/공항 거점 장악',
    weakness: '카드 디자인 커스텀 불가(고정 디자인), 충전을 위해 반드시 키오스크를 찾아가야 함',
    cardBase: '티머니'
  },
  {
    name: '트래블월렛 / 티머니',
    scale: '수백만 다운로드 (국내/아웃바운드 1위)',
    positioning: '해외 결제 수수료 무료 / 범용 교통',
    keyStrength: '압도적인 인프라, 수수료 0원, 전국 대중교통 호환성',
    weakness: '방한 외국인 전용 혜택이나 굿즈 소장 가치 부재',
    cardBase: '국내 금융망 / 티머니'
  }
];

export const benchmarkingRecommendations: BenchmarkingItem[] = [
  {
    id: 1,
    title: '페이↔교통 잔액 스마트 자동 전환',
    category: 'UX / 기능 개선',
    impact: 'Critical',
    effort: 'Medium',
    description: '외국인 리뷰에서 가장 반복되는 페인포인트는 "잔액이 있는데 개찰구에서 안 찍힌다"는 것입니다. 대중교통 태그 시 잔액이 부족하면 페이 잔액에서 필요한 만큼 즉시 자동 전환되는 하이브리드 결제 루프를 도입해야 합니다.',
    actionPlan: '앱 내 [교통잔액 자동 충전 ON/OFF] 옵션을 신설하고, 부족분만큼 페이 잔액에서 즉시 전환 처리'
  },
  {
    id: 2,
    title: '외화 지폐 환전 지원 키오스크 모듈화 (와우패스 1위 무기 흡수)',
    category: '비즈니스 / 인프라',
    impact: 'Critical',
    effort: 'High',
    description: '와우패스가 100만 가입자를 돌파한 결정적 이유는 "외화 현금을 직접 넣으면 원화 카드로 바꿔주는 편의성"입니다. 나마네 키오스크에도 외화 수납 모듈을 추가하거나 제휴하여 환전소 대체 효용을 제공해야 합니다.',
    actionPlan: '공항 및 명동/홍대 주요 거점 키오스크 10~20곳에 외화 지폐 수납기 시범 장착 후 데이터 검증'
  },
  {
    id: 3,
    title: '공식 K-POP / 웹툰 라이선스 프레임 마켓플레이스',
    category: '수익화',
    impact: 'High',
    effort: 'Low',
    description: '단순 개인 사진 업로드에 그치지 않고, 하이브/SM/JYP 등 기획사 또는 인기 웹툰 IP와 협업한 한정판 프레임을 앱 내에서 소액 인앱결제(IAP, 2,000~3,000원) 후 출력하게 하여 건당 객단가를 극대화할 수 있습니다.',
    actionPlan: '카드 커스텀 에디터에 [공식 아티스트 프레임] 카테고리 신설 및 인앱 결제 연동'
  },
  {
    id: 4,
    title: '3초 인터랙티브 온보딩 가이드 (3DS 해외결제 + NFC 태그 위치)',
    category: '온보딩 UX',
    impact: 'High',
    effort: 'Low',
    description: '해외 카드 결제 실패(3DS 미인증)와 스마트폰 뒷면 NFC 태깅 위치 혼동으로 인한 이탈을 막기 위해, 앱 최초 실행 시 3단계 애니메이션 튜토리얼을 다국어로 노출합니다.',
    actionPlan: '신규 가입 즉시 "카드 뒷면 상단 태그 방법" 및 "3DS 지원 카드 안내" 팝업 인터랙션 제공'
  }
];
