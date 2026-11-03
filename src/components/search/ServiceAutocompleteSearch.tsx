import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, Globe, Building2, CheckCircle2, 
  Smartphone, ArrowRight, X, Sparkles, ShieldCheck,
  ListFilter, SortAsc, Loader2, Database, Building
} from 'lucide-react';
import { 
  searchVerifiedServices, 
  getAllVerifiedServicesSorted,
  getPopularVerifiedServices,
  getVerifiedServicesByInitial,
  INITIAL_CONSONANTS,
  type InitialConsonant,
  type VerifiedServiceItem,
  type CorporateScale 
} from '../../data/verifiedServicesRegistry';

interface Props {
  onSelectVerifiedService: (service: VerifiedServiceItem) => void;
  onSubmitCustomUrl: (url: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  autoFocus?: boolean;
}

type TabMode = 'alphabetical' | 'popular';

const SCALE_FILTER_TABS: { id: CorporateScale | 'all'; label: string; icon?: string }[] = [
  { id: 'all', label: '전체 규모' },
  { id: 'enterprise', label: '대기업' },
  { id: 'mid', label: '중견기업' },
  { id: 'startup', label: '스타트업/유니콘' },
  { id: 'sme', label: '중소/소기업' },
];

export const ServiceAutocompleteSearch: React.FC<Props> = ({
  onSelectVerifiedService,
  onSubmitCustomUrl,
  placeholder = '기업명, 서비스명, 도메인, 사업자번호 또는 초성(예: ㅅㅅ, ㅇㅍㄹㅍ, ㅌㅅ) 입력',
  initialValue = '',
  className = '',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabMode>('alphabetical');
  const [selectedConsonant, setSelectedConsonant] = useState<InitialConsonant>('전체');
  const [selectedScale, setSelectedScale] = useState<CorporateScale | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // 2단계: 실시간 공공데이터포털 API 검색 결과 상태
  const [publicApiResults, setPublicApiResults] = useState<VerifiedServiceItem[]>([]);
  const [isSearchingPublicApi, setIsSearchingPublicApi] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1-Track: 로컬 마스터 인덱스 실시간 검색 (0.01초)
  const localMatches = useMemo(() => {
    const clean = query.trim();
    if (clean.length > 0) {
      return searchVerifiedServices(clean, selectedScale);
    }
    if (activeTab === 'popular') {
      return getPopularVerifiedServices();
    }
    return getVerifiedServicesByInitial(selectedConsonant, selectedScale);
  }, [query, activeTab, selectedConsonant, selectedScale]);

  // 2-Track: 공공데이터포털 실시간 비동기 검색 (300ms 디바운스)
  useEffect(() => {
    const clean = query.trim();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (clean.length < 2) {
      setPublicApiResults([]);
      setIsSearchingPublicApi(false);
      return;
    }

    setIsSearchingPublicApi(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-corporate?query=${encodeURIComponent(clean)}&scale=${selectedScale}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            // 로컬 검색 결과와 중복되지 않는 공공데이터 기업만 필터링
            const localDomains = new Set(localMatches.map((m) => m.domain.toLowerCase()));
            const localBizNos = new Set(localMatches.map((m) => m.businessNumber.replace(/[^0-9]/g, '')));
            
            const uniquePublic = json.data.filter((item: VerifiedServiceItem) => {
              const dom = item.domain.toLowerCase();
              const biz = item.businessNumber.replace(/[^0-9]/g, '');
              return !localDomains.has(dom) && !localBizNos.has(biz);
            });
            setPublicApiResults(uniquePublic);
          } else {
            setPublicApiResults([]);
          }
        }
      } catch (err) {
        console.warn('[ServiceAutocompleteSearch] Public API search error:', err);
        setPublicApiResults([]);
      } finally {
        setIsSearchingPublicApi(false);
      }
    }, 320);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, selectedScale, localMatches]);

  // 최종 화면에 표시할 기업 목록 (로컬 우선 + 공공데이터 실시간 결합)
  const displayedServices = useMemo(() => {
    if (query.trim().length === 0) {
      return localMatches;
    }
    return [...localMatches, ...publicApiResults];
  }, [query, localMatches, publicApiResults]);

  // 검색어가 도메인 형태인지 판별
  const isDomainLike = useMemo(() => {
    const clean = query.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '');
    return clean.includes('.') && clean.length >= 4;
  }, [query]);

  // 바깥 영역 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // initialValue 변경 시 동기화
  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  // 쿼리 또는 필터 변경 시 키보드 선택 인덱스 초기화
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, activeTab, selectedConsonant, selectedScale]);

  const handleSelectService = (service: VerifiedServiceItem) => {
    setQuery(service.serviceName.split(' (')[0]);
    setIsOpen(false);
    onSelectVerifiedService(service);
  };

  const handleCustomSubmit = () => {
    const clean = query.trim();
    if (!clean) return;
    setIsOpen(false);
    onSubmitCustomUrl(clean);
  };

  // 폼 제출 이벤트
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < displayedServices.length) {
      handleSelectService(displayedServices[selectedIndex]);
      return;
    }
    // 첫 번째 일치 기업이 확실하고 도메인 직접 입력이 아닌 경우
    if (displayedServices.length > 0 && !isDomainLike && query.trim().length >= 2) {
      handleSelectService(displayedServices[0]);
      return;
    }
    handleCustomSubmit();
  };

  // 키보드 상/하 및 Enter, Escape 탐색 지원
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    const totalSelectable = displayedServices.length + (query.trim().length > 0 ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < totalSelectable ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalSelectable - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < displayedServices.length) {
        e.preventDefault();
        handleSelectService(displayedServices[selectedIndex]);
      } else if (selectedIndex === displayedServices.length) {
        e.preventDefault();
        handleCustomSubmit();
      }
    }
  };

  const totalAllCount = getAllVerifiedServicesSorted().length;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* ── 1. 메인 검색 입력 바 ── */}
      <form onSubmit={handleFormSubmit} className="relative">
        <div className="relative flex items-center p-1.5 sm:p-2 rounded-2xl bg-dark-900/95 border-2 sm:border-[2.5px] border-white shadow-2xl shadow-white/10 ring-2 ring-white/10 backdrop-blur-md transition-all focus-within:ring-purple-400/40 focus-within:border-purple-300">
          <div className="absolute left-3.5 sm:left-4 flex items-center pointer-events-none text-cyan-400">
            <Search size={18} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            autoFocus={autoFocus}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="기업명, 서비스명, 도메인, 사업자번호 또는 초성 입력"
            className="w-full pl-10 sm:pl-12 pr-28 sm:pr-32 py-2.5 sm:py-3 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 font-medium focus:outline-none"
          />

          {/* 공공데이터 실시간 조회 로딩 인디케이터 */}
          {isSearchingPublicApi && (
            <div className="absolute right-32 sm:right-36 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-cyan-400 animate-pulse pointer-events-none hidden sm:flex">
              <Loader2 size={13} className="animate-spin text-cyan-400" />
              <span>공공DB 조회</span>
            </div>
          )}

          {/* 입력값 클리어 (X) 버튼 */}
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(true);
                inputRef.current?.focus();
              }}
              className="absolute right-24 sm:right-28 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="입력 지우기"
            >
              <X size={15} />
            </button>
          )}

          {/* 분석하기 / 검색 실행 버튼 */}
          <button
            type="submit"
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer group hover:scale-[1.02]"
          >
            <span>분석하기</span>
            <ArrowRight size={14} className="text-purple-200 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>

      {/* ── 2. 스마트 가나다순 전체 탐색 & 공공 실시간 하이브리드 드롭다운 ── */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-dark-950/98 border border-dark-700 shadow-2xl backdrop-blur-xl overflow-hidden divide-y divide-dark-800 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* 상단 1: 기업 규모(대기업/중견/스타트업/중소기업) 필터 탭 */}
          <div className="px-3.5 py-2 bg-dark-900/90 flex items-center justify-between gap-2 border-b border-dark-800 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-1 shrink-0 text-xs">
              <span className="text-slate-400 font-medium px-1 flex items-center gap-1 shrink-0">
                <Building size={12} className="text-purple-400" />
                <span className="hidden sm:inline">기업분류:</span>
              </span>
              {SCALE_FILTER_TABS.map((tab) => {
                const isActive = selectedScale === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedScale(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 shrink-0 hidden md:flex items-center gap-1">
              <Database size={11} className="text-cyan-400" />
              <span>공공데이터포털 + DART 100% 실측 연동</span>
            </div>
          </div>

          {/* 상단 2: 검색 상태 또는 가나다/인기 토글 바 */}
          <div className="px-3.5 py-1.5 bg-dark-900/70 flex items-center justify-between text-xs">
            {query.trim().length === 0 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('alphabetical');
                    setSelectedConsonant('전체');
                  }}
                  className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'alphabetical'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <SortAsc size={12} />
                  <span>가나다순 전체보기 ({totalAllCount}개사)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('popular')}
                  className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'popular'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={12} className="text-amber-400" />
                  <span>인기/추천</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>
                  검색결과: <strong className="text-cyan-300">"{query.trim()}"</strong> 일치 기업 ({displayedServices.length}건)
                </span>
                {publicApiResults.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    공공DB 실시간 {publicApiResults.length}건 결합
                  </span>
                )}
              </div>
            )}

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              초성(ㅅㅅ, ㅇㅍㄹㅍ) 및 방향키(↑↓) 지원
            </span>
          </div>

          {/* 가나다순 모드일 때 초성(ㄱ, ㄴ, ㄷ...) 빠른 필터 바 */}
          {query.trim().length === 0 && activeTab === 'alphabetical' && (
            <div className="px-3 py-1.5 bg-dark-900/50 border-b border-dark-800/80 flex items-center gap-1 overflow-x-auto custom-scrollbar text-[11px]">
              <span className="text-slate-400 font-medium px-1 flex items-center gap-1 shrink-0">
                <ListFilter size={12} className="text-purple-400" />
                <span>초성:</span>
              </span>
              {INITIAL_CONSONANTS.map((consonant) => {
                const isActive = selectedConsonant === consonant;
                return (
                  <button
                    key={consonant}
                    type="button"
                    onClick={() => setSelectedConsonant(consonant)}
                    className={`px-2 py-0.5 rounded transition-colors font-medium shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    {consonant}
                  </button>
                );
              })}
            </div>
          )}

          {/* 일치 기업 카드 목록 (로컬 + 공공데이터 결합) */}
          <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-dark-800/60 custom-scrollbar">
            {displayedServices.length > 0 ? (
              displayedServices.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                const isPublicApiItem = item.id.startsWith('public-mirror') || item.id.startsWith('gov-');

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectService(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-4 py-3 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                      isSelected 
                        ? 'bg-purple-950/40 border-l-4 border-brand-purpleLight pl-3 text-white' 
                        : 'hover:bg-dark-900/70 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* 아이콘 아바타 */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        item.hasApp 
                          ? 'bg-purple-950/60 text-brand-purpleLight border border-purple-500/40 shadow-sm'
                          : isPublicApiItem
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                            : 'bg-dark-850 text-slate-300 border border-dark-700'
                      }`}>
                        {item.hasApp ? (
                          <Smartphone size={17} />
                        ) : isPublicApiItem ? (
                          <Database size={16} />
                        ) : (
                          <Building2 size={17} />
                        )}
                      </div>

                      {/* 본문 정보 */}
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-sm font-bold text-white group-hover:text-purple-200">
                            {item.serviceName}
                          </strong>
                          
                          {/* 공식 검증 / 공공데이터 뱃지 */}
                          <span className={`inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            isPublicApiItem
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            <CheckCircle2 size={10} className="shrink-0" />
                            <span>{isPublicApiItem ? '공공데이터포털' : '공식 검증'}</span>
                          </span>

                          {/* 기업 규모 뱃지 */}
                          {item.scaleLabel && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700 font-medium">
                              {item.scaleLabel}
                            </span>
                          )}

                          {item.hasApp && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-purple/20 text-brand-purpleLight border border-brand-purple/30 font-semibold">
                              스토어 앱
                            </span>
                          )}

                          {item.isDartAudited && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold">
                              DART 공시
                            </span>
                          )}
                        </div>

                        {/* 사업자 식별자 및 도메인 정합성 정보 */}
                        <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                          <span>법인: <strong className="text-slate-300">{item.companyName}</strong></span>
                          <span className="text-slate-600">·</span>
                          <span>대표자: <strong className="text-slate-300">{item.representative}</strong></span>
                          <span className="text-slate-600">·</span>
                          <span>사업자: <strong className="text-slate-300 font-mono">{item.businessNumber}</strong></span>
                          <span className="text-slate-600">·</span>
                          <span className="text-cyan-400/90 font-mono">{item.domain}</span>
                        </div>

                        {/* 하이라이트 문구 */}
                        {item.highlightMetric && (
                          <div className="text-[11px] text-purple-300/90 font-medium pt-0.5">
                            ⚡ {item.highlightMetric}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 우측 카테고리 배지 */}
                    <div className="shrink-0 text-right pt-0.5">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-dark-850 border border-dark-750 text-slate-300 font-medium">
                        {item.category.split('/')[0].trim()}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-7 text-center text-xs text-slate-400 space-y-2">
                {isSearchingPublicApi ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 size={20} className="animate-spin text-cyan-400" />
                    <p className="text-slate-300">공공데이터포털 및 통신판매업 DB를 실시간 조회 중입니다...</p>
                  </div>
                ) : (
                  <>
                    <p>선택하신 조건에 일치하는 기업이 없습니다.</p>
                    <p className="text-slate-400">아래 직접 분석 요청 버튼을 눌러 임의의 웹사이트 URL을 분석하실 수 있습니다.</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── 3. 하단 액션: 목록에 없는 신규 URL 직접 분석 요청 ── */}
          {query.trim().length > 0 && (
            <div
              onClick={handleCustomSubmit}
              onMouseEnter={() => setSelectedIndex(displayedServices.length)}
              className={`px-4 py-3 bg-dark-900/90 hover:bg-purple-950/30 cursor-pointer flex items-center justify-between gap-2 text-xs transition-colors ${
                selectedIndex === displayedServices.length ? 'bg-purple-950/50 border-l-4 border-indigo-400 pl-3' : ''
              }`}
            >
              <div className="flex items-center gap-2 text-slate-300">
                <Globe size={15} className="text-cyan-400 shrink-0" />
                <span>
                  <strong className="text-cyan-300">"{query.trim()}"</strong> URL 직접 입력하여 신규 분석 요청하기
                </span>
              </div>
              <span className="font-bold text-brand-purpleLight flex items-center gap-1 shrink-0">
                <span>직접 분석</span>
                <ArrowRight size={13} />
              </span>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
