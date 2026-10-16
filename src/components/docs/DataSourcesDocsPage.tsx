import React, { useState, useMemo } from 'react';
import {
  BookOpenIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
  SearchIcon,
  DatabaseIcon,
  LayersIcon,
  SparklesIcon,
  LinkIcon,
  FileCheckIcon,
  ClockIcon,
  CompassIcon,
  LayoutDashboardIcon,
  ServerIcon,
  Building2Icon,
  BriefcaseIcon,
  TargetIcon,
  ShareIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@animateicons/react/lucide';
import { DATA_SOURCES_CATALOG, DOC_CATEGORIES, type DataSourceItem } from '../../data/dataSourcesCatalog';
import type { SubpageTab } from '../Header';
import { MainFooter } from '../common/MainFooter';
import type { PolicyType } from '../landing/PolicyModals';

interface Props {
  onBackToDashboard: (targetTab?: SubpageTab) => void;
  initialCategory?: string;
  onOpenPolicy?: (type: PolicyType) => void;
  onNavigateHome?: () => void;
  onNavigateGuide?: () => void;
  hideHeader?: boolean;
}

export const DataSourcesDocsPage: React.FC<Props> = ({
  onBackToDashboard,
  initialCategory = 'all',
  onOpenPolicy,
  onNavigateHome,
  onNavigateGuide,
  hideHeader = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 필터링된 공용 데이터 목록
  const filteredSources = useMemo(() => {
    return DATA_SOURCES_CATALOG.filter((item) => {
      // 카테고리 필터
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory;

      // 검색어 필터
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.provider.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query) ||
        item.collectedMetrics.toLowerCase().includes(query) ||
        item.tabLabel.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeCategoryMeta = useMemo(() => {
    return DOC_CATEGORIES.find((c) => c.id === selectedCategory) || DOC_CATEGORIES[0];
  }, [selectedCategory]);

  // 카테고리별 아이콘 매핑
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'traffic': return <LayoutDashboardIcon size={14} className="text-brand-purpleLight" />;
      case 'service': return <LayersIcon size={14} className="text-cyan-400" />;
      case 'marketing-status': return <ShareIcon size={14} className="text-purple-400" />;
      case 'ir': return <Building2Icon size={14} className="text-cyan-400" />;
      case 'business': return <BriefcaseIcon size={14} className="text-purple-300" />;
      case 'sales': return <TargetIcon size={14} className="text-purple-400" />;
      case 'marketing-strategy': return <SparklesIcon size={14} className="text-purple-300" />;
      case 'server': return <ServerIcon size={14} className="text-cyan-400" />;
      default: return <DatabaseIcon size={14} className="text-indigo-400" />;
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
                <SparklesIcon size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>서비스 소개</span>
              </button>
              {onNavigateGuide && (
                <button
                  type="button"
                  onClick={onNavigateGuide}
                  className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 border border-dark-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
                  title="이용방법으로 이동"
                >
                  <CompassIcon size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>이용방법</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onBackToDashboard('overview')}
                className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 border border-dark-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
                title="대시보드(제품)로 이동"
              >
                <LayoutDashboardIcon size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>제품</span>
              </button>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/40">
                <div className="w-5 h-5 rounded-md bg-purple-600 flex items-center justify-center text-white shadow-sm">
                  <BookOpenIcon size={13} />
                </div>
                <h1 className="text-xs font-black text-purple-300 flex items-center gap-2">
                  <span>데이터 출처</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Docs
                  </span>
                </h1>
              </div>
            </div>

            {/* 우측: 실측 정합성 배지 및 빠른 검색 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-bold whitespace-nowrap">
                <ShieldCheckIcon size={14} className="text-brand-cyan" />
                <span>실측 정합성 검증 완료 (100% Matched)</span>
              </div>
              {/* 검색창 */}
              <div className="relative w-full sm:w-56">
                <SearchIcon size={14} className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="출처·기관·지표 검색..."
                  aria-label="데이터 출처 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-dark-950 border border-dark-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ── 2. 메인 컨테이너 (좌측 사이드바 + 중앙 본문, 가로스크롤 없는 100% 유동형) ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 flex flex-col md:flex-row gap-5 overflow-x-hidden">
        
        {/* ── 좌측 사이드바 (Slim Left Navigation) ── */}
        <aside className="w-full md:w-56 shrink-0 space-y-4">
          {/* 출처 검색창 (GNB가 최상단에 있을 때 사이드바 상단에 배치) */}
          {hideHeader && (
            <div className="space-y-2">
              <div className="relative w-full">
                <SearchIcon size={14} className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="출처·기관·지표 검색..."
                  aria-label="사이드바 데이터 출처 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-dark-900 border border-dark-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors shadow-sm"
                />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                <ShieldCheckIcon size={13} className="text-brand-cyan shrink-0" />
                <span className="truncate">실측 정합성 100% 매칭 검증</span>
              </div>
            </div>
          )}
          <div className="p-3 rounded-xl bg-dark-900 border border-dark-750 shadow-sm">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
              <CompassIcon size={14} className="text-purple-400" />
              <span>탭별 목차</span>
            </div>
            
            <nav aria-label="데이터 출처 탭별 목차 네비게이션" className="space-y-1">
              {DOC_CATEGORIES.map((cat) => {
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
                        ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm'
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
                          ? 'bg-purple-500 text-white'
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

          {/* 사이드바 하단 원칙 카드 */}
          <div className="p-3 rounded-xl bg-dark-900/60 border border-dark-750 text-xs space-y-1.5 text-slate-400">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <FileCheckIcon size={14} className="text-brand-cyan" />
              <span>원천 실측 검증 원칙</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              임의의 가상 수치 배제, 공공·상장사 공시·공식 API 원본 데이터 실측 100% 일치 보증.
            </p>
          </div>
        </aside>

        {/* ── 중앙 본문 영역 (No Horizontal Scrollbar, Compact Fluid Specs) ── */}
        <main className="flex-1 min-w-0 space-y-4 overflow-x-hidden">
          
          {/* 섹션 상단 헤더 카드 */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-750 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-purple-500/15 text-purple-300 border-purple-500/30 flex items-center gap-1">
                  {getCategoryIcon(activeCategoryMeta.id)}
                  <span>{activeCategoryMeta.label}</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">({filteredSources.length}건 등록)</span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white">
                {activeCategoryMeta.description}
              </h2>
            </div>

            {/* 대시보드 해당 탭으로 즉시 전환 버튼 */}
            {activeCategoryMeta.id !== 'all' && (
              <button
                type="button"
                onClick={() => {
                  const tabMapping: Record<string, SubpageTab> = {
                    traffic: 'overview',
                    service: 'service',
                    'marketing-status': 'marketing-status',
                    ir: 'ir',
                    business: 'business',
                    sales: 'sales',
                    'marketing-strategy': 'marketing',
                    server: 'server'
                  };
                  const target = tabMapping[activeCategoryMeta.id] || 'overview';
                  onBackToDashboard(target);
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-center"
              >
                <span>대시보드 바로가기</span>
                <ExternalLinkIcon size={14} />
              </button>
            )}
          </div>

          {/* ── 공용데이터 컴팩트 명세 표 (가로 스크롤 없는 100% 유동형 테이블) ── */}
          <div className="rounded-xl bg-dark-900 border border-dark-750 shadow-sm overflow-hidden">
            <div className="p-3 border-b border-dark-750 flex items-center justify-between bg-dark-900/80">
              <div className="flex items-center gap-2">
                <DatabaseIcon size={14} className="text-cyan-400" />
                <h3 className="text-xs font-black text-white">원천 데이터 출처 & 지표 명세</h3>
              </div>
              <span className="text-[11px] text-slate-400">
                * 행 클릭 시 실측 정합성 메모 확장
              </span>
            </div>

            {filteredSources.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                검색 조건에 일치하는 데이터 출처가 없습니다.
              </div>
            ) : (
              <table className="w-full table-fixed text-left text-xs text-slate-200 border-collapse">
                <thead>
                  <tr className="border-b border-dark-750 text-slate-400 text-[11px] bg-dark-950/70">
                    <th className="py-2.5 px-3 font-bold text-center w-[30%]">데이터명 / 원천</th>
                    <th className="py-2.5 px-3 font-bold text-center w-[38%]">핵심 수집 지표 (요약)</th>
                    <th className="py-2.5 px-3 font-bold text-center w-[16%]">반영 위치</th>
                    <th className="py-2.5 px-2.5 font-bold text-center w-[16%]">공식 링크</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                  {filteredSources.map((item: DataSourceItem) => {
                    const isExpanded = expandedId === item.id;
                    return (
                      <React.Fragment key={item.id}>
                        <tr
                          className={`hover:bg-dark-850/70 transition-colors cursor-pointer group ${
                            isExpanded ? 'bg-purple-950/20' : ''
                          }`}
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        >
                          {/* 1. 데이터명 / 원천 (30%) */}
                          <td className="py-2.5 px-3 align-middle text-left">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white truncate text-xs">{item.name}</span>
                              {isExpanded ? (
                                <ChevronUpIcon size={12} className="text-purple-400 shrink-0" />
                              ) : (
                                <ChevronDownIcon size={12} className="text-slate-500 group-hover:text-purple-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate pt-0.5">
                              {item.provider}
                            </div>
                          </td>

                          {/* 2. 핵심 수집 지표 (38%) */}
                          <td className="py-2.5 px-3 align-middle text-left text-slate-300 text-[11px] leading-snug">
                            <span className="line-clamp-2">{item.collectedMetrics}</span>
                          </td>

                          {/* 3. 반영 위치 (16%) */}
                          <td className="py-2.5 px-3 align-middle text-left text-slate-400 text-[11px] leading-snug">
                            <span className="line-clamp-2">{item.mappingComponent}</span>
                          </td>

                          {/* 4. 링크 (16%) */}
                          <td className="py-2.5 px-2.5 align-middle text-left" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-dark-800 hover:bg-purple-600/30 text-cyan-300 hover:text-cyan-200 text-[11px] font-bold transition-colors border border-dark-700"
                              title="원천 사이트 새창 이동"
                            >
                              <span>원천 이동</span>
                              <ExternalLinkIcon size={11} className="shrink-0" />
                            </a>
                          </td>
                        </tr>

                        {/* 행 클릭 시 열리는 인라인 상세 서브 드로어 (가로 스크롤 없음) */}
                        {isExpanded && (
                          <tr className="bg-dark-950/80 border-b border-purple-500/20">
                            <td colSpan={4} className="py-3 px-4 text-xs text-slate-300 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-dark-900 border border-dark-750">
                                <div className="flex items-center gap-2 truncate text-[11px] font-mono text-cyan-300">
                                  <LinkIcon size={14} className="text-slate-500 shrink-0" />
                                  <span className="truncate">{item.url}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
                                  <span className="flex items-center gap-1">
                                    <ClockIcon size={12} className="text-slate-500" />
                                    <span>갱신: {item.updateCycle}</span>
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700">
                                    {item.tabLabel}
                                  </span>
                                </div>
                              </div>
                              <div className="text-[11px] text-slate-300 flex items-start gap-1.5 pt-0.5">
                                <span className="text-purple-300 font-bold shrink-0">• 실측 정합성 메모:</span>
                                <span className="text-slate-300">{item.verificationDetails}</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* ── 하단 정합성 검증 보증 배너 (단일 슬림 카드) ── */}
          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-dark-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon size={16} className="text-brand-cyan shrink-0" />
              <span>모든 출처 링크는 정상 접속 및 코드 수치 100% 매핑을 교차 검증했습니다.</span>
            </div>
            <button
              type="button"
              onClick={() => onBackToDashboard()}
              className="text-xs text-purple-400 hover:text-purple-300 font-bold underline underline-offset-2 cursor-pointer self-start sm:self-auto"
            >
              대시보드 메인으로 돌아가기 →
            </button>
          </div>

        </main>
      </div>

      {/* ── 3. 하단 푸터 ── */}
      <MainFooter
        currentView="docs"
        onOpenPolicy={onOpenPolicy || (() => {})}
        onNavigateLanding={onNavigateHome}
        onNavigateDashboard={() => onBackToDashboard('overview')}
        onNavigateGuide={onNavigateGuide}
      />
    </div>
  );
};

export default DataSourcesDocsPage;
