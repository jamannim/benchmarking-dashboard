import React, { useState } from 'react';
import { 
  Server, 
  LayoutDashboard, 
  Rocket,
  Building2,
  Share2,
  Layers,
  Menu,
  X,
  ChevronDown,
  Briefcase,
  Target,
  Compass,
  BookOpen,
  Sparkles
} from 'lucide-react';
import type { CompleteServiceIntelligence } from '../types/intelligence';
import type { UserProfile } from '../types/auth';
import { BizStrategyLogo } from './BizStrategyLogo';

export type SubpageTab = 'landing' | 'overview' | 'service' | 'traffic' | 'marketing-status' | 'marketing' | 'app' | 'server' | 'ir' | 'gmv' | 'business' | 'sales' | 'docs' | 'guide';

export type SubViewId =
  | 'main'
  | 'merchant-share'
  | 'region-atm'
  | 'pc-traffic'
  | 'app-traffic'
  | 'sns-sheet'
  | 'keyword-analysis'
  | 'ir-trend'
  | 'gmv'
  | 'bm-model'
  | 'biz-roadmap'
  | 'keyword-guide'
  | 'smartplace-docs'
  | 'existing'
  | 'prospective';

export interface SubMenuItem {
  id: SubViewId;
  label: string;
}

export interface GnbTabItem {
  id: SubpageTab;
  path: string;
  group: 'status' | 'task';
  groupLabel: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SubMenuItem[];
}

const GNB_MENU_TREE: GnbTabItem[] = [
  // [현 상황] 1단계 메뉴 및 하위 2단계 서브페이지 (4개)
  {
    id: 'overview',
    path: '/traffic',
    group: 'status',
    groupLabel: '현 상황',
    label: '트래픽(현)',
    icon: LayoutDashboard,
    subItems: [
      { id: 'main', label: '웹+앱 통합트래픽' },
      { id: 'pc-traffic', label: '웹 트래픽(PC)' },
      { id: 'app-traffic', label: '앱 트래픽(iOS+Android)' },
    ],
  },
  {
    id: 'service',
    path: '/service',
    group: 'status',
    groupLabel: '현 상황',
    label: '서비스',
    icon: Layers,
    subItems: [
      { id: 'main', label: '매출/수익 집계' },
      { id: 'merchant-share', label: '가맹업종 결제 비중' },
      { id: 'region-atm', label: '지역별 결제량(ATM)' },
    ],
  },
  {
    id: 'marketing-status',
    path: '/marketing',
    group: 'status',
    groupLabel: '현 상황',
    label: '마케팅',
    icon: Share2,
    subItems: [
      { id: 'main', label: '마케팅 현황' },
      { id: 'sns-sheet', label: '월별 SNS 성과비교' },
      { id: 'keyword-analysis', label: '키워드 분석' },
    ],
  },
  {
    id: 'ir',
    path: '/IR',
    group: 'status',
    groupLabel: '현 상황',
    label: 'IR',
    icon: Building2,
    subItems: [
      { id: 'main', label: '기업정보 · 재무 · 투자' },
      { id: 'ir-trend', label: '연도별 실적추이' },
      { id: 'gmv', label: 'GMV · 거래액 지표' },
    ],
  },
  // [과제] 1단계 메뉴 및 하위 2단계 서브페이지 (4개)
  {
    id: 'business',
    path: '/Business',
    group: 'task',
    groupLabel: '과제',
    label: '사업전략',
    icon: Briefcase,
    subItems: [
      { id: 'main', label: '매출 증가 방식' },
    ],
  },
  {
    id: 'sales',
    path: '/Sales',
    group: 'task',
    groupLabel: '과제',
    label: '영업전략',
    icon: Target,
    subItems: [
      { id: 'main', label: '영업 제안 리드' },
      { id: 'existing', label: '기존 파트너사 제안' },
      { id: 'prospective', label: '신규 추진 업체' },
    ],
  },
  {
    id: 'marketing',
    path: '/marketing_ING',
    group: 'task',
    groupLabel: '과제',
    label: '마케팅전략',
    icon: Rocket,
    subItems: [
      { id: 'main', label: '유입 채널 및 키워드' },
      { id: 'keyword-guide', label: '키워드 공략집' },
    ],
  },
  {
    id: 'server',
    path: '/Server_fee',
    group: 'task',
    groupLabel: '과제',
    label: '서버비용',
    icon: Server,
  },
];

