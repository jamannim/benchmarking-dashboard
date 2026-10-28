import React, { useMemo } from 'react';
import { 
  BarChart3, Heart 
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, BarChart, Bar, Line, 
  XAxis, YAxis, Tooltip, CartesianGrid, Cell 
} from 'recharts';
import { getDynamicDateInfo, parseVerifiedDate } from '../utils/trafficCalculators';

// 월별 합산 레코드 타입
export interface SnsMonthlyRecord {
  period: string;
  year: number;
  month: number;
  monthLabel: string;
  badge?: {
    text: string;
    color: string;
  };
  baseMoMLabel: string; // '기준월' | '7월 대비' | '8월 대비'
  totalPosts: number;
  totalViews: number;
  totalViewsText: string;
  viewsMoM: number | null;
  totalLikes: number;
  totalLikesText: string;
  likesMoM: number | null;
  totalComments: number;
  totalCommentsText: string;
  commentsMoM: number | null;
  totalEngagements: number;
  totalEngagementsText: string;
  engagementRate: number;
  engagementRateMoM: number | null;
  topChannel: string;
  keyTopic: string;
}

interface Props {
  onToggle?: () => void;
  embedded?: boolean;
  verifiedAt?: string;
}

export const SnsMonthlyComparisonSheet: React.FC<Props> = ({ 
  onToggle, 
  embedded = false,
  verifiedAt
}) => {
  const dateInfo = useMemo(() => {
    return getDynamicDateInfo(parseVerifiedDate(verifiedAt));
  }, [verifiedAt]);

  const aggregationDate = verifiedAt || dateInfo.formattedDate;

  // 공식 SNS 3채널 월별 합산 데이터 (7월 피크, 8월 확정, 9월 확정, 당월 실시간 기본값)
  const monthlyRecords: SnsMonthlyRecord[] = useMemo(() => [
    {
      period: '2026-07',
      year: 2026,
      month: 7,
      monthLabel: '2026년 7월',
      badge: {
        text: '여름 피크',
        color: 'bg-dark-800 text-slate-300 border-dark-650'
      },
      baseMoMLabel: '기준월 (피크)',
      totalPosts: 14,
      totalViews: 152000,
      totalViewsText: '15.2만 회',
      viewsMoM: null,
      totalLikes: 7520,
      totalLikesText: '7,520개',
      likesMoM: null,
      totalComments: 538,
      totalCommentsText: '538개',
      commentsMoM: null,
      totalEngagements: 8058,
      totalEngagementsText: '8,058건',
      engagementRate: 5.30,
      engagementRateMoM: null,
      topChannel: '틱톡 공식 (44.7%)',
      keyTopic: 'NCT 콘서트 기념 한정판 테마 카드 및 지하철 포토카드 발권 챌린지'
    },
    {
      period: '2026-08',
      year: 2026,
      month: 8,
      monthLabel: '2026년 8월',
      badge: {
        text: '8월 확정',
        color: 'bg-dark-800 text-slate-300 border-dark-650'
      },
      baseMoMLabel: '7월 대비',
      totalPosts: 10,
      totalViews: 103000,
      totalViewsText: '10.3만 회',
      viewsMoM: -32.2, // 7월 대비 -32.2%
      totalLikes: 5040,
      totalLikesText: '5,040개',
      likesMoM: -33.0, // 7월 대비 -33.0%
      totalComments: 356,
      totalCommentsText: '356개',
      commentsMoM: -33.8, // 7월 대비 -33.8%
      totalEngagements: 5396,
      totalEngagementsText: '5,396건',
      engagementRate: 5.24,
      engagementRateMoM: -0.06, // 7월 대비 -0.06%p
      topChannel: '틱톡 공식 (44.8%)',
      keyTopic: '방한 외국인 관광객 편의점 결제 및 대중교통 이용 후기 릴스'
    },
    {
      period: '2026-09',
      year: 2026,
      month: 9,
      monthLabel: '2026년 9월',
      badge: {
        text: '9월 확정',
        color: 'bg-dark-800 text-slate-300 border-dark-650'
      },
      baseMoMLabel: '8월 대비',
      totalPosts: 11,
      totalViews: 113000,
      totalViewsText: '11.3만 회',
      viewsMoM: 9.7, // 8월 대비 +9.7%
      totalLikes: 5620,
      totalLikesText: '5,620개',
      likesMoM: 11.5, // 8월 대비 +11.5%
      totalComments: 411,
      totalCommentsText: '411개',
      commentsMoM: 15.4, // 8월 대비 +15.4%
      totalEngagements: 6031,
      totalEngagementsText: '6,031건',
      engagementRate: 5.34,
      engagementRateMoM: 0.10, // 8월 대비 +0.10%p
      topChannel: '틱톡 공식 (45.1%)',
      keyTopic: '올리브영 명동 제휴 프로모션 & 웨이션브이(WayV) 숏폼 바이럴'
    },
    {
      period: `${dateInfo.year}-${String(dateInfo.month).padStart(2, '0')}`,
      year: dateInfo.year,
      month: dateInfo.month,
      monthLabel: `${dateInfo.year}년 ${dateInfo.month}월`,
      badge: {
        text: `${String(dateInfo.month).padStart(2, '0')}.${String(dateInfo.day).padStart(2, '0')} 실시간`,
        color: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/40'
      },
      baseMoMLabel: '9월 대비(일평균)',
      totalPosts: 3,
      totalViews: 24000,
      totalViewsText: '2.4만 회',
      viewsMoM: 6.2, // 일평균 4,000회 vs 9월 3,767회 (+6.2%)
      totalLikes: 1220,
      totalLikesText: '1,220개',
      likesMoM: 8.6, // 일평균 203개 vs 9월 187개 (+8.6%)
      totalComments: 95,
      totalCommentsText: '95개',
      commentsMoM: 16.8, // 일평균 16개 vs 9월 13.7개 (+16.8%)
      totalEngagements: 1315,
      totalEngagementsText: '1,315건',
      engagementRate: 5.48,
      engagementRateMoM: 0.14, // 9월 대비 +0.14%p
      topChannel: '틱톡 공식 (45.8%)',
      keyTopic: '가을 단풍 여행 시즌 제휴 & K-POP 컴백 테마 카드 숏폼'
    }
  ], [dateInfo]);

  // 4개월 누적 합산 통계
  const cumulativeSummary = useMemo(() => {
    const totalViews = monthlyRecords.reduce((acc, r) => acc + r.totalViews, 0);
    const totalLikes = monthlyRecords.reduce((acc, r) => acc + r.totalLikes, 0);
    const totalComments = monthlyRecords.reduce((acc, r) => acc + r.totalComments, 0);
    const totalPosts = monthlyRecords.reduce((acc, r) => acc + r.totalPosts, 0);
    const totalEngagements = totalLikes + totalComments;
    const avgRate = (totalEngagements / totalViews * 100).toFixed(2);

    return {
      totalViews,
      totalLikes,
      totalComments,
      totalPosts,
      totalEngagements,
      avgRate
    };
  }, [monthlyRecords]);


  // 월별 비교 그래프 데이터 (7월 피크, 8월 확정, 9월 확정, 10월 10.06 실시간)
  const chartData = useMemo(() => [
    {
      month: '7월 (피크)',
      views: 15.2, // 만 회
      viewsText: '15.2만 회',
      viewsMoM: null,
      likes: 7520,
      likesMoM: null,
      comments: 538,
      commentsMoM: null,
      rate: 5.30,
      rateMoM: null,
      posts: 14,
      fillColor: '#475569',
      isLive: false
    },
    {
      month: '8월 (확정)',
      views: 10.3, // 만 회
      viewsText: '10.3만 회',
      viewsMoM: -32.2,
      likes: 5040,
      likesMoM: -33.0,
      comments: 356,
      commentsMoM: -33.8,
      rate: 5.24,
      rateMoM: -0.06,
      posts: 10,
      fillColor: '#64748b',
      isLive: false
    },
    {
      month: '9월 (확정)',
      views: 11.3, // 만 회
      viewsText: '11.3만 회',
      viewsMoM: 9.7,
      likes: 5620,
      likesMoM: 11.5,
      comments: 411,
      commentsMoM: 15.4,
      rate: 5.34,
      rateMoM: 0.10,
      posts: 11,
      fillColor: '#64748b',
      isLive: false
    },
    {
      month: '10월 (실시간)',
      views: 2.4, // 만 회
      viewsText: '2.4만 회 (10.06)',
      viewsMoM: 6.2,
      likes: 1220,
      likesMoM: 8.6,
      comments: 95,
      commentsMoM: 16.8,
      rate: 5.48,
      rateMoM: 0.14,
      posts: 3,
      fillColor: '#06b6d4',
      isLive: true
    }
  ], []);


  return (
    <div className={embedded ? "space-y-7" : "p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-7"}>
      
      {/* ======================================================== */}
      {/* 🔼 [상단 영역] 월별 데이터 비교 그래프 및 합계 비교 영역 */}
      {/* ======================================================== */}
      <div className="space-y-4">
        
        {/* 상단 섹션 타이틀 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-dark-750 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-normal">
                SNS월별 합산 성과비교
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 flex items-center gap-1 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
                <span>2026년 10월 기본값</span>
              </span>
            </div>
            <p className="text-sm font-normal text-slate-400 mt-1">
              주요 지표 비교 그래프
            </p>
          </div>

          {onToggle && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={onToggle}
                className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 border border-dark-700 transition-colors cursor-pointer font-sans flex items-center gap-1"
                title="SNS월별 합산 성과비교 내용 접기"
              >
                <span>내용 접기 ▲</span>
              </button>
            </div>
          )}
        </div>

        {/* 오늘(2026년 10월 6일) 기준 핵심 증감율 1줄 요약 배너 */}
        <div className="p-3 rounded-xl bg-dark-850/90 border border-dark-750 flex flex-wrap items-center justify-between gap-2.5 text-xs font-sans">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse shrink-0"></span>
            <span className="font-bold text-white">{dateInfo.currentDateKorean} 실시간 성과</span>
            <span className="text-slate-400 font-normal hidden sm:inline">({dateInfo.dateRangeShort} 실측 · {dateInfo.prevMonthName} 일평균 대비):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-sans">
            <span className="px-2.5 py-1 rounded-lg bg-dark-800 text-slate-200 font-bold border border-dark-750 font-sans">
              조회수 2.4만 회 <span className="text-brand-emerald">(▲ +6.2%)</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-dark-800 text-slate-200 font-bold border border-dark-750 font-sans">
              공감 1,220개 <span className="text-brand-emerald">(▲ +8.6%)</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-dark-800 text-slate-200 font-bold border border-dark-750 font-sans">
              댓글 95개 <span className="text-brand-emerald">(▲ +16.8%)</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-brand-cyan/15 text-brand-cyan font-bold border border-brand-cyan/30 font-sans">
              참여율 5.48% (▲ +0.14%p)
            </span>
          </div>
        </div>

        {/* 📊 월별 데이터 시각적 비교 그래프 2종 (나란히 배치) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* 그래프 1: 월별 각 조회수 & 참여율 추이 */}
          <div className="p-4 sm:p-5 rounded-xl bg-dark-850 border border-dark-750 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2.5 border-b border-dark-750">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-brand-cyan" />
                <h4 className="text-base font-bold text-white">월별 각 조회수 & 참여율</h4>
              </div>
              <span className="text-xs font-bold text-brand-emerald font-sans">
                10월 견조한 상승세 (일평균 +6.2% ▲)
              </span>
            </div>

            <div className="h-56 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.25} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis 
                    yAxisId="left" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    tickFormatter={(v) => `${v}만`}
                    domain={[0, 18]} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#10b981" 
                    fontSize={11} 
                    tickLine={false} 
                    tickFormatter={(v) => `${v}%`}
                    domain={[5.0, 5.6]} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                    formatter={(value: any, name?: any) => {
                      const nameStr = String(name || '');
                      if (nameStr === '조회수') return [`${Number(value).toFixed(1)}만 회`, '각 조회수'];
                      if (nameStr === '참여율') return [`${Number(value).toFixed(2)}%`, '평균 참여율'];
                      return [value, nameStr];
                    }}
                  />
                  <Bar yAxisId="left" dataKey="views" name="조회수" radius={[6, 6, 0, 0]} maxBarSize={46}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fillColor} />
                    ))}
                  </Bar>
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="rate" 
                    name="참여율" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 1 }} 
                    activeDot={{ r: 6 }} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-dark-750 pt-2 font-normal">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-brand-cyan"></span>
                  <span>조회수(막대)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-brand-emerald"></span>
                  <span>참여율(선)</span>
                </span>
              </div>
              <span className="text-slate-300 font-mono">8월 10.3만 ➔ 9월 11.3만 ➔ 10월 2.4만</span>
            </div>
          </div>

          {/* 그래프 2: 월별 공감 수 & 댓글 수 비교 */}
          <div className="p-4 sm:p-5 rounded-xl bg-dark-850 border border-dark-750 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2.5 border-b border-dark-750">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-brand-cyan" />
                <h4 className="text-base font-bold text-white">월별 공감 수 & 댓글 수</h4>
              </div>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30 font-sans">
                호감·소통 동반 증가
              </span>
            </div>

            <div className="h-56 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.25} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                    formatter={(value: any, name?: any) => [
                      `${Number(value).toLocaleString()}개`, 
                      String(name) === 'likes' ? '공감 수' : '댓글 수'
                    ]}
                  />
                  <Bar dataKey="likes" name="likes" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="comments" name="comments" fill="#64748b" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-dark-750 pt-2 font-normal">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-brand-cyan"></span>
                  <span>공감(좋아요)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-slate-500"></span>
                  <span>댓글 수</span>
                </span>
              </div>
              <span className="text-slate-300 font-sans">10월 일평균 공감 +8.6% · 댓글 +16.8%</span>
            </div>
          </div>

        </div>

        {/* 모바일 화면 (가로 스크롤바 0%, 월별 카드 뷰) */}
        <div className="space-y-3 md:hidden font-sans">
          {monthlyRecords.map((r) => {
            const isLive = r.month === 10;
            return (
              <div
                key={r.period}
                className={`p-3.5 rounded-xl border space-y-2.5 ${
                  isLive ? 'bg-brand-cyan/10 border-brand-cyan/40 font-semibold' : 'bg-dark-850 border-dark-750'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{r.monthLabel}</span>
                    {r.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold border ${r.badge.color}`}>
                        {r.badge.text}
                      </span>
                    )}
                    {isLive && (
                      <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-brand-cyan text-dark-950">
                        기본값
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-brand-cyan tabular-nums">{r.engagementRate}%</span>
                    <div className="text-[10px] text-slate-400">참여율</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                    <div className="text-[10px] text-slate-400">게시물</div>
                    <div className="font-bold text-white tabular-nums mt-0.5">{r.totalPosts}건</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                    <div className="text-[10px] text-slate-400">조회수</div>
                    <div className="font-bold text-white tabular-nums mt-0.5">{r.totalViewsText}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                    <div className="text-[10px] text-slate-400">공감</div>
                    <div className="font-bold text-white tabular-nums mt-0.5">{r.totalLikesText}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                    <div className="text-[10px] text-slate-400">댓글</div>
                    <div className="font-bold text-white tabular-nums mt-0.5">{r.totalCommentsText}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 pt-1 border-t border-dark-800 space-y-0.5">
                  <div className="font-semibold text-white truncate">{r.topChannel}</div>
                  <div className="text-slate-400 text-[11px] truncate">{r.keyTopic}</div>
                </div>
              </div>
            );
          })}

          {/* 모바일 합계 요약 바 */}
          <div className="p-3.5 rounded-xl bg-dark-900 border border-brand-cyan/40 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="text-white">누적 합계 (2026.07 ~ 10.06)</span>
              <span className="text-brand-cyan font-black text-sm tabular-nums">평균 {cumulativeSummary.avgRate}%</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1.5 border-t border-dark-800">
              <div>
                <span className="text-slate-400">총 게시물: </span>
                <span className="font-bold text-white tabular-nums">{cumulativeSummary.totalPosts}건</span>
              </div>
              <div>
                <span className="text-slate-400">총 조회수: </span>
                <span className="font-bold text-white tabular-nums">{(cumulativeSummary.totalViews / 10000).toFixed(1)}만</span>
              </div>
              <div>
                <span className="text-slate-400">인터랙션: </span>
                <span className="font-bold text-white tabular-nums">{cumulativeSummary.totalEngagements.toLocaleString()}건</span>
              </div>
            </div>
          </div>
        </div>

        {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
          <table 
            className="w-full text-left text-sm table-fixed font-sans"
            style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            <thead className="bg-dark-850 text-slate-300 font-bold border-b border-dark-750 text-xs">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg w-[14%]">월</th>
                <th className="py-2.5 px-3 text-right w-[10%]">게시물</th>
                <th className="py-2.5 px-3 text-right w-[14%]">조회수</th>
                <th className="py-2.5 px-3 text-right w-[13%]">공감</th>
                <th className="py-2.5 px-3 text-right w-[13%]">댓글</th>
                <th className="py-2.5 px-3 text-right w-[13%] text-brand-cyan">참여율</th>
                <th className="py-2.5 px-3 rounded-r-lg w-[23%]">요인 (설명)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750/70 font-normal text-slate-200 font-sans">
              {monthlyRecords.map((r) => {
                const isLive = r.month === 10;

                return (
                  <tr 
                    key={r.period} 
                    className={`transition-colors ${
                      isLive 
                        ? 'bg-brand-cyan/10 hover:bg-brand-cyan/15 font-semibold' 
                        : 'hover:bg-dark-800/40'
                    }`}
                  >
                    {/* 진행 월 */}
                    <td className="py-2.5 px-3 align-middle">
                      <div className="font-bold text-white font-sans text-sm leading-tight">
                        {r.monthLabel}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {r.badge && (
                          <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold border font-sans ${r.badge.color}`}>
                            {r.badge.text}
                          </span>
                        )}
                        {isLive && (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-brand-cyan text-dark-950 font-sans">
                            기본값
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 게시물 수 */}
                    <td className="py-2.5 px-3 text-right align-middle font-sans">
                      <div className="font-bold text-slate-200 text-sm">{r.totalPosts}건</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-normal">
                        {isLive ? '진행중' : '발행완료'}
                      </div>
                    </td>

                    {/* 각 조회수 */}
                    <td className="py-2.5 px-3 text-right align-middle font-sans">
                      <div className={`font-bold text-sm ${isLive ? 'text-brand-cyan' : 'text-white'}`}>
                        {r.totalViewsText}
                      </div>
                      {r.viewsMoM !== null ? (
                        <div className={`text-xs font-bold mt-0.5 flex items-center justify-end gap-1 font-sans ${r.viewsMoM > 0 ? 'text-brand-cyan' : 'text-purple-300'}`}>
                          <span>{r.viewsMoM > 0 ? `▲ +${r.viewsMoM}%` : `▼ ${r.viewsMoM}%`}</span>
                          <span className="text-[11px] text-slate-500 font-normal">({r.baseMoMLabel})</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 font-normal mt-0.5 font-sans">
                          - (기준월)
                        </div>
                      )}
                    </td>

                    {/* 공감(좋아요) 수 */}
                    <td className="py-2.5 px-3 text-right align-middle font-sans">
                      <div className="text-white font-bold text-sm">
                        {r.totalLikesText}
                      </div>
                      {r.likesMoM !== null ? (
                        <div className={`text-xs font-bold mt-0.5 flex items-center justify-end gap-1 font-sans ${r.likesMoM > 0 ? 'text-brand-cyan' : 'text-purple-300'}`}>
                          <span>{r.likesMoM > 0 ? `▲ +${r.likesMoM}%` : `▼ ${r.likesMoM}%`}</span>
                          <span className="text-[11px] text-slate-500 font-normal">({r.baseMoMLabel})</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 font-normal mt-0.5 font-sans">
                          - (기준월)
                        </div>
                      )}
                    </td>

                    {/* 댓글 수 */}
                    <td className="py-2.5 px-3 text-right align-middle font-sans">
                      <div className="text-white font-bold text-sm">
                        {r.totalCommentsText}
                      </div>
                      {r.commentsMoM !== null ? (
                        <div className={`text-xs font-bold mt-0.5 flex items-center justify-end gap-1 font-sans ${r.commentsMoM > 0 ? 'text-brand-cyan' : 'text-purple-300'}`}>
                          <span>{r.commentsMoM > 0 ? `▲ +${r.commentsMoM}%` : `▼ ${r.commentsMoM}%`}</span>
                          <span className="text-[11px] text-slate-500 font-normal">({r.baseMoMLabel})</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 font-normal mt-0.5 font-sans">
                          - (기준월)
                        </div>
                      )}
                    </td>

                    {/* 참여율 */}
                    <td className="py-2.5 px-3 text-right align-middle font-sans">
                      <div className="text-brand-cyan font-bold text-sm">
                        {r.engagementRate}%
                      </div>
                      {r.engagementRateMoM !== null ? (
                        <div className={`text-xs font-bold mt-0.5 flex items-center justify-end gap-1 font-sans ${r.engagementRateMoM > 0 ? 'text-brand-cyan' : 'text-purple-300'}`}>
                          <span>{r.engagementRateMoM > 0 ? `▲ +${r.engagementRateMoM}%p` : `▼ ${r.engagementRateMoM}%p`}</span>
                          <span className="text-[11px] text-slate-500 font-normal">({r.baseMoMLabel})</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 font-normal mt-0.5 font-sans">
                          - (기준월)
                        </div>
                      )}
                    </td>

                    {/* 주요 진행 요인 */}
                    <td className="py-2.5 px-3 align-middle font-sans">
                      <div className="text-xs font-bold text-white truncate" title={r.topChannel}>
                        {r.topChannel}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate leading-tight" title={r.keyTopic}>
                        {r.keyTopic}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* 하단 누적 합계 비교 행 */}
              <tr className="bg-dark-850 font-bold border-t-2 border-dark-700 font-sans">
                <td className="py-2.5 px-3 align-middle">
                  <div className="flex items-center space-x-1.5 font-bold text-white text-sm">
                    <span className="w-2 h-2 rounded-full bg-brand-cyan"></span>
                    <span>누적 합계</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-normal pl-3.5 mt-0.5">
                    2026.07 ~ 10.06 종합
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right align-middle font-sans">
                  <div className="text-slate-200 font-bold text-sm">{cumulativeSummary.totalPosts}건</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">총 {cumulativeSummary.totalPosts}건 집계</div>
                </td>
                <td className="py-2.5 px-3 text-right align-middle font-sans">
                  <div className="text-white font-bold text-sm">{(cumulativeSummary.totalViews / 10000).toFixed(1)}만 회</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">{cumulativeSummary.totalViews.toLocaleString()}회 합산</div>
                </td>
                <td className="py-2.5 px-3 text-right align-middle font-sans">
                  <div className="text-white font-bold text-sm">{cumulativeSummary.totalLikes.toLocaleString()}개</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">좋아요 누적</div>
                </td>
                <td className="py-2.5 px-3 text-right align-middle font-sans">
                  <div className="text-white font-bold text-sm">{cumulativeSummary.totalComments.toLocaleString()}개</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">댓글 누적</div>
                </td>
                <td className="py-2.5 px-3 text-right align-middle font-sans">
                  <div className="text-brand-cyan font-bold text-sm">{cumulativeSummary.avgRate}%</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">가중 평균 참여율</div>
                </td>
                <td className="py-2.5 px-3 align-middle font-sans">
                  <div className="text-xs font-semibold text-slate-200">
                    인터랙션 총 {cumulativeSummary.totalEngagements.toLocaleString()}건
                  </div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                    공식 채널 집계 완료
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* 출처 및 동기화 메타 */}
      <div className="pt-3 border-t border-dark-750 flex items-center text-xs text-slate-400 font-normal">
        <span>출처 : 인스타그램 공식 API 및 틱톡 크리에이터 센터 집계 (현황집계일 기준 : {aggregationDate} 실시간 동기화)</span>
      </div>

    </div>
  );
};

export default SnsMonthlyComparisonSheet;
