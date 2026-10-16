import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import type { SubpageTab, SubViewId } from './components/Header';
import { MetricsOverview, type HubChannelTab } from './components/MetricsOverview';
import { TrafficCharts } from './components/TrafficCharts';
import { TopPagesList } from './components/TopPagesList';
import { ServerCostSubpage } from './components/subpages/ServerCostSubpage';
import { MarketingStrategySubpage } from './components/subpages/MarketingStrategySubpage';
import { MarketingStatusSubpage } from './components/subpages/MarketingStatusSubpage';
import { IrDetailSubpage } from './components/subpages/IrDetailSubpage';
import { GmvDetailSubpage } from './components/subpages/GmvDetailSubpage';
import { ServiceRevenueSubpage } from './components/subpages/ServiceRevenueSubpage';
import { BusinessStrategySubpage } from './components/subpages/BusinessStrategySubpage';
import { SalesStrategySubpage } from './components/subpages/SalesStrategySubpage';
import { 
  namaneIntelligence,
  wowpassIntelligence, 
  travelwalletIntelligence, 
  evezaryIntelligence,
  generateDynamicIntelligence 
} from './data/multiDomainData';
import type { CompleteServiceIntelligence, MobileAppTrafficIntelligence } from './types/intelligence';
import type { RegisteredAppInfo } from './components/modals/AppRegistrationModal';
import { exportVerificationReportPdf, type PdfReportTabType } from './utils/exportPdfReport';
import { resolveRouteFromLocation, syncUrlWithTab } from './utils/navigation';
import { ServicePaidLockOverlay } from './components/ServicePaidLockOverlay';
import { DataSourcesDocsPage } from './components/docs/DataSourcesDocsPage';
import { HowToUseDocsPage } from './components/docs/HowToUseDocsPage';
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { SignupModal } from './components/landing/SignupModal';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { PolicyModals, type PolicyType } from './components/landing/PolicyModals';
import { MainFooter } from './components/common/MainFooter';
import type { VerificationResult } from './components/landing/UrlVerificationModal';
import type { UserProfile } from './types/auth';
import { getCurrentUser, saveUserSession, clearUserSession } from './utils/authStorage';
import { supabase } from './lib/supabase';

const PRESET_MAP: Record<string, CompleteServiceIntelligence> = {
  'namanecard.com': namaneIntelligence,
  'wowpass.io': wowpassIntelligence, 
  'travelwallet.co.kr': travelwalletIntelligence,
  'brand.evezary.co.kr': evezaryIntelligence,
  'evezary.co.kr': evezaryIntelligence
};

