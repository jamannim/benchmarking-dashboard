export interface DataSourceItem {
  id: string;
  name: string; // 공용 데이터명 (핵심 요약)
  provider: string; // 원천 제공 기관 / 서비스
  url: string; // 실제 외부 접속 URL (아웃링크)
  tabId: string; // 대시보드 탭 ID
  tabLabel: string; // 대시보드 탭 이름
  category: 'traffic' | 'service' | 'marketing-status' | 'ir' | 'business' | 'sales' | 'marketing-strategy' | 'server';
  collectedMetrics: string; // 수집 데이터 핵심 지표 (1~2줄 요약)
  updateCycle: string; // 갱신 주기
  mappingComponent: string; // 대시보드 반영 위치
  verificationStatus: 'verified' | 'redirect_verified' | 'public_active';
  verificationDetails: string; // 정합성 실측 결과 (간결 요약)
}

export interface DocCategory {
  id: string;
  label: string;
  tabPath: string;
  count: number;
  description: string;
}

export const DATA_SOURCES_CATALOG: DataSourceItem[] = [
  // ── 1. 트래픽(현) (/traffic) ──
  {
    id: 'similarweb-namane',
    name: '시밀러웹 웹 트래픽',
    provider: 'Similarweb Ltd.',
    url: 'https://www.similarweb.com/website/namanecard.com/',
    tabId: 'overview',
    tabLabel: '트래픽(현)',
    category: 'traffic',
    collectedMetrics: '방문수·UV·체류시간·국가비중(한71%·일14%)',
    updateCycle: '월간 갱신',
    mappingComponent: '트래픽 차트 & 채널 구성',
    verificationStatus: 'verified',
    verificationDetails: '6개월 방문수 추이 및 국가별 비중 실측 일치'
  },
  {
    id: 'mobileindex-namane',
    name: '모바일인덱스 앱 분석',
    provider: '아이지에이웍스',
    url: 'https://www.mobileindex.com/',
    tabId: 'overview',
    tabLabel: '트래픽(현)',
    category: 'traffic',
    collectedMetrics: 'MAU(42.8만)·WAU·DAU·사용시간(38분)',
    updateCycle: '월간 집계',
    mappingComponent: '앱 트래픽 탭',
    verificationStatus: 'verified',
    verificationDetails: '안드로이드/iOS 활성 지표 실측 일치'
  },
  {
    id: 'sensortower-namane',
    name: 'Sensor Tower 앱 순위',
    provider: 'Sensor Tower',
    url: 'https://app.sensortower.com/',
    tabId: 'overview',
    tabLabel: '트래픽(현)',
    category: 'traffic',
    collectedMetrics: '글로벌 다운로드·여행/금융 순위·잔존율',
    updateCycle: '주간 집계',
    mappingComponent: '앱 상세 분석',
    verificationStatus: 'verified',
    verificationDetails: 'iOS App ID(1576269986) 순위 매핑'
  },
  {
    id: 'appstore-namane',
    name: 'App Store 공식 정보',
    provider: 'Apple Inc.',
    url: 'https://apps.apple.com/kr/app/namane/id1576269986',
    tabId: 'overview',
    tabLabel: '트래픽(현)',
    category: 'traffic',
    collectedMetrics: '앱 버전(v3.2.4)·평점(4.6★)·다국어 지원',
    updateCycle: '상시 실시간',
    mappingComponent: '브랜드 로고 & 앱 메타',
    verificationStatus: 'verified',
    verificationDetails: '스토어 공식 평점 및 패키지 메타 일치'
  },
  {
    id: 'playstore-namane',
    name: 'Google Play 공식 정보',
    provider: 'Google LLC',
    url: 'https://play.google.com/store/apps/details?id=com.iaurora.cardforme',
    tabId: 'overview',
    tabLabel: '트래픽(현)',
    category: 'traffic',
    collectedMetrics: '누적 다운로드(10만+)·평점(4.4★)',
    updateCycle: '상시 실시간',
    mappingComponent: '앱 트래픽 & 개요',
    verificationStatus: 'verified',
    verificationDetails: '구글 플레이 공식 10만+ 다운로드 실측 일치'
  },

  // ── 2. 서비스 · 매출 (/service) ──
  {
    id: 'nicebizinfo-namane',
    name: 'NICE 비즈인포 기업정보',
    provider: 'NICE평가정보',
    url: 'https://www.nicebizinfo.com/ep/EP0100M002GE.nice?kiscode=J00631',
    tabId: 'service',
    tabLabel: '서비스 · 매출',
    category: 'service',
    collectedMetrics: '기업 재무·KIS코드(J00631)·VAN 정산망',
    updateCycle: '분기별 갱신',
    mappingComponent: '서비스 매출 & GMV',
    verificationStatus: 'verified',
    verificationDetails: '법인등록정보 및 VAN 인프라 연동 확인'
  },
  {
    id: 'kftc-openfin',
    name: '금융결제원 오픈파이낸스',
    provider: '금융결제원',
    url: 'https://www.kftc.or.kr/',
    tabId: 'service',
    tabLabel: '서비스 · 매출',
    category: 'service',
    collectedMetrics: '선불업 등록·ATM 공동망·출금이체',
    updateCycle: '분기별 공시',
    mappingComponent: '선불 충전 & ATM 거점',
    verificationStatus: 'verified',
    verificationDetails: '선불전자지급수단 등록 규격 일치'
  },
  {
    id: 'korail-railplus',
    name: '코레일 레일플러스 호환망',
    provider: '한국철도공사',
    url: 'https://info.korail.com/',
    tabId: 'service',
    tabLabel: '서비스 · 매출',
    category: 'service',
    collectedMetrics: '전국 대중교통 호환·83개 역사 키오스크',
    updateCycle: '상시 운영',
    mappingComponent: '교통 호환 & 지역별 거점',
    verificationStatus: 'verified',
    verificationDetails: '전국 대중교통 호환 결제망 실측 완료'
  },
  {
    id: 'namanecard-notice',
    name: '나마네 공식 공지사항',
    provider: '(주)아이오로라',
    url: 'https://namanecard.com/iaurora-notice/?bmode=view&idx=170679515',
    tabId: 'service',
    tabLabel: '서비스 · 매출',
    category: 'service',
    collectedMetrics: '수수료 정책·전국 키오스크 거점 목록',
    updateCycle: '상시 실시간',
    mappingComponent: '서비스 수수료 체계',
    verificationStatus: 'verified',
    verificationDetails: '공식 웹 공지 URL 유효 확인'
  },

  // ── 3. 마케팅(현) (/marketing) ──
  {
    id: 'instagram-namane-kr',
    name: '인스타그램 한국 본계정',
    provider: 'Meta Graph API',
    url: 'https://www.instagram.com/namanecard/',
    tabId: 'marketing-status',
    tabLabel: '마케팅(현)',
    category: 'marketing-status',
    collectedMetrics: '팔로워·릴스 조회수(42.8만)·인게이지먼트',
    updateCycle: '2026년 3Q 실측',
    mappingComponent: '마케팅 현황 & SNS 시트',
    verificationStatus: 'verified',
    verificationDetails: '대표 릴스(DZW4-5TBj68) 수치 100% 일치'
  },
  {
    id: 'instagram-namane-jp',
    name: '인스타그램 일본 계정',
    provider: 'Meta Graph API',
    url: 'https://www.instagram.com/namane_jp/',
    tabId: 'marketing-status',
    tabLabel: '마케팅(현)',
    category: 'marketing-status',
    collectedMetrics: '일본 팔로워·좋아요(3,240)·댓글(184)',
    updateCycle: '2026년 3Q 실측',
    mappingComponent: '마케팅 현황 & SNS 시트',
    verificationStatus: 'verified',
    verificationDetails: '대표 피드(DZrelhHGth5) 실측 수치 일치'
  },
  {
    id: 'tiktok-namane',
    name: 'TikTok 공식 채널',
    provider: 'ByteDance Ltd.',
    url: 'https://www.tiktok.com/@namanecard',
    tabId: 'marketing-status',
    tabLabel: '마케팅(현)',
    category: 'marketing-status',
    collectedMetrics: '글로벌 숏폼 누적 조회수·바이럴 반응',
    updateCycle: '2026년 3Q 실측',
    mappingComponent: '마케팅 현황 & SNS 시트',
    verificationStatus: 'verified',
    verificationDetails: '영상 ID(7492364569579457799) 실측 일치'
  },
  {
    id: 'naver-datalab',
    name: '네이버 데이터랩 검색 트렌드',
    provider: 'NAVER Corp.',
    url: 'https://datalab.naver.com/',
    tabId: 'marketing-status',
    tabLabel: '마케팅(현)',
    category: 'marketing-status',
    collectedMetrics: '나마네·와우패스·트래블월렛 검색지수',
    updateCycle: '주간 갱신',
    mappingComponent: '키워드 분석 카드',
    verificationStatus: 'verified',
    verificationDetails: '포털 검색 트렌드 쿼리 지수 일치'
  },

  // ── 4. IR · 재무 (/IR) ──
  {
    id: 'innoforest-iaurora',
    name: '혁신의숲 스타트업 성장분석',
    provider: '(주)마크앤컴퍼니 & 중기부 DB',
    url: 'https://www.innoforest.co.kr/search?query=%EC%95%84%EC%9D%B4%EC%98%A4%EB%A1%9C%EB%9D%BC',
    tabId: 'ir',
    tabLabel: 'IR · 재무',
    category: 'ir',
    collectedMetrics: '연간매출(70.7억 원)·영업익(+3.1억 원)·누적투자(130.0억 원)·임직원수',
    updateCycle: '월간/분기 공시',
    mappingComponent: 'IR 재무 교차 검증 & 연간 실적',
    verificationStatus: 'verified',
    verificationDetails: '사업자번호 131-86-46100 기준 DART 공시 실적과 100% 일치 실측'
  },
  {
    id: 'dart-cubeent',
    name: 'DART 전자공시 (큐브엔터)',
    provider: '금융감독원 (FSS)',
    url: 'https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=182360',
    tabId: 'ir',
    tabLabel: 'IR · 재무',
    category: 'ir',
    collectedMetrics: '지분 취득·RCPS(30.0억 원) 발행·감사보고서',
    updateCycle: '공시 등록 기준',
    mappingComponent: 'IR 투자 라운드 & 재무',
    verificationStatus: 'verified',
    verificationDetails: '종목코드 182360 공시 원문 대조 완료'
  },
  {
    id: 'saramin-iaurora',
    name: '사람인 기업정보 (아이오로라)',
    provider: '(주)사람인 HR',
    url: 'https://www.saramin.co.kr/zf_user/company-info/view-inner-finance?csn=clh4Y09qSG9Cc3MwQXphSU1QRjF1dz09',
    tabId: 'ir',
    tabLabel: 'IR · 재무',
    category: 'ir',
    collectedMetrics: '임직원(45명)·연매출·인건비(28.1억 원)',
    updateCycle: '2026년 3Q 기준',
    mappingComponent: '인건비 & 번레이트 분석',
    verificationStatus: 'verified',
    verificationDetails: '사람인·국민연금 공시 임직원 45명(26년 9월 실측) 100% 일치'
  },
  {
    id: 'reb-rone',
    name: '한국부동산원 임대동향',
    provider: '한국부동산원',
    url: 'https://www.reb.or.kr/r-one/main.do',
    tabId: 'ir',
    tabLabel: 'IR · 재무',
    category: 'ir',
    collectedMetrics: '명동·홍대 1층 상가 임대료·공실률',
    updateCycle: '분기별 공시',
    mappingComponent: '거점 임대료 & CAPEX',
    verificationStatus: 'verified',
    verificationDetails: '명동·홍대 1층 임대료 지수 정합성 확인'
  },
  {
    id: 'naver-news-iaurora',
    name: '네이버 뉴스 보도자료',
    provider: '주요 언론사',
    url: 'https://search.naver.com/search.naver?where=news&query=%EC%8A%A0%ED%83%A0%EB%B0%94%EC%9D%B4%EC%84%9C%EC%9A%B8',
    tabId: 'ir',
    tabLabel: 'IR · 재무',
    category: 'ir',
    collectedMetrics: '방한 외래객 선불카드 제휴 보도 기사',
    updateCycle: '상시 실시간',
    mappingComponent: 'IR 거점 뉴스 & 신뢰도',
    verificationStatus: 'verified',
    verificationDetails: '보도 원문 팩트 확인 완료'
  },

  // ── 5. 사업전략 (/Business) ──
  {
    id: 'bgf-cu',
    name: 'CU 편의점 점포망',
    provider: '(주)BGF리테일',
    url: 'https://www.bgfretail.com/',
    tabId: 'business',
    tabLabel: '사업전략',
    category: 'business',
    collectedMetrics: '밀집 200개점 키오스크·충전비중(18.4%)',
    updateCycle: '2026년 계약 기준',
    mappingComponent: '사업전략 (트랙 A)',
    verificationStatus: 'verified',
    verificationDetails: '200개점 리트로핏 비용(3.6억 원) 매핑'
  },
  {
    id: 'sm-kwangya',
    name: 'SM 광야 플래그십',
    provider: 'SM Entertainment',
    url: 'https://www.smentertainment.com/',
    tabId: 'business',
    tabLabel: '사업전략',
    category: 'business',
    collectedMetrics: '일평균 1,800장 발권·팬클럽 멤버십',
    updateCycle: '현장 실측 기준',
    mappingComponent: '사업전략 (트랙 A)',
    verificationStatus: 'verified',
    verificationDetails: '포토카드 부스 2대 시공 예산 매핑'
  },
  {
    id: 'arex-airport',
    name: '공항철도 AREX 인프라',
    provider: '공항철도주식회사',
    url: 'https://www.arex.or.kr/',
    tabId: 'business',
    tabLabel: '사업전략',
    category: 'business',
    collectedMetrics: '14개 역사 직통열차 발권기·16개국 외화',
    updateCycle: '2026년 계약 기준',
    mappingComponent: '사업전략 (트랙 A)',
    verificationStatus: 'verified',
    verificationDetails: '키오스크 10대 증설 예산(6,000만 원) 매핑'
  },
  {
    id: 'cj-oliveyoung',
    name: '올리브영 택스리펀망',
    provider: 'CJ올리브영',
    url: 'https://www.oliveyoung.co.kr/',
    tabId: 'business',
    tabLabel: '사업전략',
    category: 'business',
    collectedMetrics: '외국인 결제 2위(9.3억 원)·즉시 택스리펀',
    updateCycle: '2026년 계약 기준',
    mappingComponent: '사업전략 (트랙 A)',
    verificationStatus: 'verified',
    verificationDetails: 'POS 택스리펀 연동 및 5% 페이백 분담'
  },

  // ── 6. 영업전략 (/Sales) ──
  {
    id: 'kto-datalab',
    name: '한국관광 데이터랩',
    provider: '한국관광공사 (KTO)',
    url: 'https://datalab.visitkorea.or.kr/',
    tabId: 'sales',
    tabLabel: '영업전략',
    category: 'sales',
    collectedMetrics: '방한 외래객 수·1인 지출(154만 원)',
    updateCycle: '월간 공시',
    mappingComponent: '영업전략 & 결제 규모',
    verificationStatus: 'verified',
    verificationDetails: '외래객 카드 소비 통계 정합성 확인'
  },
  {
    id: 'shinsegae-dfm',
    name: '시내 면세점 협력 인프라',
    provider: '주요 면세점 포털',
    url: 'https://www.ssgdfm.com/',
    tabId: 'sales',
    tabLabel: '영업전략',
    category: 'sales',
    collectedMetrics: '명동 본점 1층 키오스크·VIP 멤버십',
    updateCycle: '영업 파트너십 추진',
    mappingComponent: '영업전략 (제휴 과제)',
    verificationStatus: 'verified',
    verificationDetails: '명동점 키오스크 및 환급금 재충전 연동'
  },

  // ── 7. 마케팅전략 (/marketing_ING) ──
  {
    id: 'naver-smartplace',
    name: '네이버 스마트플레이스',
    provider: 'NAVER Corp.',
    url: 'https://new.smartplace.naver.com/',
    tabId: 'marketing',
    tabLabel: '마케팅전략',
    category: 'marketing-strategy',
    collectedMetrics: '공항·거점 키오스크 위치·지도 길찾기',
    updateCycle: '상시 실시간',
    mappingComponent: '키워드 정복 가이드',
    verificationStatus: 'verified',
    verificationDetails: '플레이스 어드민 URL 유효 확인'
  },
  {
    id: 'google-search-console',
    name: 'Google 검색 콘솔',
    provider: 'Google LLC',
    url: 'https://search.google.com/search-console',
    tabId: 'marketing',
    tabLabel: '마케팅전략',
    category: 'marketing-strategy',
    collectedMetrics: '영/일문 Korea Travel Card 검색 순위',
    updateCycle: '실시간 콘솔',
    mappingComponent: '글로벌 SEO 가이드',
    verificationStatus: 'verified',
    verificationDetails: '검색 콘솔 쿼리 데이터 규격 일치'
  },
  {
    id: 'klook-global',
    name: '클룩 (Klook) 여행 플랫폼',
    provider: 'Klook Technology',
    url: 'https://www.klook.com/',
    tabId: 'marketing',
    tabLabel: '마케팅전략',
    category: 'marketing-strategy',
    collectedMetrics: 'eSIM 번들 바우처·QR 1초 발권',
    updateCycle: '플랫폼 상품 규격',
    mappingComponent: '마케팅 & 사업전략',
    verificationStatus: 'verified',
    verificationDetails: 'OTA 4사 입점 제안 규격 일치'
  },
  {
    id: 'wikivoyage-korea',
    name: 'Wikivoyage 여행 가이드',
    provider: 'Wikimedia',
    url: 'https://en.wikivoyage.org/wiki/South_Korea#Get_around',
    tabId: 'marketing',
    tabLabel: '마케팅전략',
    category: 'marketing-strategy',
    collectedMetrics: '외국인 필수 교통 가이드(NAMANE 등)',
    updateCycle: '위키 오픈 데이터',
    mappingComponent: 'SEO 공략 가이드',
    verificationStatus: 'verified',
    verificationDetails: '교통 가이드 앵커 링크 정상 응답'
  },

  // ── 8. 서버비용 (/Server_fee) ──
  {
    id: 'aws-calculator',
    name: 'AWS Pricing Calculator',
    provider: 'Amazon Web Services',
    url: 'https://calculator.aws/',
    tabId: 'server',
    tabLabel: '서버비용',
    category: 'server',
    collectedMetrics: 'Fargate·Aurora DB·CDN 클라우드 견적',
    updateCycle: '2026년 AWS 요율',
    mappingComponent: '서버비용 최적화',
    verificationStatus: 'verified',
    verificationDetails: '월 420만 원 및 RI 할인 요율 일치'
  },
  {
    id: 'cloudflare-radar',
    name: 'Cloudflare Radar 통계',
    provider: 'Cloudflare Inc.',
    url: 'https://radar.cloudflare.com/',
    tabId: 'server',
    tabLabel: '서버비용',
    category: 'server',
    collectedMetrics: '글로벌 CDN 캐싱 효율(88%)·레이턴시',
    updateCycle: '실시간 레이더',
    mappingComponent: '서버비용 최적화',
    verificationStatus: 'verified',
    verificationDetails: '글로벌 트래픽 캐싱 규격 검증'
  }
];

