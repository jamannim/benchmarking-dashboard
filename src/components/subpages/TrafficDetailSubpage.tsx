import React, { useState, useMemo } from 'react';
import { 
  Globe, Search, Compass
} from 'lucide-react';
import type { CompleteServiceIntelligence, MonthlyTrafficRecord } from '../../types/intelligence';
import { BrandLogo, BrandBadgesFromText } from '../BrandLogo';
import { CountryFlag } from '../CountryFlag';
import { getTableDensityClasses, type TableDensity } from '../TableDensityControl';
import { PdfReportButton } from '../PdfReportButton';
import { getDynamicDateInfo, parseVerifiedDate } from '../../utils/trafficCalculators';

interface Props {
  data: CompleteServiceIntelligence;
  isEmbedded?: boolean;
}

export const TrafficDetailSubpage: React.FC<Props> = ({ data, isEmbedded = false }) => {
  const { traffic, countries, service, monthlyHistory } = data;

  const isNamane = service.domain.includes('namane') || service.domain.includes('iaurora');

  // 검색일자(service.verifiedAt) 기준 동적 현황집계일 산출
  const dateInfo = useMemo(() => {
    return getDynamicDateInfo(parseVerifiedDate(service.verifiedAt));
  }, [service.verifiedAt]);

  const aggregationDate = service.verifiedAt || dateInfo.formattedDate;

  // Country search analysis list from data
  const countrySearchList = useMemo(() => {
    if (data.countrySearchAnalysis && data.countrySearchAnalysis.length > 0) {
      return data.countrySearchAnalysis;
    }
    // Only return namane preset if active service is actually namane
    if (isNamane) {
      return [
        {
          countryCode: 'JP',
          countryName: '일본',
          flag: '🇯🇵',
          shareOfSearch: 25.13,
          mainPortals: [
            { name: 'Yahoo! Japan', share: 58.2 },
            { name: 'Google Japan', share: 41.8 }
          ],
          keywords: [
            { rank: 1, keyword: 'ナマネカード', portal: 'Yahoo! JP / Google', share: 42.5, estimatedVisits: 6400, intent: '브랜드 및 공식 홈페이지 접속' },
            { rank: 2, keyword: 'ナマネカード キオスク 場所', portal: 'Yahoo! JP', share: 24.8, estimatedVisits: 3700, intent: '공항·지하철역 발급기 위치 확인' },
            { rank: 3, keyword: '韓国 交通カード 推し活', portal: 'Google JP', share: 14.2, estimatedVisits: 2100, intent: '최애 아이돌 포토카드 굿즈 제작' },
            { rank: 4, keyword: 'namane card 日本 クレジットカード', portal: 'Yahoo! JP', share: 10.5, estimatedVisits: 1600, intent: '일본 신용카드(JCB/비자) 앱 충전 방법' },
            { rank: 5, keyword: 'ナマネカード ワウパス 比較', portal: 'Google JP', share: 8.0, estimatedVisits: 1200, intent: '와우패스 vs 나마네카드 혜택 비교' }
          ]
        },
        {
          countryCode: 'US',
          countryName: '미국 / 글로벌',
          flag: '🇺🇸',
          shareOfSearch: 20.27,
          mainPortals: [
            { name: 'Google', share: 92.4 },
            { name: 'Bing', share: 7.6 }
          ],
          keywords: [
            { rank: 1, keyword: 'namane card', portal: 'Google', share: 45.2, estimatedVisits: 5500, intent: 'Official Site & Card Service Search' },
            { rank: 2, keyword: 'namane card kiosk locations', portal: 'Google', share: 22.6, estimatedVisits: 2800, intent: 'Incheon Airport / Station Kiosk Map' },
            { rank: 3, keyword: 'korea custom transit card', portal: 'Google', share: 15.4, estimatedVisits: 1900, intent: 'Prepaid All-in-one Travel Card' },
            { rank: 4, keyword: 'how to charge namane foreign card', portal: 'Google', share: 10.8, estimatedVisits: 1300, intent: 'Foreign Visa/Mastercard 3DS In-app Reload' },
            { rank: 5, keyword: 'namane vs wowpass for tourists', portal: 'Bing / Google', share: 6.0, estimatedVisits: 750, intent: 'Comparison of Tourist Cards in Korea' }
          ]
        },
        {
          countryCode: 'KR',
          countryName: '대한민국',
          flag: '🇰🇷',
          shareOfSearch: 13.38,
          mainPortals: [
            { name: 'Naver', share: 68.4 },
            { name: 'Google Korea', share: 28.2 },
            { name: 'Daum', share: 3.4 }
          ],
          keywords: [
            { rank: 1, keyword: '나마네카드', portal: 'Naver / Google', share: 52.0, estimatedVisits: 4200, intent: '나마네카드 공식 사이트 및 앱 정보' },
            { rank: 2, keyword: '나마네카드 키오스크 위치', portal: 'Naver', share: 21.5, estimatedVisits: 1750, intent: '지하철역 및 공항 키오스크 발급기' },
            { rank: 3, keyword: '나마네카드 충전 잔액전환', portal: 'Naver', share: 13.8, estimatedVisits: 1100, intent: '페이잔액↔교통잔액 이동 방법 확인' },
            { rank: 4, keyword: '아이오로라 나마네카드', portal: 'Google KR', share: 7.2, estimatedVisits: 580, intent: '운영사(iAurora) 기업 및 솔루션 탐색' },
            { rank: 5, keyword: '교통카드 포토카드 제작', portal: 'Naver', share: 5.5, estimatedVisits: 450, intent: '레일플러스 기반 커스텀 인쇄' }
          ]
        },
        {
          countryCode: 'TW',
          countryName: '대만 / 홍콩',
          flag: '🇹🇼',
          shareOfSearch: 4.93,
          mainPortals: [
            { name: 'Google Taiwan', share: 94.5 },
            { name: 'Yahoo!奇摩', share: 5.5 }
          ],
          keywords: [
            { rank: 1, keyword: 'namane card 韓國', portal: 'Google TW', share: 46.0, estimatedVisits: 1400, intent: '韓國自由行 客製化交通卡' },
            { rank: 2, keyword: 'namane card 機台位置 (홍대/명동)', portal: 'Google TW', share: 28.5, estimatedVisits: 850, intent: '機場快線及熱門商圈機台查詢' },
            { rank: 3, keyword: 'namane card 交通卡 儲值', portal: 'Google TW', share: 15.5, estimatedVisits: 460, intent: 'APP海外信用卡即時加值指南' },
            { rank: 4, keyword: '韓國 追星 交通卡 (K-POP 포토카드)', portal: 'Yahoo TW', share: 10.0, estimatedVisits: 300, intent: '偶像照片客製化悠遊卡紀念品' }
          ]
        }
      ];
    }
    return [];
  }, [data.countrySearchAnalysis, isNamane]);

  // Initial selected country dynamically matching top country of service
  const initialCountryCode = useMemo(() => {
    if (countrySearchList.length > 0) return countrySearchList[0].countryCode;
    if (countries && countries.length > 0) return countries[0].code;
    return 'KR';
  }, [countrySearchList, countries]);

  // State for country search analysis
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(initialCountryCode);

  // Density state for keywords table
  const kwDensity: TableDensity = 'auto';
  const kwClasses = getTableDensityClasses(kwDensity);

  const activeCountrySearch = useMemo(() => {
    if (countrySearchList.length === 0) return null;
    return countrySearchList.find(c => c.countryCode === selectedCountryCode) || countrySearchList[0];
  }, [countrySearchList, selectedCountryCode]);

  const [selectedMonth, setSelectedMonth] = useState<number>(10);

  const selectedRecord: MonthlyTrafficRecord = useMemo(() => {
    if (monthlyHistory && monthlyHistory.length > 0) {
      return monthlyHistory.find(r => r.month === selectedMonth) || monthlyHistory.find(r => r.month === 10) || monthlyHistory[0];
    }
    const topCountryItem = countries && countries.length > 0 ? countries[0] : null;
    return {
      period: '2026-10',
      year: 2026,
      month: 10,
      visits: traffic.totalVisits || 0,
      bounceRate: traffic.bounceRate,
      pagesPerVisit: traffic.pagesPerVisit,
      searchShare: traffic.searchShare,
      topCountry: topCountryItem?.name || '대한민국',
      topCountryShare: topCountryItem?.share || 97.8,
      note: `${dateInfo.month}월 1일~${dateInfo.month}월 ${dateInfo.day}일 집계치 (${dateInfo.day}일간 누적)`,
      periodRange: `${dateInfo.month}월 1일~${dateInfo.month}월 ${dateInfo.day}일`
    };
  }, [monthlyHistory, selectedMonth, traffic, countries]);

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner (독립 서브페이지 탭 전용) */}
      {!isEmbedded && (
        <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-dark-900 border border-dark-700 flex flex-col md:flex-row md:items-start md:justify-between gap-2.5 sm:gap-3 font-sans">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 flex items-center">
                <Globe className="w-3.5 h-3.5 mr-1" />
                Similarweb 실측
              </span>
              <span className="text-xs text-slate-400">
                월간 총 방문: {traffic.totalVisits.toLocaleString()}회 (현황집계일 기준 : {aggregationDate})
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white flex items-center gap-2 pt-0.5">
              <BrandLogo domain={service.domain} size="md" />
              <span>트래픽 세부데이터</span>
              <span className="hidden sm:inline text-sm font-normal text-slate-400 font-sans">| 월별 검색·유입 추이</span>
            </h2>
            <p className="hidden sm:block text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              월별 검색·유입 키워드 및 국가별 포털 점유율 상세 분석
            </p>
          </div>

          {/* PDF 다운로드 버튼 (데스크톱 전용) */}
          <div className="hidden md:block self-end md:self-start shrink-0">
            <PdfReportButton data={data} tab="traffic" />
          </div>
        </div>
      )}

      {/* 6. Country Search Portals & Keyword Intelligence */}
      <div className="p-5 rounded-xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-dark-700 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-brand-cyan" />
              <h3 className="text-sm font-bold text-white">
                국가별 유입 검색 키워드 분석
              </h3>
              <span className="text-[15px] px-2 py-0.5 rounded font-bold bg-brand-cyan/15 text-brand-cyan">
                자연 검색 82.06% 정밀 분석
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs text-slate-400">
              {selectedRecord.periodRange ? `기간: ${selectedRecord.periodRange}` : `기준: ${String(selectedRecord.year).slice(-2)}년 ${selectedRecord.month}월`}
            </span>
            <div className="inline-flex items-center rounded-lg bg-dark-950 p-0.5 border border-dark-750 text-xs">
              {[
                { m: 8, label: '8월', range: '8.01~8.31' },
                { m: 9, label: '9월', range: '9.01~9.30' },
                { m: 10, label: '10월', range: '10.01~10.06' }
              ].map((item) => (
                <button
                  key={item.m}
                  type="button"
                  onClick={() => setSelectedMonth(item.m)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedRecord.month === item.m
                      ? 'bg-brand-cyan text-dark-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`text-[10px] hidden xs:inline ${selectedRecord.month === item.m ? 'text-dark-950 font-semibold' : 'text-slate-500'}`}>({item.range})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Country Filter Buttons */}
        {countrySearchList.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {countrySearchList.map((country) => {
              const isSelected = selectedCountryCode === country.countryCode;
              return (
                <button
                  key={country.countryCode}
                  onClick={() => setSelectedCountryCode(country.countryCode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    isSelected 
                      ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25 ring-1 ring-brand-purple' 
                      : 'bg-dark-850 hover:bg-dark-800 text-slate-300 border border-dark-750'
                  }`}
                >
                  <CountryFlag code={country.countryCode} name={country.countryName} size="sm" />
                  <span>{country.countryName}</span>
                  <span className="text-[15px] opacity-75 font-normal">({country.shareOfSearch}%)</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Portals & Keywords Grid */}
        {activeCountrySearch ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
          
          {/* Left: Search Portals Market Share in that Country (4 cols) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-dark-700">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CountryFlag code={activeCountrySearch.countryCode} name={activeCountrySearch.countryName} size="sm" />
                <span>{activeCountrySearch.countryName} 유입 포털 비중</span>
              </span>
              <span className="text-[15px] text-brand-purpleLight font-bold">주요 유입 경로</span>
            </div>

            <div className="space-y-3 pt-1">
              {activeCountrySearch.mainPortals.map((portal, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <BrandBadgesFromText text={portal.name} size="xs" />
                    </span>
                    <span className="font-bold text-brand-cyan font-mono">{portal.share}%</span>
                  </div>
                  <div className="w-full bg-dark-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${idx === 0 ? 'bg-brand-cyan' : 'bg-brand-purple'}`} 
                      style={{ width: `${portal.share}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-750/70 text-[16.5px] text-slate-400 leading-relaxed mt-3 break-keep">
              💡 <strong>{activeCountrySearch.countryName} 인사이트:</strong> {activeCountrySearch.countryCode === 'JP' ? '야후재팬(58%) 중심 유입, 야후 검색 최적화(SEO) 핵심' : activeCountrySearch.countryCode === 'KR' ? '네이버 블로그 및 키오스크 위치 검색(68%) 중심' : '구글 모바일 검색 90% 이상 점유'}
            </div>
          </div>

          {/* Right: Detailed Keywords Table (8 cols) */}
          <div className="lg:col-span-8 p-4 rounded-xl bg-dark-850 border border-dark-750">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-dark-700 mb-2.5 gap-2">
              <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                <CountryFlag code={activeCountrySearch.countryCode} name={activeCountrySearch.countryName} size="sm" />
                <span>{activeCountrySearch.countryName} 유입 검색어 Top 5</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[16.5px] text-slate-400 font-mono">
                  {selectedRecord.month}월 기준 유입
                </span>
                
              </div>
            </div>

            {/* 모바일 화면 (가로 스크롤바 0%, 키워드 카드 뷰) */}
            <div className="space-y-3 md:hidden font-sans">
              {activeCountrySearch.keywords.map((kw) => {
                const countryVisits = Math.round((selectedRecord.visits * activeCountrySearch.shareOfSearch) / 100);
                const keywordVisits = Math.round((countryVisits * kw.share) / 100);
                return (
                  <div key={kw.rank} className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-dark-750 text-center font-bold text-xs text-brand-cyan shrink-0 flex items-center justify-center tabular-nums">
                          {kw.rank}
                        </span>
                        <span className="font-bold text-sm text-white">{kw.keyword}</span>
                      </div>
                      <span className="font-black text-sm text-brand-purpleLight tabular-nums">
                        {kw.share}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                        <div className="text-[10px] text-slate-400">추정 방문</div>
                        <div className="font-bold text-white tabular-nums mt-0.5">
                          약 {keywordVisits.toLocaleString()}회
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                        <div className="text-[10px] text-slate-400">검색 포털</div>
                        <div className="mt-1">
                          <BrandBadgesFromText text={kw.portal} size="xs" />
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 pt-1 border-t border-dark-800 flex items-center">
                      <Compass className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" />
                      <span className="text-slate-400 font-semibold mr-1">[의도]</span>
                      <span>{kw.intent}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
              <table className={`w-full table-fixed text-left ${kwClasses.tableText}`}>
                <thead className="bg-dark-900 text-slate-400 font-semibold border-b border-dark-750 text-xs">
                  <tr>
                    <th className={`${kwClasses.th} rounded-l text-center w-[7%]`}>순위</th>
                    <th className={`${kwClasses.th} w-[20%]`}>키워드</th>
                    <th className={`${kwClasses.th} text-right w-[12%]`}>점유율</th>
                    <th className={`${kwClasses.th} text-right w-[15%]`}>방문수</th>
                    <th className={`${kwClasses.th} w-[18%]`}>포털</th>
                    <th className={`${kwClasses.th} rounded-r w-[28%]`}>의도 (설명)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-750/70 text-slate-200 text-xs sm:text-sm">
                  {activeCountrySearch.keywords.map((kw) => {
                    const countryVisits = Math.round((selectedRecord.visits * activeCountrySearch.shareOfSearch) / 100);
                    const keywordVisits = Math.round((countryVisits * kw.share) / 100);
                    return (
                      <tr key={kw.rank} className="hover:bg-dark-800/50 transition-colors">
                        {/* 1. 순위 */}
                        <td className={`${kwClasses.td} text-center`}>
                          <span className="inline-flex w-5 h-5 rounded bg-dark-750 items-center justify-center font-bold text-xs text-brand-cyan shrink-0 tabular-nums">
                            {kw.rank}
                          </span>
                        </td>

                        {/* 2. 키워드 */}
                        <td className={`${kwClasses.td} font-medium`}>
                          <span className="font-bold text-white break-keep">{kw.keyword}</span>
                        </td>

                        {/* 3. 점유율 (숫자 좌측) */}
                        <td className={`${kwClasses.td} text-right`}>
                          <span className="font-bold text-brand-purpleLight font-mono tabular-nums">{kw.share}%</span>
                        </td>

                        {/* 4. 추정 방문수 (숫자 좌측) */}
                        <td className={`${kwClasses.td} font-mono text-slate-300 whitespace-nowrap text-right tabular-nums`}>
                          약 {keywordVisits.toLocaleString()}회
                        </td>

                        {/* 5. 검색 포털 */}
                        <td className={kwClasses.td}>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-dark-900 border border-dark-750 text-slate-300 font-mono text-xs">
                            <BrandBadgesFromText text={kw.portal} size="xs" />
                          </div>
                        </td>

                        {/* 6. 검색 의도 (설명 우측 끝) */}
                        <td className={`${kwClasses.td} text-slate-400 text-xs break-keep`}>
                          <div className="flex items-center">
                            <Compass className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" />
                            <span>{kw.intent}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-dark-850/60 border border-dark-750">
            <Search className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-300">
              해당 도메인의 국가별 검색 키워드 및 포털 점유율 분석 정보가 없습니다.
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              [미확인: 도메인 검색 키워드 공시 데이터 없음]
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

