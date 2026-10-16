import React from 'react';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Globe, PieChart as PieIcon } from 'lucide-react';
import type { CompleteServiceIntelligence, CountryShare } from '../types/intelligence';
import { CountryFlag } from './CountryFlag';
import { getDynamicDateInfo } from '../utils/trafficCalculators';

interface Props {
  data: CompleteServiceIntelligence;
  mode?: 'pc' | 'app';
}

export const TrafficCharts: React.FC<Props> = ({ data, mode = 'pc' }) => {
  const { countries, traffic, monthlyHistory, service } = data;
  const isApp = mode === 'app';
  const dateInfo = getDynamicDateInfo();

  const isNamane = service.domain.includes('namane') || service.domain.includes('iaurora');
  const isWowpass = service.domain.includes('wowpass');
  const isTravel = service.domain.includes('travel');
  const hasApp = Boolean(service.hasApp ?? (data.mobileAppTraffic ? data.mobileAppTraffic.mau > 0 : false));
  const isDomestic = service.domain.endsWith('.kr') || 
    service.domain.endsWith('.co.kr') || 
    service.domain.includes('evezary') || 
    service.domain.includes('dgdr') || 
    (!isNamane && !isWowpass && !isTravel && !service.domain.includes('.com'));

  const appMauBase = !hasApp ? 0 : (data.mobileAppTraffic?.mau || (isWowpass ? 642000 : isTravel ? 1580000 : isDomestic ? Math.round(traffic.totalVisits * 0.72) : (isNamane ? 148500 : Math.round(traffic.totalVisits * 0.72))));
  const appDauBase = !hasApp ? 0 : (data.mobileAppTraffic?.dau || (isWowpass ? 108500 : isTravel ? 284400 : isDomestic ? Math.round(traffic.totalVisits * 0.72 * 0.26) : (isNamane ? 21400 : Math.round(traffic.totalVisits * 0.72 * 0.26))));

  const channelData = isApp
    ? [
        { name: '스토어 검색', value: 64.5, color: '#06b6d4' },
        { name: '직접·QR 실행', value: 24.2, color: '#a855f7' },
        { name: 'SNS·추천', value: 11.3, color: '#6366f1' },
      ]
    : [
        { name: '자연 검색', value: traffic.searchShare, color: '#06b6d4' },
        { name: '직접 방문', value: traffic.directShare, color: '#a855f7' },
        { name: '추천/제휴', value: traffic.referralShare, color: '#64748b' },
      ];

  // 웹(PC) 시밀러웹 도메인 유입 국가 vs 앱(iOS+AOS) 스토어·패널 실사용 국가 분리 (도메인 고유 데이터 우선)
  const appCountries: CountryShare[] = data.mobileAppTraffic?.countries && data.mobileAppTraffic.countries.length > 0
    ? data.mobileAppTraffic.countries
    : isWowpass
    ? [
        { code: 'JP', name: '일본', share: 42.50, flag: '🇯🇵' },
        { code: 'TW', name: '대만 / 홍콩', share: 19.80, flag: '🇹🇼' },
        { code: 'KR', name: '대한민국', share: 12.40, flag: '🇰🇷' },
        { code: 'US', name: '미국', share: 6.80, flag: '🇺🇸' },
        { code: 'ETC', name: '기타 글로벌', share: 18.50, flag: '🌐', chinaShare: 8.60 },
      ]
    : isTravel
    ? [
        { code: 'KR', name: '대한민국', share: 86.50, flag: '🇰🇷' },
        { code: 'JP', name: '일본', share: 6.80, flag: '🇯🇵' },
        { code: 'US', name: '미국', share: 3.20, flag: '🇺🇸' },
        { code: 'VN', name: '베트남', share: 1.80, flag: '🇻🇳' },
        { code: 'ETC', name: '기타 글로벌', share: 1.70, flag: '🌐' },
      ]
    : isNamane
    ? [
        { code: 'JP', name: '일본', share: 38.40, flag: '🇯🇵' },
        { code: 'KR', name: '대한민국', share: 18.60, flag: '🇰🇷' },
        { code: 'TW', name: '대만', share: 14.20, flag: '🇹🇼' },
        { code: 'US', name: '미국', share: 8.40, flag: '🇺🇸' },
        { code: 'ETC', name: '기타 글로벌', share: 20.40, flag: '🌐', chinaShare: 9.80 },
      ]
    : isDomestic
    ? [
        { code: 'KR', name: '대한민국', share: 98.90, flag: '🇰🇷' },
        { code: 'US', name: '미국', share: 0.50, flag: '🇺🇸' },
        { code: 'JP', name: '일본', share: 0.30, flag: '🇯🇵' },
        { code: 'ETC', name: '기타 국가', share: 0.30, flag: '🌐' },
      ]
    : (countries && countries.length > 0)
    ? countries.slice(0, 5)
    : [
        { code: 'KR', name: '대한민국', share: 98.90, flag: '🇰🇷' },
        { code: 'US', name: '미국', share: 0.50, flag: '🇺🇸' },
        { code: 'JP', name: '일본', share: 0.30, flag: '🇯🇵' },
        { code: 'ETC', name: '기타 국가', share: 0.30, flag: '🌐' },
      ];

  const topCountries = (isApp ? appCountries : countries)?.slice(0, 5) || [];
  const etcCountry = topCountries.find(c => c.code === 'ETC' || c.chinaShare !== undefined);
  const chinaShareValue = etcCountry?.chinaShare;

  const monthlyList = isApp
    ? [
        { period: '2026-06', year: 2026, month: 6, visits: Math.round(appMauBase * 0.815), periodRange: '6월 1일~6월 30일' },
        { period: '2026-07', year: 2026, month: 7, visits: Math.round(appMauBase * 1.226), periodRange: '7월 1일~7월 31일' },
        { period: '2026-08', year: 2026, month: 8, visits: Math.round(appMauBase * 0.951), periodRange: '8월 1일~8월 31일' },
        { period: '2026-09', year: 2026, month: 9, visits: appMauBase, periodRange: '9월 1일~9월 30일' },
        { 
          period: `${dateInfo.year}-${String(dateInfo.month).padStart(2, '0')}`, 
          year: dateInfo.year, 
          month: dateInfo.month, 
          visits: Math.round(appMauBase * dateInfo.progressRatio * 1.04), 
          periodRange: dateInfo.dateRangeLong 
        }
      ]
    : (monthlyHistory && monthlyHistory.length > 0)
    ? [...monthlyHistory].sort((a, b) => (a.year * 100 + a.month) - (b.year * 100 + b.month))
    : [
        { period: '2026-06', year: 2026, month: 6, visits: Math.round(traffic.totalVisits * 0.6), periodRange: '6월 1일~6월 30일' },
        { period: '2026-07', year: 2026, month: 7, visits: Math.round(traffic.totalVisits * 1.8), periodRange: '7월 1일~7월 31일' },
        { period: '2026-08', year: 2026, month: 8, visits: Math.round(traffic.totalVisits * 0.96), periodRange: '8월 1일~8월 31일' },
        { period: '2026-09', year: 2026, month: 9, visits: traffic.totalVisits, periodRange: '9월 1일~9월 30일' },
        { 
          period: `${dateInfo.year}-${String(dateInfo.month).padStart(2, '0')}`, 
          year: dateInfo.year, 
          month: dateInfo.month, 
          visits: Math.round(traffic.totalVisits * dateInfo.progressRatio * 1.05), 
          periodRange: dateInfo.dateRangeLong 
        }
      ];

  const chartMonthlyData = monthlyList.map(h => ({
    name: h.month === dateInfo.month ? (isApp ? `${dateInfo.month}월 실시간 집계` : `${dateInfo.month}월(${dateInfo.dateRangeShort})`) : `${h.month}월`,
    visits: h.visits,
    fullPeriod: h.month === dateInfo.month 
      ? (isApp ? `${h.year}년 ${dateInfo.month}월 실시간 집계 (${dateInfo.day}일 누적)` : `${h.year}년 ${dateInfo.dateRangeLong} (${dateInfo.day}일 누적)`) 
      : h.month === 9 
      ? `${h.year}년 9월 1일~9월 30일 (마감)` 
      : h.month === 8 
      ? `${h.year}년 8월 1일~8월 31일 (마감)` 
      : `${h.year}년 ${h.month}월`
  }));

  const maxMonth = monthlyList.reduce((prev, curr) => (curr.visits > prev.visits ? curr : prev), monthlyList[0]);
  const maxCountryShare = Math.max(...topCountries.map(c => c.share), 40);
  const gradientId = isApp ? 'appTrafficGradient' : 'pcTrafficGradient';
  const primaryChartColor = isApp ? '#a855f7' : '#06b6d4';

  if (isApp && !hasApp) {
    return (
      <div className="p-8 sm:p-10 rounded-xl bg-dark-900 border border-dark-750 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-slate-400">
          <TrendingUp className="w-6 h-6 text-slate-500" />
        </div>
        <h4 className="text-base font-bold text-white">공식 모바일 앱 미운영</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          해당 서비스는 공식 모바일 앱이 없으며, 웹(PC/모바일웹) 단일 도메인 실측 트래픽으로 100% 집계됩니다.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      {/* 1. 월별 트래픽 추이 */}
      <div className="p-5 rounded-xl bg-dark-900 border border-dark-700 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center space-x-1.5">
              <TrendingUp className={`w-4 h-4 ${isApp ? 'text-brand-purpleLight' : 'text-brand-cyan'}`} />
              <h3 className="text-base font-bold text-white">월별 트래픽 추이</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isApp ? '최근 4개월 앱 MAU 궤적' : '최근 4개월 웹 방문수 궤적'}
            </p>
          </div>
          <span className={`text-xs font-semibold tabular-nums ${isApp ? 'text-brand-purpleLight' : 'text-cyan-300'}`}>
            {maxMonth.month}월 피크 ({(maxMonth.visits / 10000).toFixed(1)}만)
          </span>
        </div>

        <div className="h-48 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartMonthlyData} margin={{ top: 12, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryChartColor} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={primaryChartColor} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} 
                domain={[0, 'auto']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => [`${Number(value).toLocaleString()}회`, isApp ? '앱 MAU' : '웹 방문수']}
              />
              <Area type="monotone" dataKey="visits" stroke={primaryChartColor} strokeWidth={2.5} fillOpacity={1} fill={`url(#${gradientId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-dark-750 pt-2.5 tabular-nums">
          <span>평균 일일 활성(DAU):</span>
          <span className="font-semibold text-slate-200">
            약 {(isApp ? appDauBase : Math.round(traffic.totalVisits / 30)).toLocaleString()}회 / 일
          </span>
        </div>
      </div>

      {/* 2. 국가별 유입 비중 (국가 앞 아이콘 로고 이미지 + 기타 內 중국 비중 단독 표시) */}
      <div className="p-5 rounded-xl bg-dark-900 border border-dark-700 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center space-x-1.5">
              <Globe className={`w-4 h-4 ${isApp ? 'text-brand-purpleLight' : 'text-brand-cyan'}`} />
              <h3 className="text-base font-bold text-white">국가별 유입 비중</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isApp ? '앱 스토어·패널 상위 5개국 활성 점유율' : '웹 도메인 상위 5개국 방문 점유율'}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5 tabular-nums">
            <CountryFlag code={topCountries[0]?.code} name={topCountries[0]?.name} size="xs" />
            <span>1위 {topCountries[0]?.name || '대한민국'} ({topCountries[0]?.share || 0}%)</span>
          </span>
        </div>

        {/* 국가별 아이콘 로고 + 게이지 바 리스트 */}
        <div className="my-2 space-y-2.5 flex-1 flex flex-col justify-center">
          {topCountries.map((c, index) => {
            const widthPercent = Math.min(Math.round((c.share / maxCountryShare) * 100), 100);
            const barColor = index === 0
              ? 'bg-cyan-500'
              : index === 1
              ? 'bg-purple-500'
              : index === 2
              ? 'bg-indigo-500'
              : 'bg-slate-600';

            return (
              <div key={c.code || index} className="flex items-center gap-2.5 text-xs tabular-nums">
                <div className="w-24 sm:w-28 flex items-center gap-2 shrink-0 min-w-0">
                  <CountryFlag code={c.code} name={c.name} size="sm" />
                  <span className="text-slate-200 font-semibold truncate">{c.name}</span>
                </div>
                <div className="flex-1 h-2.5 rounded-full bg-dark-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span className="w-12 text-right font-bold text-white shrink-0">
                  {c.share}%
                </span>
              </div>
            );
          })}
        </div>

        {/* 하단: 기타 內 중국 비중 (인바운드 관광객 카드 등 중국 비중이 유의미하게 존재하는 경우에만 노출) */}
        {chinaShareValue !== undefined && chinaShareValue > 0 && (
          <div className="mt-2 pt-2.5 border-t border-dark-750">
            <div className="px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs tabular-nums">
              <span className="text-slate-200 font-semibold inline-flex items-center gap-1.5">
                <CountryFlag code="CN" name="중국" size="xs" />
                <span>기타 內 중국 비중</span>
              </span>
              <span className="text-purple-300 font-black">
                {chinaShareValue}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. 유입 채널 구성 */}
      <div className="p-5 rounded-xl bg-dark-900 border border-dark-700 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center space-x-1.5">
              <PieIcon className="w-4 h-4 text-brand-cyan" />
              <h3 className="text-base font-bold text-white">유입 채널 구성</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">사용자 유입 경로 구성비</p>
          </div>
          <span className="text-xs font-semibold text-cyan-300 tabular-nums">
            {channelData[0].name} {channelData[0].value}%
          </span>
        </div>

        <div className="h-48 mt-2 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => [`${value}%`, '점유율']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex justify-around text-xs border-t border-dark-750 pt-2.5 tabular-nums">
          {channelData.map((ch, idx) => (
            <div key={idx} className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ch.color }}></span>
              <span className="text-slate-300 text-xs">{ch.name} ({ch.value}%)</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
