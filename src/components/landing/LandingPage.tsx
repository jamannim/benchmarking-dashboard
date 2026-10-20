import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  TrendingUpIcon, 
  LayersIcon, 
  CircleCheckIcon, 
  CircleQuestionMarkIcon, 
  TargetIcon, 
  MenuIcon, 
  XIcon, 
  FileTextIcon,
  BookOpenIcon,
  GlobeIcon,
  ClockIcon,
  LayoutDashboardIcon,
  ZapIcon,
  SearchIcon,
  CompassIcon
} from '@animateicons/react/lucide';
import { BizStrategyLogo } from '../BizStrategyLogo';
import { BrandLogo } from '../BrandLogo';
import { MainFooter } from '../common/MainFooter';
import { PartnersBelt } from './PartnersBelt';
import { SignupModal } from './SignupModal';
import { LoginModal } from '../auth/LoginModal';
import { UserProfileModal } from '../auth/UserProfileModal';
import { PolicyModals, type PolicyType } from './PolicyModals';
import { UrlVerificationModal, type VerificationResult } from './UrlVerificationModal';
import KineticGrid from '@/components/ui/kinetic-grid';
import { trackEvent } from '../../utils/analytics';
import type { CompleteServiceIntelligence } from '../../types/intelligence';
import type { UserProfile } from '../../types/auth';

// 메인 화면 내용별 슬라이드 섹션 목록 정의 (클릭 & 스크롤 연동)
const LANDING_SECTIONS = [
  { id: 'hero', number: '01', title: '한 눈에 보는 비지니스 컨설팅 리포트!', shortTitle: '분석시작' },
  { id: 'problem', number: '02', title: '대표와 C레벨 임원들의 핵심 고민은?', shortTitle: '핵심고민' },
  { id: 'features', number: '03', title: '대 AI시대, 이제는 데이터가 정답이다!', shortTitle: '핵심가치' },
] as const;

