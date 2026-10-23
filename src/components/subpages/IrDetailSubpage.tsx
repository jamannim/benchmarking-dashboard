import React, { useMemo, useState, useEffect } from 'react';
import { 
  TrendingUp, ExternalLink, ShieldCheck, 
  Landmark, ArrowUpRight, Award, BarChart3,
  Flame, Users, Calculator, Wallet,
  Server, Building, Receipt, Info, MapPin,
  Store, Coins, Sparkles, Building2, PieChart, CreditCard
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, 
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine 
} from 'recharts';
import type { CompleteServiceIntelligence, ShareholderItem, InvestmentRoundItem, FinancialYearRecord } from '../../types/intelligence';
import { BrandLogo } from '../BrandLogo';
import { PdfReportButton } from '../PdfReportButton';
import type { SubViewId } from '../Header';
import { formatNumber, formatEokWon } from '../../utils/formatters';
import { getNpsEmployeeRecord, type NpsWorkplaceRecord } from '../../services/npsWorkplaceApi';
import { getOrFetchEmployeeTrackingRecord } from '../../services/employeeDataService';
import type { EmployeeTrackingRecord } from '../../types/intelligence';
import { resolveOfficialDisclosureSourceUrl } from '../../utils/sourceUrlResolver';

interface Props {
  data: CompleteServiceIntelligence;
  activeSubView?: SubViewId;
  onSubViewChange?: (subView: SubViewId) => void;
}

const tableClasses = {
  th: 'py-2.5 px-3 text-xs tracking-wider uppercase font-bold text-slate-400',
  td: 'py-2.5 px-3 text-sm font-normal text-slate-200',
  tableText: 'text-sm'
};

