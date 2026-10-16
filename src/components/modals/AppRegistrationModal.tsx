import React, { useState, useEffect } from 'react';
import { 
  X, Smartphone, Search, 
  Sparkles, AlertCircle, Loader2
} from 'lucide-react';
import { searchAppStoreCandidates, type AppMarketInfo } from '../../utils/urlAnalyzer';

export interface RegisteredAppInfo {
  appName: string;
  packageId: string;
  iosAppId: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  mau?: number;
  dau?: number;
}

interface AppRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  domain: string;
  initialPackageId?: string;
  initialIosAppId?: string;
  totalWebVisits?: number;
  onConfirm: (appInfo: RegisteredAppInfo) => void;
}

export const AppRegistrationModal: React.FC<AppRegistrationModalProps> = ({
  isOpen,
  onClose,
  serviceName,
  domain,
  initialPackageId = '',
  initialIosAppId = '',
  totalWebVisits = 100000,
  onConfirm
}) => {
  const cleanServiceName = serviceName.split(' (')[0] || domain;

  // 폼 상태
  const [searchKeyword, setSearchKeyword] = useState<string>(cleanServiceName);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<AppMarketInfo[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const [appName, setAppName] = useState<string>(cleanServiceName);
  const [androidPackage, setAndroidPackage] = useState<string>(initialPackageId);
  const [iosAppId, setIosAppId] = useState<string>(initialIosAppId);
  
  // 트래픽 산출 방식: 'auto' (웹 대비 0.72x 자동 산출) vs 'manual' (직접 입력)
  const [trafficMode, setTrafficMode] = useState<'auto' | 'manual'>('auto');
  const [customMau, setCustomMau] = useState<string>('');
  const [customDau, setCustomDau] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 모달 오픈 시 초기화
  useEffect(() => {
    if (isOpen) {
      setSearchKeyword(cleanServiceName);
      setAppName(cleanServiceName);
      setAndroidPackage(initialPackageId);
      setIosAppId(initialIosAppId);
      setFormError('');
      setSearchResults([]);
      setHasSearched(false);
      setIsSubmitting(false);

      // 모달 열릴 때 백그라운드에서 키워드로 1회 자동 조회 시도
      if (cleanServiceName && cleanServiceName.length >= 2) {
        setIsSearching(true);
        searchAppStoreCandidates(cleanServiceName).then((results) => {
          setSearchResults(results);
          setHasSearched(true);
          setIsSearching(false);
        }).catch(() => {
          setIsSearching(false);
        });
      }
    }
  }, [isOpen, cleanServiceName, domain, initialPackageId, initialIosAppId]);

  if (!isOpen) return null;

  // URL에서 패키지명 또는 App ID 자동 파싱
  const handleAndroidInput = (val: string) => {
    let cleanVal = val.trim();
    if (cleanVal.includes('play.google.com')) {
      const match = cleanVal.match(/[?&]id=([a-zA-Z0-9_.]+)/);
      if (match && match[1]) {
        cleanVal = match[1];
      }
    }
    setAndroidPackage(cleanVal);
    if (formError) setFormError('');
  };

  const handleIosInput = (val: string) => {
    let cleanVal = val.trim();
    if (cleanVal.includes('apps.apple.com')) {
      const match = cleanVal.match(/id(\d+)/i);
      if (match && match[1]) {
        cleanVal = `id${match[1]}`;
      }
    } else if (/^\d+$/.test(cleanVal)) {
      cleanVal = `id${cleanVal}`;
    }
    setIosAppId(cleanVal);
    if (formError) setFormError('');
  };

  // 실시간 앱 검색 실행
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchKeyword.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchAppStoreCandidates(searchKeyword.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색 결과에서 앱 선택 시 자동 채우기
  const handleSelectCandidate = (candidate: AppMarketInfo) => {
    setAppName(candidate.appName);
    if (candidate.bundleId) {
      setAndroidPackage(candidate.bundleId);
    }
    if (candidate.iosAppId) {
      setIosAppId(candidate.iosAppId);
    }
    if (formError) setFormError('');
  };

  // 등록 완료 제출
  const handleSubmit = () => {
    const pkg = androidPackage.trim();
    const ios = iosAppId.trim();

    if (!pkg && !ios) {
      setFormError('Android 패키지명 또는 iOS App ID 중 최소 1개 이상을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    const autoMau = Math.round(totalWebVisits * 0.72);
    const autoDau = Math.round(autoMau * 0.26);

    const resolvedMau = trafficMode === 'manual' && Number(customMau) > 0 
      ? Number(customMau) 
      : autoMau;

    const resolvedDau = trafficMode === 'manual' && Number(customDau) > 0 
      ? Number(customDau) 
      : (trafficMode === 'manual' ? Math.round(resolvedMau * 0.26) : autoDau);

    setTimeout(() => {
      onConfirm({
        appName: appName.trim() || cleanServiceName,
        packageId: pkg || (ios ? `com.${domain.replace(/[^a-zA-Z0-9]/g, '')}.app` : ''),
        iosAppId: ios || (pkg ? 'id-official' : ''),
        mau: resolvedMau,
        dau: resolvedDau
      });
      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  const autoEstimatedMau = Math.round(totalWebVisits * 0.72);
  const autoEstimatedDau = Math.round(autoEstimatedMau * 0.26);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-dark-900 border border-dark-700 shadow-2xl shadow-purple-950/40 text-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-750 bg-gradient-to-r from-dark-850 via-dark-900 to-purple-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  모바일 앱 정보 등록하기
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-500/30 font-bold">
                  트래픽 잠금 해제
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                스토어 식별자를 등록하시면 앱 트래픽(MAU/DAU) 및 통합 지표가 즉시 자동 산출됩니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs sm:text-sm">
          
          {/* 1단계: 실시간 스토어 빠른 검색 (원클릭 자동 채우기) */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Search className="w-4 h-4 text-purple-400" />
                <span>스토어 공식 앱 실시간 검색</span>
              </span>
              <span className="text-[11px] text-slate-400">
                선택 시 아래 폼이 자동 완성됩니다
              </span>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="서비스명 또는 앱 명칭 검색 (예: 나마네카드, 와우패스)"
                  className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-dark-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchKeyword.trim()}
                className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>검색 중...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>앱 검색</span>
                  </>
                )}
              </button>
            </form>

            {/* 검색 결과 목록 */}
            {hasSearched && (
              <div className="pt-2 border-t border-dark-750/80 space-y-1.5">
                {searchResults.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {searchResults.map((app, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-dark-900/90 border border-dark-700 hover:border-purple-500/50 transition-all gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {app.iconUrl ? (
                            <img src={app.iconUrl} alt={app.appName} className="w-8 h-8 rounded-lg shrink-0 object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center shrink-0">
                              <Smartphone className="w-4 h-4 text-purple-300" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs truncate">{app.appName}</div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {app.developer} {app.bundleId && `· ${app.bundleId}`}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectCandidate(app)}
                          className="px-2.5 py-1 rounded-md bg-purple-950 text-purple-300 hover:bg-purple-900/80 border border-purple-500/40 text-xs font-bold shrink-0 transition-colors cursor-pointer"
                        >
                          선택
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs text-slate-400">
                    스토어에서 '{searchKeyword}' 검색 결과가 없습니다. 아래 양식에 직접 입력해 주세요.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2단계: 스토어 식별자 직접 입력 및 확인 */}
          <div className="space-y-3.5">
            
            {/* 앱 서비스명 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                앱 표기 명칭
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="예: 나마네카드 공식 앱"
                className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>

            {/* Android (Google Play) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>Google Play (Android 패키지명 또는 스토어 URL)</span>
                </label>
                <span className="text-[11px] text-emerald-400/80 font-mono">
                  {androidPackage ? '확인됨' : '미입력'}
                </span>
              </div>
              <input
                type="text"
                value={androidPackage}
                onChange={(e) => handleAndroidInput(e.target.value)}
                placeholder="예: com.iaurora.cardforme 또는 https://play.google.com/store/apps/details?id=..."
                className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs font-mono focus:outline-hidden focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500 mt-0.5">
                ※ 스토어 URL을 붙여넣으시면 패키지명이 자동으로 추출됩니다.
              </p>
            </div>

            {/* iOS (Apple App Store) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  <span>Apple App Store (iOS App ID 또는 스토어 URL)</span>
                </label>
                <span className="text-[11px] text-cyan-400/80 font-mono">
                  {iosAppId ? '확인됨' : '미입력'}
                </span>
              </div>
              <input
                type="text"
                value={iosAppId}
                onChange={(e) => handleIosInput(e.target.value)}
                placeholder="예: id1533784467 또는 https://apps.apple.com/kr/app/.../id1533784467"
                className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs font-mono focus:outline-hidden focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-0.5">
                ※ 앱스토어 링크를 붙여넣으시면 숫자 ID가 자동으로 추출됩니다.
              </p>
            </div>

          </div>

          {/* 3단계: 트래픽 산출 방식 설정 */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2.5">
            <span className="font-bold text-white block">
              트래픽(MAU/DAU) 산출 옵션
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label 
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  trafficMode === 'auto'
                    ? 'bg-purple-950/40 border-purple-500/60 ring-1 ring-purple-500/30'
                    : 'bg-dark-900 border-dark-700 hover:border-dark-600'
                }`}
              >
                <input
                  type="radio"
                  name="trafficMode"
                  checked={trafficMode === 'auto'}
                  onChange={() => setTrafficMode('auto')}
                  className="mt-0.5 text-purple-600 focus:ring-purple-500"
                />
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-white text-xs">
                    웹 기반 자동 산출 (권장)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    웹 트래픽 대비 0.72x 비율 적용
                  </div>
                  <div className="text-[11px] text-purple-300 font-semibold tabular-nums pt-1">
                    추정 MAU: {autoEstimatedMau.toLocaleString()} / DAU: {autoEstimatedDau.toLocaleString()}
                  </div>
                </div>
              </label>

              <label 
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  trafficMode === 'manual'
                    ? 'bg-purple-950/40 border-purple-500/60 ring-1 ring-purple-500/30'
                    : 'bg-dark-900 border-dark-700 hover:border-dark-600'
                }`}
              >
                <input
                  type="radio"
                  name="trafficMode"
                  checked={trafficMode === 'manual'}
                  onChange={() => setTrafficMode('manual')}
                  className="mt-0.5 text-purple-600 focus:ring-purple-500"
                />
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-white text-xs">
                    직접 MAU/DAU 입력
                  </div>
                  <div className="text-[11px] text-slate-400">
                    스토어 콘솔 실측치 직접 입력
                  </div>
                </div>
              </label>
            </div>

            {trafficMode === 'manual' && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark-750">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    월간 활성 이용자 (MAU)
                  </label>
                  <input
                    type="number"
                    value={customMau}
                    onChange={(e) => setCustomMau(e.target.value)}
                    placeholder={`예: ${autoEstimatedMau}`}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs tabular-nums focus:outline-hidden focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    일간 활성 이용자 (DAU)
                  </label>
                  <input
                    type="number"
                    value={customDau}
                    onChange={(e) => setCustomDau(e.target.value)}
                    placeholder={`예: ${autoEstimatedDau}`}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs tabular-nums focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 에러 메시지 */}
          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

        </div>

        {/* 모달 푸터 */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-dark-750 bg-dark-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition-colors cursor-pointer text-xs font-semibold"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-950/50 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>연동 처리 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>등록 완료 및 통합 트래픽 잠금 해제</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