interface LandingPageProps {
  onEnterDashboard: (targetTab?: string, isDemo?: boolean) => void;
  currentData: CompleteServiceIntelligence;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onAnalyzeUrl: (rawUrl: string, verificationResult?: VerificationResult) => void;
  historyDomains?: string[];
  hideHeader?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  currentData: _currentData,
  currentUser,
  onLoginSuccess,
  onLogout,
  onAnalyzeUrl,
  historyDomains = [],
  hideHeader = false,
}) => {
  // 모달 제어
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [policyType, setPolicyType] = useState<PolicyType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');

  // URL 직접 입력 검색창 상태
  const [inputUrl, setInputUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  // A/B 테스트 변수 (명세서 5.0)
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paramVariant = searchParams.get('variant')?.toUpperCase();
    if (paramVariant === 'B') {
      setVariant('B');
    }

    trackEvent('landing_view', {
      variant: paramVariant === 'B' ? 'B' : 'A',
      experiment_id: 'exp_hero_headline_2026',
    });
  }, []);

  // CTA 클릭 핸들러
  const handleOpenSignup = (location: string) => {
    trackEvent('hero_cta_click', { cta_location: location, variant });
    setIsSignupOpen(true);
  };

  const handleEnterDashboardWithTracking = (tabName = 'overview', isDemo = false) => {
    trackEvent('dashboard_entry', { source: isDemo ? 'virtual_demo_button' : 'landing_cta', target_tab: tabName });
    onEnterDashboard(tabName, isDemo);
  };

  // URL 입력 후 AI 벤치마킹 사전 검증 모달 오픈
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const clean = inputUrl.trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
    if (!clean) {
      setUrlError('분석할 웹사이트 URL 또는 도메인을 입력해 주세요.');
      return;
    }

    trackEvent('url_analysis_start', { domain: clean });
    setPendingUrl(clean);
    setIsVerificationOpen(true);
  };

  // 사전 검증 모달에서 최종 확인 시 대시보드 생성
  const handleVerificationConfirm = (result: VerificationResult) => {
    setIsVerificationOpen(false);
    trackEvent('url_verification_confirmed', { 
      domain: result.domain, 
      category: result.category,
      peers_count: result.peerCompetitors.length 
    });
    onAnalyzeUrl(result.domain, result);
    onEnterDashboard('overview');
  };

  // 최근 분석 히스토리 도메인 클릭 시 즉시 재검증 및 분석
  const handleHistoryClick = (historyDomain: string) => {
    setInputUrl(historyDomain);
    setUrlError(null);
    setPendingUrl(historyDomain);
    setIsVerificationOpen(true);
  };


  // ── 내용별 화면 슬라이드 네비게이션 (클릭 & 스크롤바) ──
  const [activeSection, setActiveSection] = useState<string>('hero');

  // 스크롤 위치에 따른 활성 내용 실시간 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = LANDING_SECTIONS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(LANDING_SECTIONS[i].id);
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(LANDING_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── 부드러운 슬라이딩 감속 애니메이션 (easeInOutCubic) ──
  const smoothSlideTo = (targetY: number, duration: number = 850) => {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    if (Math.abs(diff) < 2) return;

    let startTime: number | null = null;

    // easeInOutCubic: 부드럽게 출발하여 고속 이동 후 벨벳처럼 우아하게 감속 안착
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startY + diff * ease);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  // 특정 내용(섹션)으로 부드럽게 슬라이딩 1단 이동
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 64; // GNB 헤더 높이 64px
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);

      smoothSlideTo(offsetPosition, 850);
      setActiveSection(id);
      trackEvent('feature_section_view', { section_id: id });
    }
  };



  // ── 한 번 마우스 휠 스크롤 시 각 해당 단으로 1단계씩 정확하게 이동하는 원페이지 스냅 스크롤 ──
  const isScrollingRef = useRef(false);
  const activeSectionRef = useRef(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      // 모달이 열려있거나 포커스가 입력창에 있을 때는 휠 가로채지 않고 정상 스크롤 허용
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === 'input' || 
        activeTag === 'textarea' || 
        isSignupOpen || 
        isLoginOpen || 
        isProfileOpen || 
        isVerificationOpen ||
        Boolean(policyType)
      ) {
        return;
      }

      // 미세한 휠 노이즈 무시
      if (Math.abs(e.deltaY) < 15) return;

      // 이미 스크롤 이동 중일 때는 중복 이벤트 무시
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      const curIdx = LANDING_SECTIONS.findIndex((s) => s.id === activeSectionRef.current);
      if (curIdx === -1) return;

      if (e.deltaY > 0) {
        // 휠 다운 ➔ 다음 단으로 이동
        if (curIdx < LANDING_SECTIONS.length - 1) {
          e.preventDefault();
          isScrollingRef.current = true;
          scrollToSection(LANDING_SECTIONS[curIdx + 1].id);

          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            isScrollingRef.current = false;
          }, 850);
        }
      } else if (e.deltaY < 0) {
        // 휠 업 ➔ 이전 단으로 이동
        if (curIdx > 0) {
          e.preventDefault();
          isScrollingRef.current = true;
          scrollToSection(LANDING_SECTIONS[curIdx - 1].id);

          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            isScrollingRef.current = false;
          }, 850);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [isSignupOpen, isLoginOpen, isProfileOpen, isVerificationOpen, policyType]);

  // 키보드 상/하 및 PageUp/PageDown 방향키 슬라이드 이동 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === 'input' || 
        activeTag === 'textarea' || 
        isSignupOpen || 
        isLoginOpen || 
        isProfileOpen || 
        isVerificationOpen ||
        Boolean(policyType)
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const cur = LANDING_SECTIONS.findIndex((s) => s.id === activeSectionRef.current);
        if (cur < LANDING_SECTIONS.length - 1) {
          e.preventDefault();
          scrollToSection(LANDING_SECTIONS[cur + 1].id);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const cur = LANDING_SECTIONS.findIndex((s) => s.id === activeSectionRef.current);
        if (cur > 0) {
          e.preventDefault();
          scrollToSection(LANDING_SECTIONS[cur - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSignupOpen, isLoginOpen, isProfileOpen, isVerificationOpen, policyType]);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 font-sans selection:bg-purple-600 selection:text-white flex flex-col overflow-x-hidden snap-y snap-proximity scroll-smooth">
      
      {/* ── 1. GNB 헤더 (2.1) ── */}
      {!hideHeader && (
        <header className="sticky top-0 z-40 w-full bg-dark-950/80 backdrop-blur-md border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* 좌측: 로고 및 브랜드 타이포그래피 (BIZLENS 아래에 Business Analysis Lens 배치) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <BizStrategyLogo size="md" />
            <div className="flex flex-col text-left justify-center">
              <span className="font-black text-white text-base sm:text-lg lg:text-xl tracking-tight leading-none">
                BIZLENS
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-slate-400 tracking-tight leading-none mt-1">
                Business Analysis Lens
              </span>
            </div>
          </div>

          {/* 중앙: 데스크톱 GNB 메뉴 (서비스 소개 · 이용방법 · 제품 · 데이터 출처) */}
          <nav aria-label="메인 네비게이션" className="hidden md:flex items-center gap-6 sm:gap-7 text-sm font-semibold text-slate-300">
            {/* 1. 서비스 소개 */}
            <button 
              type="button"
              onClick={() => scrollToSection('hero')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeSection === 'hero' ? 'text-indigo-300 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <SparklesIcon size={16} className="text-indigo-400" />
              <span>서비스 소개</span>
            </button>

            {/* 2. 이용방법 */}
            <button 
              type="button"
              onClick={() => handleEnterDashboardWithTracking('guide')}
              className="flex items-center gap-1.5 hover:text-cyan-300 text-slate-300 transition-colors cursor-pointer"
            >
              <CompassIcon size={16} className="text-cyan-400" />
              <span>이용방법</span>
            </button>

            {/* 3. 제품 */}
            <button 
              type="button"
              onClick={() => handleEnterDashboardWithTracking('overview', true)}
              className="flex items-center gap-1.5 hover:text-cyan-300 text-slate-300 transition-colors cursor-pointer"
              title="대시보드(제품) 바로가기"
            >
              <LayoutDashboardIcon size={16} className="text-cyan-400" />
              <span>제품</span>
            </button>

            {/* 4. 데이터 출처 */}
            <button
              type="button"
              onClick={() => handleEnterDashboardWithTracking('docs')}
              className="flex items-center gap-1.5 hover:text-purple-300 text-slate-300 transition-colors cursor-pointer"
            >
              <BookOpenIcon size={16} className="text-purple-400" />
              <span>데이터 출처</span>
            </button>
          </nav>

          {/* 우측: 인증 상태별 버튼 그룹 (표준 CSS 규격: text-sm font-semibold, h-9 높이 통일) */}
          <div className="hidden sm:flex items-center gap-2.5">
            {currentUser ? (
              /* 로그인 완료 상태: 프로필 칩 */
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                className="h-9 px-3 rounded-xl bg-dark-900 hover:bg-dark-850 border border-purple-500/40 text-sm font-semibold text-slate-200 flex items-center gap-2 transition-all shadow-sm group cursor-pointer"
                title="내 계정 정보 확인 및 비밀번호 재설정"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white text-[11px] font-black">
                  {currentUser.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white text-xs truncate max-w-[120px] font-semibold leading-tight">
                    {currentUser.companyName || currentUser.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono">
                    {currentUser.uid}
                  </span>
                </div>
              </button>
            ) : (
              /* 비로그인 상태: 로그인 + 회원가입 (표준 14px text-sm font-semibold, h-9 통일) */
              <>
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="h-9 px-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-dark-800 border border-dark-750 transition-colors cursor-pointer flex items-center justify-center"
                >
                  로그인
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenSignup('header')}
                  className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>회원가입</span>
                  <ArrowRightIcon size={15} />
                </button>
              </>
            )}
          </div>

          {/* 모바일 햄버거 토글 */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        {/* 모바일 드롭다운 메뉴 (표준 CSS 규격: text-sm font-semibold) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-900 border-b border-dark-800 px-4 py-4 space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('hero');
              }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-300 py-1.5 text-left w-full cursor-pointer hover:text-white"
            >
              <SparklesIcon size={16} className="text-indigo-400" />
              <span>서비스 소개</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleEnterDashboardWithTracking('guide');
              }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-300 py-1.5 text-left w-full cursor-pointer hover:text-white"
            >
              <CompassIcon size={16} className="text-cyan-400" />
              <span>이용방법</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleEnterDashboardWithTracking('overview', true);
              }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-300 py-1.5 text-left w-full cursor-pointer hover:text-cyan-300"
            >
              <LayoutDashboardIcon size={16} className="text-cyan-400" />
              <span>제품</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleEnterDashboardWithTracking('docs');
              }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-300 py-1.5 text-left w-full cursor-pointer hover:text-white"
            >
              <BookOpenIcon size={16} className="text-purple-400" />
              <span>데이터 출처</span>
            </button>
            <div className="pt-2 border-t border-dark-800 flex flex-col gap-2">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsProfileOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-purple-200 bg-purple-950/40 border border-purple-500/40 text-center"
                >
                  내 계정 정보 (UID: {currentUser.uid})
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsLoginOpen(true);
                    }}
                    className="h-10 rounded-xl text-sm font-semibold text-slate-200 bg-dark-800 hover:bg-dark-750 text-center flex items-center justify-center cursor-pointer"
                  >
                    로그인
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleOpenSignup('mobile_menu');
                    }}
                    className="h-10 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 text-center flex items-center justify-center cursor-pointer"
                  >
                    회원가입
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    )}

      {/* ── 1. Top-Tier 컨설팅 전담팀 구성 (한 눈에 보는 비지니스 컨설팅 리포트!) ── */}
      <main id="main-content" className="flex-1">
        <section id="hero" className="relative border-b border-dark-800 snap-start scroll-mt-16 overflow-hidden">
          <KineticGrid globalColor="default" className="min-h-0 pt-12 sm:pt-18 pb-16 sm:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
                
                {/* 상단 뱃지 */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900/80 border border-dark-750 text-slate-300 text-xs font-bold shadow-sm">
                  <SparklesIcon size={14} className="text-purple-400" />
                  <span className="sm:hidden">컨설팅 전담팀 구성</span>
                  <span className="hidden sm:inline">Top-Tier 컨설팅 전담팀 구성</span>
                </div>

              {/* 헤드라인 / 메인 슬로건 */}
              <div className="space-y-2.5 sm:space-y-3">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight sm:leading-snug">
                  한 눈에 보는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-300">비지니스 컨설팅 리포트!</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium tracking-tight">
                  <span>사업 현황 진단 + 성장 마케팅 방향 + 전략적 컨설팅</span>
                </p>
              </div>

              {/* ── URL 직접 입력창 (흰색 두꺼운 테두리) & 핵심 2대 버튼 1행 배치 ── */}
              <div className="pt-2 sm:pt-4 max-w-2xl mx-auto w-full space-y-3">
                <form onSubmit={handleUrlSubmit} className="relative">
                  {/* 흰색 두꺼운 테두리바 입력창 (내부 우측에 '분석하기' 버튼 배치) */}
                  <div className="relative flex items-center p-1.5 sm:p-2 rounded-2xl bg-dark-900/95 border-2 sm:border-[2.5px] border-white shadow-2xl shadow-white/10 ring-2 ring-white/10 backdrop-blur-md">
                    <GlobeIcon size={18} className="absolute left-3.5 sm:left-4 text-cyan-400 pointer-events-none" />
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => {
                        setInputUrl(e.target.value);
                        if (urlError) setUrlError(null);
                      }}
                      placeholder="URL을 입력하세요."
                      aria-label="분석 대상 도메인 URL 입력"
                      className="w-full pl-10 sm:pl-12 pr-24 sm:pr-28 py-2.5 sm:py-3 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 font-medium focus:outline-none"
                    />
                  <button
                    type="submit"
                    className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer group hover:scale-[1.02]"
                  >
                    <SearchIcon size={14} className="text-purple-200" />
                    <span>분석하기</span>
                  </button>
                </div>

                {urlError && (
                  <p className="text-[11px] text-purple-300 text-left pl-3 pt-1 font-medium flex items-center gap-1">
                    <span>* {urlError}</span>
                  </p>
                )}

                {/* 최근 분석 히스토리 */}
                {historyDomains && historyDomains.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[11px] text-slate-400">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <ClockIcon size={14} className="text-purple-400" />
                      <span>최근 분석 히스토리:</span>
                    </span>
                    {historyDomains.slice(0, 3).map((dom) => (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => handleHistoryClick(dom)}
                        className="px-2.5 py-0.5 rounded-md bg-dark-900 hover:bg-dark-800 text-cyan-300 hover:text-white border border-dark-750 hover:border-purple-500/50 transition-colors font-mono cursor-pointer flex items-center gap-1.5 shadow-sm"
                        title={`${dom} 재분석`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
                        <span>{dom}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 체험 대시보드 바로가기 버튼 */}
                <div className="pt-2 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEnterDashboardWithTracking('overview', true)}
                    className="w-full sm:w-auto sm:min-w-[280px] py-3.5 px-6 rounded-xl bg-dark-900 hover:bg-dark-850 text-white font-black text-xs sm:text-sm border-2 border-cyan-400/50 hover:border-cyan-400 shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer group hover:scale-[1.02]"
                    title="체험 대시보드로 바로 이동"
                  >
                    <LayoutDashboardIcon size={16} className="text-cyan-400" />
                    <span>체험 대시보드</span>
                    <ArrowRightIcon size={16} className="text-cyan-300" />
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
        </KineticGrid>
      </section>

      {/* ── Trust By (파트너사 무한 롤링 벨트 티커) ── */}
      <PartnersBelt />

      {/* ── 2. 대표와 C레벨 임원들의 핵심 고민은? (현재 상황과 문제점 분석) ── */}
      <section id="problem" className="py-16 sm:py-24 border-b border-dark-800 bg-gradient-to-b from-dark-950 via-dark-900/40 to-dark-950 relative overflow-hidden snap-start scroll-mt-16">
        {/* 은은한 배경 오로라 라이트 */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900/90 border border-dark-750 text-slate-300 text-xs font-bold shadow-sm">
              <CircleQuestionMarkIcon size={14} className="text-purple-400" />
              <span className="sm:hidden">상황·문제점 분석</span>
              <span className="hidden sm:inline">현재 상황과 문제점 분석</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              <span className="sm:hidden">대표·C레벨 핵심 고민</span>
              <span className="hidden sm:inline">대표와 C레벨 임원들의 핵심 고민은?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 카드 1: 서비스 데이터 기준 */}
            <div className="p-6 rounded-3xl bg-dark-900/90 border border-dark-750/90 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-purple-950/20 backdrop-blur-sm">
              <div className="space-y-4">
                {/* 동적 아이콘 사이즈 확대 + 내용 설명(제목 및 서브텍스트) 인라인 우측 배치 (퍼플 톤 정돈) */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0 shadow-inner">
                    <TargetIcon size={26} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      <span className="sm:hidden">서비스 데이터 기준</span>
                      <span className="hidden sm:inline">서비스 데이터 기준</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                      <span className="sm:hidden">트래픽과 매출/수익 관계 분석</span>
                      <span className="hidden sm:inline">트래픽과 매출/수익 관계 분석</span>
                    </p>
                  </div>
                </div>

                {/* ── 트렌디 인터랙티브 비주얼 오브젝트: 실시간 경쟁사 성장 갭 벤치마크 바 ── */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">
                      <span className="sm:hidden">웹/앱 MAU 확인</span>
                      <span className="hidden sm:inline">웹/앱 MAU 확인</span>
                    </span>
                    <span className="text-cyan-400 font-bold">시밀러웹 실측</span>
                  </div>
                  
                  {/* 자사 바 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="sm:hidden">자사</span>
                        <span className="hidden sm:inline">우리 회사 (자사)</span>
                      </span>
                      <span className="font-mono text-cyan-300 font-bold">142.5만 (48%)</span>
                    </div>
                    <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full w-[48%]" />
                    </div>
                  </div>

                  {/* 경쟁사 A 바 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>
                        <span className="sm:hidden">경쟁사 A</span>
                        <span className="hidden sm:inline">경쟁사 A (업계 1위)</span>
                      </span>
                      <span className="font-mono">195.0만 (66%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-600 rounded-full w-[66%]" />
                    </div>
                  </div>

                  {/* 경쟁사 B 바 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>경쟁사 B</span>
                      <span className="font-mono">88.2만 (30%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-700 rounded-full w-[30%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 솔루션 태그: 현 서비스 실시간 데이터 검증 (전사 공식 강조색: 에메랄드 그린) */}
              <div className="mt-5 pt-3.5 border-t border-dark-800 flex items-center gap-2 text-xs font-bold text-emerald-300">
                <CircleCheckIcon size={16} className="text-emerald-400 shrink-0" />
                <span>
                  <span className="sm:hidden">실시간 데이터 검증</span>
                  <span className="hidden sm:inline">현 서비스 실시간 데이터 검증</span>
                </span>
              </div>
            </div>

            {/* 카드 2: 파편화된 채널 지표 */}
            <div className="p-6 rounded-3xl bg-dark-900/90 border border-dark-750/90 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-cyan-950/20 backdrop-blur-sm">
              <div className="space-y-4">
                {/* 동적 아이콘 사이즈 확대 + 내용 설명(제목 및 서브텍스트) 인라인 우측 배치 (시안 톤 정돈) */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0 shadow-inner">
                    <LayersIcon size={26} className="text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      파편화된 채널 지표
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                      <span className="sm:hidden">데이터 자동 통합</span>
                      <span className="hidden sm:inline">흩어진 데이터 추적은 이제 그만!</span>
                    </p>
                  </div>
                </div>

                {/* ── 트렌디 인터랙티브 비주얼 오브젝트: 3대 데이터 파이프라인 통합 허브 그래픽 (로고 이미지 기반) ── */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-2.5">
                  <div className="text-[11px] text-slate-400 font-medium">
                    <span className="sm:hidden">데이터 자동 통합</span>
                    <span className="hidden sm:inline">분산 데이터 자동 통합 파이프라인</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-dark-900 border border-dark-800 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <BrandLogo brandKey="similarweb" size="xs" className="w-5 h-5 !p-0.5 rounded-md shrink-0" />
                        <span className="text-slate-200 font-bold truncate">시밀러웹</span>
                      </div>
                      <span className="text-cyan-300 font-mono text-[11px] font-bold shrink-0 ml-2">실측 완료</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-dark-900 border border-dark-800 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex items-center -space-x-1 shrink-0">
                          <BrandLogo brandKey="dart" size="xs" className="w-5 h-5 !p-0.5 rounded-md" />
                          <BrandLogo brandKey="mss" size="xs" className="w-5 h-5 !p-0.5 rounded-md" />
                          <BrandLogo brandKey="innoforest" size="xs" className="w-5 h-5 !p-0.5 rounded-md" />
                        </div>
                        <span className="text-slate-200 font-bold truncate">
                          <span className="sm:hidden">DART·혁신의숲</span>
                          <span className="hidden sm:inline">DART·중기부·혁신의숲</span>
                        </span>
                      </div>
                      <span className="text-cyan-300 font-mono text-[11px] font-bold shrink-0 ml-2">검증 완료</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-dark-900 border border-dark-800 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex items-center -space-x-1 shrink-0">
                          <BrandLogo brandKey="naver" size="xs" className="w-5 h-5 !p-0.5 rounded-md" />
                          <BrandLogo brandKey="google" size="xs" className="w-5 h-5 !p-0.5 rounded-md" />
                        </div>
                        <span className="text-slate-200 font-bold truncate">Naver·Google</span>
                      </div>
                      <span className="text-cyan-300 font-mono text-[11px] font-bold shrink-0 ml-2">연동 완료</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 솔루션 태그: 비지니스의 핵심을 한 눈에! (전사 공식 강조색: 에메랄드 그린) */}
              <div className="mt-5 pt-3.5 border-t border-dark-800 flex items-center gap-2 text-xs font-bold text-emerald-300">
                <CircleCheckIcon size={16} className="text-emerald-400 shrink-0" />
                <span>
                  <span className="sm:hidden">비즈니스 핵심 한눈에!</span>
                  <span className="hidden sm:inline">비지니스의 핵심을 한 눈에!</span>
                </span>
              </div>
            </div>

            {/* 카드 3: 데이터 취합 리소스 낭비 */}
            <div className="p-6 rounded-3xl bg-dark-900/90 border border-dark-750/90 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-purple-950/20 backdrop-blur-sm">
              <div className="space-y-4">
                {/* 동적 아이콘 사이즈 확대 + 내용 설명(제목 및 서브텍스트) 인라인 우측 배치 (퍼플 톤) */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0 shadow-inner">
                    <ZapIcon size={26} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      <span className="sm:hidden">취합 리소스 낭비</span>
                      <span className="hidden sm:inline">데이터 취합 리소스 낭비</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                      <span className="sm:hidden">원클릭 30초 취합</span>
                      <span className="hidden sm:inline">방대한 자료 취합, 원 클릭 즉시</span>
                    </p>
                  </div>
                </div>

                {/* ── 트렌디 인터랙티브 비주얼 오브젝트: 리소스 절감 Before / After 메트릭 위젯 (차분한 다크톤) ── */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
                  <div className="text-[11px] text-slate-400 font-medium">
                    <span className="sm:hidden">리소스 절감 효과</span>
                    <span className="hidden sm:inline">보고서 작성 리소스 절감 효과</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-800 text-center">
                      <div className="text-[10px] text-slate-500 line-through">기존 수작업</div>
                      <div className="text-xs font-bold text-slate-400 line-through mt-0.5">주 15시간 이상</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-center">
                      <div className="text-[10px] text-purple-300 font-bold">비즈렌즈</div>
                      <div className="text-xs font-black text-cyan-300 mt-0.5">단 30초 추출</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <FileTextIcon size={14} className="text-purple-400" />
                      <span className="sm:hidden">전략 보고서</span>
                      <span className="hidden sm:inline">원클릭 전략 보고서</span>
                    </span>
                    <span className="text-purple-300 font-mono font-bold text-[11px]">
                      <span className="sm:hidden">PDF 다운로드</span>
                      <span className="hidden sm:inline">PDF 즉시 다운로드</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 솔루션 태그: 데이터 취합 시간 98% 획기적 단축 (전사 공식 강조색: 에메랄드 그린) */}
              <div className="mt-5 pt-3.5 border-t border-dark-800 flex items-center gap-2 text-xs font-bold text-emerald-300">
                <CircleCheckIcon size={16} className="text-emerald-400 shrink-0" />
                <span>
                  <span className="sm:hidden">취합 시간 98% 단축</span>
                  <span className="hidden sm:inline">데이터 취합 시간 98% 획기적 단축</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. 대 AI시대, 이제는 데이터가 정답이다! (즉시 실행 가능한 인사이트 제공) ── */}
      <section id="features" className="py-16 sm:py-24 border-b border-dark-800 bg-gradient-to-b from-dark-950 via-dark-900/60 to-dark-950 relative snap-start scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900/90 border border-dark-750 text-slate-300 text-xs font-bold shadow-sm">
              <SparklesIcon size={14} className="text-cyan-400" />
              <span className="sm:hidden">실행 인사이트 제공</span>
              <span className="hidden sm:inline">즉시 실행 가능한 인사이트 제공</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              <span className="sm:hidden">AI시대 데이터가 정답</span>
              <span className="hidden sm:inline">대 AI시대, 이제는 데이터가 정답이다!</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-300 font-medium">
              <span>
                <span className="sm:hidden">30초 리서치 단축</span>
                <span className="hidden sm:inline">수주일 리서치를 30초로 단축</span>
              </span>
              <span className="text-slate-600">·</span>
              <span>
                <span className="sm:hidden">솔루션 비용 절감</span>
                <span className="hidden sm:inline">수천만 원 솔루션·인프라 비용 절감</span>
              </span>
              <span className="text-slate-600">·</span>
              <span>
                <span className="sm:hidden">전략 로드맵 제시</span>
                <span className="hidden sm:inline">즉시 실행 가능한 전략 로드맵</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 가치 1: 데이터 수집 리소스 98% 절감 */}
            <div className="p-6 rounded-3xl bg-dark-900/90 border border-dark-750/90 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-sm group">
              <div className="space-y-4">
                {/* 아이콘 확대 + 내용 설명(제목 및 서브텍스트) 인라인 우측 배치 (RESOURCE & TIME 삭제) */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0 shadow-inner">
                    <ClockIcon size={26} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                      <span className="sm:hidden">리소스 98% 절감</span>
                      <span className="hidden sm:inline">데이터 수집 리소스 98% 절감</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                      <span className="sm:hidden">공시 취합 30초 단축</span>
                      <span className="hidden sm:inline">시장 리서치 및 공시 수작업. 단 30초로 단축</span>
                    </p>
                  </div>
                </div>

                {/* ── 비주얼 오브젝트: 리서치 리소스 비교 위젯 ── */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
                  <div className="space-y-2">
                    {/* 기존 리소스 소모 방식 */}
                    <div className="p-2.5 rounded-xl bg-dark-900/80 border border-dark-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          <span className="sm:hidden">수작업 조사</span>
                          <span className="hidden sm:inline">기존 수작업 리서치</span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          <span className="sm:hidden">외부 공시 취합</span>
                          <span className="hidden sm:inline">분산된 외부 공시자료 조사</span>
                        </div>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px] bg-dark-850 px-2 py-0.5 rounded border border-dark-750">
                        평균 1-2주
                      </span>
                    </div>

                    {/* 비즈렌즈 도입 후 (전사 공식 강조색: 에메랄드 그린) */}
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                      <div>
                        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CircleCheckIcon size={12} className="text-emerald-400" />
                          비즈렌즈 도입
                        </div>
                        <div className="text-emerald-200 text-[11px] mt-0.5 font-bold">
                          <span className="sm:hidden">URL 즉시 매핑</span>
                          <span className="hidden sm:inline">URL 1개 입력 즉시 매핑</span>
                        </div>
                      </div>
                      <span className="text-emerald-300 font-black font-mono text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                        30초 완성
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 가치 2: AI 컨설팅 솔루션으로 비용 최적화 */}
            <div className="p-6 rounded-3xl bg-dark-900/90 border border-dark-750/90 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-sm group">
              <div className="space-y-4">
                {/* 아이콘 확대 + 내용 설명(제목 및 서브텍스트) 인라인 우측 배치 (COST OPTIMIZATION 삭제) */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0 shadow-inner">
                    <TargetIcon size={26} className="text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                      <span className="sm:hidden">AI 컨설팅 비용 최적화</span>
                      <span className="hidden sm:inline">AI 컨설팅 솔루션으로 비용 최적화</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                      <span className="sm:hidden">비용 부담 효율화</span>
                      <span className="hidden sm:inline">외부 분석 툴 및 인프라 유료 부담 효율화</span>
                    </p>
                  </div>
                </div>

                {/* ── 비주얼 오브젝트: 비용 비교 매트릭스 위젯 ── */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-2.5">
                  <div className="space-y-2">
                    {/* 기존 고가 솔루션 & 컨설팅 */}
                    <div className="p-2.5 rounded-xl bg-dark-900/80 border border-dark-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          <span className="sm:hidden">외산 툴·컨설팅</span>
                          <span className="hidden sm:inline">외산 툴 / 외주 컨설팅</span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          <span className="sm:hidden">고가 리포트 계약</span>
                          <span className="hidden sm:inline">기업 컨설팅 및 리포트</span>
                        </div>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px] bg-dark-850 px-2 py-0.5 rounded border border-dark-750">
                        연 1억원 이상
                      </span>
                    </div>

                    {/* 비즈렌즈 도입 후 (전사 공식 강조색: 에메랄드 그린) */}
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                      <div>
                        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CircleCheckIcon size={12} className="text-emerald-400" />
                          비즈렌즈 도입
                        </div>
                        <div className="text-emerald-200 text-[11px] mt-0.5 font-bold">
                          <span className="sm:hidden">서버비 최적화</span>
                          <span className="hidden sm:inline">서버비 효율화 시뮬레이션</span>
                        </div>
                      </div>
                      <span className="text-emerald-300 font-black font-mono text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                        <span className="sm:hidden">비용 최적화</span>
                        <span className="hidden sm:inline">비용 효율 극대화</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 가치 3: 성장전략 로드맵 & 보고서 */}
            <div className="p-6 rounded-3xl bg-dark-900/90 border border-dark-750/90 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-sm group">
              <div className="space-y-4">
                {/* 아이콘 확대 + 내용 설명(제목 및 서브텍스트) 인라인 우측 배치 (퍼플 톤) */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0 shadow-inner">
                    <TrendingUpIcon size={26} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                      <span className="sm:hidden">성장전략 로드맵 & 보고서</span>
                      <span className="hidden sm:inline">성장전략 로드맵 & 보고서</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                      <span className="sm:hidden">부서별 전략 로드맵</span>
                      <span className="hidden sm:inline">핵심 BM 확장 및 부서별 실행 전략 로드맵</span>
                    </p>
                  </div>
                </div>

                {/* ── 비주얼 오브젝트: 실행 전략 로드맵 위젯 (기존 문제점 ➔ 비즈렌즈 로드맵 하이라이트) ── */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-2.5">
                  <div className="space-y-2">
                    {/* 기존 문제점 (회색 흐릿한 텍스트: 실행 전략 부재 , 문제점 도출 불가) */}
                    <div className="p-2.5 rounded-xl bg-dark-900/80 border border-dark-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          실행 전략 부재
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          문제점 도출 불가
                        </div>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px] bg-dark-850 px-2 py-0.5 rounded border border-dark-750">
                        액션 부재
                      </span>
                    </div>

                    {/* 비즈렌즈 도입 후 (전사 공식 강조색: 에메랄드 그린) */}
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                      <div>
                        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CircleCheckIcon size={12} className="text-emerald-400" />
                          비즈렌즈 도입
                        </div>
                        <div className="text-emerald-200 text-[11px] mt-0.5 font-bold">
                          부서별 전략 로드맵
                        </div>
                      </div>
                      <span className="text-emerald-300 font-black font-mono text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                        즉시 실행
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      </main>

      {/* ── 4. 푸터 ── */}
      <MainFooter
        currentView="landing"
        onOpenPolicy={(type) => setPolicyType(type)}
        onNavigateDashboard={() => handleEnterDashboardWithTracking('overview')}
        onNavigateDocs={() => handleEnterDashboardWithTracking('docs')}
        onNavigateGuide={() => handleEnterDashboardWithTracking('guide')}
      />

      {/* ── 8. 모달 레이어 ── */}
      {/* 회원가입 모달 */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSuccess={(userProfile) => {
          setIsSignupOpen(false);
          onLoginSuccess(userProfile);
          handleEnterDashboardWithTracking('overview');
        }}
        onOpenPolicy={(type) => setPolicyType(type)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={(user) => {
          onLoginSuccess(user);
        }}
        onOpenSignup={() => setIsSignupOpen(true)}
      />

      {/* 회원 프로필 모달 (UID, 이메일, 비밀번호 재설정) */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onLogout={() => {
          onLogout();
          setIsProfileOpen(false);
        }}
      />

      {/* 이용약관 및 개인정보 처리방침 모달 */}
      <PolicyModals
        isOpen={Boolean(policyType)}
        type={policyType}
        onClose={() => setPolicyType(null)}
      />

      {/* AI 비교 기준 탐색 & 정합성 사전 검증 모달 */}
      <UrlVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        rawUrl={pendingUrl}
        onConfirm={handleVerificationConfirm}
      />

    </div>
  );
};