export function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState<PolicyType | null>(null);
  // 가상 대시보드 체험 모드 상태 (클릭 시 GNB 전체 페이지 및 데이터 100% 오픈)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bizlens_demo_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Supabase 세션 동기화 및 실시간 인증 상태 변경 리스너
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const profile: UserProfile = {
          uid: `UID-${u.id.slice(0, 8).toUpperCase()}`,
          id: u.id,
          email: u.email || '',
          companyName: (u.user_metadata?.company_name as string) || u.email?.split('@')[1]?.split('.')[0]?.toUpperCase() || '',
          role: (u.user_metadata?.role as string) || '사업전략 / 기획',
          interest: (u.user_metadata?.interest as string) || '경쟁사 지표 벤치마킹',
          createdAt: u.created_at || new Date().toISOString(),
        };
        setCurrentUser(profile);
        saveUserSession(profile);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        const u = session.user;
        const profile: UserProfile = {
          uid: `UID-${u.id.slice(0, 8).toUpperCase()}`,
          id: u.id,
          email: u.email || '',
          companyName: (u.user_metadata?.company_name as string) || u.email?.split('@')[1]?.split('.')[0]?.toUpperCase() || '',
          role: (u.user_metadata?.role as string) || '사업전략 / 기획',
          interest: (u.user_metadata?.interest as string) || '경쟁사 지표 벤치마킹',
          createdAt: u.created_at || new Date().toISOString(),
        };
        setCurrentUser(profile);
        saveUserSession(profile);
      } else if (event === 'SIGNED_OUT') {
        clearUserSession();
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    clearUserSession();
    setCurrentUser(null);
    setIsProfileModalOpen(false);
  };

  const initialRoute = resolveRouteFromLocation();
  const [activeTab, setActiveTab] = useState<SubpageTab>(initialRoute.tab);
  const [activeSubView, setActiveSubView] = useState<SubViewId>(initialRoute.subView);
  const [hubChannelTab, setHubChannelTab] = useState<HubChannelTab>(() => {
    return initialRoute.subView === 'app-traffic' ? 'app' : 'pc';
  });

  const handleTabChange = (tab: SubpageTab, subView: SubViewId = 'main') => {
    setActiveTab(tab);
    setActiveSubView(subView);
    if (tab === 'overview') {
      if (subView === 'app-traffic') {
        setHubChannelTab('app');
      } else if (subView === 'pc-traffic' || subView === 'main') {
        setHubChannelTab('pc');
      }
    }
    syncUrlWithTab(tab);
  };

  const handleSubViewChange = (subView: SubViewId) => {
    setActiveSubView(subView);
    syncUrlWithTab(activeTab);
  };

  const handleHubChannelChange = (nextChannel: HubChannelTab) => {
    setHubChannelTab(nextChannel);
    const sub = nextChannel === 'app' ? 'app-traffic' : 'pc-traffic';
    setActiveSubView(sub);
    syncUrlWithTab(activeTab);
  };
  
  // 사용자가 직접 분석을 요청한 URL 히스토리 (최대 3개 유지, 프리셋 강제값 제거)
  const [historyDomains, setHistoryDomains] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('benchmark_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 3);
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [currentDomain, setCurrentDomain] = useState<string>('namanecard.com');
  const [cacheMap, setCacheMap] = useState<Record<string, CompleteServiceIntelligence>>(() => {
    try {
      const saved = localStorage.getItem('benchmark_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        delete parsed['shortchall.com'];
        delete parsed['toss.im'];
        return { 
          ...PRESET_MAP, 
          ...parsed, 
          'namanecard.com': namaneIntelligence,
          'wowpass.io': wowpassIntelligence, 
          'travelwallet.co.kr': travelwalletIntelligence,
          'brand.evezary.co.kr': evezaryIntelligence,
          'evezary.co.kr': evezaryIntelligence
        };
      }
    } catch {
      // fallback
    }
    return PRESET_MAP;
  });

  // Current active dataset (defaults to namanecard.com)
  const currentData: CompleteServiceIntelligence = cacheMap[currentDomain] || PRESET_MAP['namanecard.com'];

  // Save history and cache to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('benchmark_history', JSON.stringify(historyDomains));
      localStorage.setItem('benchmark_cache', JSON.stringify(cacheMap));
    } catch {
      // ignore
    }
  }, [historyDomains, cacheMap]);

  // URL 동기화 및 브라우저 뒤로가기/앞으로가기 popstate 이벤트 리스너
  useEffect(() => {
    // 최초 마운트 시 현재 탭에 맞는 표준 URL(/traffic, /IR 등)로 즉시 정규화
    syncUrlWithTab(activeTab, true);

    const handlePopState = () => {
      const route = resolveRouteFromLocation();
      setActiveTab(route.tab);
      setActiveSubView(route.subView);
      if (route.tab === 'overview') {
        if (route.subView === 'app-traffic') {
          setHubChannelTab('app');
        } else {
          setHubChannelTab('pc');
        }
      }
      syncUrlWithTab(route.tab, true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSearch = (rawUrl: string, verificationResult?: VerificationResult) => {
    setIsLoading(true);
    
    // Normalize domain
    let clean = rawUrl.toLowerCase().trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0];
      
    if (!clean) clean = 'custom.com';

    setTimeout(() => {
      let resultData: CompleteServiceIntelligence;

      if (verificationResult) {
        resultData = generateDynamicIntelligence(clean, {
          inputUrl: verificationResult.inputUrl || rawUrl,
          redirectUrl: verificationResult.redirectUrl,
          sourceUrl: verificationResult.sourceUrl,
          serviceName: verificationResult.serviceName,
          category: verificationResult.category,
          peerCompetitors: verificationResult.peerCompetitors.map((p) => ({
            name: p.name,
            domain: p.domain,
          })),
          snsUrls: verificationResult.snsUrls,
          companyName: verificationResult.companyName,
          businessNumber: verificationResult.businessNumber,
          representative: verificationResult.representative,
          mailOrderReport: verificationResult.mailOrderReport,
          isDartAudited: verificationResult.isDartAudited,
          disclosureType: verificationResult.disclosureType,
          hasApp: verificationResult.hasApp,
        });
      } else if (clean === 'namanecard.com') {
        resultData = namaneIntelligence;
      } else if (clean === 'wowpass.io') {
        resultData = wowpassIntelligence;
      } else if (clean === 'travelwallet.co.kr') {
        resultData = travelwalletIntelligence;
      } else if (clean === 'brand.evezary.co.kr' || clean === 'evezary.co.kr') {
        resultData = evezaryIntelligence;
      } else {
        resultData = generateDynamicIntelligence(clean, {
          inputUrl: rawUrl,
          redirectUrl: `https://${clean}`,
          sourceUrl: `https://${clean}`
        });
      }

      // 기존 DB/캐시 데이터와 중복 및 충돌 검증 (기업식별자: 사업자등록번호 기준)
      const existingEntry = resultData.irData?.businessNumber
        ? Object.values(cacheMap).find(
            (item) => item.irData?.businessNumber &&
                      item.irData.businessNumber === resultData.irData?.businessNumber &&
                      item.service.domain !== clean
          )
        : undefined;

      if (existingEntry && resultData.irData) {
        // 충돌 내역 기록 (기존 도메인과 신규 수집 도메인 간 동일 법인 식별자 감지)
        const conflictRecord = {
          corporateId: resultData.irData.businessNumber || resultData.irData.companyName || clean,
          metricName: '법인 엔티티 식별자',
          targetPeriod: '전체',
          statementType: '확인 불가' as const,
          existingValue: `${existingEntry.service.name} (${existingEntry.service.domain})`,
          newValue: `${resultData.service.name} (${clean})`,
          reason: `동일 사업자번호(${resultData.irData.businessNumber})에 대한 복수 도메인 수집 감지`,
          resolution: 'preserved_existing' as const,
          timestamp: new Date().toISOString()
        };
        resultData.irData.conflictHistory = [
          ...(resultData.irData.conflictHistory || []),
          conflictRecord
        ];
      }

      setCacheMap((prev) => ({ ...prev, [clean]: resultData }));
      setCurrentDomain(clean);

      setHistoryDomains((prev) => {
        const filtered = prev.filter((d) => d.toLowerCase() !== clean.toLowerCase());
        return [clean, ...filtered].slice(0, 3);
      });

      setIsLoading(false);
    }, 600);
  };

  const handleExportReport = (targetTab?: PdfReportTabType) => {
    const tabMapping: Partial<Record<SubpageTab, PdfReportTabType>> = {
      overview: 'overview',
      traffic: 'traffic',
      service: 'service-revenue',
      'marketing-status': 'marketing-status',
      ir: activeSubView === 'gmv' ? 'gmv' : 'ir',
      business: 'business-strategy',
      sales: 'business-strategy',
      marketing: 'marketing-strategy',
      server: 'server-cost',
      app: 'app'
    };
    const resolvedTab = targetTab || (activeTab ? tabMapping[activeTab] : undefined) || 'overview';
    exportVerificationReportPdf(currentData, resolvedTab);
  };

  const handleRegisterApp = (appInfo: RegisteredAppInfo) => {
    setCacheMap((prev) => {
      const existing = prev[currentDomain] || currentData;
      const visits = existing.traffic.totalVisits || 100000;
      const mau = appInfo.mau && appInfo.mau > 0 ? appInfo.mau : Math.round(visits * 0.72);
      const dau = appInfo.dau && appInfo.dau > 0 ? appInfo.dau : Math.round(mau * 0.26);

      const updatedMobileTraffic: MobileAppTrafficIntelligence = {
        appName: appInfo.appName || existing.service.name,
        packageId: appInfo.packageId || `com.${currentDomain.replace(/[^a-zA-Z0-9]/g, '')}.app`,
        iosAppId: appInfo.iosAppId || 'app-official',
        mau,
        dau,
        stickiness: Number(((dau / Math.max(mau, 1)) * 100).toFixed(1)),
        monthlySessions: Math.round(mau * 3.6),
        sessionsPerUser: 3.6,
        avgSessionDuration: '3분 30초',
        avgSessionSeconds: 210,
        iosShare: 52.0,
        androidShare: 48.0,
        webVsAppMultiple: `웹 대비 ${(mau / Math.max(visits, 1)).toFixed(1)}배`,
        trackingMethodology: '등록된 공식 스토어 식별자 기반 실시간 연동 집계',
        screenDwellList: [
          { rank: 1, screenName: `${appInfo.appName || '앱'} 홈`, screenRoute: '/app/home', category: '메인', avgDwellTime: '1분 40초', avgDwellSeconds: 100, dwellShare: 38.0, sessionReachRate: 95.0, monthlyScreenSessions: Math.round(mau * 3.5), monthlyPageViews: Math.round(mau * 7.2), exitRate: 15.0, coreAction: '메인 서비스 이용' },
          { rank: 2, screenName: '탐색 및 세부 기능', screenRoute: '/app/explore', category: '탐색', avgDwellTime: '1분 15초', avgDwellSeconds: 75, dwellShare: 28.0, sessionReachRate: 65.0, monthlyScreenSessions: Math.round(mau * 2.0), monthlyPageViews: Math.round(mau * 3.8), exitRate: 18.0, coreAction: '콘텐츠 조회 및 탐색' },
          { rank: 3, screenName: '전환/주문/결제', screenRoute: '/app/action', category: '전환', avgDwellTime: '0분 55초', avgDwellSeconds: 55, dwellShare: 22.0, sessionReachRate: 35.0, monthlyScreenSessions: Math.round(mau * 1.1), monthlyPageViews: Math.round(mau * 1.8), exitRate: 12.0, coreAction: '핵심 전환 완료' },
          { rank: 4, screenName: '마이페이지/설정', screenRoute: '/app/profile', category: '계정', avgDwellTime: '0분 35초', avgDwellSeconds: 35, dwellShare: 12.0, sessionReachRate: 28.0, monthlyScreenSessions: Math.round(mau * 0.7), monthlyPageViews: Math.round(mau * 0.9), exitRate: 22.0, coreAction: '계정 및 환경설정' }
        ],
        countries: [
          { code: 'KR', name: '대한민국', flag: '🇰🇷', share: 88.5 },
          { code: 'US', name: '미국', flag: '🇺🇸', share: 5.2 },
          { code: 'JP', name: '일본', flag: '🇯🇵', share: 3.8 },
          { code: 'OTHER', name: '기타 국가', flag: '🌐', share: 2.5 }
        ]
      };

      const updated: CompleteServiceIntelligence = {
        ...existing,
        service: {
          ...existing.service,
          hasApp: true,
          appPackage: appInfo.packageId || existing.service.appPackage
        },
        mobileAppTraffic: updatedMobileTraffic
      };

      return {
        ...prev,
        [currentDomain]: updated
      };
    });

    setHubChannelTab('app');
    setActiveSubView('app-traffic');
  };

  // 유료 엔터프라이즈 잠금 오버레이 래퍼 (가상 대시보드 체험 모드 시 전면 해제 및 모든 데이터 100% 오픈)
  const wrapWithLock = (
    content: React.ReactNode,
    lockConfig?: {
      title?: string;
      description?: string;
      requirements?: string[];
      emailSubject?: string;
    }
  ) => {
    if (isDemoMode) {
      return content;
    }
    return (
      <ServicePaidLockOverlay
        onGoToOverview={() => handleTabChange('overview')}
        {...lockConfig}
      >
        {content}
      </ServicePaidLockOverlay>
    );
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-purple selection:text-white w-full max-w-full overflow-x-hidden">
      
      {/* ── 최상단 글로벌 네비게이션 바 (모든 페이지 및 검색결과 화면에서 상시 고정) ── */}
      <Header 
        onSearch={handleSearch} 
        isLoading={isLoading} 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        activeSubView={activeSubView}
        currentData={currentData}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenSignup={() => setIsSignupModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isDemoMode={isDemoMode}
      />

      {/* ── 본문 콘텐츠: activeTab에 따른 동적 페이지 렌더링 ── */}
      {activeTab === 'landing' ? (
        <LandingPage
          onEnterDashboard={(targetTab, isDemo) => {
            if (isDemo) {
              setIsDemoMode(true);
              setCurrentDomain('namanecard.com');
              try {
                localStorage.setItem('bizlens_demo_mode', 'true');
              } catch {
                // ignore
              }
            }
            handleTabChange((targetTab as SubpageTab) || 'overview');
          }}
          currentData={currentData}
          currentUser={currentUser}
          onLoginSuccess={(user) => setCurrentUser(user)}
          onLogout={handleLogout}
          onAnalyzeUrl={handleSearch}
          historyDomains={historyDomains}
          hideHeader={true}
        />
      ) : activeTab === 'docs' ? (
        <DataSourcesDocsPage
          onBackToDashboard={(targetTab) => handleTabChange(targetTab || 'overview')}
          onOpenPolicy={(type) => setPolicyType(type)}
          onNavigateHome={() => handleTabChange('landing')}
          onNavigateGuide={() => handleTabChange('guide')}
          hideHeader={true}
        />
      ) : activeTab === 'guide' ? (
        <HowToUseDocsPage
          onBackToDashboard={(targetTab) => handleTabChange(targetTab || 'overview')}
          onOpenPolicy={(type) => setPolicyType(type)}
          onNavigateHome={() => handleTabChange('landing')}
          onNavigateDocs={() => handleTabChange('docs')}
          hideHeader={true}
        />
      ) : (
        <>
          {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6 overflow-x-hidden">
        
        {/* Dynamic Data-Bound View per Subpage Tab */}
        {(activeTab === 'overview' || activeTab === 'traffic') && (
          <div className="space-y-6">
            <MetricsOverview 
              data={currentData} 
              onExportReport={handleExportReport}
              activeChannelTab={hubChannelTab}
              onChannelTabChange={handleHubChannelChange}
              onRegisterApp={handleRegisterApp}
            />

            {hubChannelTab === 'pc' && (
              <>
                {/* 월별 트래픽 추이 · 국가별 유입 비중 · 유입 채널 구성 */}
                <TrafficCharts data={currentData} />

                {/* 인기 서브 페이지 */}
                <TopPagesList data={currentData} />
              </>
            )}
          </div>
        )}
        {activeTab === 'service' && wrapWithLock(
          <ServiceRevenueSubpage
            data={currentData}
            activeSubView={activeSubView}
            onSubViewChange={handleSubViewChange}
          />
        )}
        {activeTab === 'marketing-status' && (
          <MarketingStatusSubpage
            data={currentData}
            activeSubView={activeSubView}
            onSubViewChange={handleSubViewChange}
          />
        )}
        {activeTab === 'business' && wrapWithLock(
          <BusinessStrategySubpage
            data={currentData}
            activeSubView={activeSubView}
            onSubViewChange={handleSubViewChange}
          />,
          {
            title: "내부데이터 필요 및 유료 엔터프라이즈 모델 영역",
            description: "본 사업전략 탭(매출 증가 방식, BM 모델링, 사업 로드맵)은 기업 내부 회계 원장 및 엔터프라이즈 성장 컨설팅 모델이 필요한 영역입니다.",
            requirements: [
              '기업 내부 회계 데이터 및 단위 경제학(Unit Economics) 연동 필수',
              '신규 수익원(BM) 모델링 및 맞춤형 성장 시뮬레이션 분석',
              '분기별 전략 실행 로드맵 및 핵심 KPI 최적화 컨설팅',
            ],
            emailSubject: "[비즈렌즈] 사업전략 탭 내부데이터 연동 및 유료 플랜 문의",
          }
        )}
        {activeTab === 'sales' && wrapWithLock(
          <SalesStrategySubpage
            data={currentData}
            activeSubView={activeSubView}
            onSubViewChange={handleSubViewChange}
          />,
          {
            title: "내부데이터 필요 및 유료 엔터프라이즈 모델 영역",
            description: "본 영업전략 탭(영업 제안 리드, 기존 파트너사 제안, 신규 추진 업체)은 기업 내부 CRM 및 맞춤형 B2B 파이프라인 분석이 필요한 영역입니다.",
            requirements: [
              '기업 내부 CRM 및 기존 파트너십 협약 이력 연동 필수',
              '맞춤형 B2B 타깃 리드 발굴 및 잠재 고객사 공략 분석',
              '세일즈 파이프라인 전환율 추적 및 제안서 패키징 지원',
            ],
            emailSubject: "[비즈렌즈] 영업전략 탭 내부데이터 연동 및 유료 플랜 문의",
          }
        )}
        {(activeTab === 'marketing' || activeTab === 'app') && wrapWithLock(
          <MarketingStrategySubpage
            data={currentData}
            activeSubView={activeSubView}
            onSubViewChange={handleSubViewChange}
          />,
          {
            title: "내부데이터 필요 및 유료 엔터프라이즈 모델 영역",
            description: "본 마케팅전략 탭(유입 채널 및 키워드 공략집, 실행 과제)은 마케팅 집행 원장 데이터 및 고도화된 타깃 분석 모델이 필요한 영역입니다.",
            requirements: [
              '실제 마케팅 집행 예산 및 ROAS 성과 원장 연동 필수',
              '고수익 전환 키워드 공략집 및 오가닉 트래픽 선점 전략',
              '4주 완성 실행 로드맵 및 채널별 CVR 최적화 모델',
            ],
            emailSubject: "[비즈렌즈] 마케팅전략 탭 내부데이터 연동 및 유료 플랜 문의",
          }
        )}
        {activeTab === 'server' && wrapWithLock(
          <ServerCostSubpage data={currentData} />,
          {
            title: "내부데이터 필요 및 유료 엔터프라이즈 모델 영역",
            description: "본 서버비용 탭(클라우드 인프라 견적, 아키텍처 비용 최적화)은 클라우드 실제 빌링 데이터(AWS/GCP Cost Explorer) 연동이 요구되는 영역입니다.",
            requirements: [
              '실제 CSP(AWS, GCP, Azure) 상세 인보이스 및 사용량 연동 필수',
              '리소스별 오버프로비저닝 감지 및 클라우드 비용 절감(FinOps) 진단',
              '트래픽 급증 대비 오토스케일링 인프라 아키텍처 사이징 리포트',
            ],
            emailSubject: "[비즈렌즈] 서버비용 탭 내부데이터 연동 및 유료 플랜 문의",
          }
        )}
        {(activeTab === 'ir' || activeTab === 'gmv') && (
          (activeSubView === 'gmv' || activeTab === 'gmv') ? (
            <GmvDetailSubpage
              data={currentData}
              onBackToIr={() => handleTabChange('ir', 'main')}
            />
          ) : (
            <IrDetailSubpage
              data={currentData}
              activeSubView={activeSubView}
              onSubViewChange={(sub) => {
                if (sub === 'gmv') {
                  handleTabChange('ir', 'gmv');
                } else {
                  handleSubViewChange(sub);
                }
              }}
            />
          )
        )}

      </main>

      {/* Footer with Data Sources Docs Outlink Portal */}
      <MainFooter
        currentView="dashboard"
        onOpenPolicy={(type) => setPolicyType(type)}
        onNavigateLanding={() => handleTabChange('landing')}
        onNavigateDashboard={() => handleTabChange('overview')}
        onNavigateDocs={() => handleTabChange('docs')}
        onNavigateGuide={() => handleTabChange('guide')}
      />
    </>
  )}

      {/* ── 대시보드 화면용 인증 모달 레이어 ── */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsLoginModalOpen(false);
        }}
        onOpenSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsSignupModalOpen(false);
        }}
        onOpenPolicy={(type) => setPolicyType(type)}
        onOpenLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* 대시보드 화면용 정책 모달 */}
      <PolicyModals
        isOpen={Boolean(policyType)}
        type={policyType}
        onClose={() => setPolicyType(null)}
      />

    </div>
  );
}

export default App;
