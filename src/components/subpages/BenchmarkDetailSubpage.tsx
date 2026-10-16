import React from 'react';
import { 
  Layers, ArrowRight, ArrowDown, 
  Flame, Rocket, CheckCircle2,
  Workflow, Zap, Sparkles
} from 'lucide-react';
import type { CompleteServiceIntelligence, BenchmarkingItem } from '../../types/intelligence';
import type { SubpageTab } from '../Header';
import { BrandLogo } from '../BrandLogo';
import { PdfReportButton } from '../PdfReportButton';

interface Props {
  data: CompleteServiceIntelligence;
  onTabChange?: (tab: SubpageTab) => void;
}

export const BenchmarkDetailSubpage: React.FC<Props> = ({ data, onTabChange }) => {
  const { benchmarking, service } = data;

  // 가장 최우선 과제 (1위)와 이후 단계 과제들(2위~) 분리
  const topPriorityTask: BenchmarkingItem | undefined = benchmarking[0];
  const subsequentTasks: BenchmarkingItem[] = benchmarking.slice(1);

  // 단계별 일정 및 뱃지 메타데이터 매핑
  const getPhaseMeta = (index: number) => {
    switch (index) {
      case 0:
        return {
          phaseLabel: 'Phase 1 (즉시)',
          timing: 'Day 1~14',
          badgeText: '최우선 과제',
          badgeColor: 'bg-brand-rose/20 text-brand-rose border-brand-rose/40',
          borderColor: 'border-brand-rose/60 hover:border-brand-rose',
          glowBg: 'bg-gradient-to-b from-rose-950/30 via-dark-900 to-dark-900',
          focusText: '치명적 결제 병목 즉각 해소'
        };
      case 1:
        return {
          phaseLabel: 'Phase 2 (단기)',
          timing: 'Day 15~45',
          badgeText: '이후 단계',
          badgeColor: 'bg-brand-amber/20 text-brand-amber border-brand-amber/40',
          borderColor: 'border-brand-amber/40 hover:border-brand-amber/70',
          glowBg: 'bg-dark-850',
          focusText: '오프라인 거점 차별화'
        };
      case 2:
        return {
          phaseLabel: 'Phase 3 (중기)',
          timing: 'Day 46~75',
          badgeText: '이후 단계',
          badgeColor: 'bg-brand-purple/20 text-brand-purpleLight border-brand-purple/40',
          borderColor: 'border-brand-purple/40 hover:border-brand-purple/70',
          glowBg: 'bg-dark-850',
          focusText: '굿즈 IP 연계 수익화'
        };
      default:
        return {
          phaseLabel: `Phase ${index + 1} (고도화)`,
          timing: 'Day 76~90',
          badgeText: '이후 단계',
          badgeColor: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/40',
          borderColor: 'border-brand-cyan/40 hover:border-brand-cyan/70',
          glowBg: 'bg-dark-850',
          focusText: '온보딩 & 리텐션 최적화'
        };
    }
  };

  // 핵심내용 단답형 요약 헬퍼
  const getTaskSummary = (item: BenchmarkingItem) => {
    if (item.id === 1 && (item.title.includes('교통') || item.title.includes('환전 예약'))) {
      return {
        problem: '페이·교통 잔액 분리로 개찰구 오류 다발 (VOC 80%)',
        solution: '교통잔액 스마트 오토 밸런싱(자동 전환) 신설',
        impactGoal: '개찰구 결제 이탈 차단 및 평점 4.9★ 도약'
      };
    }
    if (item.id === 2 && (item.title.includes('키오스크') || item.title.includes('커스텀'))) {
      return {
        problem: '외화 지폐의 원화 카드 즉시 발급 부재',
        solution: '공항철도·명동 키오스크 외화 수납 모듈 시범 장착',
        impactGoal: '환전 편의 확보 및 100만 가입자 유치'
      };
    }
    if (item.id === 3 && (item.title.includes('프레임') || item.title.includes('송금'))) {
      return {
        problem: '개인 사진 출력 중심의 일회성 결제 한계',
        solution: 'K-POP IP 제휴 공식 한정판 프레임 및 IAP 연동',
        impactGoal: '팬덤 굿즈화 및 객단가(ARPU) 극대화'
      };
    }
    if (item.id === 4 && item.title.includes('온보딩')) {
      return {
        problem: '3DS 인증 실패 및 NFC 태그 위치 혼선 이탈',
        solution: '앱 최초 실행 3단계 다국어 인터랙션 가이드',
        impactGoal: '초기 이탈률 50% 절감 및 전환율 극대화'
      };
    }
    return {
      problem: item.description,
      solution: item.actionPlan,
      impactGoal: `영향도 ${item.impact} 달성 및 서비스 경쟁력 확보`
    };
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner with Hierarchy Badge & Sub-Task Direct Links */}
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-dark-900 border border-purple-500/30 shadow-lg relative overflow-hidden font-sans">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-500/50 flex items-center font-sans">
                <Layers className="w-3.5 h-3.5 mr-1" />
                과제 총괄 허브
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/40 font-sans">
                실행 로드맵
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2 pt-0.5 font-sans">
              <BrandLogo domain={service.domain} size="md" />
              <span>단계별 실행과제</span>
            </h2>
            <p className="hidden sm:block text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl font-normal font-sans">
              실측 데이터 기반: <strong className="text-brand-rose font-bold">긴급 병목 해결</strong> 및 <strong className="text-purple-300 font-bold">순차 추진 계획</strong> 명세
            </p>
          </div>

          {/* PDF 다운로드 버튼 (데스크톱 전용) */}
          <div className="hidden md:block self-end md:self-start shrink-0">
            <PdfReportButton data={data} tab="benchmark" />
          </div>
        </div>

        {/* 단계별 실행과제 하위 3대 과제 바로가기 */}
        {onTabChange && (
          <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-dark-750">
            <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1 font-sans">
              <span className="text-purple-400 font-bold text-xs">↳</span>
              <span>하위 3대 핵심 실행 영역 바로가기:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => onTabChange('marketing')}
                className="group p-2.5 sm:p-3.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-cyan-500/30 hover:border-cyan-400/70 text-left transition-all flex items-center justify-between cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-950/40 text-brand-cyan border border-cyan-500/40 flex items-center justify-center shrink-0">
                    <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 font-sans">마케팅 전략</div>
                    <div className="hidden sm:block text-[15px] text-slate-400 font-sans">0원 해외 바이럴 & SEO</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => onTabChange('app')}
                className="group p-2.5 sm:p-3.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-purple-500/30 hover:border-purple-400/70 text-left transition-all flex items-center justify-between cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 font-sans">앱 리뷰 분석</div>
                    <div className="hidden sm:block text-[15px] text-slate-400 font-sans">스토어 평점 & VOC 병목</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => onTabChange('server')}
                className="group p-2.5 sm:p-3.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-cyan-500/30 hover:border-cyan-400/70 text-left transition-all flex items-center justify-between cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-950/40 text-brand-cyan border border-cyan-500/40 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 font-sans">서버비용 효율화</div>
                    <div className="hidden sm:block text-[15px] text-slate-400 font-sans">인프라 50% 절감 방안</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. 단계별 실행 순서 다이어그램 (핵심 요약 플로우) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-dark-750 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/20 text-brand-purpleLight flex items-center justify-center border border-brand-purple/40">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                추진 순서 다이어그램
              </h3>
              <p className="text-xs font-normal text-slate-400 mt-0.5">
                병목 해소(Phase 1)부터 기능 확장 및 수익화까지의 경로
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-dark-800 text-slate-300 border border-dark-700 font-bold self-start sm:self-auto">
            파이프라인
          </span>
        </div>

        {/* 간결하고 시인성 높은 순서도 노드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {benchmarking.map((item, idx) => {
            const meta = getPhaseMeta(idx);
            const isFirst = idx === 0;

            return (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 relative ${meta.borderColor} ${meta.glowBg} ${
                  isFirst ? 'ring-2 ring-rose-500/30 shadow-md shadow-rose-950/20' : ''
                }`}
              >
                <div>
                  {/* 상단 뱃지 & 일정 */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${meta.badgeColor} flex items-center gap-1`}>
                      {isFirst && <Flame className="w-3.5 h-3.5" />}
                      <span>{meta.badgeText}</span>
                    </span>
                    <span className="text-xs font-normal text-slate-400">
                      {meta.timing}
                    </span>
                  </div>

                  {/* 단계 및 과제 타이틀 (가독성 높은 text-sm 볼드) */}
                  <span className="text-xs font-bold text-slate-400 block">
                    {meta.phaseLabel}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                    0{item.id}. {item.title}
                  </h4>
                </div>

                {/* 핵심 목표 1줄 강조 */}
                <div className="pt-2 border-t border-dark-750 flex items-center gap-1.5 text-xs">
                  <Zap className={`w-3.5 h-3.5 shrink-0 ${isFirst ? 'text-brand-rose' : 'text-brand-cyan'}`} />
                  <span className="font-normal text-slate-300 truncate">
                    {meta.focusText}
                  </span>
                </div>

                {/* 데스크톱 화살표 */}
                {idx < benchmarking.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-dark-800 border border-dark-700 text-slate-300 items-center justify-center shadow-md">
                    <ArrowRight className="w-3.5 h-3.5 text-brand-purpleLight" />
                  </div>
                )}

                {/* 모바일 화살표 */}
                {idx < benchmarking.length - 1 && (
                  <div className="flex lg:hidden justify-center pt-0.5 text-slate-500">
                    <ArrowDown className="w-3.5 h-3.5 text-brand-purpleLight" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 구분된 실행과제 명세서 (최우선 과제 vs 이후 단계) */}
      <div className="space-y-6">

        {/* 🚨 Section A: 가장 최우선 실행 과제 명세서 (Phase 1) */}
        {topPriorityTask && (() => {
          const summary = getTaskSummary(topPriorityTask);

          return (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 pb-1.5 border-b border-dark-700">
                <div className="w-7 h-7 rounded-lg bg-brand-rose/20 text-brand-rose flex items-center justify-center border border-brand-rose/40">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>최우선 실행 과제</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-rose/20 text-brand-rose border border-brand-rose/40 font-bold">
                    Phase 1 · 즉시 착수
                  </span>
                </h3>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border-2 border-brand-rose/60 shadow-lg shadow-rose-950/20 space-y-4">
                {/* 상단 타이틀 및 메타 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3.5 border-b border-dark-750">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-rose text-white text-sm font-bold flex items-center justify-center shadow-sm">
                      0{topPriorityTask.id}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-brand-rose block">
                        {topPriorityTask.category} (병목 해결)
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {topPriorityTask.title}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs self-start sm:self-auto">
                    <span className="px-2.5 py-1 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/30 font-bold">
                      영향도: {topPriorityTask.impact}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-dark-800 text-slate-300 border border-dark-700 font-normal">
                      난이도: {topPriorityTask.effort}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/30 font-normal">
                      일정: Day 1~14
                    </span>
                  </div>
                </div>

                {/* 핵심 내용 2분할 (text-sm 표준 폰트 적용) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
                    <span className="text-white font-bold block flex items-center text-sm gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-purple"></span>
                      배경 및 당면 문제
                    </span>
                    <p className="text-sm font-normal text-slate-200 leading-relaxed">
                      {summary.problem}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-dark-850 border border-brand-rose/30 space-y-2">
                    <span className="text-brand-cyan font-bold block flex items-center text-sm gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                      구체적 구현 방안
                    </span>
                    <p className="text-sm font-normal text-white leading-relaxed">
                      {summary.solution}
                    </p>
                  </div>
                </div>

                {/* 기대 효과 강조 바 */}
                <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-300">
                  <span className="text-slate-400 font-normal">달성 목표:</span>
                  <span className="text-brand-emerald font-bold">
                    {summary.impactGoal}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 🚀 Section B: 이후 단계 실행 과제 명세서 (Phase 2, Phase 3, ...) */}
        {subsequentTasks.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2 pb-1.5 border-b border-dark-700">
              <div className="w-7 h-7 rounded-lg bg-brand-purple/20 text-brand-purpleLight flex items-center justify-center border border-brand-purple/40">
                <Rocket className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>후속 단계 과제</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-dark-800 text-slate-300 border border-dark-700 font-bold">
                  Phase 2 ~ {benchmarking.length} (순차)
                </span>
              </h3>
            </div>

            <div className="space-y-4">
              {subsequentTasks.map((item, idx) => {
                const meta = getPhaseMeta(idx + 1);
                const summary = getTaskSummary(item);

                return (
                  <div 
                    key={item.id} 
                    className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4 hover:border-dark-600 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3.5 border-b border-dark-750">
                      <div className="flex items-center space-x-3">
                        <span className="w-7 h-7 rounded-lg bg-dark-800 text-slate-200 border border-dark-700 text-xs font-bold flex items-center justify-center shadow-sm">
                          0{item.id}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-brand-purpleLight">
                              {item.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${meta.badgeColor}`}>
                              {meta.phaseLabel} ({meta.timing})
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs self-start sm:self-auto">
                        <span className="px-2.5 py-1 rounded-md bg-brand-amber/20 text-brand-amber border border-brand-amber/40 font-bold">
                          영향도: {item.impact}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-dark-800 text-slate-300 border border-dark-700 font-normal">
                          난이도: {item.effort}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
                        <span className="text-white font-bold block text-sm">
                          배경 및 필요성
                        </span>
                        <p className="text-sm font-normal text-slate-200 leading-relaxed">
                          {summary.problem}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
                        <span className="text-brand-cyan font-bold block text-sm">
                          구체적 구현 방안
                        </span>
                        <p className="text-sm font-normal text-slate-200 leading-relaxed">
                          {summary.solution}
                        </p>
                      </div>
                    </div>

                    {/* 기대 효과 */}
                    <div className="p-3 rounded-xl bg-dark-850/80 border border-dark-750 text-sm flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 font-normal">기대 효과:</span>
                      <span className="text-brand-cyan font-bold">
                        {summary.impactGoal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default BenchmarkDetailSubpage;