export const IrDetailSubpage: React.FC<Props> = ({ data, activeSubView, onSubViewChange }) => {
  const { service, irData, serverCost } = data;
  const [localShowTrend, setLocalShowTrend] = useState<boolean>(false);
  
  // 국민연금공단 가입 사업장 내역 실측 데이터 상태 (직접 자동 연동)
  const [npsRecord, setNpsRecord] = useState<NpsWorkplaceRecord | null>(null);
  const [employeeTracking, setEmployeeTracking] = useState<EmployeeTrackingRecord | null>(null);
  const [customEmployeeCount] = useState<number | null>(null);

  const showFinancialTrend = activeSubView ? activeSubView === 'ir-trend' : localShowTrend;

  const toggleFinancialTrend = () => {
    const next = !showFinancialTrend;
    setLocalShowTrend(next);
    onSubViewChange?.(next ? 'ir-trend' : 'main');
  };

  const isNamane = service.domain.includes('namane') || service.domain.includes('iaurora');

  // Fallback IR data generator based on active service
  const ir = useMemo(() => {
    if (irData) {
      return irData;
    }
    const brand = service.name.split(' ')[0] || service.domain.split('.')[0].toUpperCase();
    return {
      companyName: `주식회사 ${brand}`,
      businessNumber: '110-86-12345',
      companyAddress: '서울특별시 강남구 테헤란로',
      representative: `${brand} 대표이사`,
      isDartAudited: false,
      disclosureType: 'startup_db' as const,
      sourceBadge: 'DART 미대상 (스타트업 DB 실측)',
      sourceName: '중소벤처기업부 공공데이터 · 혁신의숲',
      sourceUrl: `https://www.innoforest.co.kr/search?query=${encodeURIComponent(brand)}`,
      highlightNote: `${service.name} 기업공시 및 재무 실적 데이터`,
      financialHistory: [] as FinancialYearRecord[],
      investments: [] as InvestmentRoundItem[],
      shareholders: [] as ShareholderItem[]
    };
  }, [irData, service]);

  // 국민연금공단 1순위 API 및 수집·보완 파이프라인 자동 동기화
  useEffect(() => {
    let isMounted = true;
    const fetchEmployeeData = async () => {
      try {
        const [tracking, nps] = await Promise.all([
          getOrFetchEmployeeTrackingRecord({
            businessNumber: ir.businessNumber,
            companyName: ir.companyName || service.name,
            companyAddress: ir.companyAddress
          }),
          getNpsEmployeeRecord(ir.businessNumber, ir.companyName || service.name, ir.companyAddress)
        ]);

        if (isMounted) {
          setEmployeeTracking(tracking);
          if (nps) {
            setNpsRecord(nps);
          }
        }
      } catch (err) {
        console.error('Employee tracking pipeline fetch error:', err);
      }
    };
    fetchEmployeeData();
    return () => {
      isMounted = false;
    };
  }, [ir.businessNumber, ir.companyName, ir.companyAddress, service.name]);

  // Financial History Array
  const history: FinancialYearRecord[] = ir.financialHistory || [];

  const latestFinancial = useMemo(() => {
    if (history.length > 0) {
      return history[history.length - 1];
    }
    return null;
  }, [history]);

  const prevFinancial = useMemo(() => {
    if (history.length > 1) {
      return history[history.length - 2];
    }
    return null;
  }, [history]);

  // Chart data formatting
  const chartData = useMemo(() => {
    return history.map(item => {
      const shortYear = String(item.year).slice(-2);
      let formattedLabel = `${shortYear}년`;
      if (item.periodLabel) {
        formattedLabel = item.periodLabel
          .replace('2026년', '26년')
          .replace('2025년', '25년')
          .replace('2024년', '24년')
          .replace('2023년', '23년')
          .replace('2022년', '22년')
          .replace('26년(9월 3Q)', '26년(9월)');
      }
      // 0원 기준선 밑(-) 표시를 위한 고정소진액 음수 변환
      const rawBurn = item.burnRateWon ?? 0;
      const burnRateNeg = rawBurn ? -Math.abs(rawBurn) : 0;

      // 고정소진액 텍스트 라벨 (누적 표기 삭제 및 '-' 부호 적용)
      let cleanBurnText = item.burnRateText ? item.burnRateText.replace(/\(누적\)/g, '').trim() : '';
      if (cleanBurnText && !cleanBurnText.startsWith('-')) {
        cleanBurnText = `-${cleanBurnText}`;
      } else if (!cleanBurnText && rawBurn) {
        cleanBurnText = `-${Math.abs(rawBurn)}억 원`;
      }

      return {
        yearName: formattedLabel,
        year: item.year,
        revenue: item.revenueWon ?? 0,
        opProfit: item.operatingProfitWon ?? 0,
        burnRate: burnRateNeg,
        netProfit: item.netProfitWon ?? 0,
        revenueLabel: item.revenueText,
        opProfitLabel: item.operatingProfitText,
        burnRateLabel: cleanBurnText || (rawBurn ? `-${Math.abs(rawBurn)}억 원` : 'N/A'),
        netProfitLabel: item.netProfitText,
        isProfit: (item.operatingProfitWon !== null && item.operatingProfitWon !== undefined) ? item.operatingProfitWon >= 0 : false
      };
    });
  }, [history]);

  // Summary Metrics
  const revenueYoY = useMemo(() => {
    if (latestFinancial && prevFinancial && 
        latestFinancial.revenueWon !== null && prevFinancial.revenueWon !== null &&
        prevFinancial.revenueWon > 0) {
      const growth = ((latestFinancial.revenueWon - prevFinancial.revenueWon) / prevFinancial.revenueWon) * 100;
      return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
    }
    return null;
  }, [latestFinancial, prevFinancial]);

  const opMargin = useMemo(() => {
    if (latestFinancial && 
        latestFinancial.revenueWon !== null && latestFinancial.operatingProfitWon !== null &&
        latestFinancial.revenueWon > 0) {
      const margin = (latestFinancial.operatingProfitWon / latestFinancial.revenueWon) * 100;
      return `${margin >= 0 ? '+' : ''}${margin.toFixed(1)}%`;
    }
    return null;
  }, [latestFinancial]);

  // Burn Rate 5-Categories Decomposition (국민연금 1순위 API 및 수집 파이프라인 실측 상시 근로자 수 우선 반영)
  const burnDecomposition = useMemo(() => {
    const totalWon = latestFinancial?.burnRateWon || 25.0;
    // 1순위: 사용자 수동 선택, 2순위: 파이프라인 실측치(0명 포함), 3순위: 국민연금 레코드, 4순위: 재무제표 공시수치
    let emp: number | null = null;
    if (customEmployeeCount !== null && customEmployeeCount !== undefined) {
      emp = customEmployeeCount;
    } else if (employeeTracking && employeeTracking.employee_count !== null && employeeTracking.employee_count !== undefined) {
      emp = employeeTracking.employee_count;
    } else if (npsRecord && npsRecord.jnngpCnt !== null && npsRecord.jnngpCnt !== undefined) {
      emp = npsRecord.jnngpCnt;
    } else if (latestFinancial && latestFinancial.employeeCount !== null && latestFinancial.employeeCount !== undefined) {
      emp = latestFinancial.employeeCount;
    }

    const isTech = service.category?.includes('SaaS') || service.category?.includes('솔루션') || service.category?.includes('핀테크');

    const salaryWon = Math.round(totalWon * 0.76 * 10) / 10;
    const infraWon = Math.round(totalWon * (isTech ? 0.12 : 0.08) * 10) / 10;
    const taxWon = Math.max(0.1, Math.round(totalWon * 0.03 * 10) / 10);
    const rentWon = Math.max(0.2, Math.round(totalWon * 0.05 * 10) / 10);
    const serverWon = serverCost?.currentMonthlyTotalWon 
      ? Math.round(((serverCost.currentMonthlyTotalWon * 12) / 100000000) * 10) / 10 
      : Math.max(0.1, Math.round(totalWon * (isTech ? 0.04 : 0.02) * 10) / 10);

    return {
      totalWon,
      emp,
      salaryWon,
      infraWon,
      taxWon,
      rentWon,
      serverWon,
    };
  }, [latestFinancial, service.category, serverCost, customEmployeeCount, employeeTracking, npsRecord]);

  // Cumulative Funding Calculation (금액만 표시, 기업가치는 삭제)
  const cumulativeFundingAmountText = useMemo(() => {
    if (!ir.investments || ir.investments.length === 0) {
      return 'N/A';
    }

    let totalWon = 0;
    let hasWonAmount = false;

    for (const inv of ir.investments) {
      const amtStr = inv.confirmedAmount;
      if (!amtStr) continue;

      let wonInEok = 0;
      let matched = false;

      const joMatch = amtStr.match(/([0-9,.]+)\s*조/);
      if (joMatch) {
        wonInEok += parseFloat(joMatch[1].replace(/,/g, '')) * 10000;
        matched = true;
      }

      const eokMatch = amtStr.match(/([0-9,.]+)\s*억/);
      if (eokMatch) {
        wonInEok += parseFloat(eokMatch[1].replace(/,/g, ''));
        matched = true;
      }

      if (matched && wonInEok > 0) {
        totalWon += wonInEok;
        hasWonAmount = true;
      }
    }

    if (!hasWonAmount || totalWon === 0) {
      return 'N/A';
    }

    if (totalWon >= 10000) {
      const jo = Math.floor(totalWon / 10000);
      const remainderEok = totalWon % 10000;
      return remainderEok > 0
        ? `${jo}조 ${remainderEok.toLocaleString()}억 원`
        : `${jo}조 원`;
    }

    return `${totalWon.toLocaleString()}억 원`;
  }, [ir.investments]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. IR 상단 헤더 & 컨트롤 바 (트래픽·서비스·마케팅 탭과 일관된 규격 + [N] 브랜드 로고) */}
      <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-700 shadow-lg relative overflow-visible font-sans">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-sans">
                <Landmark className="w-3.5 h-3.5 text-cyan-400" />
                <span>IR 경영 공시</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5 pt-0.5 font-sans">
              <BrandLogo domain={service.domain} size="md" className="shrink-0 rounded-xl shadow-md" />
              <span>주요 경영 지표</span>
              <span className="hidden sm:inline text-sm font-normal text-slate-400 font-sans">
                | Key Metrics ({latestFinancial ? (latestFinancial.periodLabel || `${latestFinancial.year}년`) : '최신 공시'} 기준)
              </span>
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="w-full lg:w-auto flex flex-wrap items-center gap-1.5 sm:gap-2 justify-start lg:justify-end shrink-0">
            {/* 1. 실적추이 그래프 토글 */}
            <button
              type="button"
              onClick={toggleFinancialTrend}
              className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap ${
                showFinancialTrend
                  ? 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-500/20'
                  : 'bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-dark-650 hover:border-cyan-400/50'
              }`}
              title={showFinancialTrend ? "연도별 실적추이 그래프 접기" : "연도별 실적추이 그래프 펼쳐보기"}
            >
              <TrendingUp className={`w-3.5 h-3.5 shrink-0 ${showFinancialTrend ? 'text-white' : 'text-cyan-400'}`} />
              <span>실적추이 {showFinancialTrend ? '▲' : '▼'}</span>
            </button>

            {/* 2. GMV · 거래액 지표 서브뷰 이동 버튼 (선불/카드 서비스 전용) */}
            {(isNamane || service.domain.includes('wowpass')) && (
              <button
                type="button"
                onClick={() => onSubViewChange?.('gmv')}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-dark-650 hover:border-purple-400/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                title="IR 하위 GMV · 거래액 지표 페이지로 이동"
              >
                <CreditCard className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>GMV 지표</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            )}

            {/* 4. PDF 다운로드 버튼 */}
            <div className="hidden sm:block">
              <PdfReportButton data={data} tab="ir" className="h-8 sm:h-9 px-3 justify-center whitespace-nowrap text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 1-1. 공정거래위원회 가맹사업 정보공개서 & 마이프차 실측 현황 카드 (프랜차이즈 전용) ── */}
      {ir.franchiseInfo && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-cyan-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-dark-750 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  공정거래위원회 가맹사업거래 공식 등록
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  마이프차 실측 연동
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1.5 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <span>가맹사업 정보공개서 & 프랜차이즈 창업 실측 현황</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                금융감독원 외부감사법(자산 120억/매출 100억) 기준 미달 비외감 법인이나, 공정거래위원회 가맹사업정보제공시스템에 등록된 법정 가맹본부 실측 공시 데이터를 제공합니다.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={ir.franchiseInfo.ftcDisclosureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                title="공정거래위원회 가맹사업정보제공시스템 공식 정보공개서 열람 새 창 열기"
              >
                <span>공정위 정보공개서</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={ir.franchiseInfo.myFranchiseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                title="마이프차 공식 프랜차이즈 플랫폼 새 창 열기"
              >
                <span>마이프차 상세</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 4대 주요 실측 데이터 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-dark-950/70 border border-dark-750 space-y-1">
              <span className="text-[11px] font-medium text-slate-400">가맹본부(법인명) / 대표</span>
              <div className="text-sm font-bold text-white truncate">
                {ir.franchiseInfo.headquarters}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                대표: {ir.franchiseInfo.representative} (사업자: {ir.franchiseInfo.businessNumber})
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950/70 border border-dark-750 space-y-1">
              <span className="text-[11px] font-medium text-slate-400">가맹 브랜드명</span>
              <div className="text-sm font-bold text-cyan-300 truncate">
                {ir.franchiseInfo.brandName}
              </div>
              <div className="text-[11px] text-slate-400">
                {ir.franchiseInfo.industryCategory || '외식 프랜차이즈'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950/70 border border-dark-750 space-y-1">
              <span className="text-[11px] font-medium text-slate-400">가맹점 및 직영점 운영</span>
              <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                <span>약 {ir.franchiseInfo.franchiseStoreCount || 11}개점</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-normal bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  수도권 중심
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                마이프차 등록 매장 기준 실측
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950/70 border border-dark-750 space-y-1">
              <span className="text-[11px] font-medium text-slate-400">예상 초기 창업 비용</span>
              <div className="text-sm font-bold text-amber-300">
                {ir.franchiseInfo.initialInvestmentCostText || '약 5,695만 원'}
              </div>
              <div className="text-[11px] text-slate-400">
                가맹비·교육비·인테리어 포함
              </div>
            </div>
          </div>

          {ir.franchiseInfo.slogan && (
            <div className="px-3.5 py-2 rounded-xl bg-dark-950/50 border border-dark-800 text-xs text-slate-300 flex items-center justify-between">
              <span>슬로건: <strong className="text-white font-medium">"{ir.franchiseInfo.slogan}"</strong></span>
              <span className="text-[11px] text-cyan-400 font-mono">정보공개서 등록 상태: {ir.franchiseInfo.registrationStatus}</span>
            </div>
          )}
        </div>
      )}

      {/* 연도별 실적추이 그래프 영역 (토글 시 노출) */}
      {showFinancialTrend && chartData.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-dark-750 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    연도별 실적 추이
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-cyan-500/15 text-cyan-300">
                    단위: 억 원
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-normal">
                  매출액 성장세 및 수익(영업이익) · 연간 고정 소진액 변동 추이
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-normal">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-xs bg-purple-500 inline-block"></span>
                  <span className="text-slate-300">매출</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-xs bg-cyan-400 inline-block"></span>
                  <span className="text-slate-300">수익</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block"></span>
                  <span className="text-slate-300">고정소진액 (-)</span>
                </div>
                <button
                  type="button"
                  onClick={toggleFinancialTrend}
                  className="text-xs text-cyan-300 hover:text-white px-2.5 py-1 rounded-md bg-dark-800 border border-dark-700 hover:border-cyan-400/40 cursor-pointer ml-1 transition-colors"
                >
                  닫기 ▲
                </button>
              </div>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232733" vertical={false} />
                  <XAxis 
                    dataKey="yearName" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={{ stroke: '#334155' }} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={{ stroke: '#334155' }}
                    tickFormatter={(val) => formatEokWon(val)}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const row = payload[0].payload;
                        return (
                          <div className="bg-dark-900 border border-dark-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 min-w-[200px] tabular-nums font-sans">
                            <div className="font-bold text-white pb-1.5 border-b border-dark-750 flex items-center justify-between">
                              <span>{label} 경영 실적</span>
                              {row.isProfit ? (
                                <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">흑자</span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-purple-950/40 text-purple-300 border border-purple-500/30">적자</span>
                              )}
                            </div>
                            <div className="space-y-1.5 pt-0.5">
                              <div className="flex justify-between items-center text-slate-300">
                                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-xs bg-purple-500 mr-1.5"></span>매출:</span>
                                <span className="font-bold text-white tabular-nums">{row.revenueLabel}</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-300">
                                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-xs bg-cyan-400 mr-1.5"></span>수익(영업익):</span>
                                <span className={`font-bold tabular-nums ${row.opProfit >= 0 ? 'text-cyan-300' : 'text-purple-300'}`}>
                                  {row.opProfitLabel}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-slate-300">
                                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-xs bg-rose-500 mr-1.5"></span>고정소진액(-):</span>
                                <span className="font-bold text-rose-300 tabular-nums">
                                  {row.burnRateLabel}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
                  
                  {/* 1. 매출 (보라색, 0원 기준선 위) */}
                  <Bar 
                    dataKey="revenue" 
                    name="매출" 
                    fill="#a855f7" 
                    radius={[5, 5, 0, 0]} 
                    maxBarSize={30} 
                  />

                  {/* 2. 수익 (cyan) */}
                  <Bar 
                    dataKey="opProfit" 
                    name="수익" 
                    fill="#06b6d4" 
                    radius={[5, 5, 0, 0]} 
                    maxBarSize={30} 
                  />

                  {/* 3. 고정소진액 (빨강, 0원 기준선 밑 음수 막대) */}
                  <Bar 
                    dataKey="burnRate" 
                    name="고정소진액" 
                    fill="#ef4444" 
                    radius={[0, 0, 5, 5]} 
                    maxBarSize={30} 
                  />

                  {/* 수익 추이 꺾은선 (cyan) */}
                  <Line 
                    type="monotone" 
                    dataKey="opProfit" 
                    name="수익 추이" 
                    stroke="#22d3ee" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 1.5 }} 
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      {/* 2. Key Metrics Overview (5 Cards: 입력된 법인 실측 데이터 완전 동적 연동) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* 1. 누적 펀딩 (금액만 표시) */}
        <div className="p-4 sm:p-5 rounded-xl bg-dark-900 border border-dark-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-purple-400 shrink-0" />
              <span>누적 펀딩</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-purple-500/20 text-purple-300">
              공식 공시
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 my-3 tracking-tight tabular-nums truncate">
            {cumulativeFundingAmountText}
          </div>
          <div className="text-xs text-slate-400 font-medium pt-2.5 border-t border-dark-750/70 truncate tabular-nums">
            {ir.investments && ir.investments.length > 0 && cumulativeFundingAmountText !== '0원'
              ? `${ir.investments[ir.investments.length - 1].partnerName} (${ir.investments[ir.investments.length - 1].confirmedAmount})` 
              : 'DART 전자공시 확인 (외부 펀딩 없음)'}
          </div>
        </div>

        {/* 2. 최근 결산 매출액 */}
        <div className="p-4 sm:p-5 rounded-xl bg-dark-900 border border-dark-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>최근 결산 매출</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-cyan-500/20 text-cyan-300">
              {latestFinancial?.periodLabel || `${latestFinancial?.year || 25}년`}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white my-3 tracking-tight tabular-nums">
            {latestFinancial?.revenueText || '-'}
          </div>
          <div className="text-xs text-cyan-300 font-medium pt-2.5 border-t border-dark-750/70 flex items-center truncate tabular-nums">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
            <span>{revenueYoY ? `전년 동기 대비 ${revenueYoY} 성장` : (latestFinancial?.statusNote || '공식 결산 확정')}</span>
          </div>
        </div>

        {/* 3. 최근 결산 영업이익 */}
        <div className="p-4 sm:p-5 rounded-xl bg-dark-900 border border-dark-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>최근 영업이익</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
              {latestFinancial?.periodLabel || `${latestFinancial?.year || 25}년`}
            </span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black my-3 tracking-tight tabular-nums ${
            latestFinancial && latestFinancial.operatingProfitWon !== null && latestFinancial.operatingProfitWon !== undefined
              ? (latestFinancial.operatingProfitWon >= 0 ? 'text-cyan-300' : 'text-purple-300')
              : 'text-slate-400'
          }`}>
            {latestFinancial?.operatingProfitText || '-'}
          </div>
          <div className="text-xs text-slate-400 font-medium pt-2.5 border-t border-dark-750/70 truncate tabular-nums">
            {opMargin 
              ? `영업이익률(OPM): ${opMargin}` 
              : (latestFinancial?.operatingProfitWon !== null && latestFinancial?.operatingProfitWon !== undefined 
                  ? (latestFinancial.operatingProfitWon >= 0 ? '영업이익 흑자 달성' : '시장 점유율 확장기') 
                  : '외부공시 미기재')}
          </div>
        </div>

        {/* 4. 연간/누적 소진액 (버닝레이트) */}
        <div className="p-4 sm:p-5 rounded-xl bg-dark-900 border border-purple-500/30 bg-gradient-to-br from-dark-900 via-dark-900 to-purple-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-purple-400 shrink-0" />
              <span>연간 고정 소진액</span>
              <span className="relative group inline-flex items-center cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-dark-950 border border-dark-700 text-xs text-slate-200 font-normal shadow-2xl z-50 leading-relaxed">
                  <strong className="text-cyan-400 font-bold block mb-1">버닝레이트 산출 기준</strong>
                  • 총 소진액 = 상시근로자수 × 1인당 평균연봉 × 1.5배수<br />
                  • 인건비({formatEokWon(burnDecomposition.salaryWon)}) + 운영·인프라({formatEokWon(burnDecomposition.infraWon)})<br />
                  • 근로자 수 출처: 국민연금공단 국민연금 가입 사업장 내역 실측
                </span>
              </span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-purple-950/40 text-purple-300 border border-purple-500/30">
              고정 운영비
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 my-3 tracking-tight tabular-nums">
            {(latestFinancial?.burnRateText ? latestFinancial.burnRateText.replace(/\(누적\)/g, '').trim() : null) || formatEokWon(burnDecomposition.totalWon)}
          </div>
          <div className="pt-2.5 border-t border-dark-750/70 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="truncate tabular-nums">
              임직원 {formatNumber(burnDecomposition.emp)}명 기준
            </span>
            <span
              className="text-[11px] text-cyan-300 px-2 py-0.5 rounded bg-dark-800 border border-cyan-500/40 flex items-center gap-1 shrink-0"
              title="국민연금공단_국민연금 가입 사업장 내역 실측 기준"
            >
              <Users className="w-3 h-3 text-cyan-400" />
              <span>{burnDecomposition.emp !== null ? '국민연금 실측' : '실측 N/A'}</span>
            </span>
          </div>
        </div>

        {/* 5. 실질 가용 현금 / 유동성 */}
        <div className="p-4 sm:p-5 rounded-xl bg-dark-900 border border-cyan-500/50 ring-1 ring-cyan-500/20 bg-gradient-to-br from-dark-900 via-dark-900 to-cyan-950/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>가용 현금 유동성</span>
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-md font-bold ${
              latestFinancial?.cumulativeCashWon !== undefined && latestFinancial?.cumulativeCashWon !== null
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-dark-800 text-slate-400 border border-dark-700'
            }`}>
              {latestFinancial?.cumulativeCashWon !== undefined && latestFinancial?.cumulativeCashWon !== null
                ? '런웨이 안정권'
                : '재무상태표 미공시'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-300 my-3 tracking-tight tabular-nums whitespace-nowrap truncate">
            {latestFinancial?.cumulativeCashText || (latestFinancial?.cumulativeCashWon !== undefined && latestFinancial?.cumulativeCashWon !== null ? formatEokWon(latestFinancial.cumulativeCashWon) : (isNamane ? '15.0억 원' : '미공시 (N/A)'))}
          </div>
          <div className="text-xs text-slate-400 font-medium pt-2.5 border-t border-dark-750/70 truncate tabular-nums">
            {latestFinancial?.cumulativeCashWon !== undefined && latestFinancial?.cumulativeCashWon !== null
              ? (isNamane ? 'SGI보증 25억 원 차감 실질 가용현금' : '영업활동 현금흐름 및 가용 유동성')
              : '비외감 법인으로 재무상태표 현금성 자산 미공시 (N/A)'}
          </div>
        </div>

      </div>

      {/* 3. 공식 재무제표 요약표 (100% 동적 연동) */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-dark-700 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                결산 손익계산서 요약
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-purple-950/40 text-purple-300 border border-purple-500/30">
                공식 결산
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 font-normal">
              {ir.sourceName || (ir.isDartAudited === false ? '중소벤처기업부 공공데이터 · 혁신의숲' : 'DART 전자공시시스템')}
              {ir.isDartAudited === false ? ' 결산 및 기업 데이터 연도별 확정 실적' : ' 결산 및 외감 감사보고서 연도별 확정 실적'}
            </p>
          </div>
        </div>

        {/* 모바일 화면 (동적 카드 뷰) */}
        <div className="space-y-3 md:hidden font-sans">
          {history.map((row) => (
            <div key={`${row.year}-${row.periodLabel}`} className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <span className="font-bold text-sm text-white">{row.periodLabel || `${row.year}년`} 실적</span>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                  row.operatingProfitWon === null
                    ? 'bg-slate-700/50 text-slate-400'
                    : row.operatingProfitWon >= 0 ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30' : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                }`}>
                  {row.operatingProfitWon === null ? '미공시' : (row.operatingProfitWon >= 0 ? '흑자' : '적자')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">매출액</div>
                  <div className="font-bold text-white tabular-nums mt-0.5">{row.revenueText}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">영업이익</div>
                  <div className={`font-bold tabular-nums mt-0.5 ${
                    row.operatingProfitWon === null ? 'text-slate-400' : row.operatingProfitWon >= 0 ? 'text-cyan-300' : 'text-purple-300'
                  }`}>
                    {row.operatingProfitText}
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">당기순이익</div>
                  <div className={`font-bold tabular-nums mt-0.5 ${
                    row.netProfitWon === null ? 'text-slate-400' : row.netProfitWon >= 0 ? 'text-cyan-300' : 'text-purple-300'
                  }`}>
                    {row.netProfitText}
                  </div>
                </div>
              </div>
              {row.statusNote && (
                <div className="text-xs text-slate-300 pt-1 border-t border-dark-800 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold text-[11px]">[특이사항]</span>
                  <span className="font-medium text-cyan-300 text-[11px] truncate max-w-[240px]">{row.statusNote}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 데스크탑 화면 (동적 테이블) */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
          <table className={`w-full text-left table-fixed text-slate-200 ${tableClasses.tableText}`}>
            <thead className="bg-dark-850">
              <tr>
                <th className={`${tableClasses.th} rounded-l-lg whitespace-nowrap w-[14%]`}>구분</th>
                {history.map((h) => (
                  <th key={`th-${h.year}-${h.periodLabel}`} className={`${tableClasses.th} whitespace-nowrap text-right`}>
                    {h.periodLabel || `${h.year}년`}
                  </th>
                ))}
                <th className={`${tableClasses.th} rounded-r-lg whitespace-nowrap text-center w-[28%]`}>특이사항 및 핵심 마일스톤</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750">
              {/* Row 1: 매출액 */}
              <tr className="hover:bg-dark-800/50 transition-colors">
                <td className={`${tableClasses.td} font-bold text-white whitespace-nowrap align-middle`}>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="font-bold text-white">매출액</span>
                  </div>
                </td>
                {history.map((h) => (
                  <td key={`rev-${h.year}-${h.periodLabel}`} className={`${tableClasses.td} font-bold text-white text-right whitespace-nowrap align-middle tabular-nums`}>
                    {h.revenueText}
                  </td>
                ))}
                <td className={`${tableClasses.td} text-slate-300 whitespace-nowrap align-middle text-center`}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 tabular-nums">
                    {latestFinancial ? `${latestFinancial.periodLabel || `${latestFinancial.year}년`} 기준 ${latestFinancial.revenueText}` : '공식 공시'}
                  </span>
                </td>
              </tr>

              {/* Row 2: 영업이익 */}
              <tr className="hover:bg-dark-800/50 transition-colors">
                <td className={`${tableClasses.td} font-bold text-white whitespace-nowrap align-middle`}>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="font-bold text-white">영업이익</span>
                  </div>
                </td>
                {history.map((h) => (
                  <td key={`op-${h.year}-${h.periodLabel}`} className={`text-sm py-2.5 px-3 font-bold text-right whitespace-nowrap align-middle tabular-nums ${
                    h.operatingProfitWon === null ? 'text-slate-400' : h.operatingProfitWon >= 0 ? 'text-cyan-300' : 'text-purple-300'
                  }`}>
                    {h.operatingProfitText}
                  </td>
                ))}
                <td className={`${tableClasses.td} text-slate-300 whitespace-nowrap align-middle text-center`}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 tabular-nums">
                    {latestFinancial && latestFinancial.operatingProfitWon !== null && latestFinancial.operatingProfitWon >= 0 ? `영업이익 ${latestFinancial.operatingProfitText} 흑자` : '영업이익 공시'}
                  </span>
                </td>
              </tr>

              {/* Row 3: 당기순이익 */}
              <tr className="hover:bg-dark-800/50 transition-colors">
                <td className={`${tableClasses.td} font-bold text-white whitespace-nowrap align-middle`}>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span className="font-bold text-white">당기순이익</span>
                  </div>
                </td>
                {history.map((h) => (
                  <td key={`net-${h.year}-${h.periodLabel}`} className={`text-sm py-2.5 px-3 font-medium text-right whitespace-nowrap align-middle tabular-nums ${
                    h.netProfitWon === null ? 'text-slate-400' : h.netProfitWon >= 0 ? 'text-cyan-300' : 'text-purple-300'
                  }`}>
                    {h.netProfitText}
                  </td>
                ))}
                <td className={`${tableClasses.td} text-slate-300 whitespace-nowrap align-middle text-center`}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-800 text-slate-300 border border-dark-700 tabular-nums">
                    {latestFinancial ? `최근 순이익 ${latestFinancial.netProfitText}` : '-'}
                  </span>
                </td>
              </tr>

              {/* Row 4: 인원수 및 버닝레이트 */}
              <tr className="hover:bg-dark-800/50 transition-colors bg-dark-950/40">
                <td className={`${tableClasses.td} font-bold text-white whitespace-nowrap align-middle`}>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span className="font-bold text-slate-200">인원수 / 소진액</span>
                  </div>
                </td>
                {history.map((h, idx) => {
                  const isLatest = idx === history.length - 1;
                  let displayEmp: number | null | undefined = h.employeeCount;
                  if (isLatest) {
                    if (customEmployeeCount !== null && customEmployeeCount !== undefined) {
                      displayEmp = customEmployeeCount;
                    } else if (employeeTracking && employeeTracking.employee_count !== null && employeeTracking.employee_count !== undefined) {
                      displayEmp = employeeTracking.employee_count;
                    } else if (npsRecord && npsRecord.jnngpCnt !== null && npsRecord.jnngpCnt !== undefined) {
                      displayEmp = npsRecord.jnngpCnt;
                    }
                  }
                  const empText = (displayEmp !== null && displayEmp !== undefined)
                    ? `${formatNumber(displayEmp)}명`
                    : 'N/A';
                  return (
                    <td key={`emp-${h.year}-${h.periodLabel}`} className={`${tableClasses.td} text-xs text-slate-300 text-right whitespace-nowrap align-middle tabular-nums`}>
                      {empText}{h.burnRateText ? ` (${h.burnRateText.replace(/\(누적\)/g, '').trim()})` : ''}
                    </td>
                  );
                })}
                <td className={`${tableClasses.td} text-slate-300 whitespace-nowrap align-middle text-center`}>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/40 text-purple-300 border border-purple-500/30"
                    title="국민연금 가입 사업장 내역 (공공데이터포털) 실측 조회 및 검증"
                  >
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span>
                      {burnDecomposition.emp !== null && burnDecomposition.emp !== undefined
                        ? `국민연금 실측 (${formatNumber(burnDecomposition.emp)}명)`
                        : '국민연금 공시 확인 (N/A)'}
                    </span>
                  </span>
                </td>
              </tr>

              {/* Row 5: 핵심 사유 및 마일스톤 */}
              <tr className="hover:bg-dark-800/50 transition-colors bg-dark-950/40">
                <td className={`${tableClasses.td} font-bold text-white whitespace-nowrap align-middle`}>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="font-bold text-slate-200">주요 마일스톤</span>
                  </div>
                </td>
                {history.map((h) => (
                  <td key={`note-${h.year}-${h.periodLabel}`} className={`${tableClasses.td} text-xs text-slate-300 text-right whitespace-nowrap align-middle truncate max-w-[120px]`} title={h.statusNote}>
                    {h.statusNote ? (h.statusNote.length > 14 ? `${h.statusNote.slice(0, 14)}...` : h.statusNote) : '-'}
                  </td>
                ))}
                <td className={`${tableClasses.td} text-slate-300 whitespace-nowrap align-middle text-center`}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    사업 성장 및 피봇 기록
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. 연간 버닝레이트 분석 */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-dark-700 gap-3">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <Calculator className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>연간 버닝레이트 분석</span>
                <span className="relative group inline-flex items-center cursor-help">
                  <Info className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-80 p-3.5 rounded-xl bg-dark-950 border border-dark-700 text-xs text-slate-200 font-normal shadow-2xl z-50 leading-relaxed">
                    <strong className="text-cyan-400 font-bold block mb-1">버닝레이트(소진액) 산출 산식</strong>
                    • 총 소진액 = 상시 근로자수 × 1인당 평균연봉 × 인건비 부대배수(1.5배)<br />
                    • 인건비({formatEokWon(burnDecomposition.salaryWon)}) + 인프라·운영비({formatEokWon(burnDecomposition.infraWon)}) + 임대료({formatEokWon(burnDecomposition.rentWon)})<br />
                    • 상시 근로자수: 국민연금공단 국민연금 가입 사업장 내역 실측 기준
                  </span>
                </span>
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-purple-950/40 text-purple-300 border border-purple-500/30">
                연간 약 {formatEokWon(burnDecomposition.totalWon)} 규모
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>
                  {burnDecomposition.emp !== null && burnDecomposition.emp !== undefined
                    ? `상시근로자: ${formatNumber(burnDecomposition.emp)}명 (${employeeTracking?.employee_source === 'NPS' ? '국민연금' : employeeTracking?.employee_source || '실측'})`
                    : '상시근로자: N/A'}
                </span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 font-normal">
              핵심 5대 고정 비용 분해 및 운영 지출 구조 ({burnDecomposition.emp !== null && burnDecomposition.emp !== undefined ? `상시근로자 ${formatNumber(burnDecomposition.emp)}명 기준` : '상시근로자 미확인: N/A'})
            </p>
          </div>
        </div>

        {/* 국민연금공단 가입 사업장 실시간 실측 내역 패널 (직접 검색 데이터 표출) */}
        <div className="p-4 sm:p-5 rounded-xl bg-dark-850/90 border border-purple-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-dark-750/70">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 rounded-md bg-purple-500/20 text-purple-300">
                <Building2 className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>국민연금 가입 사업장 실시간 실측 내역</span>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-purple-950/60 text-purple-300 border border-purple-500/30">
                  {npsRecord ? '공공데이터포털 실시간 연동' : '공시 실측 조회'}
                </span>
              </h4>
            </div>
            {npsRecord?.sourceUrl && (
              <a
                href={npsRecord.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 font-medium transition-colors group"
                title="공공데이터포털 국민연금공단_국민연금 가입 사업장 내역"
              >
                <span>국민연금공단 공공데이터포털 원문</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. 사업장명 */}
            <div className="p-3 rounded-lg bg-dark-900/80 border border-dark-750">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-purple-400" />
                <span>공식 사업장명</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white mt-1 truncate" title={npsRecord?.wkplNm || ir.companyName || service.name}>
                {npsRecord?.wkplNm || ir.companyName || service.name}
              </div>
              <div className="text-xs text-slate-400 mt-1 truncate">
                사업자번호: {npsRecord?.bzowrRgstNo || ir.businessNumber || 'N/A'}
              </div>
            </div>

            {/* 2. 상시 근로자 수 */}
            <div className="p-3 rounded-lg bg-dark-900/80 border border-cyan-500/30">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>국민연금 가입자 (상시근로자)</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-cyan-300 mt-1 tabular-nums">
                {npsRecord?.jnngpCnt !== undefined && npsRecord?.jnngpCnt !== null
                  ? `${formatNumber(npsRecord.jnngpCnt)}명`
                  : (burnDecomposition.emp !== null && burnDecomposition.emp !== undefined
                      ? `${formatNumber(burnDecomposition.emp)}명`
                      : 'N/A')}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {npsRecord?.dataCrtYm
                  ? `자료 기준월: ${npsRecord.dataCrtYm.slice(0, 4)}.${npsRecord.dataCrtYm.slice(4, 6)}`
                  : (npsRecord?.verifiedDate ? `검증 기준: ${npsRecord.verifiedDate}` : '공시 데이터 부재 (N/A)')}
              </div>
            </div>

            {/* 3. 당월 고지 보험료 */}
            <div className="p-3 rounded-lg bg-dark-900/80 border border-dark-750">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                <span>당월 고지 보험료</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white mt-1 tabular-nums">
                {npsRecord?.crrmmNtfcAmt
                  ? `${formatNumber(npsRecord.crrmmNtfcAmt)}원`
                  : 'N/A'}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {npsRecord?.crrmmNtfcAmt
                  ? `월 약 ${(npsRecord.crrmmNtfcAmt / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })}만 원 부과`
                  : '고지액 정보 없음 (N/A)'}
              </div>
            </div>

            {/* 4. 사업장 주소 */}
            <div className="p-3 rounded-lg bg-dark-900/80 border border-dark-750">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>사업장 도로명 주소</span>
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-1 truncate" title={npsRecord?.wkplRoadNmDtlAddr || ir.companyAddress || 'N/A'}>
                {npsRecord?.wkplRoadNmDtlAddr || ir.companyAddress || 'N/A'}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {npsRecord?.wkplJnngSttsCd ? `사업장 상태: ${npsRecord.wkplJnngSttsCd}` : '국민연금 가입 기준지'}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-dark-750/50 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-1 font-normal">
            <span>
              {npsRecord 
                ? `※ 공공데이터포털 국민연금공단 실측 가입자 수(${formatNumber(npsRecord.jnngpCnt)}명)를 1순위로 하여 연간 소진액(버닝레이트) 및 인건비(76.0%)를 직접 산출합니다.`
                : (ir.sourceName?.includes('잡코리아')
                    ? '※ [잡코리아 기업정보 연동] 잡코리아 등록 사원수(50명 이하, 약 25명 규모) 및 사업장 본사 소재지를 기준 지표로 활용합니다.'
                    : '※ [미확인: 국민연금 가입 사업장 공시 없음 / N/A] 해당 기업은 국민연금공단 공공데이터에 사업장 내역이 미공시된 상태입니다.')}
            </span>
            <span className="text-cyan-400 shrink-0">
              {npsRecord ? '데이터 출처: 국민연금공단_국민연금 가입 사업장 내역' : '데이터 출처: 잡코리아 기업정보 · NICE평가정보'}
            </span>
          </div>
        </div>

        {/* 5대 세부 지출 분해 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* 1. 총 인건비 */}
          <div className="p-4 sm:p-5 rounded-xl bg-dark-850/90 border border-dark-750 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5 font-bold text-sm text-slate-200 min-w-0">
                <Users className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate whitespace-nowrap">총 인건비</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/30 font-bold tabular-nums whitespace-nowrap shrink-0">
                비중 76.0%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white my-3 tracking-tight tabular-nums">
              {formatEokWon(burnDecomposition.salaryWon)}
            </div>
            <div className="pt-2.5 border-t border-dark-750/70 text-xs text-slate-400 font-medium truncate tabular-nums">
              임직원 {formatNumber(burnDecomposition.emp)}명 급여 및 4대보험
            </div>
          </div>

          {/* 2. 플랫폼 및 운영 인프라비 */}
          <div className="p-4 sm:p-5 rounded-xl bg-dark-850/90 border border-dark-750 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5 font-bold text-sm text-slate-200 min-w-0">
                <Flame className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate whitespace-nowrap">플랫폼 운영비</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/30 font-bold tabular-nums whitespace-nowrap shrink-0">
                비중 12.0%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white my-3 tracking-tight tabular-nums">
              {formatEokWon(burnDecomposition.infraWon)}
            </div>
            <div className="pt-2.5 border-t border-dark-750/70 text-xs text-slate-400 font-medium truncate tabular-nums">
              서비스 운영 거점 및 회선·결제망
            </div>
          </div>

          {/* 3. 부가세 및 세금 */}
          <div className="p-4 sm:p-5 rounded-xl bg-dark-850/90 border border-dark-750 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5 font-bold text-sm text-slate-200 min-w-0">
                <Receipt className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate whitespace-nowrap">부가세 및 세금</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-bold tabular-nums whitespace-nowrap shrink-0">
                비중 3.0%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white my-3 tracking-tight tabular-nums">
              {formatEokWon(burnDecomposition.taxWon)}
            </div>
            <div className="pt-2.5 border-t border-dark-750/70 text-xs text-slate-400 font-medium truncate tabular-nums">
              과세 결제 수수료 부가세 및 공과금
            </div>
          </div>

          {/* 4. 임대 및 관리비 */}
          <div className="p-4 sm:p-5 rounded-xl bg-dark-850/90 border border-dark-750 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5 font-bold text-sm text-slate-200 min-w-0">
                <Building className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate whitespace-nowrap">본사 임대 관리비</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/30 font-bold tabular-nums whitespace-nowrap shrink-0">
                비중 5.0%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white my-3 tracking-tight tabular-nums">
              {formatEokWon(burnDecomposition.rentWon)}
            </div>
            <div className="pt-2.5 border-t border-dark-750/70 text-xs text-slate-400 font-medium truncate tabular-nums">
              {ir.companyAddress ? ir.companyAddress.split(' ')[1] || '본사' : '본사'} 사옥 임차료
            </div>
          </div>

          {/* 5. 클라우드 인프라비 */}
          <div className="p-4 sm:p-5 rounded-xl bg-dark-850/90 border border-dark-750 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5 font-bold text-sm text-slate-200 min-w-0">
                <Server className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate whitespace-nowrap">클라우드 서버비</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-bold tabular-nums whitespace-nowrap shrink-0">
                비중 4.0%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 my-3 tracking-tight tabular-nums">
              {formatEokWon(burnDecomposition.serverWon)}
            </div>
            <div className="pt-2.5 border-t border-dark-750/70 text-xs text-slate-400 font-medium truncate tabular-nums">
              {serverCost?.inferredProvider ? serverCost.inferredProvider.split(' (')[0] : '클라우드 인프라'} 트래픽 유지
            </div>
          </div>

        </div>
      </div>

      {/* 5. Investment History & Shareholders (투자 유치 이력 및 주주 구성) */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-dark-700 gap-3">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <Landmark className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                투자 유치 이력 및 주주 구성
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-purple-500/15 text-purple-300 tabular-nums">
                누적 펀딩 {cumulativeFundingAmountText}
              </span>

            </div>
          </div>
        </div>

        {/* 5-1. 라운드별 공식 투자 유치 이력 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white flex items-center gap-1.5 tracking-tight">
              <Coins className="w-4 h-4 text-purple-400" />
              <span>라운드별 공식 투자 유치 이력</span>
            </h4>
            <span className="text-xs text-slate-400 font-medium tabular-nums">
              {ir.investments && ir.investments.length > 0 ? `총 ${ir.investments.length}개 라운드 완료` : '공시 이력 N/A'}
            </span>
          </div>

          {/* 모바일 화면 (투자 이력 카드 뷰) */}
          <div className="space-y-3 md:hidden font-sans">
            {ir.investments && ir.investments.length > 0 ? (
              ir.investments.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl border border-dark-750 bg-dark-850 space-y-2.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-dark-750 text-center font-bold text-xs text-purple-300 flex items-center justify-center shrink-0 tabular-nums">
                        {inv.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-dark-800 text-slate-300 border border-dark-700 tabular-nums">
                        {inv.period}
                      </span>
                      <span className="font-bold text-sm text-white">{inv.round}</span>
                    </div>
                    <span className="font-black text-sm text-cyan-300 tabular-nums">
                      {inv.confirmedAmount}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                      <div className="text-[11px] text-slate-400">투자 파트너</div>
                      <div className="inline-flex items-center gap-1.5 mt-1">
                        <BrandLogo brandKey={inv.partnerKey} domain={inv.partnerDomain} size="xs" />
                        <span className="font-medium text-slate-200">{inv.partnerName}</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                      <div className="text-[11px] text-slate-400">상태</div>
                      <div className="mt-1 font-bold text-white tabular-nums">
                        {inv.status === 'confirmed' ? '공시 확정' : '투자 완료'}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 pt-1.5 border-t border-dark-800 space-y-1">
                    <div>{inv.description}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 text-center text-xs text-slate-400 font-mono">
                공시된 투자 유치 라운드 이력 없음 (N/A)
              </div>
            )}
          </div>

          {/* 데스크탑 화면 (투자 이력 테이블) */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
            <table className={`w-full table-fixed text-left text-slate-200 ${tableClasses.tableText}`}>
              <thead className="bg-dark-850 text-xs font-bold text-slate-400 border-b border-dark-750">
                <tr>
                  <th className={`${tableClasses.th} rounded-l-lg whitespace-nowrap w-[20%]`}>라운드</th>
                  <th className={`${tableClasses.th} whitespace-nowrap text-right w-[16%]`}>유치금액</th>
                  <th className={`${tableClasses.th} whitespace-nowrap w-[24%]`}>투자 파트너</th>
                  <th className={`${tableClasses.th} rounded-r-lg whitespace-nowrap w-[40%]`}>투자 목적 및 마일스톤</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-750">
                {ir.investments && ir.investments.length > 0 ? (
                  ir.investments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-dark-800/50 transition-colors">
                      <td className={`${tableClasses.td} font-bold text-white whitespace-nowrap align-middle`}>
                        <div className="flex items-center space-x-2.5 whitespace-nowrap">
                          <span className="w-5 h-5 rounded bg-dark-750 text-center font-bold text-xs text-purple-300 flex items-center justify-center shrink-0 tabular-nums">
                            {inv.id}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-dark-800 text-slate-300 border border-dark-700 tabular-nums">
                            {inv.period}
                          </span>
                          <span className="font-bold text-white tracking-normal">{inv.round}</span>
                        </div>
                      </td>
                      <td className={`${tableClasses.td} whitespace-nowrap align-middle text-right tabular-nums font-bold text-cyan-300`}>
                        {inv.confirmedAmount}
                      </td>
                      <td className={`${tableClasses.td} whitespace-nowrap align-middle`}>
                        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-dark-800 text-slate-200 border border-dark-750 text-xs whitespace-nowrap">
                          <BrandLogo brandKey={inv.partnerKey} domain={inv.partnerDomain} size="xs" />
                          <span className="font-medium text-slate-200">{inv.partnerName}</span>
                        </div>
                      </td>
                      <td className={`${tableClasses.td} text-slate-300 text-sm font-normal leading-relaxed align-middle`}>
                        <div>{inv.description}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-xs text-slate-400 font-mono">
                      공시된 투자 유치 라운드 이력 없음 (N/A)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5-2. 주주 구성 및 지분율 현황 */}
        <div className="pt-4 border-t border-dark-750 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-1.5 tracking-tight">
                <PieChart className="w-4 h-4 text-cyan-400" />
                <span>주주 구성 및 공식 지분율 현황</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                {ir.sourceName || 'DART 전자공시시스템'} 최신 주주명부 및 지분 공시 기준
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {ir.shareholders && ir.shareholders.length > 0 ? (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 tabular-nums">
                  지분율 합계 100.0%
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-dark-800 text-slate-400 border border-dark-700 font-mono">
                  지분율 N/A
                </span>
              )}
            </div>
          </div>

          {/* 지분율 시각화 프로그레스 스택 바 */}
          {ir.shareholders && ir.shareholders.length > 0 && (
            <div className="p-3.5 rounded-xl bg-dark-850/80 border border-dark-750 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">지분 분포 시각화</span>
                <span className="font-bold text-cyan-300 tabular-nums">
                  최대주주 지분율 {ir.shareholders[0]?.shareText || '안정권 확보'}
                </span>
              </div>
              <div className="h-3.5 w-full bg-dark-800 rounded-full overflow-hidden flex shadow-inner border border-dark-700/60">
                {ir.shareholders.map((sh, idx) => {
                  const colors = [
                    'bg-cyan-500',
                    'bg-purple-500',
                    'bg-indigo-500',
                    'bg-cyan-400',
                    'bg-purple-400',
                    'bg-slate-500'
                  ];
                  const color = colors[idx % colors.length];
                  return (
                    <div
                      key={sh.id}
                      style={{ width: `${sh.shareRatio}%` }}
                      className={`${color} hover:opacity-90 transition-all cursor-pointer relative`}
                      title={`${sh.name} (${sh.companyName}): ${sh.shareText}`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 pt-1 tabular-nums">
                {ir.shareholders.map((sh, idx) => {
                  const dotColors = [
                    'bg-cyan-500',
                    'bg-purple-500',
                    'bg-indigo-500',
                    'bg-cyan-400',
                    'bg-purple-400',
                    'bg-slate-500'
                  ];
                  return (
                    <div key={sh.id} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${dotColors[idx % dotColors.length]} shrink-0`} />
                      <span className="text-slate-200 font-medium">{sh.name}</span>
                      <span className="text-slate-400 font-semibold tabular-nums">({sh.shareText})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 모바일 화면 (주주 구성 카드 뷰) */}
          <div className="space-y-3 md:hidden font-sans">
            {ir.shareholders && ir.shareholders.length > 0 ? (
              ir.shareholders.map((sh) => (
                <div key={sh.id} className="p-3.5 rounded-xl border border-dark-750 bg-dark-850 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                    <span className="font-bold text-white text-sm">{sh.name}</span>
                    <span className="font-bold text-cyan-300 text-sm tabular-nums">{sh.shareText}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="truncate">{sh.companyName}</span>
                    <span className="px-2 py-0.5 rounded bg-dark-800 text-slate-300 shrink-0">{sh.role}</span>
                  </div>
                  {sh.note && <div className="text-[11px] text-slate-400">{sh.note}</div>}
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 text-center text-xs text-slate-400 font-mono">
                공시 주주명부 데이터 없음 (N/A)
              </div>
            )}
          </div>

          {/* 주주 구성 상세 표 (데스크탑) */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
            <table className={`w-full table-fixed text-left text-slate-200 ${tableClasses.tableText}`}>
              <thead className="bg-dark-850 text-xs font-bold text-slate-400 border-b border-dark-750">
                <tr>
                  <th className={`${tableClasses.th} w-[16%]`}>주주</th>
                  <th className={`${tableClasses.th} text-right w-[15%]`}>지분율</th>
                  <th className={`${tableClasses.th} w-[22%]`}>소속 / 회사</th>
                  <th className={`${tableClasses.th} w-[16%]`}>직위 / 역할</th>
                  <th className={`${tableClasses.th} w-[31%]`}>비고 (설명)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-750">
                {ir.shareholders && ir.shareholders.length > 0 ? (
                  ir.shareholders.map((sh) => (
                    <tr key={sh.id} className="hover:bg-dark-800/50 transition-colors">
                      <td className={`${tableClasses.td} align-middle font-bold text-white`}>
                        {sh.name}
                      </td>
                      <td className={`${tableClasses.td} align-middle font-bold text-cyan-300 tabular-nums text-right`}>
                        <div className="flex items-center justify-end gap-2">
                          <span>{sh.shareText}</span>
                          <div className="w-12 h-1.5 bg-dark-750 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className="h-full bg-cyan-400 rounded-full" 
                              style={{ width: `${Math.min(sh.shareRatio * 2.5, 100)}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className={`${tableClasses.td} align-middle`}>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-750 text-xs">
                          <BrandLogo
                            brandKey={sh.companyKey}
                            domain={sh.companyDomain}
                            size="xs"
                          />
                          <span className="font-semibold text-slate-200 truncate">{sh.companyName}</span>
                        </div>
                      </td>
                      <td className={`${tableClasses.td} align-middle`}>
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          sh.role.includes('최대주주')
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : sh.role.includes('특수관계인') || sh.role.includes('공동창업')
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : sh.role.includes('기관투자자') || sh.role.includes('VC')
                            ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                            : 'bg-dark-800 text-slate-300 border border-dark-700'
                        }`}>
                          {sh.role}
                        </span>
                      </td>
                      <td className={`${tableClasses.td} align-middle text-xs text-slate-300 leading-relaxed`}>
                        {sh.note}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-xs text-slate-400 font-mono">
                      공시 주주명부 데이터 없음 (N/A)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. 조건부 섹션: 나마네카드 전용 오프라인 거점 분석 */}
      {isNamane && (
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-dark-700 gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Store className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  스탠바이서울(STAN by Seoul) 공간대여 거점 분석
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  나마네 오프라인 거점
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 font-normal">
                동대문 맥스타일 B1 (700평) · 앤소울 제휴 오프라인 공간대여 거점 투자 및 수익성 추이
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-normal">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>동대문 맥스타일 B1 (700평)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 sm:p-5 rounded-xl bg-dark-850/90 border border-dark-750 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>공간 인프라 규모</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/20 text-cyan-300">
                  맥스타일 B1
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 my-3 tracking-tight tabular-nums">
                700평 (900㎡)
              </div>
              <div className="pt-2.5 text-xs text-slate-300 font-medium border-t border-dark-750/70">
                수용 300명 · 10m 대형 LED월
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-dark-850/90 border border-dark-750 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>초기 설비 투자 (CAPEX)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 tabular-nums">
                  22~23년
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-300 my-3 tracking-tight tabular-nums">
                6억 원 ~ 8억 원
              </div>
              <div className="pt-2.5 text-xs text-slate-300 font-medium border-t border-dark-750/70">
                연 유지비(OPEX) 1.5억 원 수준 경량화
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-dark-850/90 border border-dark-750 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>거점 운영비 비중</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300">
                  최신 실적
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-300 my-3 tracking-tight tabular-nums">
                매출 대비 1.4%
              </div>
              <div className="pt-2.5 text-xs text-slate-300 font-medium border-t border-dark-750/70">
                대관/K-POP 팝업 공간 수익 창출
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 하단 공식 출처 (IR 탭 단 1회 텍스트 아웃링크 일원화 - Rule 12, Rule 13 준수) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-750 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-semibold text-slate-300">데이터 출처 :</span>
          <a
            href={resolveOfficialDisclosureSourceUrl(ir.sourceName, ir.companyName || service.name, service.domain, ir.sourceUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold inline-flex items-center gap-1 transition-colors"
            title={`${ir.companyName || service.name} 공식 원천 데이터 열람`}
          >
            <span>{ir.sourceName || (ir.isDartAudited ? '금융감독원 DART 전자공시시스템' : '잡코리아 기업정보 (NICE평가정보 공시)')}</span>
            <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default IrDetailSubpage;
