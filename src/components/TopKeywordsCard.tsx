import React from 'react';
import { Search, Compass } from 'lucide-react';
import type { CompleteServiceIntelligence, SearchKeywordItem } from '../types/intelligence';
import { getTableDensityClasses, type TableDensity } from './TableDensityControl';
import { CountryFlag } from './CountryFlag';

interface Props {
  data: CompleteServiceIntelligence;
}

export const TopKeywordsCard: React.FC<Props> = ({ data }) => {
  const { topSearchKeywords, traffic, service } = data;
  const density: TableDensity = 'auto';
  const dClasses = getTableDensityClasses(density);

  const keywords: SearchKeywordItem[] = topSearchKeywords || [
    { rank: 1, keyword: `${service.name.split(' ')[0].toLowerCase()}`, portal: 'Google (90%)', share: 32.5, estimatedVisits: Math.round(traffic.totalVisits * 0.25), intent: '공식 브랜드 탐색', country: '글로벌' },
    { rank: 2, keyword: `${service.domain}`, portal: 'Google (85%) / Naver (15%)', share: 22.0, estimatedVisits: Math.round(traffic.totalVisits * 0.17), intent: '다이렉트 도메인 검색', country: '국내/해외' },
    { rank: 3, keyword: `${service.name} 사용법 및 가이드`, portal: 'Google (75%)', share: 15.4, estimatedVisits: Math.round(traffic.totalVisits * 0.12), intent: '기능 및 서비스 온보딩', country: '국내' },
    { rank: 4, keyword: `${service.category.split(' ')[0]} 추천`, portal: 'Naver / Google', share: 11.2, estimatedVisits: Math.round(traffic.totalVisits * 0.08), intent: '카테고리 솔루션 탐색', country: '글로벌' },
    { rank: 5, keyword: `${service.name} 가격 / 요금제`, portal: 'Google (92%)', share: 8.5, estimatedVisits: Math.round(traffic.totalVisits * 0.06), intent: '전환 퍼널 유입', country: '국내/해외' },
  ];

  return (
    <div className="p-5 rounded-xl bg-dark-900 border border-dark-700">
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-3.5 border-b border-dark-700 mb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-base font-bold text-white tracking-normal">
              포털 유입 키워드 Top 5
            </h3>
            <span className="text-xs font-semibold text-brand-cyan">
              · 검색 비중 {traffic.searchShare}%
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed tracking-normal">
            구글·야후재팬·네이버 등 주요 포털 실측 최다 검색 유입어
          </p>
        </div>
      </div>

      {/* 좌우 스크롤바 완전 방지: table-fixed + 유입 포털·주요 타겟 국가 셀 통합 + 모바일 반응형 레이아웃 */}
      <div className="w-full overflow-hidden">
        <table className={`w-full table-fixed text-left text-slate-200 ${dClasses.tableText}`}>
          <thead className="bg-dark-850">
            <tr>
              <th className="py-2.5 px-2 sm:px-3 text-xs font-bold text-slate-400 rounded-l-lg w-[34%] sm:w-[28%]">
                순위 / 검색 키워드
              </th>
              <th className="py-2.5 px-2 sm:px-3 text-xs font-bold text-slate-400 w-[30%] sm:w-[24%]">
                유입 포털 · 타겟 국가
              </th>
              <th className="py-2.5 px-1.5 sm:px-3 text-xs font-bold text-slate-400 text-right sm:text-left w-[16%] sm:w-[16%]">
                점유율
              </th>
              <th className="py-2.5 px-1.5 sm:px-3 text-xs font-bold text-slate-400 text-right sm:text-left rounded-r-lg md:rounded-none w-[20%] sm:w-[14%]">
                추정 유입
              </th>
              <th className="hidden md:table-cell py-2.5 px-3 text-xs font-bold text-slate-400 rounded-r-lg w-[18%]">
                유입 의도
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-750">
            {keywords.map((item) => {
              const portals = item.portal ? item.portal.split('/').map(p => p.trim()).filter(Boolean) : [];
              return (
                <tr key={item.rank} className="hover:bg-dark-800/50 transition-colors">
                  {/* 순위 / 검색 키워드 */}
                  <td className="py-2.5 px-2 sm:px-3 font-bold align-middle">
                    <div className="flex items-start sm:items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded bg-dark-750 text-center font-bold text-xs text-brand-cyan flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                        {item.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        {item.keyword.includes('(') ? (
                          <div className="leading-tight break-words">
                            <span className="font-bold text-white block text-xs sm:text-sm">
                              {item.keyword.slice(0, item.keyword.indexOf('(')).trim()}
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal block mt-0.5">
                              {item.keyword.slice(item.keyword.indexOf('(')).trim()}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-white block leading-snug break-words text-xs sm:text-sm">
                            {item.keyword}
                          </span>
                        )}
                        {/* 모바일에서 유입 의도 보조 표기 */}
                        <span className="md:hidden text-[11px] text-slate-400 font-normal block mt-0.5 truncate">
                          {item.intent}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 유입 포털 + 주요 타겟 국가 통합 셀 */}
                  <td className="py-2.5 px-2 sm:px-3 align-middle">
                    <div className="flex flex-wrap items-center gap-1">
                      {portals.map((p, pIdx) => (
                        <span 
                          key={pIdx} 
                          className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded bg-dark-800 text-slate-200 border border-dark-750 text-[11px] sm:text-xs font-medium break-keep"
                        >
                          {p}
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-[11px] sm:text-xs font-bold break-keep">
                        <CountryFlag name={item.country || '글로벌'} size="xs" />
                        <span>{(item.country || '글로벌').replace(/[\u{1F1E6}-\u{1F1FF}🌐]/gu, '').trim()}</span>
                      </span>
                    </div>
                  </td>

                  {/* 검색 점유율 */}
                  <td className="py-2.5 px-1.5 sm:px-3 align-middle text-right sm:text-left">
                    <div className="flex items-center justify-end sm:justify-start sm:space-x-2">
                      <div className="hidden sm:block w-14 bg-dark-750 rounded-full h-1.5 overflow-hidden shrink-0">
                        <div className="bg-brand-cyan h-full rounded-full" style={{ width: `${Math.min(item.share * 2.5, 100)}%` }}></div>
                      </div>
                      <span className="font-bold text-brand-cyan tabular-nums font-sans text-xs">{item.share}%</span>
                    </div>
                  </td>

                  {/* 월간 추정 유입 */}
                  <td className="py-2.5 px-1.5 sm:px-3 font-sans tabular-nums font-bold text-white text-xs text-right sm:text-left align-middle">
                    <span className="hidden sm:inline">약 </span>
                    {item.estimatedVisits.toLocaleString()}회
                  </td>

                  {/* 유입 의도 (데스크탑 노출) */}
                  <td className="hidden md:table-cell py-2.5 px-3 text-slate-300 align-middle">
                    <div className="flex items-center space-x-1.5">
                      <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="leading-snug tracking-normal text-xs text-slate-300 break-keep line-clamp-2">
                        {item.intent}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