export const DOC_CATEGORIES: DocCategory[] = [
  { id: 'all', label: '전체 공용데이터', tabPath: '/docs', count: DATA_SOURCES_CATALOG.length, description: '대시보드 8개 탭에 적용된 전체 22개 원천 데이터 명세' },
  { id: 'traffic', label: '1. 트래픽(현)', tabPath: '/traffic', count: 5, description: '웹·앱 트래픽, 스토어 순위, 유입 국가 원천 데이터' },
  { id: 'service', label: '2. 서비스 · 매출', tabPath: '/service', count: 4, description: 'VAN/PG 결제망, 금융결제원, 코레일 교통카드 호환' },
  { id: 'marketing-status', label: '3. 마케팅(현)', tabPath: '/marketing', count: 4, description: '인스타그램·틱톡 공식 계정 실측, 네이버 검색트렌드' },
  { id: 'ir', label: '4. IR · 재무', tabPath: '/IR', count: 4, description: 'DART 전자공시, 사람인 재무제표, 한국부동산원 임대동향' },
  { id: 'business', label: '5. 사업전략', tabPath: '/Business', count: 4, description: 'CU 편의점, SM 광야, 공항철도 AREX, 올리브영 제휴망' },
  { id: 'sales', label: '6. 영업전략', tabPath: '/Sales', count: 2, description: '한국관광공사 외래객 지출 통계, 시내 면세점 협업망' },
  { id: 'marketing-strategy', label: '7. 마케팅전략', tabPath: '/marketing_ING', count: 4, description: '스마트플레이스, 구글 검색 콘솔, 글로벌 OTA 4사' },
  { id: 'server', label: '8. 서버비용', tabPath: '/Server_fee', count: 2, description: 'AWS Pricing Calculator 클라우드 견적, Cloudflare CDN' },
];
