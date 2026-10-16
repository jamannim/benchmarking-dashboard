import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import type { CompleteServiceIntelligence } from '../types/intelligence';

interface Props {
  data: CompleteServiceIntelligence;
}

export const ConsistencyCheck: React.FC<Props> = ({ data }) => {
  const { consistency, traffic, app, service } = data;

  return (
    <div className="p-5 rounded-xl bg-dark-900 border border-dark-700">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-dark-700 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-brand-emerald/10 text-brand-emerald">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">데이터 정합성 및 신뢰도 검증</h2>
            <p className="text-xs text-slate-400">{service.domain} 웹 트래픽과 앱 다운로드 간 인과 검증</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
            정합성 점수: {consistency.score}점 / 100점
          </span>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-dark-850 border border-dark-750">
        <h3 className="text-xs font-semibold text-slate-300 mb-3">검증된 전환 퍼널 구조</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          
          <div className="p-3 rounded-lg bg-dark-800 border border-dark-700">
            <div className="text-xs text-slate-400">1. 사전 웹 탐색</div>
            <div className="text-lg font-bold text-white mt-1">월 {traffic.totalVisits.toLocaleString()}회</div>
            <div className="text-xs text-brand-purpleLight mt-0.5">검색 유입 {traffic.searchShare}%</div>
          </div>

          <div className="p-3 rounded-lg bg-dark-800 border border-dark-700 relative">
            <div className="text-xs text-slate-400">2. 평균 탐색 심도</div>
            <div className="text-lg font-bold text-white mt-1">{traffic.pagesPerVisit} 페이지</div>
            <div className="text-xs text-brand-cyan mt-0.5">체류 시간 {traffic.avgDuration}</div>
          </div>

          <div className="p-3 rounded-lg bg-dark-800 border border-dark-700">
            <div className="text-xs text-slate-400">3. 이탈률</div>
            <div className="text-lg font-bold text-brand-emerald mt-1">{traffic.bounceRate}%</div>
            <div className="text-xs text-slate-400 mt-0.5">안정적 탐색 유지</div>
          </div>

          <div className="p-3 rounded-lg bg-dark-800 border border-dark-700">
            <div className="text-xs text-slate-400">4. 스토어 유저 규모</div>
            <div className="text-lg font-bold text-brand-blue mt-1">{app.downloads}</div>
            <div className="text-xs text-brand-amber mt-0.5">평점 {app.rating}★ ({app.reviewCount})</div>
          </div>

        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {consistency.evidenceItems.map((item, idx) => (
          <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-lg bg-dark-800/60 border border-dark-750">
            <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
            <span className="text-xs text-slate-300 leading-relaxed">{item}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
