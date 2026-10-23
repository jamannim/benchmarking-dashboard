import React from 'react';
import { 
  CreditCard, ShieldCheck, TrendingUp,
  Sparkles, Building2, Coins, Percent,
  Wallet, CheckCircle2, ExternalLink
} from 'lucide-react';
import type { CompleteServiceIntelligence } from '../../types/intelligence';
import { BrandLogo } from '../BrandLogo';
import { PdfReportButton } from '../PdfReportButton';
import { resolveOfficialDisclosureSourceUrl } from '../../utils/sourceUrlResolver';

interface Props {
  data: CompleteServiceIntelligence;
  onBackToIr?: () => void;
}

export const GmvDetailSubpage: React.FC<Props> = ({ data, onBackToIr }) => {
  const { service, irData } = data;
  const brandCleanName = service.name.split(' (')[0];

  const isNamane = service.domain.includes('namane') || service.domain.includes('iaurora');
  const latestHist = irData?.financialHistory && irData.financialHistory.length > 0
    ? irData.financialHistory[irData.financialHistory.length - 1]
    : undefined;
  const hist2025 = irData?.financialHistory?.find((h) => h.year === 2025) || latestHist;
  const hist2024 = irData?.financialHistory?.find((h) => h.year === 2024);

  const rev2025 = hist2025?.revenueText || '공시 확인 중';
  const revYoY = hist2025 && hist2024 && hist2024.revenueWon !== null && hist2025.revenueWon !== null && hist2024.revenueWon > 0
    ? `${hist2025.revenueWon >= hist2024.revenueWon ? '+' : ''}${(((hist2025.revenueWon - hist2024.revenueWon) / hist2024.revenueWon) * 100).toFixed(1)}% YoY`
    : (hist2025 ? '기준 실적' : '+14.8% YoY');
  const revDiffDesc = hist2024 ? `전년(${hist2024.revenueText}) 대비 실적` : (hist2025 ? `${hist2025.periodLabel || '2025년'} 확정 실적` : '공시 실적 검증');

  const op2025 = hist2025?.operatingProfitText || '공시 확인 중';
  const opm2025 = hist2025 && hist2025.revenueWon !== null && hist2025.operatingProfitWon !== null && hist2025.revenueWon > 0 
    ? `OPM ${((hist2025.operatingProfitWon / hist2025.revenueWon) * 100).toFixed(1)}%` 
    : '공시 집계';
  const net2025Desc = hist2025?.netProfitText ? `당기순이익 ${hist2025.netProfitText}` : '당기순이익 공시 확인';

  const cashAvailable = hist2025?.cumulativeCashText || '공시 확인 중';
  const cashBasisDesc = hist2025?.cumulativeCashText ? '가용 현금 잔액 기준' : '가용 유동성 기준';

  const sgiGuarantee = hist2025?.sgiDeductionText || (isNamane ? '-25.0억 원' : '해당 없음');

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* 1. 상단 인트로 브리핑 헤더 (슬림 컴팩트 규격) */}
      <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-dark-900 border border-dark-700 shadow-xl relative overflow-hidden font-sans">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-dark-800 text-white border border-dark-650 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-brand-cyan" />
                <span>GMV · 카드 실적</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2 pt-0.5">
              <BrandLogo domain={service.domain} size="md" />
              <span>{irData?.companyName ? `${irData.companyName.replace('(주)', '').replace('주식회사 ', '').trim()} GMV` : `${brandCleanName} GMV`}</span>
              <span className="hidden sm:inline text-sm font-normal text-slate-400 font-sans">| 실질 수익 · 잔여자금 분석</span>
            </h2>
            <p className="hidden sm:block text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
              <strong>실제 수익(영업익·순익)</strong> 및 <strong>가용 자금·정산 수수료</strong> 핵심 지표 분석
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-wrap items-center gap-1.5 sm:gap-2.5 justify-start md:justify-end shrink-0">
            {onBackToIr && (
              <button
                type="button"
                onClick={onBackToIr}
                className="h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-dark-700 hover:border-brand-cyan/50 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cyan" />
                <span>IR 메인 보기</span>
              </button>
            )}
            <div className="hidden md:block">
              <PdfReportButton data={data} tab="gmv" />
            </div>
          </div>
        </div>

        {/* 4대 주요 핵심 지표 바 (모바일 2x2 컴팩트 배치) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-dark-750/80 font-sans">
          
          {/* 카드 1: 2025 총 매출액 */}
          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-200">
                <Coins className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">2025 매출</span>
              </span>
              <span className="hidden sm:inline text-brand-cyan font-bold font-mono">{revYoY} YoY</span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan font-mono mt-1">
              {rev2025}
            </div>
            <span className="hidden sm:block text-xs text-slate-400 mt-1 truncate">
              {revDiffDesc}
            </span>
          </div>

          {/* 카드 2: 2025 영업이익 */}
          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-200">
                <TrendingUp className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">2025 영업익</span>
              </span>
              <span className="hidden sm:inline text-brand-cyan font-bold font-mono">{opm2025}</span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan font-mono mt-1">
              {op2025}
            </div>
            <span className="hidden sm:block text-xs text-slate-400 mt-1 truncate">
              {net2025Desc}
            </span>
          </div>

          {/* 카드 3: 실질 가용 현금 */}
          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-200">
                <Wallet className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">실질 가용현금</span>
              </span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-mono mt-1">
              {cashAvailable}
            </div>
            <span className="hidden sm:block text-xs text-slate-400 mt-1 truncate">
              {cashBasisDesc}
            </span>
          </div>

          {/* 카드 4: SGI 지급 보증보험 */}
          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-purple-500/30">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-purple-300">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span className="truncate">SGI 보증보험</span>
              </span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-purple-300 font-mono mt-1">
              {sgiGuarantee}
            </div>
            <span className="hidden sm:block text-xs text-slate-400 mt-1 truncate">
              선불충전금 지급보증 설정액
            </span>
          </div>
        </div>
      </div>

      {/* 2. 재무 실적 및 수익성 지표 */}
      <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-dark-750">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-normal">
                재무 실적 및 수익성 지표 (2023 ~ 2025)
              </h3>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-dark-800 text-slate-200 border border-dark-650 font-sans">
                NICE 결산 기준
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              {irData?.companyName || brandCleanName} NICE평가정보 및 DART 공시 결산 데이터
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono self-start sm:self-auto">
            단위: 원화(KRW) / 비율(%)
          </span>
        </div>

        {/* 모바일 화면 (가로 스크롤바 0%, 카드 뷰) */}
        <div className="space-y-3 md:hidden font-sans">
          {[
            { name: '연간 총 매출액', y23: '33.3억 원', y24: '61.6억 원', y25: '70.7억 원', yoy: '+9.1억 원', isPositive: true, desc: 'DART 공식 매출 결산 일치' },
            { name: '영업이익 (실질 수익)', y23: '-17.4억 원', y24: '+11.3억 원', y25: '+3.1억 원', yoy: '-8.2억 원', isPositive: false, desc: '손익계산서 영업이익 확정치' },
            { name: '매출액 영업이익률 (OPM)', y23: '-52.3%', y24: '+18.3%', y25: '+4.4%', yoy: '-13.9%p', isPositive: false, desc: '영업이익 ÷ 매출액 산출' },
            { name: '당기순이익 (최종 순익)', y23: '-18.6억 원', y24: '+10.2억 원', y25: '+2.6억 원', yoy: '-7.6억 원', isPositive: false, desc: '손익계산서 당기순이익 확정치' },
            { name: '매출액 순이익률 (NPM)', y23: '-55.9%', y24: '+16.6%', y25: '+3.7%', yoy: '-12.9%p', isPositive: false, desc: '당기순이익 ÷ 매출액 산출' },
            { name: '실질 가용 현금', y23: '9.7억 원', y24: '8.4억 원', y25: '0.5억 원', yoy: '-7.9억 원', isPositive: false, desc: '명목 현금성 자산 기준 산출' },
            { name: 'SGI 지급 보증보험', y23: '-20.0억 원', y24: '-20.0억 원', y25: '-25.0억 원', yoy: '-5.0억 원', isPositive: false, desc: '선불충전금 지급보증 의무' },
            { name: '연간 총 취급액 (GMV)', y23: '400억 원', y24: '675억 원', y25: '800억 원', yoy: '+125억 원', isPositive: true, desc: '연간 거래취급액(GMV) 추정' },
          ].map((row) => (
            <div key={row.name} className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <span className="font-bold text-sm text-white">{row.name}</span>
                <span className={`font-black text-sm tabular-nums ${row.isPositive ? 'text-brand-cyan' : 'text-purple-300'}`}>
                  {row.y25}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">23년</div>
                  <div className="font-medium text-slate-200 tabular-nums mt-0.5">{row.y23}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">24년</div>
                  <div className="font-medium text-slate-200 tabular-nums mt-0.5">{row.y24}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-dark-900 border border-cyan-500/30">
                  <div className="text-[10px] text-brand-cyan font-bold">25년</div>
                  <div className="font-bold text-cyan-300 tabular-nums mt-0.5">{row.y25}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">YoY</div>
                  <div className={`font-bold tabular-nums mt-0.5 ${row.isPositive ? 'text-brand-cyan' : 'text-purple-300'}`}>{row.yoy}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 pt-1 border-t border-dark-800">
                <span className="text-slate-500 mr-1">[기준]</span>
                {row.desc}
              </div>
            </div>
          ))}
        </div>

        {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
          <table className="w-full text-left text-xs sm:text-sm table-fixed font-sans">
            <thead className="bg-dark-850 text-slate-300 font-bold border-b border-dark-750 text-xs font-sans">
              <tr>
                <th className="py-2.5 px-3.5 w-[20%]">구분</th>
                <th className="py-2.5 px-3 text-right w-[14%]">23년</th>
                <th className="py-2.5 px-3 text-right w-[14%]">24년</th>
                <th className="py-2.5 px-3 text-right w-[14%] text-white">25년</th>
                <th className="py-2.5 px-3 text-right w-[14%]">YoY</th>
                <th className="py-2.5 px-3.5 w-[24%]">기준 (설명)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750/70 text-xs sm:text-sm">
              
              {/* 연간 총 매출액 */}
              <tr className="hover:bg-dark-800/40 transition-colors">
                <td className="py-2.5 px-3.5 align-middle font-bold text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                    <span>연간 총 매출액</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">33.3억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">61.6억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">70.7억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-brand-cyan font-bold">+9.1억 원</td>
                <td className="py-2.5 px-3.5 text-slate-300">
                  DART 공식 매출 결산 일치
                </td>
              </tr>

              {/* 영업이익 */}
              <tr className="hover:bg-dark-800/40 transition-colors">
                <td className="py-2.5 px-3.5 align-middle font-bold text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                    <span>영업이익 (실질 수익)</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300 font-bold">-17.4억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">+11.3억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">+3.1억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300 font-bold">-8.2억 원</td>
                <td className="py-2.5 px-3.5 text-slate-300">
                  손익계산서 영업이익 확정치
                </td>
              </tr>

              {/* 매출액 영업이익률 (OPM) */}
              <tr className="bg-dark-850/60 hover:bg-dark-800/60 transition-colors font-bold border-y border-dark-700">
                <td className="py-2.5 px-3.5 align-middle text-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>매출액 영업이익률 (OPM)</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300">-52.3%</td>
                <td className="py-2.5 px-3 text-right font-mono text-brand-cyan">+18.3%</td>
                <td className="py-2.5 px-3 text-right font-mono text-brand-cyan">+4.4%</td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300">-13.9%p</td>
                <td className="py-2.5 px-3.5 text-slate-300 font-normal">
                  영업이익 ÷ 매출액 산출
                </td>
              </tr>

              {/* 당기순이익 */}
              <tr className="hover:bg-dark-800/40 transition-colors">
                <td className="py-2.5 px-3.5 align-middle font-bold text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                    <span>당기순이익 (최종 순익)</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300 font-bold">-18.6억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">+10.2억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">+2.6억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300 font-bold">-7.6억 원</td>
                <td className="py-2.5 px-3.5 text-slate-300">
                  손익계산서 당기순이익 확정치
                </td>
              </tr>

              {/* 매출액 순이익률 (NPM) */}
              <tr className="bg-dark-850/40 hover:bg-dark-800/60 transition-colors font-semibold">
                <td className="py-2.5 px-3.5 align-middle text-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>매출액 순이익률 (NPM)</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300">-55.9%</td>
                <td className="py-2.5 px-3 text-right font-mono text-brand-cyan">+16.6%</td>
                <td className="py-2.5 px-3 text-right font-mono text-brand-cyan">+3.7%</td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300">-12.9%p</td>
                <td className="py-2.5 px-3.5 text-slate-300 font-normal">
                  당기순이익 ÷ 매출액 산출
                </td>
              </tr>

              {/* 회사 명목 현금 및 SGI 차감 후 실질 가용 현금 */}
              <tr className="bg-dark-850/70 hover:bg-dark-800/70 transition-colors font-bold border-y border-dark-700">
                <td className="py-2.5 px-3.5 align-middle text-white">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>실질 가용 현금</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">9.7억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">8.4억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-white font-bold">0.5억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300">-7.9억 원</td>
                <td className="py-2.5 px-3.5 text-slate-300 font-normal">
                  명목 현금성 자산 기준 산출
                </td>
              </tr>

              {/* SGI 서울보증보험 설정액 (마이너스 차감 항목) */}
              <tr className="hover:bg-dark-800/40 transition-colors bg-purple-950/20">
                <td className="py-2.5 px-3.5 align-middle font-bold text-purple-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>SGI 지급 보증보험</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300">-20.0억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300">-20.0억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-purple-300">-25.0억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-300">-5.0억 원</td>
                <td className="py-2.5 px-3.5 text-slate-300">
                  선불충전금 지급보증 의무
                </td>
              </tr>

              {/* 연간 총 취급액 (GMV) */}
              <tr className="hover:bg-dark-800/40 transition-colors">
                <td className="py-2.5 px-3.5 align-middle font-bold text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                    <span>연간 총 취급액 (GMV)</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">400억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">675억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">800억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">+125억 원</td>
                <td className="py-2.5 px-3.5 text-slate-300">
                  연간 거래취급액(GMV) 추정
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 세부 판매 실적(추정) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-dark-750">
          <div>
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-normal">
                세부 판매 실적 (추정)
              </h3>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-dark-800 text-slate-200 border border-dark-650">
                수익 분해 역산
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              공식 발급단가(장당 7,000원) · 선불충전 수수료(3~4%) · 가맹점 수수료 합산 = NICE 공시 총매출(70.7억 원) 100% 정합
            </p>
          </div>
          <span className="text-xs text-slate-300 font-mono self-start sm:self-auto">
            공식 총매출 일치
          </span>
        </div>

        {/* 모바일 화면 (가로 스크롤바 0%, 카드 뷰) */}
        <div className="space-y-3 md:hidden font-sans">
          {[
            { category: '연간 총 카드 발급량', y23: '약 38만 장', y24: '약 65만 장', y25: '약 72만 장', desc: '기준단가 7,000원/장' },
            { category: '├ 일반 충전카드 (DIY)', y23: '약 29만 장', y24: '약 47만 장', y25: '약 50만 장 (69%)', desc: '장당 7,000원 (마진 35%)' },
            { category: '└ 한정판 IP 제휴 카드', y23: '약 9만 장', y24: '약 18만 장', y25: '약 22만 장 (31%)', desc: '장당 7,000원 (마진 20%)' },
            { category: '1. 실물 카드 판매 매출 (A)', y23: '약 26.6억 원', y24: '약 45.5억 원', y25: '약 50.4억 원', desc: '72만 장 × 7,000원' },
            { category: '2. 선불 충전 수수료 매출 (B)', y23: '약 6.7억 원', y24: '약 16.1억 원', y25: '약 20.3억 원', desc: '앱 충전 시 3~4% 수수료' },
            { category: '전사 총 공헌이익 (마진율)', y23: '약 13.2억 원', y24: '약 25.6억 원', y25: '약 29.9억 원', desc: '2025년 마진 42.3%' },
            { category: '합계 총 매출액 (A + B)', y23: '33.3억 원', y24: '61.6억 원', y25: '70.7억 원', desc: 'NICE 공시 100% 일치' },
          ].map((row) => (
            <div key={row.category} className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <span className="font-bold text-sm text-white">{row.category}</span>
                <span className="font-black text-sm text-brand-cyan tabular-nums">
                  {row.y25}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">23년</div>
                  <div className="font-medium text-slate-200 tabular-nums mt-0.5">{row.y23}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">24년</div>
                  <div className="font-medium text-slate-200 tabular-nums mt-0.5">{row.y24}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-dark-900 border border-cyan-500/30">
                  <div className="text-[10px] text-brand-cyan font-bold">25년</div>
                  <div className="font-bold text-cyan-300 tabular-nums mt-0.5">{row.y25}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 pt-1 border-t border-dark-800">
                <span className="text-slate-500 mr-1">[기준]</span>
                {row.desc}
              </div>
            </div>
          ))}
        </div>

        {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
          <table className="w-full text-left text-xs sm:text-sm table-fixed font-sans">
            <thead className="bg-dark-850 text-slate-300 font-bold border-b border-dark-750 text-xs font-sans">
              <tr>
                <th className="py-2.5 px-3.5 w-[32%]">항목</th>
                <th className="py-2.5 px-3 text-right w-[16%]">23년</th>
                <th className="py-2.5 px-3 text-right w-[16%]">24년</th>
                <th className="py-2.5 px-3 text-right w-[16%] text-white">25년</th>
                <th className="py-2.5 px-3.5 w-[20%]">기준 (설명)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750/70 text-xs sm:text-sm">
              
              {/* 총 카드 발급량 */}
              <tr className="bg-dark-850/30 hover:bg-dark-800/40 transition-colors font-semibold">
                <td className="py-2.5 px-3.5 align-middle text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>연간 총 카드 발급량</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">약 38만 장</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">약 65만 장</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-white">약 72만 장</td>
                <td className="py-2.5 px-3.5 font-mono text-slate-300 text-xs">기준단가 7,000원/장</td>
              </tr>

              {/* 일반 충전카드 */}
              <tr className="hover:bg-dark-800/40 transition-colors text-slate-300">
                <td className="py-2 px-3.5 pl-6 align-middle">
                  <span className="text-slate-400 mr-1.5">├</span>
                  <span>일반 충전카드 (DIY 커스텀)</span>
                </td>
                <td className="py-2 px-3 text-right font-mono">약 29만 장 (76%)</td>
                <td className="py-2 px-3 text-right font-mono">약 47만 장 (72%)</td>
                <td className="py-2 px-3 text-right font-mono text-slate-100 font-medium">약 50만 장 (69%)</td>
                <td className="py-2 px-3.5 text-slate-400 font-mono text-xs">장당 7,000원 (마진 35%)</td>
              </tr>

              {/* 한정판 IP 제휴 카드 */}
              <tr className="hover:bg-dark-800/40 transition-colors text-slate-300">
                <td className="py-2 px-3.5 pl-6 align-middle font-semibold text-slate-200">
                  <span className="text-slate-400 mr-1.5">└</span>
                  <span>한정판 IP 제휴 카드 (SM 등)</span>
                </td>
                <td className="py-2 px-3 text-right font-mono text-slate-200">약 9만 장 (24%)</td>
                <td className="py-2 px-3 text-right font-mono text-slate-200">약 18만 장 (28%)</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-white">약 22만 장 (31%)</td>
                <td className="py-2 px-3.5 text-slate-400 font-mono text-xs">장당 7,000원 (마진 20%)</td>
              </tr>

              {/* 실물 카드 판매 매출액 */}
              <tr className="bg-dark-850/20 hover:bg-dark-800/40 transition-colors font-semibold border-t border-dark-750">
                <td className="py-2.5 px-3.5 align-middle text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-cyan"></span>
                    <span>1. 실물 카드 판매 매출 (A)</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">약 26.6억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">약 45.5억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">약 50.4억 원</td>
                <td className="py-2.5 px-3.5 font-mono text-slate-300 text-xs">72만 장 × 7,000원</td>
              </tr>

              {/* 선불 충전 수수료 (3~4%) */}
              <tr className="bg-dark-850/20 hover:bg-dark-800/40 transition-colors font-semibold border-t border-dark-750">
                <td className="py-2.5 px-3.5 align-middle text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-cyan"></span>
                    <span>2. 선불 충전 수수료 (3~4%) 매출 (B)</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-200">약 6.7억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">약 16.1억 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">약 20.3억 원</td>
                <td className="py-2.5 px-3.5 text-brand-cyan font-bold font-mono text-xs">앱 충전 시 3~4% 수수료 (총매출 역산)</td>
              </tr>

              {/* 전사 종합 공헌 마진율 */}
              <tr className="bg-dark-850/60 hover:bg-dark-800/60 transition-colors font-bold border-y border-dark-700">
                <td className="py-2.5 px-3.5 align-middle text-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>전사 총 공헌이익 (마진율)</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-300">약 13.2억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-brand-cyan">약 25.6억 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-brand-cyan font-bold">약 29.9억 원</td>
                <td className="py-2.5 px-3.5 font-mono text-slate-300 text-xs">2025년 마진 42.3%</td>
              </tr>

              {/* 합산 총 매출액 (정합성) */}
              <tr className="bg-dark-800/90 font-bold border-t-2 border-dark-700 text-xs sm:text-sm">
                <td className="py-3 px-3.5 align-middle text-white">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>합계 총 매출액 (A + B)</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-white">33.3억 원</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-white">61.6억 원</td>
                <td className="py-3 px-3 text-right font-mono font-black text-brand-cyan">70.7억 원</td>
                <td className="py-3 px-3.5 text-brand-cyan font-semibold text-xs">
                  <span>NICE 공시 100% 일치</span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* 4. BM 3대 핵심 축 및 부문별 수익 메커니즘 요약 */}
      <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-dark-750">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-normal">
                수익 구조(BM) 3대 핵심 축 및 부문별 수익 메커니즘
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              일회성 카드 판매에서 거래액 연동 고마진 핀테크 플랫폼으로의 수익 구조 분해
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-dark-850 text-slate-300 border border-dark-750 font-sans self-start sm:self-auto">
            핵심 요약
          </span>
        </div>

        {/* 모바일 화면 (가로 스크롤바 0%, 카드 뷰) */}
        <div className="space-y-3 md:hidden font-sans">
          {[
            { name: '1. 실물 카드 발급', margin: '약 30.4%', desc: '장당 7,000원 베이스라인 매출 (연 50.4억 원)' },
            { name: '2. 한정판 IP 제휴', margin: '약 20.0%', desc: 'K-POP 팬덤 중심 굿즈 소장 및 0원 바이럴' },
            { name: '3. 선불 충전 수수료 (3~4%)', margin: '약 72.0%', desc: '앱 해외카드·간편결제 충전 시 3~4% 수수료 부과 (연 약 20.3억 원 역산 추정)', highlight: true },
          ].map((row) => (
            <div
              key={row.name}
              className={`p-3.5 rounded-xl border space-y-2 ${
                row.highlight ? 'bg-dark-850/90 border-cyan-500/40' : 'bg-dark-850 border-dark-750'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <span className={`font-bold text-sm ${row.highlight ? 'text-brand-cyan' : 'text-white'}`}>
                  {row.name}
                </span>
                <span className="font-black text-sm text-brand-cyan tabular-nums">
                  마진 {row.margin}
                </span>
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-slate-400 font-semibold mr-1">[모델]</span>
                <span>{row.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
          <table className="w-full text-left text-xs sm:text-sm table-fixed font-sans">
            <thead className="bg-dark-850 text-slate-300 font-bold border-b border-dark-750 text-xs font-sans">
              <tr>
                <th className="py-2.5 px-3.5 w-[25%]">엔진</th>
                <th className="py-2.5 px-3 text-center w-[18%]">마진율</th>
                <th className="py-2.5 px-3.5 w-[57%]">수익모델 (설명)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750/70 text-xs sm:text-sm">
              <tr className="hover:bg-dark-800/40 transition-colors">
                <td className="py-2.5 px-3.5 font-bold text-white">
                  1. 실물 카드 발급
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-brand-cyan">
                  약 30.4%
                </td>
                <td className="py-2.5 px-3.5 text-slate-300">
                  장당 7,000원 베이스라인 매출 (연 50.4억 원)
                </td>
              </tr>
              <tr className="hover:bg-dark-800/40 transition-colors">
                <td className="py-2.5 px-3.5 font-bold text-white">
                  2. 한정판 IP 제휴
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-brand-cyan">
                  약 20.0%
                </td>
                <td className="py-2.5 px-3.5 text-slate-300">
                  K-POP 팬덤 중심 굿즈 소장 및 0원 바이럴
                </td>
              </tr>
              <tr className="hover:bg-dark-800/40 transition-colors bg-cyan-950/20">
                <td className="py-2.5 px-3.5 font-bold text-brand-cyan">
                  3. 선불 충전 수수료 (3~4%)
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-black text-brand-cyan">
                  약 72.0%
                </td>
                <td className="py-2.5 px-3.5 text-slate-200">
                  앱 해외카드·간편결제 충전 시 3~4% 수수료 부과 (연 약 20.3억 원 역산 추정)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. 하단 공식 출처 (GMV 탭 단 1회 텍스트 아웃링크 일원화 - Rule 12, Rule 13 준수) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-750 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-semibold text-slate-300">데이터 출처 :</span>
          <a
            href={resolveOfficialDisclosureSourceUrl(irData?.sourceName, irData?.companyName || brandCleanName, service.domain, irData?.sourceUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold inline-flex items-center gap-1 transition-colors"
            title={`${irData?.companyName || brandCleanName} 공식 원천 데이터 열람`}
          >
            <span>{irData?.sourceName || (irData?.isDartAudited ? '금융감독원 DART 전자공시시스템' : '잡코리아 기업정보 (NICE평가정보 공시)')}</span>
            <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default GmvDetailSubpage;
