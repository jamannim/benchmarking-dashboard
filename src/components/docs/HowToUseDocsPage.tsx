import React, { useState, useMemo } from 'react';
import {
  CompassIcon,
  SearchIcon,
  CircleCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LayoutDashboardIcon,
  SparklesIcon,
  CircleQuestionMarkIcon,
  ZapIcon,
  GlobeIcon,
  ClockIcon,
  BookOpenIcon,
} from '@animateicons/react/lucide';
import type { SubpageTab } from '../Header';
import { MainFooter } from '../common/MainFooter';
import type { PolicyType } from '../landing/PolicyModals';

export interface GuideSource {
  name: string;
  url: string;
}

interface GuideStepItem {
  id: string;
  category: string;
  stepNumber?: string;
  title: string;
  summary: string;
  keyAction: string;
  tips: string[];
  sources: GuideSource[];
}

export interface GuideCategory {
  id: string;
  label: string;
  iconName: string;
  count: number;
  description: string;
}

const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: 'faq',
    label: 'FAQ & 실전 팁',
    iconName: 'faq',
    count: 4,
    description: '도메인 분석 범위, 공시 데이터 갱신 주기, 이용 요금 및 실무 활용 팁'
  },
  {
    id: 'all',
    label: '전체 가이드',
    iconName: 'all',
    count: 16,
    description: 'URL 입력부터 데이터 리포트, 실행 전략 리포트, PDF 보고서까지 종합 이용 가이드'
  },
  {
    id: 'search',
    label: '간편한 URL 입력',
    iconName: 'search',
    count: 3,
    description: '분석 대상 도메인 입력 규칙, DART 공시/혁신의숲 자동 매칭 및 표준산업분류 확인'
  },
  {
    id: 'diagnosis',
    label: '현 데이터 리포트',
    iconName: 'diagnosis',
    count: 4,
    description: '트래픽(현) · 서비스 · 마케팅 · IR 탭 순서별 현황 데이터 리포트 활용법'
  },
  {
    id: 'strategy',
    label: '실행 전략 리포트',
    iconName: 'strategy',
    count: 4,
    description: '사업전략 · 영업전략 · 마케팅전략 · 서버비용 탭 순서별 실행 전략 리포트 도출법'
  },
  {
    id: 'report',
    label: 'PDF 보고서',
    iconName: 'report',
    count: 1,
    description: '경영진 보고 및 팀 공유를 위한 A4 규격 종합 전략 PDF 리포트 원클릭 추출'
  }
];

