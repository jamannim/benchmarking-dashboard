import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Clock,
  Building2,
  ExternalLink
} from 'lucide-react';
import type { CompleteServiceIntelligence } from '../../types/intelligence';
import type { SubViewId } from '../Header';
import { BrandLogo } from '../BrandLogo';
import { resolveOfficialDisclosureSourceUrl } from '../../utils/sourceUrlResolver';

interface Props {
  data: CompleteServiceIntelligence;
  activeSubView?: SubViewId;
  onSubViewChange?: (subView: SubViewId) => void;
}

// ── 1. [트랙 A] 기협약 즉시 실행 데이터 (협약 완료 / 즉시 매출 고도화) ──
interface ContractedStrategyItem {
  id: string;
  partnerName: string;
  category: string;
  revenueEngine: string; // ① 판매 / ② 결제 / ③ 충전
  engineNumber: string;
  currentBase: string; // 현재 협약 기반
  actionPlan: string; // 즉시 실행 고도화안
  estimatedCost: string; // 예상 투입 예산 (신규)
  costDetail: string; // 비용 세부 내역 (단가/항목) (신규)
  expectedImpact: string; // 기대 성과 및 회수
  readiness: 'immediate'; // 즉시 실행
}

const CONTRACTED_STRATEGIES: ContractedStrategyItem[] = [
  {
    id: 'cu',
    partnerName: 'CU (BGF리테일)',
    category: '오프라인 편의점',
    revenueEngine: '③ ATM/키오스크 충전',
    engineNumber: '03',
    currentBase: '전국 점포 키오스크 가동 (충전 비중 18.4%)',
    actionPlan: '외국인 밀집 200개점 키오스크 2세대 교체 및 심야 수수료 0%',
    estimatedCost: '약 4.0억 원',
    costDetail: '기기 교체 3.6억(200대) + 심야 프로모션 4,000만',
    expectedImpact: '월 충전 22억(+34%) 및 결제 15만 건 (회수 3.5개월)',
    readiness: 'immediate'
  },
  {
    id: 'sm',
    partnerName: 'SM 엔터테인먼트',
    category: 'K-POP IP · 팬덤',
    revenueEngine: '① 일반/IP 판매',
    engineNumber: '01',
    currentBase: '월드투어 팝업 일평균 1,800장 완판 검증',
    actionPlan: '성수 광야 매장 포토카드 부스 상설화 및 공식 멤버십 연계',
    estimatedCost: '약 4,500만 원',
    costDetail: '포토카드 부스 2대 3,000만 + 멤버십 API 연동 1,500만',
    expectedImpact: '분기 5만 장 발권 및 ARPU 1.5만 원 (회수 1개월)',
    readiness: 'immediate'
  },
  {
    id: 'korail',
    partnerName: '코레일 (레일플러스)',
    category: '철도 · 대중교통',
    revenueEngine: '② 결제/충전 증가',
    engineNumber: '02',
    currentBase: '83개 역사 키오스크 가동 및 전국 교통 호환',
    actionPlan: '다국어 KTX 왕복권 + 나마네 선불카드 결합 패스 출시',
    estimatedCost: '약 5,000만 원',
    costDetail: '예매망 API 개발 3,500만 + 투어패스 패키징 1,500만',
    expectedImpact: '연간 결제액 35억 원 순증 (회수 약 2.5개월)',
    readiness: 'immediate'
  },
  {
    id: 'oliveyoung',
    partnerName: 'CJ 올리브영',
    category: '뷰티 · H&B 스토어',
    revenueEngine: '② 결제/충전 증가',
    engineNumber: '02',
    currentBase: '외국인 결제 9.3억 원 (여성 결제 88.7%)',
    actionPlan: '플래그십 5개점 택스리펀 자동 연동 및 5% 페이백',
    estimatedCost: '약 4,500만 원',
    costDetail: 'POS 즉시 환급 연동 2,500만 + 페이백 분담 2,000만',
    expectedImpact: '대기 40% 단축 및 분기 결제액 12억 달성 (즉시 회수)',
    readiness: 'immediate'
  },
  {
    id: 'arex',
    partnerName: '공항철도 (AREX)',
    category: '공항 교통 관문',
    revenueEngine: '③ ATM/키오스크 충전',
    engineNumber: '03',
    currentBase: '인천공항·서울역 등 14개 주요 역사 키오스크 가동',
    actionPlan: '직통열차 발권기 옆 키오스크 증설 및 16개국 외화 충전 지원',
    estimatedCost: '약 7,000만 원',
    costDetail: '신형 기기 10대 도입 6,000만 + 통신·설치비 1,000만',
    expectedImpact: '입국 첫 충전 전환율 65% 달성 (회수 약 4개월)',
    readiness: 'immediate'
  }
];

