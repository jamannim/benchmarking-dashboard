import React from 'react';
import { 
  Globe, 
  FileText, 
  Layers, 
  Smartphone, 
  CheckCircle2,
  Server
} from 'lucide-react';
import type { CompleteServiceIntelligence } from '../types/intelligence';
import type { SubpageTab } from './Header';
import { BrandLogo } from './BrandLogo';
import type { VerificationResult } from './landing/UrlVerificationModal';

interface Props {
  data: CompleteServiceIntelligence;
  onAnalyzeUrl?: (rawUrl: string, verificationResult?: VerificationResult) => void;
  onExportReport?: () => void;
  historyDomains?: string[];
  activeTab?: SubpageTab;
  isDemoMode?: boolean;
}

export const ActiveModelBanner: React.FC<Props> = ({
  data,
  onExportReport,
  activeTab,
}) => {
  const { service, traffic, app } = data;
  const brandCleanName = service.name.split(' (')[0];

  return (
    <section 
      aria-label="현재 활성 분석 모델 배너"
      className="rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-purple-950/40 border-2 border-purple-500/40 shadow-xl shadow-purple-950/20 relative overflow-hidden px-4 py-3 sm:px-5 sm:py-3.5 font-sans transition-all"
    >
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 sm:gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3.5 min-w-0 shrink-0">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-dark-950/90 border border-purple-500/30 shadow-inner shrink-0">
            <BrandLogo domain={service.domain} size="lg" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="text-[11px] text-slate-400 font-mono">
              기준일: {service.verifiedAt || '2026.10 최신'}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{brandCleanName}</span>
                <span
                  className="text-xs sm:text-sm font-mono text-purple-300 bg-dark-950/60 px-2 py-0.5 rounded-md border border-dark-700"
                >
                  {service.domain}
                </span>
              </h1>
            </div>

            <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 flex-wrap">
              <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-purple-200 font-bold">산업군:</span>
              <span className="text-slate-200">{service.category}</span>
            </p>
          </div>
        </div>

        {/* Center: 탭별 외부 실측·공시 데이터 연동 상태 (사용자 요청: 상단 빈 공간으로 위치 이동 & 컴팩트 단일 행 배치) */}
        <div className="flex-1 flex items-center justify-start xl:justify-center flex-wrap gap-2.5 min-w-0">
          
          {/* 1. 트래픽 / 종합 탭: 시밀러웹 실측 + 스토어 양대 마켓 */}
          {(!activeTab || activeTab === 'overview' || activeTab === 'traffic') && (
            <>
              {/* Similarweb 글로벌 트래픽 실측 */}
              <div className="px-3 py-2 rounded-xl bg-dark-950/80 border border-purple-500/30 flex items-center gap-2.5 shadow-sm">
                <div className="p-1.5 rounded-lg bg-purple-500/10 shrink-0">
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    시밀러웹 실측
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white font-mono truncate">
                    월 {traffic.totalVisits.toLocaleString()}회
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                    검색점유 {traffic.searchShare}% · 이탈 {traffic.bounceRate}%
                  </div>
                </div>
              </div>

              {/* 스토어 양대 마켓 실측 */}
              <div className="px-3 py-2 rounded-xl bg-dark-950/80 border border-cyan-500/30 flex items-center gap-2.5 shadow-sm">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 shrink-0">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    스토어 양대 마켓
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white font-mono truncate">
                    {app.downloads}
                  </div>
                  <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
                    평점 {app.rating}★ ({app.reviewCount})
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 4. 사업전략 탭: 단일 핵심 사업 전략 실측 연동 */}
          {activeTab === 'business' && (
            <div className="px-3.5 py-2 rounded-xl bg-dark-950/80 border border-indigo-500/30 flex items-center gap-2.5 shadow-sm">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 shrink-0">
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  기업 공식 전략 파이프라인
                </div>
                <div className="text-xs sm:text-sm font-black text-white truncate">
                  단일 핵심 사업 전략 실측 연동
                </div>
                <div className="text-[10px] text-indigo-300 font-mono flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>공식 도메인·IR 공시 기반</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. 서버비용 탭 */}
          {activeTab === 'server' && (
            <div className="px-3.5 py-2 rounded-xl bg-dark-950/80 border border-cyan-500/30 flex items-center gap-2.5 shadow-sm">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 shrink-0">
                <Server className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  클라우드 인프라 실측
                </div>
                <div className="text-xs sm:text-sm font-black text-white truncate">
                  트래픽 연동 인프라 견적
                </div>
                <div className="text-[10px] text-cyan-300 font-mono flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>AWS / GCP 아키텍처 모델</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: DART/공시 결산 검증완료 네모박스 (상단) + PDF 보고서 버튼 (하단) */}
        <div className="flex flex-col items-start xl:items-end gap-2 shrink-0 self-start xl:self-center">
          {/* 상위 네모박스: IR탭일 때 (다트, 혁신의숲 로고) 공시 검증완료 / 서비스탭일 때 (다트로고) DART 결산 검증완료 */}
          {(activeTab === 'ir' || activeTab === 'gmv') ? (
            <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-dark-950/90 border border-cyan-500/30 flex items-center gap-2 shadow-sm">
              <div className="flex items-center -space-x-1 shrink-0">
                <BrandLogo brandKey="dart" size="xs" className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded shadow-sm" />
                <BrandLogo brandKey="innoforest" size="xs" className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded shadow-sm" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>공시</span>
                <span className="text-[10px] text-cyan-300 font-mono font-bold bg-cyan-950/50 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                  검증완료
                </span>
              </span>
            </div>
          ) : (
            <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-dark-950/90 border border-purple-500/30 flex items-center gap-2 shadow-sm">
              <BrandLogo brandKey="dart" size="xs" className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded shadow-sm shrink-0" />
              <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>DART 결산</span>
                <span className="text-[10px] text-cyan-300 font-mono font-bold bg-cyan-950/50 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                  검증완료
                </span>
              </span>
            </div>
          )}

          {onExportReport && (
            <button
              type="button"
              onClick={onExportReport}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-dark-650 hover:border-purple-400/50 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>PDF 보고서</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