const GUIDE_ITEMS: GuideStepItem[] = [
  // ── [Step 0: 간편한 URL 입력] ──
  {
    id: 'search-1',
    category: 'search',
    stepNumber: 'URL 입력',
    title: 'URL 주소 입력 규칙 및 자동 정규화',
    summary: '프로토콜(https://)이나 경로(/ko, /main) 유무와 관계없이 메인 서비스 도메인 기준 자동 판별',
    keyAction: '분석 희망 운영 서비스의 대표 웹사이트 주소를 입력창에 입력',
    tips: [
      'https:// 또는 www 접두어 없이 도메인만 입력해도 자동 유효성 검증',
      '국내 및 글로벌 도메인(.com, .io, .co.kr, .net 등) 광범위 지원',
      '서브도메인의 경우 메인 루트 서비스와 연계하여 최적 분석 모듈 매칭'
    ],
    sources: [
      { name: 'KISA 한국인터넷진흥원 후이즈 (WHOIS)', url: 'https://whois.kisa.or.kr/' }
    ]
  },
  {
    id: 'search-2',
    category: 'search',
    stepNumber: '공시 출처',
    title: '기업공시 및 재무 출처 자동 분류 기준',
    summary: '사업자 성격에 따라 DART 전자공시 또는 중기부 혁신의숲/TheVC 단일 원천으로 확정 매칭',
    keyAction: '자동 분류된 공시 출처 뱃지 확인 후 사업 분석 진행',
    tips: [
      '외감·상장 법인: 금융감독원 전자공시시스템(DART) 감사보고서 원본 기준 매칭',
      '스타트업·비외감 법인: 중기부 혁신의숲 및 The VC의 검증된 투자·재무 DB 기준 단일 확정',
      '복수 출처 혼용 없이 확정된 단일 원천 바탕 정합성 검증'
    ],
    sources: [
      { name: '금융감독원 전자공시시스템 (DART)', url: 'https://dart.fss.or.kr/' },
      { name: '중소벤처기업부 공공데이터포털', url: 'https://www.data.go.kr/' }
    ]
  },
  {
    id: 'search-3',
    category: 'search',
    stepNumber: '산업군 매칭',
    title: '한국표준산업분류(KSIC) 자동 매칭',
    summary: '국세청 사업자등록 및 법인 등기 정보의 표준업종 코드를 분석하여 정확한 산업군 자동 설정',
    keyAction: '자동 도출된 산업군 분류값(예: 전자금융업, 선불전자지급수단 등) 확인',
    tips: [
      '법인 사업자등록 정보와 웹 서비스 특성 교차 분석 기반 정확한 표준산업분류 매칭',
      '수동 선택 없이 해당 도메인 핵심 비즈니스 모델에 부합하는 맞춤형 대시보드 지표 자동 구성'
    ],
    sources: [
      { name: '통계청 통계분류포털 (KSIC 한국표준산업분류)', url: 'https://kssc.kostat.go.kr/' }
    ]
  },

  // ── [Step 1~4: 현 데이터 리포트 - GNB 탭 순서 일치] ──
  {
    id: 'diag-1',
    category: 'diagnosis',
    stepNumber: '트래픽(현)',
    title: '트래픽(현) 진단 메뉴 활용법',
    summary: '방문자 규모(MAU), 평균 체류시간, 이탈률, 채널별 유입 경로 및 양대 마켓 모바일 앱 다운로드 다각도 분석',
    keyAction: '시밀러웹 실측 트래픽과 앱스토어 다운로드 지표를 통한 서비스 접근성 진단',
    tips: [
      'PC vs 모바일 유입 비율 확인을 통한 최적화 우선순위 결정',
      '검색(오가닉) vs 직접(다이렉트) 유입 비중 분석으로 브랜드 인지도 및 마케팅 의존도 파악',
      '모바일 앱 대상 구글플레이·애플 앱스토어 다운로드 수치 및 평점·리뷰 동시 검증',
      '하위 2단계 서브페이지: 웹+앱 통합트래픽, 웹 트래픽(PC), 앱 트래픽(iOS+Android) 세분화 분석'
    ],
    sources: [
      { name: 'Similarweb 공식 웹 지표', url: 'https://www.similarweb.com/' },
      { name: 'Google Play', url: 'https://play.google.com/store/apps' },
      { name: 'Apple App Store', url: 'https://www.apple.com/app-store/' }
    ]
  },
  {
    id: 'diag-2',
    category: 'diagnosis',
    stepNumber: '서비스',
    title: '서비스 분석 메뉴 활용법',
    summary: '공식 감사보고서 결산 제품·상품 매출 구조, 가맹업종 결제 비중, 지역별 결제량(ATM) 분석',
    keyAction: '제품·상품 매출 모델과 가맹업종별 결제 점유율 지표 대조를 통한 주력 매출원 파악',
    tips: [
      '공시 감사보고서 상 제품 매출, 상품 매출, 기타 수익 구성 실측 데이터 기반 점검',
      '결제 수수료율 구조와 부가 서비스(교통카드 연동, 환전 우대 등) 차별점 확인',
      '하위 2단계 서브페이지: 매출/수익 집계, 가맹업종 결제 비중, 지역별 결제량(ATM) 구성'
    ],
    sources: [
      { name: '금융감독원 전자공시시스템 (DART 결산 재무제표)', url: 'https://dart.fss.or.kr/' },
      { name: '공정거래위원회 가맹사업정보제공시스템', url: 'https://franchise.ftc.go.kr/index.do' }
    ]
  },
  {
    id: 'diag-3',
    category: 'diagnosis',
    stepNumber: '마케팅',
    title: '마케팅(현) 채널 성과 진단법',
    summary: '인스타그램, 블로그, 유튜브 등 공식 SNS 채널 팔로워 수, 게시물 반응률, 브랜드 검색량 추적',
    keyAction: '공식 SNS 채널별 팔로워·반응률(인게이지먼트율)과 검색 키워드 유입 추이 분석',
    tips: [
      '단순 팔로워 수치 외 실제 댓글·공감(인게이지먼트율) 수치 교차 검증을 통한 진성 팬덤 분석',
      '네이버/구글 검색 트렌드 지수 기반 최근 6개월간 브랜드 관심도 변동 감지',
      '하위 2단계 서브페이지: 마케팅 현황, 월별 SNS 성과비교, 키워드 분석 상세 제공'
    ],
    sources: [
      { name: 'Meta Instagram Graph API', url: 'https://www.instagram.com/' },
      { name: '네이버 데이터랩 검색어 트렌드', url: 'https://datalab.naver.com/' }
    ]
  },
  {
    id: 'diag-4',
    category: 'diagnosis',
    stepNumber: 'IR',
    title: 'IR 및 재무(GMV) 진단법',
    summary: '매출액, 영업이익, 누적 펀딩액, 연간 추정 거래액(GMV) 공시 데이터 원본 기반 정밀 진단',
    keyAction: '연도별 재무제표 결산 공시와 추정 거래액 지표 기반 재무 건전성 평가',
    tips: [
      '외감 법인: 금융감독원 DART 감사보고서 재무제표 주석 수치 100% 일치',
      '스타트업: 중기부 혁신의숲 실측 투자 유치 이력 및 누적 펀딩액 단일 원천 검증',
      '하위 2단계 서브페이지: 기업정보 · 재무 · 투자, 연도별 실적추이, GMV · 거래액 지표 구성'
    ],
    sources: [
      { name: '금융감독원 전자공시시스템 (DART)', url: 'https://dart.fss.or.kr/' },
      { name: '중소벤처기업부 혁신의숲', url: 'https://www.innoforest.co.kr/' }
    ]
  },

  // ── [Step 5~8: 실행 전략 리포트 - GNB 탭 순서 일치] ──
  {
    id: 'strat-1',
    category: 'strategy',
    stepNumber: '사업전략',
    title: '사업전략 (BM 확장 및 로드맵)',
    summary: '기업 공식 파이프라인 기반 단일 핵심 사업 전략 로드맵 및 단계별 매출 증가 방식 제공',
    keyAction: '분기별 핵심 마일스톤 및 BM 다각화 로드맵 검토를 통한 신규 사업 기회 발굴',
    tips: [
      '도메인 공식 사업 영역에 부합하는 단일 핵심 전략(예: 외국인 관광객 선불 인프라 독점) 확인',
      '단기(1~3개월), 중기(6개월), 장기(1년) 관점의 구체적 실행 마일스톤 제시',
      '하위 2단계 서브페이지: 매출 증가 방식(BM 확장 전략 및 실행 로드맵) 제공'
    ],
    sources: [
      { name: '금융감독원 전자공시시스템 (DART 사업보고서)', url: 'https://dart.fss.or.kr/' },
      { name: '중소벤처기업부 공공데이터포털', url: 'https://www.data.go.kr/' }
    ]
  },
  {
    id: 'strat-2',
    category: 'strategy',
    stepNumber: '영업전략',
    title: '영업전략 (타겟 발굴 및 전환)',
    summary: '기존 파트너사 객단가 상승·이탈 방지 전략 및 신규 타겟 고객사 유치 파이프라인 제안',
    keyAction: '우선순위 타겟군 리스트와 파트너십 제안 시나리오 바탕 B2B 영업 파이프라인 구축',
    tips: [
      '세그먼트별 고객 니즈에 부합하는 맞춤형 밸류 프로포지션 수립',
      '전환율 높은 인바운드/아웃바운드 영업 제안서 방향 구성',
      '하위 2단계 서브페이지: 영업 제안 리드, 기존 파트너사 제안, 신규 추진 업체 구성'
    ],
    sources: [
      { name: '한국평가데이터 (KODATA)', url: 'https://www.kodata.co.kr/' },
      { name: 'NICE평가정보', url: 'https://www.nice.co.kr/' }
    ]
  },
  {
    id: 'strat-3',
    category: 'strategy',
    stepNumber: '마케팅전략',
    title: '마케팅전략 (키워드 및 바이럴 실행)',
    summary: '비용 대비 효과 높은 고효율 검색 키워드 선정 및 SNS/플레이스 바이럴 최적화 과제 도출',
    keyAction: '전환 단가 절감 롱테일 키워드 및 바이럴 액션 가이드 마케팅 캠페인 반영',
    tips: [
      '전환 단가(CPA) 절감 롱테일 키워드 공략법 및 네이버 플레이스 순위 최적화 팁 제공',
      '비용 효율 높은 고효율 유입 키워드 발굴을 통한 광고 예산 절감',
      '하위 2단계 서브페이지: 유입 채널 및 키워드, 키워드 공략집 구성'
    ],
    sources: [
      { name: '네이버 검색광고 키워드 도구', url: 'https://searchad.naver.com/' },
      { name: 'Google Ads 키워드 플래너', url: 'https://ads.google.com/' }
    ]
  },
  {
    id: 'strat-4',
    category: 'strategy',
    stepNumber: '서버비용',
    title: '서버비용 최적화 (인프라 예산 산출)',
    summary: '현재 트래픽 및 성장 목표(MAU 10만~100만)에 따른 AWS/GCP 클라우드 인프라 견적 및 절감 방안 제시',
    keyAction: '트래픽 증가 구간별 클라우드 인프라 견적 시뮬레이션 및 FinOps 절감 방안 적용',
    tips: [
      'EC2/ECS, RDS, S3/CloudFront, 네트워크 전송량 등 핵심 리소스별 비용 구성 파악',
      '예약 인스턴스(RI) 및 세이빙스 플랜 적용 시 최대 40~60% 비용 절감 시나리오 확인',
      '트래픽 급증 대비 오토스케일링 및 FinOps 아키텍처 가이드 제공'
    ],
    sources: [
      { name: 'AWS Pricing Calculator (공식 요금 계산기)', url: 'https://calculator.aws/#/' }
    ]
  },

  // ── [Step 9: PDF 보고서] ──
  {
    id: 'report-1',
    category: 'report',
    stepNumber: '보고서 추출',
    title: '실시간 전략 보고서 추출 및 팀 공유',
    summary: '경영진 보고 및 팀 공유용 종합 PDF 리포트 정형화된 A4 규격 즉시 생성',
    keyAction: '경영진 보고용 종합 전략 보고서 다운로드 및 사내/투자자 공유',
    tips: [
      '8대 지표 전체 요약 정형화된 경영진 보고용 A4 포맷 자동 변환',
      '서비스 핵심 강점·보완점 및 실행 과제 한 장 요약표 정리',
      '외부 미팅 및 투자자 IR 프레젠테이션 자료 즉시 활용 가능'
    ],
    sources: [
      { name: '금융감독원 DART', url: 'https://dart.fss.or.kr/' },
      { name: '중소벤처기업부 공공데이터포털', url: 'https://www.data.go.kr/' }
    ]
  },

  // ── [Step 10: FAQ & 실전 팁] ──
  {
    id: 'faq-1',
    category: 'faq',
    stepNumber: '도메인 범위',
    title: 'Q. 어떤 도메인이든 분석할 수 있나요?',
    summary: '공개 웹서비스 주소 대상 제한 없는 분석 지원 및 실측 데이터 매칭 기반 정확도 보증',
    keyAction: '분석 대상 웹사이트 대표 URL 입력창 입력',
    tips: [
      '신생 서비스 및 극소수 트래픽 사이트: 기본 공시 및 사이트 구조 분석 모듈 우선 적용',
      '외부 트래픽 및 공시 데이터 축적 서비스: 정밀 실측 데이터 검증 지원'
    ],
    sources: [
      { name: 'KISA 한국인터넷진흥원 인터넷주소자원센터', url: 'https://dns.kisa.or.kr/' }
    ]
  },
  {
    id: 'faq-2',
    category: 'faq',
    stepNumber: '데이터 갱신',
    title: 'Q. 데이터의 정확성과 갱신 주기는 어떻게 되나요?',
    summary: 'DART 전자공시 정기보고서 및 플랫폼 공식 API/크롤러 데이터 기반 실측 검증',
    keyAction: '공시 주기 및 플랫폼별 데이터 수집 일정 확인',
    tips: [
      '공시 재무 데이터: 매 분기/연간 공시 발표 직후 최신본 실시간 동기화',
      '웹 트래픽 및 SNS 지표: 매월 초 1회 정기 실측 검증 후 반영'
    ],
    sources: [
      { name: '금융감독원 DART 정기보고서 공시규정', url: 'https://dart.fss.or.kr/' },
      { name: 'Similarweb 데이터 사양', url: 'https://www.similarweb.com/' }
    ]
  },
  {
    id: 'faq-3',
    category: 'faq',
    stepNumber: '이용 요금',
    title: 'Q. 비회원도 모든 기능을 무료로 이용할 수 있나요?',
    summary: 'URL 입력, 기업 식별, 핵심 트래픽 및 요약 분석 전 기능 무료 체험 지원',
    keyAction: '부서별 심층 실행 전략 및 엔터프라이즈 리포트 회원가입 후 열람',
    tips: [
      '이메일 인증 간편 가입을 통한 고급 분석 지표 즉시 잠금 해제',
      '대시보드 전체 뷰 제한 없는 열람 지원'
    ],
    sources: [
      { name: '공정거래위원회 전자상거래 표준약관', url: 'https://www.ftc.go.kr/' }
    ]
  },
  {
    id: 'faq-4',
    category: 'faq',
    stepNumber: '리포트 활용',
    title: 'Q. 분석 결과 리포트는 어떻게 활용하는 것이 가장 효과적인가요?',
    summary: '주간/월간 경영진 보고, 신규 마케팅 예산 책정, 투자자 IR 피칭용 팩트 시트 활용',
    keyAction: '원클릭 PDF 보고서 생성을 통한 사내 공유 및 의사결정 자료 활용',
    tips: [
      '추출된 PDF 리포트 내 객관적 수치 및 공시 출처 명시로 사내 의사결정 설득력 확보'
    ],
    sources: [
      { name: '금융감독원 DART', url: 'https://dart.fss.or.kr/' },
      { name: '중소벤처기업부 혁신의숲', url: 'https://www.innoforest.co.kr/' }
    ]
  }
];