// ── 2. [트랙 B] 미제휴 선결 과제 데이터 (파트너십 선행 필수 / 신규 유통망 확보) ──
interface PendingStrategyItem {
  id: string;
  targetName: string;
  category: string;
  revenueEngine: string; // ① 판매 / ② 결제 / ③ 충전
  engineNumber: string;
  prerequisiteTask: string; // 필수 선행 과제 (제휴 조건)
  proposedSolution: string; // 제휴 제안 내용
  expectedImpact: string; // 제휴 성사 시 기대 성과
  partnershipStatus: 'pending'; // 선행 필요
}

const PENDING_STRATEGIES: PendingStrategyItem[] = [
  {
    id: 'ota-4',
    targetName: '글로벌 OTA 4사 (라쿠텐·KKday·트립·클룩)',
    category: '해외 여행 플랫폼',
    revenueEngine: '① 일반/IP 판매',
    engineNumber: '01',
    prerequisiteTask: '⚠️ 권역별 4사 입점 및 제휴 계약 체결 필수',
    proposedSolution: '플랫폼 독점 eSIM+나마네카드 번들 입점 및 QR 발권',
    expectedImpact: '출국 전 사전 결제 40% 확보 (월 3만 장 판매)',
    partnershipStatus: 'pending'
  },
  {
    id: 'airlines',
    targetName: 'LCC 항공사 (제주·티웨이)',
    category: '항공 인바운드 관문',
    revenueEngine: '① 일반/IP 판매',
    engineNumber: '01',
    prerequisiteTask: '⚠️ 방한 LCC 기내 면세점 및 사전 주문 입점 협약 필수',
    proposedSolution: '기내 면세망 카드 번들 판매 및 좌석 QR 홍보',
    expectedImpact: '입국 전 First-Touch 선점 (월 1.5만 장 신규 판매)',
    partnershipStatus: 'pending'
  },
  {
    id: 'daiso',
    targetName: '아성다이소',
    category: '생활용품 · 가성비 쇼핑',
    revenueEngine: '③ ATM/키오스크 충전',
    engineNumber: '03',
    prerequisiteTask: '⚠️ 외국인 밀집 100개 거점 매장 키오스크 입점 필수',
    proposedSolution: '명동·홍대 매장 키오스크 설치 및 1만 원 이상 캐시백',
    expectedImpact: '현금 잔돈 해소 및 월 8만 건 신규 결제 창출',
    partnershipStatus: 'pending'
  },
  {
    id: 'musinsa',
    targetName: '무신사 (무신사 스탠다드)',
    category: 'K-패션 쇼핑',
    revenueEngine: '② 결제/충전 증가',
    engineNumber: '02',
    prerequisiteTask: '⚠️ 플래그십 매장 키오스크 입점 및 할인 협약 필수',
    proposedSolution: '매장 내 패션 키오스크 입점 및 소지자 10% 전용 할인',
    expectedImpact: '매장 체류 증대 및 분기 결제액 8억 원 유치',
    partnershipStatus: 'pending'
  },
  {
    id: 'hybe',
    targetName: '하이브 (위버스 Weverse)',
    category: '글로벌 팬덤 · 엔터',
    revenueEngine: '① 판매 / ② 결제',
    engineNumber: '01',
    prerequisiteTask: '⚠️ 위버스 캐시 ↔ 나마네페이 상호 전환 연동 필수',
    proposedSolution: '월드투어 콘서트장 단독 입점 및 아티스트 프레임 카드 발권',
    expectedImpact: '콘서트당 3만 장 발권 및 글로벌 결제 15억 유치',
    partnershipStatus: 'pending'
  },
  {
    id: 'shinsegae',
    targetName: '신세계면세점',
    category: '면세 · 쇼핑몰',
    revenueEngine: '③ ATM/키오스크 충전',
    engineNumber: '03',
    prerequisiteTask: '⚠️ 명동점 1층 키오스크 설치 및 VIP 제휴 협약 필수',
    proposedSolution: '소지자 GOLD 멤버십 부여 및 면세 환급금 즉시 재충전',
    expectedImpact: '외국인 방문 월 2만 명 증가 및 객단가 +35% 견인',
    partnershipStatus: 'pending'
  }
];

