import React from 'react';
import type { CompleteServiceIntelligence } from '../types/intelligence';
import { BrandLogo } from './BrandLogo';
import { getTableDensityClasses, type TableDensity } from './TableDensityControl';

interface Props {
  data: CompleteServiceIntelligence;
}

export const TopPagesList: React.FC<Props> = ({ data }) => {
  const density: TableDensity = 'auto';
  const dClasses = getTableDensityClasses(density);

  return (
    <div className="p-5 rounded-xl bg-dark-900 border border-dark-700">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-dark-700 gap-2">
        <div className="flex items-center space-x-2.5">
          <BrandLogo domain={data.service.domain} size="md" />
          <div>
            <h3 className="text-base font-bold text-white tracking-normal flex items-center space-x-2">
              <span>인기 서브 페이지</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed tracking-normal">
              최다 유입 핵심 URL 경로 및 비즈니스 전환 기여도
            </p>
          </div>
        </div>

        
      </div>

      {/* 모바일 화면 (가로 스크롤바 0%, 페이지 카드 뷰) */}
      {data.topPages.length === 0 ? (
        <div className="mt-4 p-8 text-center rounded-xl bg-dark-850/60 border border-dark-750 font-sans">
          <p className="text-sm font-semibold text-slate-300">
            해당 도메인의 인기 서브 페이지 분석 데이터가 등록되어 있지 않습니다.
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            [미확인: 도메인 서브페이지 분석 데이터 없음]
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-3 md:hidden font-sans">
            {data.topPages.map((page, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-dark-750">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-dark-750 text-center font-bold text-xs text-brand-cyan flex items-center justify-center shrink-0 tabular-nums">
                  {idx + 1}
                </span>
                <BrandLogo domain={data.service.domain} size="xs" />
                <span className="font-bold text-sm text-white">{page.path}</span>
              </div>
              <span className="font-black text-sm text-brand-cyan tabular-nums">{page.share}%</span>
            </div>

            <div className="text-xs text-slate-200">
              <span className="text-slate-400 font-semibold mr-1">[페이지]</span>
              <span>{page.name}</span>
            </div>

            <div className="w-full bg-dark-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-brand-cyan h-full rounded-full" style={{ width: `${page.share}%` }} />
            </div>

            <div className="text-xs text-slate-400 pt-1 border-t border-dark-800">
              <span className="text-slate-500 mr-1">[역할]</span>
              <span>{page.role}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
      <div className="mt-4 hidden md:block overflow-hidden rounded-xl border border-dark-750">
        <table 
          className={`w-full table-fixed text-left text-slate-300 font-sans ${dClasses.tableText}`}
          style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          <thead className="bg-dark-850 text-slate-400 font-semibold text-xs">
            <tr>
              <th className={`${dClasses.th} rounded-l-lg text-center w-[7%]`}>순위</th>
              <th className={`${dClasses.th} w-[22%]`}>경로</th>
              <th className={`${dClasses.th} w-[16%]`}>점유율</th>
              <th className={`${dClasses.th} w-[25%]`}>페이지명</th>
              <th className={`${dClasses.th} rounded-r-lg w-[30%]`}>비즈니스 역할 (설명)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-750 text-xs sm:text-sm">
            {data.topPages.map((page, idx) => (
              <tr key={idx} className="hover:bg-dark-800/50 transition-colors">
                {/* 1. 순위 */}
                <td className={`${dClasses.td} text-center`}>
                  <span className="inline-flex w-5 h-5 rounded bg-dark-750 items-center justify-center font-bold text-xs text-brand-cyan shrink-0 tabular-nums">
                    {idx + 1}
                  </span>
                </td>

                {/* 2. 경로 */}
                <td className={`${dClasses.td} font-sans text-slate-200`}>
                  <div className="flex items-center space-x-1.5">
                    <BrandLogo domain={data.service.domain} size="xs" />
                    <span className="font-semibold text-white tracking-normal truncate">{page.path}</span>
                  </div>
                </td>

                {/* 3. 점유율 (숫자 좌측) */}
                <td className={dClasses.td}>
                  <div className="flex items-center space-x-2">
                    <div className="w-14 bg-dark-750 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-brand-cyan h-full rounded-full" style={{ width: `${page.share}%` }}></div>
                    </div>
                    <span className="text-brand-cyan font-bold font-sans text-xs tabular-nums">{page.share}%</span>
                  </div>
                </td>

                {/* 4. 페이지명 */}
                <td className={`${dClasses.td} font-medium text-slate-200 tracking-normal break-keep`}>
                  {page.name}
                </td>

                {/* 5. 비즈니스 역할 (설명 우측 끝) */}
                <td className={`${dClasses.td} text-slate-400 tracking-normal leading-relaxed break-keep text-xs`}>
                  {page.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
      )}
    </div>
  );
};
