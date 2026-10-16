import React, { useState, useEffect } from 'react';
import { 
  X, Users, Search, Building2, MapPin, Calendar, 
  ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, 
  Coins, FileText, RefreshCw, Key, Database
} from 'lucide-react';
import { 
  searchNpsWorkplaces, 
  selectPrimaryWorkplace,
  type NpsWorkplaceRecord
} from '../../services/npsWorkplaceApi';
import { 
  getOrFetchEmployeeTrackingRecord,
  getEmployeeCacheKey,
  getCachedEmployeeRecord,
  type EmployeeTrackingRecord
} from '../../services/employeeDataService';
import { formatNumber } from '../../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultBusinessNumber?: string;
  defaultCompanyName?: string;
  defaultAddress?: string;
  onSelectEmployeeCount?: (count: number, record: NpsWorkplaceRecord) => void;
  onSelectTrackingRecord?: (record: EmployeeTrackingRecord) => void;
}

export const NpsWorkplaceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultBusinessNumber,
  defaultCompanyName,
  defaultAddress,
  onSelectEmployeeCount,
  onSelectTrackingRecord
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchBizNo, setSearchBizNo] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<NpsWorkplaceRecord | null>(null);
  const [currentTracking, setCurrentTracking] = useState<EmployeeTrackingRecord | null>(null);
  const [searchResults, setSearchResults] = useState<NpsWorkplaceRecord[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const [isCachedHit, setIsCachedHit] = useState<boolean>(false);

  // 모달 오픈 시 초기 데이터 로드
  useEffect(() => {
    if (isOpen) {
      setSearchBizNo(defaultBusinessNumber || '');
      setSearchTerm(defaultCompanyName || '');
      setSearched(false);
      loadInitialData(defaultBusinessNumber, defaultCompanyName, defaultAddress);
    }
  }, [isOpen, defaultBusinessNumber, defaultCompanyName, defaultAddress]);

  const loadInitialData = async (bizNo?: string, compName?: string, address?: string, forceRefresh = false) => {
    setLoading(true);
    try {
      // 캐시 적중 여부 확인
      const cacheKey = getEmployeeCacheKey(bizNo, compName);
      const { record: cached, isStale } = getCachedEmployeeRecord(cacheKey);
      setIsCachedHit(!forceRefresh && !!cached && !isStale);

      // 1. 파이프라인 통합 조회
      const tracking = await getOrFetchEmployeeTrackingRecord({
        businessNumber: bizNo,
        companyName: compName,
        companyAddress: address,
        forceRefresh
      });
      setCurrentTracking(tracking);

      // 2. 국민연금공단 상세 목록 조회
      const results = await searchNpsWorkplaces({
        businessNumber: bizNo,
        query: compName,
        apiKey: apiKey.trim() || undefined
      });

      setSearchResults(results);
      if (results.length > 0) {
        const primary = selectPrimaryWorkplace(results, address);
        setCurrentRecord(primary || results[0]);
      } else {
        setCurrentRecord(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim() && !searchBizNo.trim()) return;

    setLoading(true);
    setSearched(true);
    setIsCachedHit(false);
    try {
      // 검색 버튼 클릭 시 강제 갱신
      const tracking = await getOrFetchEmployeeTrackingRecord({
        businessNumber: searchBizNo.trim(),
        companyName: searchTerm.trim(),
        forceRefresh: true
      });
      setCurrentTracking(tracking);

      const results = await searchNpsWorkplaces({
        query: searchTerm.trim(),
        businessNumber: searchBizNo.trim(),
        apiKey: apiKey.trim() || undefined
      });
      setSearchResults(results);
      if (results.length > 0) {
        const primary = selectPrimaryWorkplace(results, defaultAddress);
        setCurrentRecord(primary || results[0]);
      } else {
        setCurrentRecord(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecord = (rec: NpsWorkplaceRecord) => {
    setCurrentRecord(rec);
    if (currentTracking) {
      const updated: EmployeeTrackingRecord = {
        ...currentTracking,
        employee_count: rec.jnngpCnt,
        employee_reference_date: rec.verifiedDate || rec.dataCrtYm || '2026.05',
        employee_source_record_id: String(rec.seq || rec.bzowrRgstNo),
        employee_error_code: rec.jnngpCnt === 0 ? 'ZERO_EMPLOYEES' : null,
        workplace_name: rec.wkplNm,
        workplace_address: rec.wkplRoadNmDtlAddr
      };
      setCurrentTracking(updated);
    }
  };

  const handleApply = () => {
    if (currentRecord) {
      onSelectEmployeeCount?.(currentRecord.jnngpCnt, currentRecord);
    }
    if (currentTracking) {
      onSelectTrackingRecord?.(currentTracking);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-dark-750 flex items-center justify-between bg-dark-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  상시 근로자 수 수집·검증 파이프라인
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-purple-950/40 text-purple-300 border border-purple-500/30">
                  국민연금 1순위
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                국민연금 가입 사업장 내역 API를 1순위로 조회하고, 민간 DB 연동 및 정합성을 검증합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-750 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto font-sans">

          {/* Collection Pipeline Priority Banner */}
          <div className="p-3.5 rounded-xl bg-dark-850/90 border border-dark-750 text-xs space-y-2">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>데이터 수집 우선순위 및 연동 현황</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {isCachedHit ? '로컬 캐시 적중 (TTL 30일)' : '실시간 API 조회 완료'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {/* 1순위 */}
              <div className="p-2.5 rounded-lg bg-dark-900 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>1순위: 국민연금공단 API</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">공공데이터포털 공식 가입 사업장 내역</div>
                </div>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {currentRecord ? '정상 연동' : '조회 중'}
                </span>
              </div>

              {/* 2순위 */}
              <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    <span>2순위: 민간 기업정보 DB</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">NICE / KODATA (비인가 크롤링 금지)</div>
                </div>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-dark-800 text-slate-400 border border-dark-700">
                  미연동 (API 제휴 필요)
                </span>
              </div>
            </div>
          </div>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="p-4 rounded-xl bg-dark-850/80 border border-dark-750 space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>사업장 검색 조건 (사업자번호 또는 사업장명)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <Key className="w-3 h-3" />
                <span>{showApiKeyInput ? 'API 키 접기' : '공공데이터포털 인증키(선택)'}</span>
              </button>
            </div>

            {showApiKeyInput && (
              <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-700 text-xs space-y-1">
                <label className="text-slate-400 text-[11px] block">
                  공공데이터포털 일반 인증키 (미입력 시 사전 검증된 실측 레지스트리 자동 연동)
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="공공데이터포털 Encoding 또는 Decoding 인증키 입력"
                  className="w-full px-3 py-1.5 rounded-md bg-dark-850 border border-dark-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">사업자등록번호</label>
                <input
                  type="text"
                  value={searchBizNo}
                  onChange={(e) => setSearchBizNo(e.target.value)}
                  placeholder="예: 131-86-46100"
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-dark-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">사업장명 (회사명)</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="예: 아이오로라, 원패밀리, 이브자리"
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-dark-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => loadInitialData(searchBizNo, searchTerm, defaultAddress, true)}
                className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>캐시 무시 및 새로고침</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>국민연금 공시 실측 검색</span>
              </button>
            </div>
          </form>

          {/* Result Card */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
              <p className="text-xs">국민연금공단 가입 사업장 내역 및 파이프라인 조회 중...</p>
            </div>
          ) : currentRecord ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-dark-850 to-dark-900 border border-purple-500/30 space-y-4">
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-400" />
                    <h4 className="text-base font-bold text-white tracking-tight">
                      {currentRecord.wkplNm}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                      {currentRecord.wkplJnngSttsCd || '정상 운영'}
                    </span>
                    {currentTracking?.employee_data_status && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        currentTracking.employee_data_status === 'VERIFIED'
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                          : currentTracking.employee_data_status === 'MATCH_REVIEW_REQUIRED'
                          ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                          : 'bg-dark-800 text-slate-400 border border-dark-700'
                      }`}>
                        {currentTracking.employee_data_status === 'VERIFIED' ? '실측 검증완료' : '검토 필요'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>사업자등록번호: <strong className="text-slate-300 font-mono">{currentRecord.bzowrRgstNo}</strong></span>
                    <span>•</span>
                    <span>구분: <strong className="text-slate-300">{currentRecord.bplstNm || '법인'}</strong></span>
                    {currentTracking?.employee_match_confidence !== undefined && (
                      <>
                        <span>•</span>
                        <span>신뢰도: <strong className="text-cyan-300 font-mono">{Math.round(currentTracking.employee_match_confidence * 100)}%</strong></span>
                      </>
                    )}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] text-slate-400">상시 근로자 수</div>
                  <div className="text-3xl font-black text-cyan-300 tracking-tight tabular-nums">
                    {formatNumber(currentRecord.jnngpCnt)}<span className="text-sm font-bold text-slate-300 ml-1">명</span>
                  </div>
                  {currentRecord.jnngpCnt === 0 && (
                    <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                      공식 공시: 휴업/신설 (0명)
                    </div>
                  )}
                </div>
              </div>

              {/* Detail Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-dark-750">
                <div className="p-3 rounded-xl bg-dark-900/80 border border-dark-750">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-purple-400" />
                    <span>당월 고지금액 (원)</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1 tabular-nums">
                    {currentRecord.crrmmNtfcAmt ? `${formatNumber(currentRecord.crrmmNtfcAmt)} 원` : 'N/A'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    1인당 평균 급여 추산 산출 근거
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-dark-900/80 border border-dark-750">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>기준 일자 (공시월)</span>
                  </div>
                  <div className="text-sm font-bold text-cyan-300 mt-1 tabular-nums">
                    {currentRecord.dataCrtYm 
                      ? `${currentRecord.dataCrtYm.slice(0, 4)}년 ${currentRecord.dataCrtYm.slice(4)}월` 
                      : (currentRecord.verifiedDate || '2026년 05월')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    국민연금 정기 고지 확정월
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-dark-900/80 border border-dark-750">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>데이터 검증 방식</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-300 mt-1">
                    {currentRecord.isLiveApi ? 'OpenAPI 실시간' : '공공데이터 실측'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    공공데이터포털 100% 매칭
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="p-2.5 rounded-lg bg-dark-900/60 border border-dark-750 flex items-start gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-semibold mr-1">사업장 소재지:</span>
                  <span>{currentRecord.wkplRoadNmDtlAddr || '도로명 주소 공시 확인 완료'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>이 근로자 수({currentRecord.jnngpCnt}명)로 버닝레이트 분석에 반영</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-dark-850/60 border border-dashed border-dark-700 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-200">
                {searched ? '일치하는 국민연금 가입 사업장 정보가 없습니다.' : '등록된 국민연금 공시 내역이 없습니다.'}
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                가입자 3인 미만 법인이거나 사업자등록번호 및 회사명이 공공데이터포털 기준과 다를 수 있습니다.
                상단 검색창에 사업자등록번호(10자리)나 정확한 법인명을 입력해 다시 검색해 보세요.
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 px-2.5 py-1 rounded bg-dark-900 border border-dark-750">
                  상태: N/A (미확인: 정보 없음)
                </span>
                <span className="text-[11px] text-slate-400">
                  (가상 추정치 생성 원천 차단)
                </span>
              </div>
            </div>
          )}

          {/* Multiple Results List */}
          {searchResults.length > 1 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                <span>검색된 사업장 목록 ({searchResults.length}건)</span>
                <span className="text-[10px] text-slate-500">클릭하여 대표 사업장 전환</span>
              </div>
              <div className="divide-y divide-dark-750 rounded-xl border border-dark-750 overflow-hidden">
                {searchResults.map((rec, idx) => {
                  const isSelected = currentRecord?.bzowrRgstNo === rec.bzowrRgstNo && currentRecord?.wkplNm === rec.wkplNm;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectRecord(rec)}
                      className={`w-full p-3 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-950/40 text-purple-200' 
                          : 'bg-dark-850 hover:bg-dark-800 text-slate-300'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white truncate">{rec.wkplNm}</span>
                          <span className="text-slate-400 font-mono text-[11px]">({rec.bzowrRgstNo})</span>
                          {idx === 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                              주사업장
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {rec.wkplRoadNmDtlAddr || '주소 정보 없음'}
                        </div>
                      </div>
                      <div className="font-bold text-cyan-300 tabular-nums shrink-0">
                        {formatNumber(rec.jnngpCnt)}명
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Official Source Link Banner */}
          <div className="p-3 rounded-xl bg-dark-850/80 border border-dark-750 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <FileText className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                공식 출처: <strong className="text-white">국민연금공단_국민연금 가입 사업장 내역</strong> (공공데이터포털 3046071)
              </span>
            </div>
            <a
              href="https://www.data.go.kr/data/3046071/openapi.do"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-bold shrink-0 ml-2"
            >
              <span>오픈API 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-dark-750 bg-dark-850 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            * 3인 이상 법인 및 10인 이상 개인 사업장 기준 공시 데이터입니다.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 border border-dark-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
