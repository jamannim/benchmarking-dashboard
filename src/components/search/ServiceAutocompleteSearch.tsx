import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, Globe, Building2, CheckCircle2, 
  Smartphone, ArrowRight, X, Sparkles, ShieldCheck
} from 'lucide-react';
import { 
  searchVerifiedServices, 
  type VerifiedServiceItem 
} from '../../data/verifiedServicesRegistry';

interface Props {
  onSelectVerifiedService: (service: VerifiedServiceItem) => void;
  onSubmitCustomUrl: (url: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  autoFocus?: boolean;
}

export const ServiceAutocompleteSearch: React.FC<Props> = ({
  onSelectVerifiedService,
  onSubmitCustomUrl,
  placeholder = '서비스명, 기업명, 도메인, 사업자번호 입력 (예: 엔플랫폼, 나마네, 트랜스파머)',
  initialValue = '',
  className = '',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 실시간 일치 서비스 목록 검색
  const matchedServices = useMemo(() => {
    return searchVerifiedServices(query);
  }, [query]);

  // 검색어가 도메인 형태인지 판별 (점 포함)
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

  // 쿼리 변경 시 키보드 선택 인덱스 초기화
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

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
    if (selectedIndex >= 0 && selectedIndex < matchedServices.length) {
      handleSelectService(matchedServices[selectedIndex]);
      return;
    }
    // 첫 번째 일치 기업이 확실하고 도메인 직접 입력이 아닌 경우
    if (matchedServices.length > 0 && !isDomainLike && query.trim().length >= 2) {
      handleSelectService(matchedServices[0]);
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

    const totalSelectable = matchedServices.length + (query.trim().length > 0 ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < totalSelectable ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalSelectable - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < matchedServices.length) {
        e.preventDefault();
        handleSelectService(matchedServices[selectedIndex]);
      } else if (selectedIndex === matchedServices.length) {
        // 하단 커스텀 직접 분석 항목 선택
        e.preventDefault();
        handleCustomSubmit();
      }
    }
  };

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
            aria-label="서비스명, 기업명, 도메인, 사업자번호 입력"
            className="w-full pl-10 sm:pl-12 pr-28 sm:pr-32 py-2.5 sm:py-3 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 font-medium focus:outline-none"
          />

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

      {/* ── 2. 스마트 자동완성 드롭다운 팝오버 ── */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-dark-950/95 border border-dark-700 shadow-2xl backdrop-blur-xl overflow-hidden divide-y divide-dark-800 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* 상단 레이블 바 */}
          <div className="px-4 py-2.5 bg-dark-900/80 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              {query.trim().length === 0 ? (
                <>
                  <Sparkles size={13} className="text-amber-400" />
                  <span>추천 · 인기 분석 서비스 (100% 실측 검증)</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>공인 검증 기업 일치 검색결과 ({matchedServices.length}건)</span>
                </>
              )}
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              방향키(↑↓) 이동 및 Enter 선택 가능
            </span>
          </div>

          {/* 일치 기업 카드 목록 */}
          <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-dark-800/60 custom-scrollbar">
            {matchedServices.length > 0 ? (
              matchedServices.map((item, idx) => {
                const isSelected = selectedIndex === idx;
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
                          : 'bg-dark-850 text-cyan-400 border border-dark-700'
                      }`}>
                        {item.hasApp ? <Smartphone size={17} /> : <Building2 size={17} />}
                      </div>

                      {/* 본문 정보 */}
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-sm font-bold text-white group-hover:text-purple-200">
                            {item.serviceName}
                          </strong>
                          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                            <CheckCircle2 size={10} className="shrink-0" />
                            <span>공식 검증</span>
                          </span>
                          {item.hasApp && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-purple/20 text-brand-purpleLight border border-brand-purple/30 font-semibold">
                              스토어 앱 운영
                            </span>
                          )}
                        </div>

                        {/* 사업자 식별자 및 도메인 정합성 정보 */}
                        <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                          <span>운영사: <strong className="text-slate-300">{item.companyName}</strong></span>
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
              <div className="px-4 py-5 text-center text-xs text-slate-400 space-y-1">
                <p>공인 등록 목록에 일치하는 기업이 없습니다.</p>
                <p className="text-slate-400">아래 직접 분석 요청 버튼을 눌러 신규 웹사이트를 분석하실 수 있습니다.</p>
              </div>
            )}
          </div>

          {/* ── 3. 하단 액션: 목록에 없는 신규 URL 직접 분석 요청 ── */}
          {query.trim().length > 0 && (
            <div
              onClick={handleCustomSubmit}
              onMouseEnter={() => setSelectedIndex(matchedServices.length)}
              className={`px-4 py-3 bg-dark-900/90 hover:bg-purple-950/30 cursor-pointer flex items-center justify-between gap-2 text-xs transition-colors ${
                selectedIndex === matchedServices.length ? 'bg-purple-950/50 border-l-4 border-indigo-400 pl-3' : ''
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