export const BusinessStrategySubpage: React.FC<Props> = ({ data }) => {
  const { service } = data;
  const brandCleanName = service.name.split(' (')[0];
  const isNamane = service.domain.includes('namane') || service.domain.includes('iaurora');
  const isDgdr = service.domain.includes('dgdr') || service.domain.includes('onefamily');
  const isCardService = isNamane || service.domain.includes('wowpass');

  // URL 입력 도메인 외에 타사 데이터 병합/추론 금지: 명시된 데이터가 있을 때만 사용하고, 없으면 나마네 도메인일 때만 기본값 사용, 그 외는 빈 배열(Null)
  const contractedList = (data.businessStrategyData?.contractedStrategies && data.businessStrategyData.contractedStrategies.length > 0)
    ? data.businessStrategyData.contractedStrategies
    : (isNamane ? CONTRACTED_STRATEGIES : []);

  const pendingList = (data.businessStrategyData?.pendingStrategies && data.businessStrategyData.pendingStrategies.length > 0)
    ? data.businessStrategyData.pendingStrategies
    : (isNamane ? PENDING_STRATEGIES : []);

  // 트랙 A와 B가 모두 존재할 때만 2대 트랙(A/B) 듀얼 모드 활성화. 데이터가 없거나 1개만 있을 시에는 트랙 분리 없이 단일 전략 1개만 노출
  const hasDualTracks = contractedList.length > 0 && pendingList.length > 0;
  const singleStrategyList = contractedList.length > 0 ? contractedList : pendingList;
  const hasAnyStrategy = singleStrategyList.length > 0;

  const [activeTrack, setActiveTrack] = useState<'all' | 'contracted' | 'pending'>('all');

  const summaryBudget = data.businessStrategyData?.summaryBudget || (
    isNamane 
      ? '* 총 투입 예산 6.1억 원 (CAPEX 4.5억 원 + SI 1.6억 원) · 평균 투자 회수 3.2개월' 
      : (isDgdr 
          ? '* 총 투입 예산 약 2.8억 원 · 평균 투자 회수 2.5개월' 
          : '* 투입 예산: 공시 미확인 (Null)')
  );

  return (
    <div
      className="space-y-6 font-sans text-slate-200"
      style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif' }}
    >
      {/* ── 1. 상단 인트로 헤더 ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-dark-900 border border-dark-750 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold border bg-purple-500/15 text-purple-300 border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hasDualTracks ? '매출 증가 방식' : '핵심 사업전략'}</span>
            </span>
            <span className="text-xs text-slate-400">
              {hasDualTracks ? '기협약 즉시 실행 vs 미제휴 선결 과제 2대 트랙 전략' : '공식 비즈니스 모델 및 핵심 실행 전략'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white pt-1 flex items-center gap-2">
            <BrandLogo domain={service.domain} size="sm" />
            <span>{brandCleanName} 사업전략</span>
            {hasDualTracks && (
              <span className="text-xs font-normal text-slate-400">| 기협약 가동 & 신규 제휴 선결 트랙 분리</span>
            )}
          </h2>
        </div>

        {/* 트랙 전환 탭: 트랙 A와 B가 모두 존재할 때만 분리 탭 렌더링 */}
        {hasDualTracks && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-950 border border-dark-750">
            <button
              type="button"
              onClick={() => setActiveTrack('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTrack === 'all'
                  ? 'bg-brand-purple text-white shadow-sm font-black ring-1 ring-purple-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-dark-800/60'
              }`}
            >
              전체 보기
            </button>
            <button
              type="button"
              onClick={() => setActiveTrack('contracted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTrack === 'contracted'
                  ? 'bg-purple-600 text-white font-black shadow-sm ring-1 ring-purple-400/50'
                  : 'text-purple-300 hover:text-white hover:bg-dark-800/60'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>[트랙 A] 기협약 즉시 실행 ({contractedList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTrack('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTrack === 'pending'
                  ? 'bg-cyan-600 text-white font-black shadow-sm ring-1 ring-cyan-400/50'
                  : 'text-cyan-300 hover:text-white hover:bg-dark-800/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>[트랙 B] 미제휴 선결 과제 ({pendingList.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* ── 2. 요약 배너: 트랙 A, B가 둘 다 있을 때 2대 트랙 비교 vs 없을 때는 단일 전략 1개만 노출 ── */}
      {hasDualTracks ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 트랙 A 카드 */}
          <div className="p-3.5 rounded-xl bg-dark-900 border border-purple-500/30 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-purple-400" />
                <span>트랙 A · 기협약 기반 즉시 실행</span>
              </span>
              <span className="text-[11px] font-bold text-purple-300">
                {summaryBudget.includes('공시 미확인') ? '예산 공시 미확인' : '전략 예산 배분 완료'}
              </span>
            </div>
            <div className="text-xs font-bold text-white">
              {brandCleanName} 핵심 비즈니스 모델 기반 즉시 실행 ({contractedList.length}건)
            </div>
            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
              {contractedList.map(c => c.partnerName).slice(0, 4).join(' · ')} 대상 핵심 수익 엔진 가동.
            </p>
          </div>

          {/* 트랙 B 카드 */}
          <div className="p-3.5 rounded-xl bg-dark-900 border border-cyan-500/30 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-cyan-400" />
                <span>트랙 B · 미제휴 선결 과제 (도입채널 다각화)</span>
              </span>
              <span className="text-[11px] font-bold text-cyan-300">파트너십 선행 필수</span>
            </div>
            <div className="text-xs font-bold text-white">
              신규 유통망 확보를 위한 제휴 협약 체결 필수 ({pendingList.length}건)
            </div>
            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
              {pendingList.map(p => p.targetName.split(' (')[0]).slice(0, 4).join(' · ')} 등 신규 채널 제휴 협약 체결 후 본격 가동.
            </p>
          </div>
        </div>
      ) : (
        /* 단일 전략 요약 카드 1개만 노출 */
        <div className="p-4 rounded-xl bg-gradient-to-r from-dark-900 to-dark-950 border border-dark-750 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>{hasAnyStrategy ? `${brandCleanName} 핵심 전략 방향` : '공식 사업전략'}</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {hasAnyStrategy ? (summaryBudget.includes('공시 미확인') ? '예산 공시 미확인' : summaryBudget) : '공시 미확인 (Null)'}
            </span>
          </div>
          <div className="text-sm font-bold text-white">
            {hasAnyStrategy 
              ? `${brandCleanName} 핵심 비즈니스 모델 및 공식 사업 전략 (${singleStrategyList.length}건)` 
              : `[미확인: ${brandCleanName} 공식 사업 전략 정보 없음]`}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {hasAnyStrategy
              ? `${singleStrategyList.map(s => ('partnerName' in s ? s.partnerName : s.targetName)).slice(0, 4).join(' · ')} 중심으로 최적화된 사업 추진 방향을 가동합니다.`
              : '외부 기업공시(감사보고서, IR 자료 등) 및 공식 웹사이트 원문 상에 명시된 사업 전략 및 제휴 파트너십 정보가 확인되지 않아 가상 추론 없이 공란(Null) 처리되었습니다.'}
          </p>
        </div>
      )}

      {/* ── 3. 본문 전략 테이블: hasDualTracks일 때는 트랙 A/B 분리 표, 아닐 때는 단일 전략 1개만 노출 ── */}
      {hasDualTracks ? (
        <>
          {/* [트랙 A 표] 기협약 파트너사 기반 즉시 실행 전략 */}
          {(activeTrack === 'all' || activeTrack === 'contracted') && (
            <div className="p-4 rounded-xl bg-dark-900 border border-purple-500/30 shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-dark-750">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm sm:text-base font-black text-white">
                    [트랙 A] 기협약 파트너사 기반 즉시 실행 전략
                  </h3>
                </div>
                <span className="text-xs text-purple-300 font-bold bg-purple-950/40 px-2.5 py-0.5 rounded border border-purple-500/30 self-start sm:self-auto">
                  {summaryBudget}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200 border-collapse">
                  <thead>
                    <tr className="border-b border-dark-750 text-slate-400 text-[11px] bg-dark-950/60">
                      <th className="py-2.5 px-3 font-bold text-center w-36">파트너사 (업종)</th>
                      <th className="py-2.5 px-3 font-bold text-center w-32">수익 엔진</th>
                      <th className="py-2.5 px-3 font-bold text-center w-40">현재 협약 기반</th>
                      <th className="py-2.5 px-3 font-bold text-center">즉시 실행 고도화 방안</th>
                      <th className="py-2.5 px-3 font-bold text-center w-48 text-purple-300">예상 투입 비용 (세부 내역)</th>
                      <th className="py-2.5 px-3 font-bold text-center w-44">목표 기대 성과 (회수)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800">
                    {contractedList.map((item) => (
                      <tr key={item.id} className="hover:bg-dark-850/50 transition-colors">
                        <td className="py-2.5 px-3 align-middle text-left font-bold text-white">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span>{item.partnerName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal pt-0.5 pl-5">
                            {item.category}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dark-950 text-slate-200 border border-dark-700 whitespace-nowrap inline-block">
                            {item.revenueEngine}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left text-slate-300 text-[11px] leading-snug">
                          <span className="line-clamp-1 hover:line-clamp-2" title={item.currentBase}>{item.currentBase}</span>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left text-slate-200 font-medium text-[11px] leading-snug">
                          <span className="line-clamp-1 hover:line-clamp-2" title={item.actionPlan}>{item.actionPlan}</span>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left leading-snug">
                          <div className="font-bold text-purple-300 text-xs">{item.estimatedCost}</div>
                          <div className="text-[10px] text-slate-400 font-normal line-clamp-1 hover:line-clamp-2 pt-0.5" title={item.costDetail}>{item.costDetail}</div>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left font-black text-cyan-300 text-xs leading-snug">
                          <span className="line-clamp-1 hover:line-clamp-2" title={item.expectedImpact}>{item.expectedImpact}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* [트랙 B 표] 미제휴 도입채널 신규 파트너십 구축 선결 과제 */}
          {(activeTrack === 'all' || activeTrack === 'pending') && (
            <div className="p-4 rounded-xl bg-dark-900 border border-cyan-500/30 shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-dark-750">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm sm:text-base font-black text-white">
                    [트랙 B] 미제휴 도입채널 신규 파트너십 구축 전략
                  </h3>
                </div>
                <span className="text-xs text-cyan-300 font-bold bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-500/30 self-start sm:self-auto">
                  * BD(사업개발) 제휴 협약 체결이 반드시 선행되어야 실행 가능한 과제
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200 border-collapse">
                  <thead>
                    <tr className="border-b border-dark-750 text-slate-400 text-[11px] bg-dark-950/60">
                      <th className="py-2.5 px-3 font-bold text-center w-48">추진 대상 업체 (도입채널)</th>
                      <th className="py-2.5 px-3 font-bold text-center w-36">수익 엔진</th>
                      <th className="py-2.5 px-3 font-bold text-center">선행 과제 (필수 제휴 조건)</th>
                      <th className="py-2.5 px-3 font-bold text-center">제휴 제안 솔루션</th>
                      <th className="py-2.5 px-3 font-bold text-center w-44">제휴 성사 시 기대 효과</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800">
                    {pendingList.map((item) => (
                      <tr key={item.id} className="hover:bg-dark-850/50 transition-colors">
                        <td className="py-2.5 px-3 align-middle text-left font-bold text-white">
                          <div className="flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{item.targetName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal pt-0.5 pl-5">
                            {item.category}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dark-950 text-slate-200 border border-dark-700 whitespace-nowrap inline-block">
                            {item.revenueEngine}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left text-slate-300 font-medium text-[11px] leading-snug">
                          <span className="line-clamp-1 hover:line-clamp-2" title={item.prerequisiteTask}>{item.prerequisiteTask}</span>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left text-slate-300 text-[11px] leading-snug">
                          <span className="line-clamp-1 hover:line-clamp-2" title={item.proposedSolution}>{item.proposedSolution}</span>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left font-black text-cyan-300 text-xs leading-snug">
                          <span className="line-clamp-1 hover:line-clamp-2" title={item.expectedImpact}>{item.expectedImpact}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* 트랙 A/B를 굳이 나누지 않고 단일 전략 1개만 노출 */
        <div className="p-4 rounded-xl bg-dark-900 border border-dark-750 shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-dark-750">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm sm:text-base font-black text-white">
                {brandCleanName} 핵심 사업전략 명세
              </h3>
            </div>
            <span className="text-xs text-slate-300 font-bold bg-dark-950 px-2.5 py-0.5 rounded border border-dark-700 self-start sm:self-auto">
              {hasAnyStrategy ? `${singleStrategyList.length}개 전략 과제` : '데이터 미확인 (Null)'}
            </span>
          </div>

          {hasAnyStrategy ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200 border-collapse">
                <thead>
                  <tr className="border-b border-dark-750 text-slate-400 text-[11px] bg-dark-950/60">
                    <th className="py-2.5 px-3 font-bold text-center w-36">파트너 / 대상 (업종)</th>
                    <th className="py-2.5 px-3 font-bold text-center w-32">수익 엔진</th>
                    <th className="py-2.5 px-3 font-bold text-center w-40">현재 기반 / 선행조건</th>
                    <th className="py-2.5 px-3 font-bold text-center">실행 방안 / 솔루션</th>
                    <th className="py-2.5 px-3 font-bold text-center w-48 text-purple-300">예상 투입 비용</th>
                    <th className="py-2.5 px-3 font-bold text-center w-44">목표 기대 성과</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                  {singleStrategyList.map((item) => {
                    const isContracted = 'partnerName' in item;
                    const name = isContracted ? item.partnerName : item.targetName;
                    const base = isContracted ? item.currentBase : item.prerequisiteTask;
                    const action = isContracted ? item.actionPlan : item.proposedSolution;
                    const cost = isContracted ? item.estimatedCost : '-';
                    const costDetail = isContracted ? item.costDetail : '';
                    return (
                      <tr key={item.id} className="hover:bg-dark-850/50 transition-colors">
                        <td className="py-2.5 px-3 align-middle text-left font-bold text-white">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span>{name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal pt-0.5 pl-5">
                            {item.category}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dark-950 text-slate-200 border border-dark-700 whitespace-nowrap inline-block">
                            {item.revenueEngine}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left text-slate-300 text-[11px] leading-snug">
                          <span className="line-clamp-1 hover:line-clamp-2" title={base}>{base}</span>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left text-slate-200 font-medium text-[11px] leading-snug">
                          <span className="line-clamp-1 hover:line-clamp-2" title={action}>{action}</span>
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left leading-snug">
                          <div className="font-bold text-purple-300 text-xs">{cost}</div>
                          {costDetail && (
                            <div className="text-[10px] text-slate-400 font-normal line-clamp-1 hover:line-clamp-2 pt-0.5" title={costDetail}>{costDetail}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 align-middle text-left font-black text-cyan-300 text-xs leading-snug">
                          <span className="line-clamp-1 hover:line-clamp-2" title={item.expectedImpact}>{item.expectedImpact}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-4 rounded-xl bg-dark-950/50 border border-dashed border-dark-750 text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-50" />
              <div className="text-sm font-bold text-slate-300">
                [미확인: {brandCleanName} 공식 사업 전략 정보 없음]
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                공식 기업공시(감사보고서, IR 자료 등)에 명시된 사업 전략 내역이 확인되지 않아 가상 추론 및 타사 데이터 결합을 배제하고 공란(Null) 처리하였습니다.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── 4. 로드맵: 실제 검증된 로드맵 데이터가 있는 서비스(나마네/동거동락)만 노출하고, 일반 기업은 중복 껍데기 박스 없이 깔끔하게 생략 ── */}
      {(isCardService || isDgdr) && (
        <div className="p-4 rounded-xl bg-dark-900 border border-dark-750 shadow-md space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-dark-750">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-black text-white">
                {isCardService 
                  ? '방한 여정별 트랙 A(기협약) · 트랙 B(선행과제) 결합 로드맵' 
                  : '동거동락 고객 주거 라이프사이클 트랙 A(기협약) · 트랙 B(선행과제) 결합 로드맵'}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              * [트랙 A] 기협약 거점 즉시 가동 + [트랙 B] 선결 과제 완결 시 시너지 발생
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-dark-750 text-slate-400 text-[11px] bg-dark-950/60">
                  <th className="py-2.5 px-3 font-bold text-center w-36">여정 단계</th>
                  <th className="py-2.5 px-3 font-bold text-center w-48 text-purple-300">[트랙 A] 기협약 즉시 가동</th>
                  <th className="py-2.5 px-3 font-bold text-center text-cyan-300">[트랙 B] 필수 선결 과제 (파트너십 조건)</th>
                  <th className="py-2.5 px-3 font-bold text-center w-36">목표 시너지</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {isCardService ? (
                  <>
                    <tr>
                      <td className="py-2.5 px-3 text-left font-bold text-white whitespace-nowrap">① 방한 전 (D-14)</td>
                      <td className="py-2.5 px-3 text-left text-slate-300 leading-snug">
                        <span className="line-clamp-2">공식 앱/웹 사전 결제 및 예약 안내</span>
                      </td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">글로벌 OTA 4사 및 LCC 기내 입점 계약 선행</span>
                      </td>
                      <td className="py-2.5 px-3 text-left font-black text-cyan-300 whitespace-nowrap">발권료 선확보</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-left font-bold text-white whitespace-nowrap">② 입국 당일 (Day 1)</td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">AREX 14개역 키오스크 외화 즉시 충전</span>
                      </td>
                      <td className="py-2.5 px-3 text-left text-slate-300 leading-snug">
                        <span className="line-clamp-2">공항 입국장 신형 키오스크 전산 연동</span>
                      </td>
                      <td className="py-2.5 px-3 text-left font-black text-cyan-300 whitespace-nowrap">외화 수수료 창출</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-left font-bold text-white whitespace-nowrap">③ 관광/쇼핑 (Day 2~4)</td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">올리브영 결제(환급) ↔ CU 심야 수수료 0% 충전</span>
                      </td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">다이소 100개점 키오스크 및 무신사 할인 제휴 선행</span>
                      </td>
                      <td className="py-2.5 px-3 text-left font-black text-cyan-300 whitespace-nowrap">결제 수수료 극대화</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-left font-bold text-white whitespace-nowrap">④ 출국 당일 (Day 5)</td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">공항 키오스크 잔액으로 기념 포토카드 발권</span>
                      </td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">하이브 위버스 캐시 상호 전환 API 제휴 체결</span>
                      </td>
                      <td className="py-2.5 px-3 text-left font-black text-cyan-300 whitespace-nowrap">소액 잔액 100% 소진</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="py-2.5 px-3 text-left font-bold text-white whitespace-nowrap">① 탐색 및 계약 전</td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">대학가 공인중개사 네트워크 매물 추천 및 비대면 안심 투어 예약 연동</span>
                      </td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">LH/SH 청년 맞춤 보증부 월세 금융 지원 패키지 연계</span>
                      </td>
                      <td className="py-2.5 px-3 text-left font-black text-cyan-300 whitespace-nowrap">계약 전환율 45%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-left font-bold text-white whitespace-nowrap">② 입주 당일 (Day 1)</td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">HUG 전세보증금 반환보증 증서 자동 발급 및 KT 기가지니 IoT 키 불출</span>
                      </td>
                      <td className="py-2.5 px-3 text-left text-slate-300 leading-snug">
                        <span className="line-clamp-2">오늘의집 첫 입주 웰컴 가구/패브릭 렌탈 패키지 현장 비치</span>
                      </td>
                      <td className="py-2.5 px-3 text-left font-black text-cyan-300 whitespace-nowrap">보증 안전성 확보</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-left font-bold text-white whitespace-nowrap">③ 거주 중 (Month 1~12)</td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">세탁특공대 비대면 세탁 수거/배송 15% 전용 할인 및 지점 청소 솔루션 가동</span>
                      </td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">패스트파이브 청년 라운지 핫데스크 무료 이용 및 공유오피스 연계</span>
                      </td>
                      <td className="py-2.5 px-3 text-left font-black text-cyan-300 whitespace-nowrap">거주 유지율 극대화</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-left font-bold text-white whitespace-nowrap">④ 퇴실 및 재계약 (Month 12+)</td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">동거동락 타 지점(성수·신촌·강남) 우선 전실 혜택 및 관리비 캐시백 정산</span>
                      </td>
                      <td className="py-2.5 px-3 text-left text-slate-300 font-medium leading-snug">
                        <span className="line-clamp-2">수도권 대학 총학생회 기숙사 대체 룸메이트 매칭 우선 배정 연계</span>
                      </td>
                      <td className="py-2.5 px-3 text-left font-black text-cyan-300 whitespace-nowrap">공실률 0% 수렴</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. 하단 공식 출처 (사업전략 탭 단 1회 텍스트 아웃링크 일원화 - Rule 12, Rule 13 준수) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-750 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-semibold text-slate-300">데이터 출처 :</span>
          <a
            href={resolveOfficialDisclosureSourceUrl(data.irData?.sourceName, data.irData?.companyName || brandCleanName, service.domain, data.irData?.sourceUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold inline-flex items-center gap-1 transition-colors"
            title={`${data.irData?.companyName || brandCleanName} 공식 원천 데이터 열람`}
          >
            <span>{data.irData?.sourceName || (data.irData?.isDartAudited ? '금융감독원 DART 전자공시시스템' : '잡코리아 기업정보 (NICE평가정보 공시)')}</span>
            <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default BusinessStrategySubpage;