interface Props {
  onBackToDashboard: (targetTab?: SubpageTab) => void;
  initialCategory?: string;
  onOpenPolicy?: (type: PolicyType) => void;
  onNavigateHome?: () => void;
  onNavigateDocs?: () => void;
  hideHeader?: boolean;
}

export const HowToUseDocsPage: React.FC<Props> = ({
  onBackToDashboard,
  initialCategory = 'all',
  onOpenPolicy,
  onNavigateHome,
  onNavigateDocs,
  hideHeader = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('diag-1');

  // 필터링된 가이드 항목
  const filteredItems = useMemo(() => {
    return GUIDE_ITEMS.filter((item) => {
      // 카테고리 필터
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory;

      // 검색어 필터
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.keyAction.toLowerCase().includes(query) ||
        item.tips.some(t => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeCategoryMeta = useMemo(() => {
    return GUIDE_CATEGORIES.find((c) => c.id === selectedCategory) || GUIDE_CATEGORIES[0];
  }, [selectedCategory]);

  // 카테고리별 아이콘 매핑
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'search': return <SearchIcon size={14} className="text-purple-400" />;
      case 'diagnosis': return <LayoutDashboardIcon size={14} className="text-cyan-400" />;
      case 'strategy': return <SparklesIcon size={14} className="text-purple-300" />;
      case 'report': return <ZapIcon size={14} className="text-cyan-400" />;
      case 'faq': return <CircleQuestionMarkIcon size={14} className="text-purple-400" />;
      default: return <CompassIcon size={14} className="text-cyan-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 font-sans flex flex-col w-full max-w-full overflow-x-hidden">
      {/* ── 1. 상단 글로벌 네비게이션 헤더 ── */}
      {!hideHeader && (
        <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-750 px-4 sm:px-6 py-2.5 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* 좌측: 4대 GNB 바로가기 (서비스 소개 · 이용방법 · 제품 · 데이터 출처) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigateHome ? onNavigateHome() : onBackToDashboard('landing')}
              className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 border border-dark-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
              title="서비스 소개로 이동"
            >
              <SparklesIcon size={14} className="text-indigo-400" />
              <span>서비스 소개</span>
            </button>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/40">
              <div className="w-5 h-5 rounded-md bg-cyan-600 flex items-center justify-center text-white shadow-sm">
                <CompassIcon size={13} />
              </div>
              <h1 className="text-xs font-black text-cyan-300">
                <span>이용방법</span>
              </h1>
            </div>
            <button
              type="button"
              onClick={() => onBackToDashboard('overview')}
              className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 border border-dark-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
              title="대시보드(제품)로 이동"
            >
              <LayoutDashboardIcon size={14} className="text-cyan-400" />
              <span>제품</span>
            </button>
            {onNavigateDocs && (
              <button
                type="button"
                onClick={onNavigateDocs}
                className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 border border-dark-700 text-slate-400 hover:text-purple-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                title="데이터 출처로 이동"
              >
                <BookOpenIcon size={14} className="text-purple-400" />
                <span>데이터 출처</span>
              </button>
            )}
          </div>

          {/* 우측: 검색창 */}
          <div className="relative w-full sm:w-56">
            <SearchIcon size={14} className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="탭·지표·기능 검색..."
              aria-label="이용방법 가이드 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-dark-950 border border-dark-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>
      </header>
    )}

      {/* ── 2. 메인 컨테이너 (좌측 목차 + 중앙 본문 가이드) ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 flex flex-col md:flex-row gap-5 overflow-x-hidden">
        
        {/* ── 좌측 사이드바 ── */}
        <aside className="w-full md:w-56 shrink-0 space-y-4">
          {/* 가이드 검색창 (GNB가 최상단에 있을 때 사이드바 상단에 배치) */}
          {hideHeader && (
            <div className="relative w-full">
              <SearchIcon size={14} className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="탭·지표·기능 검색..."
                aria-label="사이드바 이용방법 가이드 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-dark-900 border border-dark-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
              />
            </div>
          )}
          <div className="p-3 rounded-xl bg-dark-900 border border-dark-750 shadow-sm">
            <nav aria-label="가이드 카테고리 네비게이션" className="space-y-1">
              {GUIDE_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setExpandedId(null);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-cyan-600/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {getCategoryIcon(cat.id)}
                      <span className="truncate">{cat.label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-mono ${
                        isActive
                          ? 'bg-cyan-500 text-white'
                          : 'bg-dark-800 text-slate-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

        </aside>

        {/* ── 중앙 본문 영역 ── */}
        <main className="flex-1 min-w-0 space-y-4 overflow-x-hidden">
          
          {/* 섹션 상단 헤더 카드 */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-750 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-cyan-500/15 text-cyan-300 border-cyan-500/30 flex items-center gap-1">
                  {getCategoryIcon(activeCategoryMeta.id)}
                  <span>{activeCategoryMeta.label}</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">({filteredItems.length}개 가이드 항목)</span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white">
                {activeCategoryMeta.description}
              </h2>
            </div>
          </div>

          {/* ── 이용방법 (3단계 핵심 온보딩 다이어그램) ── */}
          {(selectedCategory === 'all' || selectedCategory === 'search') && !searchQuery.trim() && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-dark-900 via-dark-900/80 to-dark-950 border border-dark-750 shadow-xl space-y-4">
              {/* 섹션 상단 헤더: 편리한 이용방법 (3단계) => 이용방법 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-dark-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold border border-cyan-500/30">
                    <ClockIcon size={16} className="text-cyan-400" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    이용방법
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  30초 분석 워크플로우
                </span>
              </div>

              {/* ── 3단계 다이어그램 카드 플로우 (> 순서 연결 & 핵심 요약) ── */}
              <div className="flex flex-col md:flex-row items-stretch gap-2.5 sm:gap-3">
                {/* Step 1 카드 */}
                <div className="flex-1 p-3.5 rounded-xl bg-dark-950/90 border border-dark-800 hover:border-purple-500/40 transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 font-black text-[11px] flex items-center justify-center shrink-0">
                        01
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white">이메일 인증</h4>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      회사 계정 1회 인증으로 간편 시작
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-mono text-[11px]">name@company.com</span>
                    <CircleCheckIcon size={15} className="text-brand-cyan shrink-0" />
                  </div>
                </div>

                {/* 1단계 > 2단계 연결 커넥터 */}
                <div className="shrink-0 flex items-center justify-center">
                  <div className="hidden md:flex w-7 h-7 rounded-full bg-dark-850 border border-cyan-500/40 items-center justify-center text-cyan-300 font-black text-xs shadow-md shadow-cyan-950/40 select-none">
                    &gt;
                  </div>
                  <div className="flex md:hidden py-0.5 text-cyan-400 font-black text-xs select-none">
                    ▼
                  </div>
                </div>

                {/* Step 2 카드 */}
                <div className="flex-1 p-3.5 rounded-xl bg-dark-950/90 border border-dark-800 hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-black text-[11px] flex items-center justify-center shrink-0">
                        02
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white">8대 지표 자동 매핑</h4>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      도메인 입력 즉시 8대 지표 자동 도출
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-between text-xs">
                    <span className="text-white font-mono flex items-center gap-1.5 text-[11px]">
                      <GlobeIcon size={13} className="text-cyan-400" />
                      namanecard.com
                    </span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" />
                  </div>
                </div>

                {/* 2단계 > 3단계 연결 커넥터 */}
                <div className="shrink-0 flex items-center justify-center">
                  <div className="hidden md:flex w-7 h-7 rounded-full bg-dark-850 border border-purple-500/40 items-center justify-center text-purple-300 font-black text-xs shadow-md shadow-purple-950/40 select-none">
                    &gt;
                  </div>
                  <div className="flex md:hidden py-0.5 text-purple-400 font-black text-xs select-none">
                    ▼
                  </div>
                </div>

                {/* Step 3 카드 */}
                <div className="flex-1 p-3.5 rounded-xl bg-dark-950/90 border border-dark-800 hover:border-purple-500/40 transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 font-black text-[11px] flex items-center justify-center shrink-0">
                        03
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white">PDF 보고서 추출</h4>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      경영진·팀 공유용 A4 리포트 생성
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-between text-xs">
                    <span className="text-purple-300 font-medium flex items-center gap-1.5 text-[11px]">
                      <LayoutDashboardIcon size={13} className="text-purple-400" />
                      <span>PDF Report</span>
                    </span>
                    <span className="text-purple-300 font-bold text-[10px]">원클릭 다운로드</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 가이드 스텝 리스트 (아코디언 확장형 카드) ── */}
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-dark-900 border border-dark-750 text-slate-500 text-xs">
                검색 조건에 일치하는 가이드 항목 없음
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isExpanded = expandedId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl bg-dark-900 border transition-all overflow-hidden ${
                      isExpanded
                        ? 'border-cyan-500/40 shadow-md bg-dark-900/90'
                        : 'border-dark-750 hover:border-dark-700'
                    }`}
                  >
                    {/* 카드 헤더 (클릭 시 아코디언 토글) */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-3.5 sm:p-4 cursor-pointer flex items-start sm:items-center justify-between gap-3 select-none"
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        {item.stepNumber ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                            {item.stepNumber}
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-dark-800 text-slate-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                        )}
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {item.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="p-1 rounded-md text-slate-400 hover:text-white">
                          {isExpanded ? (
                            <ChevronUpIcon size={16} className="text-cyan-400" />
                          ) : (
                            <ChevronDownIcon size={16} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 카드 확장 바디 (실전 팁 & 체크포인트) */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-3 border-t border-dark-800/80 space-y-3 bg-dark-950/40 text-xs">
                        {/* 상세 팁 목록 */}
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold text-slate-300">💡 실무 활용 팁 & 체크포인트</div>
                          <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside pl-1">
                            {item.tips.map((tip, tIdx) => (
                              <li key={tIdx} className="leading-relaxed">
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 각 내용 하단: 출처 : [아웃링크 입혀진 텍스트]만 단독 존재 */}
                        {item.sources && item.sources.length > 0 && (
                          <div className="pt-2.5 border-t border-dark-800 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                            <span className="font-bold text-slate-300 shrink-0">출처 :</span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {item.sources.map((src, sIdx) => (
                                <React.Fragment key={sIdx}>
                                  {sIdx > 0 && <span className="text-slate-600">·</span>}
                                  <a
                                    href={src.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
                                  >
                                    {src.name}
                                  </a>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* ── 하단 안내 배너 ── */}
          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-dark-750 flex items-center gap-2 text-xs text-slate-400">
            <CircleCheckIcon size={16} className="text-brand-cyan shrink-0" />
            <span>원천 데이터 출처 및 공시 정합성은 상단 메뉴 데이터 출처(Docs) 센터에서 상시 확인 가능</span>
          </div>

        </main>
      </div>

      {/* ── 3. 하단 푸터 ── */}
      <MainFooter
        currentView="guide"
        onOpenPolicy={onOpenPolicy || (() => {})}
        onNavigateLanding={onNavigateHome}
        onNavigateDashboard={() => onBackToDashboard('overview')}
        onNavigateDocs={onNavigateDocs}
      />
    </div>
  );
};

export default HowToUseDocsPage;