interface HeaderProps {
  onSearch?: (url: string) => void;
  isLoading?: boolean;
  activeTab: SubpageTab;
  onTabChange: (tab: SubpageTab, subView?: SubViewId) => void;
  activeSubView?: SubViewId;
  currentData: CompleteServiceIntelligence;
  currentUser?: UserProfile | null;
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
  onOpenProfile?: () => void;
  isDemoMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearch: _onSearch,
  activeTab, 
  onTabChange, 
  activeSubView = 'main',
  currentData: _currentData,
  currentUser,
  onOpenLogin,
  onOpenSignup,
  onOpenProfile,
  isDemoMode: _isDemoMode = false,
}) => {
  // 제품(대시보드) 활성 상태 판별 (서비스소개, 이용방법, 데이터출처가 아니면 제품 대시보드 탭)
  const isProductActive = activeTab !== 'landing' && activeTab !== 'guide' && activeTab !== 'docs';

  // 데스크탑 통합 GNB 서브메뉴 오버레이 상태 (평소에는 닫혀 있어 메인 GNB 밑에 따로 노출되지 않으며, 열리면 메뉴 선택 전까지 열린 상태 유지)
  const [gnbSubmenuOpen, setGnbSubmenuOpen] = useState<boolean>(false);
  // 모바일 삼단바(햄버거) 메뉴 오픈 상태
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  // 모바일 아코디언 펼침 상태 (전체 서브메뉴 기본 노출)
  const [expandedMobileTabs, setExpandedMobileTabs] = useState<Record<string, boolean>>({
    overview: true,
    service: true,
    'marketing-status': true,
    ir: true,
    gmv: true,
    business: true,
    sales: true,
    marketing: true,
    server: true,
  });

  const normalizedActiveTab: SubpageTab = activeTab === 'traffic' ? 'overview' : (activeTab === 'gmv' ? 'ir' : activeTab);

  const statusTabs = GNB_MENU_TREE.filter(t => t.group === 'status');
  const taskTabs = GNB_MENU_TREE.filter(t => t.group === 'task');

  // 메뉴 선택 시에만 GNB 서브메뉴 닫힘 (선택 전에는 열린 상태 유지)
  const handleSelectMenu = (tabId: SubpageTab, subId: SubViewId = 'main') => {
    onTabChange(tabId, subId);
    setGnbSubmenuOpen(false);
    setMobileMenuOpen(false);
  };

  const toggleMobileExpand = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMobileTabs(prev => ({ ...prev, [tabId]: !prev[tabId] }));
  };

  return (
    <header className="border-b border-dark-700 bg-dark-900/95 backdrop-blur-md sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
        
        {/* 모바일 상단 슬림 GNB 바 (로고 + 현재 페이지명 + 삼단바 버튼만 깔끔하게 노출) */}
        <div className="flex lg:hidden items-center justify-between gap-2 py-1">
          <button
            type="button"
            onClick={() => onTabChange('landing')}
            className="flex items-center gap-2 min-w-0 text-left cursor-pointer"
            title="BIZLENS 홈으로 이동"
          >
            <BizStrategyLogo size="sm" />
            <div className="flex flex-col min-w-0 text-left justify-center">
              <span className="text-sm font-black text-white tracking-tight leading-none">BIZLENS</span>
              <span className="text-[9px] text-slate-400 font-medium tracking-tight leading-none mt-0.5 truncate hidden sm:block">Business Analysis Lens</span>
            </div>
            <span className="text-slate-600">·</span>
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-xs font-bold text-cyan-300 truncate">
              {(() => {
                if (activeTab === 'landing') return '서비스 소개';
                if (activeTab === 'guide') return '이용방법';
                if (activeTab === 'docs') return '데이터 출처';
                const tabObj = GNB_MENU_TREE.find(t => t.id === normalizedActiveTab);
                if (!tabObj) return '제품 (대시보드)';
                if (activeSubView && activeSubView !== 'main') {
                  const subObj = tabObj.subItems?.find(s => s.id === activeSubView);
                  if (subObj) return subObj.label;
                }
                return tabObj.label;
              })()}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-white border border-dark-700 transition-colors cursor-pointer shrink-0"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-brand-cyan" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* 모바일 삼단바(햄버거) 메뉴 드로어 (1단계: 탭 / 2단계: 서브페이지) */}
        {mobileMenuOpen && (
          <nav aria-label="모바일 전체 네비게이션" className="lg:hidden p-3.5 rounded-2xl bg-dark-900 border border-dark-700 shadow-2xl space-y-4">
            {/* 상단 4대 GNB 바로가기 (서비스 소개 · 이용방법 · 제품 · 데이터 출처) */}
            <div className="pb-3 border-b border-dark-750 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {/* 1. 서비스 소개 */}
                <button
                  type="button"
                  onClick={() => {
                    onTabChange('landing');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    activeTab === 'landing'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/50'
                      : 'bg-dark-800 hover:bg-dark-750 text-slate-300 border-dark-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>서비스 소개</span>
                </button>

                {/* 2. 이용방법 */}
                <button
                  type="button"
                  onClick={() => {
                    onTabChange('guide');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    activeTab === 'guide'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                      : 'bg-dark-800 hover:bg-dark-750 text-slate-300 border-dark-700'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>이용방법</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* 3. 제품 */}
                <button
                  type="button"
                  onClick={() => {
                    onTabChange('overview');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    isProductActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                      : 'bg-dark-800 hover:bg-dark-750 text-slate-300 border-dark-700'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>제품 (대시보드)</span>
                </button>

                {/* 4. 데이터 출처 */}
                <button
                  type="button"
                  onClick={() => {
                    onTabChange('docs');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    activeTab === 'docs'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400/50'
                      : 'bg-dark-800 hover:bg-dark-750 text-slate-400 border-dark-700'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>데이터 출처</span>
                </button>
              </div>

              {/* 모바일 인증 상태 버튼 */}
              <div className="pt-2 border-t border-dark-750">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile?.();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-dark-800 hover:bg-dark-750 border border-purple-500/40 text-xs font-bold text-purple-200 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                      <span className="truncate">{currentUser.companyName || currentUser.email.split('@')[0]}</span>
                    </div>
                    <span className="text-[10px] text-purple-400 font-mono">({currentUser.uid})</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenLogin?.();
                      }}
                      className="py-2 px-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 text-xs font-bold border border-dark-700 cursor-pointer"
                    >
                      로그인
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenSignup?.();
                      }}
                      className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm cursor-pointer"
                    >
                      회원가입
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 그룹 1 (트래픽(현) · 서비스 · 마케팅 · IR · GMV) */}
            <div className="space-y-1.5">
              {statusTabs.map((tab) => {
                const Icon = tab.icon;
                const isTabActive = normalizedActiveTab === tab.id;
                const hasSub = Boolean(tab.subItems && tab.subItems.length > 0);
                const isExpanded = expandedMobileTabs[tab.id] ?? false;

                return (
                  <div key={tab.id} className="rounded-xl bg-dark-850/80 border border-dark-750 overflow-hidden">
                    {/* 1단계 메뉴 */}
                    <a
                      href={tab.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectMenu(tab.id, 'main');
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors ${
                        isTabActive
                          ? 'bg-cyan-500/15 text-white font-bold'
                          : 'text-slate-200 hover:bg-dark-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isTabActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                        <span className="text-sm">{tab.label}</span>
                      </div>
                      {hasSub && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMobileExpand(tab.id, e);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-white"
                          aria-label="하위 메뉴 펼치기"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-brand-cyan' : ''}`} />
                        </button>
                      )}
                    </a>

                    {/* 2단계 서브페이지 */}
                    {hasSub && isExpanded && (
                      <div className="bg-dark-950/60 pl-9 pr-3 py-1.5 border-t border-dark-800 space-y-1">
                        {tab.subItems!.map((sub) => {
                          const isSubActive = isTabActive && activeSubView === sub.id;
                          return (
                            <a
                              key={sub.id}
                              href={tab.path}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSelectMenu(tab.id, sub.id);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer block ${
                                isSubActive
                                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                                  : 'text-slate-300 hover:bg-dark-855 hover:text-white'
                              }`}
                            >
                              {sub.label}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 그룹 2 이원화 유지 (마케팅전략 · 앱리뷰 · 서버비용) */}
            <div className="space-y-1.5 pt-3 border-t border-dark-750">
              {taskTabs.map((tab) => {
                const Icon = tab.icon;
                const isTabActive = normalizedActiveTab === tab.id;
                const hasSub = Boolean(tab.subItems && tab.subItems.length > 0);
                const isExpanded = expandedMobileTabs[tab.id] ?? false;

                return (
                  <div key={tab.id} className="rounded-xl bg-dark-850/80 border border-dark-750 overflow-hidden">
                    {/* 1단계 메뉴 */}
                    <a
                      href={tab.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectMenu(tab.id, 'main');
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors ${
                        isTabActive
                          ? 'bg-purple-500/15 text-white font-bold'
                          : 'text-slate-200 hover:bg-dark-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isTabActive ? 'text-purple-400' : 'text-slate-400'}`} />
                        <span className="text-sm">{tab.label}</span>
                      </div>
                      {hasSub && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMobileExpand(tab.id, e);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-white"
                          aria-label="하위 메뉴 펼치기"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-purple-400' : ''}`} />
                        </button>
                      )}
                    </a>

                    {/* 2단계 서브페이지 */}
                    {hasSub && isExpanded && (
                      <div className="bg-dark-950/60 pl-9 pr-3 py-1.5 border-t border-dark-800 space-y-1">
                        {tab.subItems!.map((sub) => {
                          const isSubActive = isTabActive && activeSubView === sub.id;
                          return (
                            <a
                              key={sub.id}
                              href={tab.path}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSelectMenu(tab.id, sub.id);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer block ${
                                isSubActive
                                  ? 'bg-purple-500/20 text-purple-300 font-bold'
                                  : 'text-slate-300 hover:bg-dark-850 hover:text-white'
                              }`}
                            >
                              {sub.label}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        )}

        {/* 데스크탑 상단 브랜드 및 GNB 바 (좌측: 로고 + Business Analysis Lens 하단 배치 + GNB 메뉴 / 우측: 로그인·회원가입) */}
        <div className={`hidden lg:flex items-center justify-between ${isProductActive ? 'pb-2 mb-1.5 border-b border-dark-800' : 'py-1'} text-xs gap-4`}>
          {/* 좌측 영역: BIZLENS 브랜드 (Business Analysis Lens 하단 배치) + 세로 구분선 + 좌측 정렬 GNB 메뉴 */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => onTabChange('landing')}
              className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors cursor-pointer text-left shrink-0 group"
              title="BIZLENS 홈으로 이동"
            >
              <BizStrategyLogo size="sm" />
              <div className="flex flex-col text-left justify-center">
                <span className="font-black text-white text-base tracking-tight leading-none group-hover:text-cyan-300 transition-colors">
                  BIZLENS
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight leading-none mt-1">
                  Business Analysis Lens
                </span>
              </div>
            </button>

            {/* 브랜드와 GNB 메뉴 사이의 정돈된 구분선 */}
            <div className="h-5 w-px bg-dark-750" />

            {/* GNB 글로벌 네비게이션 메뉴 (좌측 배치) */}
            <nav aria-label="글로벌 네비게이션" className="flex items-center gap-1.5 text-xs">
              {/* 1. 서비스 소개 */}
              <button
                type="button"
                onClick={() => onTabChange('landing')}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'landing' 
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40 shadow-sm' 
                    : 'text-slate-300 hover:text-indigo-300 hover:bg-dark-850'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>서비스 소개</span>
              </button>

              {/* 2. 이용방법 */}
              <button
                type="button"
                onClick={() => onTabChange('guide')}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'guide' 
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm' 
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-dark-850'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>이용방법</span>
              </button>

              {/* 3. 제품 (대시보드) */}
              <button
                type="button"
                onClick={() => onTabChange('overview')}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold flex items-center gap-1.5 cursor-pointer ${
                  isProductActive 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-dark-850'
                }`}
                title="대시보드(제품) 각 탭 데이터 탐색"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                <span>제품</span>
              </button>

              {/* 4. 데이터 출처 */}
              <button
                type="button"
                onClick={() => onTabChange('docs')}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'docs' 
                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm' 
                    : 'text-slate-300 hover:text-purple-300 hover:bg-dark-850'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>데이터 출처</span>
              </button>
            </nav>
          </div>

          {/* 우측 유틸리티 영역: 인증 상태별 버튼 / 로그인·회원가입 */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            {currentUser ? (
              <button
                type="button"
                onClick={onOpenProfile}
                className="px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 border border-purple-500/40 text-[11px] font-bold text-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="내 계정 정보 확인 및 비밀번호 재설정"
              >
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                <span className="truncate max-w-[100px]">{currentUser.companyName || currentUser.email.split('@')[0]}</span>
                <span className="font-mono text-[10px] text-purple-400">({currentUser.uid})</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  로그인
                </button>
                <button
                  type="button"
                  onClick={onOpenSignup}
                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 데스크탑 통합 GNB - 제품(대시보드) 화면일 때만 8대 탭 LNB 노출 */}
        {isProductActive && (
          <nav
            aria-label="대시보드 분석 탭 네비게이션"
            className="hidden lg:block pt-1 relative"
            onMouseEnter={() => setGnbSubmenuOpen(true)}
            onMouseLeave={() => setGnbSubmenuOpen(false)}
          >
          {/* 1줄 메인 GNB 메뉴바 (좌측 4개 메뉴 박스 + 우측 4개 과제 메뉴 박스 6:6 완벽 대칭) */}
          <div className="grid grid-cols-12 gap-3 w-full items-center">
            
            {/* 좌측 그룹 (트래픽(현) · 서비스 · 마케팅 · IR) 4개 탭 */}
            <div className="col-span-6 p-1.5 bg-dark-900 rounded-2xl border border-cyan-500/40 shadow-md shadow-cyan-950/20 flex items-center w-full">
              <div className="grid grid-cols-4 gap-1.5 flex-1">
                {statusTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = normalizedActiveTab === tab.id;

                  return (
                    <a
                      key={tab.id}
                      href={tab.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectMenu(tab.id, 'main');
                      }}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-150 cursor-pointer w-full ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold border border-cyan-300/80 shadow-md shadow-cyan-500/25'
                          : 'bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-dark-700/90 hover:border-cyan-400/50 font-semibold'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-brand-cyan'}`} />
                      <span>{tab.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* 우측 그룹 (사업전략 · 영업전략 · 마케팅전략 · 서버비용) 4개 탭 */}
            <div className="col-span-6 p-1.5 bg-dark-900 rounded-2xl border border-purple-500/40 shadow-md shadow-purple-950/20 flex items-center w-full">
              <div className="grid grid-cols-4 gap-1.5 flex-1">
                {taskTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = normalizedActiveTab === tab.id;

                  return (
                    <a
                      key={tab.id}
                      href={tab.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectMenu(tab.id, 'main');
                      }}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-150 cursor-pointer w-full ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold border border-purple-300/80 shadow-md shadow-purple-500/30'
                          : 'bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-dark-700/90 hover:border-purple-400/50 font-semibold'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                      <span>{tab.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 통합 GNB 서브메뉴 플로팅 패널 (각 상단 탭과 1:1 열 정렬, 좌우 6:6 대칭) */}
          {gnbSubmenuOpen && (
            <div className="absolute left-0 right-0 top-full pt-1.5 z-50">
              <div className="grid grid-cols-12 gap-3 w-full">
                {/* 좌측 그룹 하위 서브메뉴 (4열) */}
                <div className="col-span-6 p-2 bg-dark-900/98 backdrop-blur-xl rounded-2xl border border-cyan-500/40 shadow-2xl">
                  <div className="grid grid-cols-4 gap-1.5">
                    {statusTabs.map((tab) => {
                      const isActive = normalizedActiveTab === tab.id;
                      const hasSub = tab.subItems && tab.subItems.length > 0;
                      if (!hasSub) {
                        return <div key={tab.id} className="invisible pointer-events-none" />;
                      }
                      return (
                        <div key={tab.id} className="p-1.5 rounded-xl bg-dark-950/90 border border-dark-750/90 space-y-1">
                          {tab.subItems?.map((sub) => {
                            const isSubActive = isActive && activeSubView === sub.id;
                            return (
                              <a
                                key={sub.id}
                                href={tab.path}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleSelectMenu(tab.id, sub.id);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer block truncate ${
                                  isSubActive
                                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                                    : 'text-slate-300 hover:bg-dark-800 hover:text-white'
                                }`}
                              >
                                {sub.label}
                              </a>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 우측 그룹 하위 서브메뉴 (4열) */}
                <div className="col-span-6 p-2 bg-dark-900/98 backdrop-blur-xl rounded-2xl border border-purple-500/40 shadow-2xl">
                  <div className="grid grid-cols-4 gap-1.5">
                    {taskTabs.map((tab) => {
                      const isActive = normalizedActiveTab === tab.id;
                      const hasSub = tab.subItems && tab.subItems.length > 0;
                      if (!hasSub) {
                        return <div key={tab.id} className="invisible pointer-events-none" />;
                      }
                      return (
                        <div key={tab.id} className="p-1.5 rounded-xl bg-dark-950/90 border border-dark-750/90 space-y-1">
                          {tab.subItems?.map((sub) => {
                            const isSubActive = isActive && activeSubView === sub.id;
                            return (
                              <a
                                key={sub.id}
                                href={tab.path}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleSelectMenu(tab.id, sub.id);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer block truncate ${
                                  isSubActive
                                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                                    : 'text-slate-300 hover:bg-dark-800 hover:text-white'
                                }`}
                              >
                                {sub.label}
                              </a>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      )}

      </div>
    </header>
  );
};

export default Header;
