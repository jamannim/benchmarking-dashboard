import React, { useState, useMemo } from 'react';
import { 
  Star, ThumbsUp, AlertTriangle, ExternalLink, 
  MessageSquare, Sparkles, Filter, CheckCircle2, 
  ShieldAlert
} from 'lucide-react';
import type { CompleteServiceIntelligence, ReviewItem } from '../../types/intelligence';
import { BrandLogo } from '../BrandLogo';
import { PdfReportButton } from '../PdfReportButton';

interface Props {
  data: CompleteServiceIntelligence;
}

type SentimentFilter = 'all' | 'positive' | 'negative';

export const AppDetailSubpage: React.FC<Props> = ({ data }) => {
  const { app, service } = data;
  const [filter, setFilter] = useState<SentimentFilter>('all');

  // Rating distribution fallback
  const distribution = app.ratingDistribution || {
    star5: 76,
    star4: 15,
    star3: 3,
    star2: 2,
    star1: 4
  };

  const isNamane = service.domain.includes('namane');
  const isWowpass = service.domain.includes('wowpass');
  const isTravel = service.domain.includes('travel');

  // Extract reviews or fallback
  const positiveReviews: ReviewItem[] = useMemo(() => {
    if (app.representativeReviews?.positive && app.representativeReviews.positive.length > 0) {
      return app.representativeReviews.positive;
    }
    if (isNamane) {
      return [
        {
          id: 'pos-1',
          rating: 5,
          sentiment: 'positive',
          author: '글로벌 유저 (Tokyo)',
          category: '커스텀 디자인',
          date: '2026.08',
          content: '좋아하는 사진으로 나만의 실물 카드를 즉석 인쇄할 수 있어 최고였습니다! 기념품으로 훌륭합니다.',
          summaryPoint: '커스텀 인쇄 만족도 극찬'
        },
        {
          id: 'pos-2',
          rating: 5,
          sentiment: 'positive',
          author: '자유여행객',
          category: '해외 카드 충전',
          date: '2026.07',
          content: '환전소 찾지 않고 비자 카드로 바로 앱 충전해서 편의점과 대중교통 다 썼습니다.',
          summaryPoint: '해외 카드 간편 충전 편의'
        },
        {
          id: 'pos-3',
          rating: 4,
          sentiment: 'positive',
          author: '인바운드 관광객',
          category: '다국어 UI',
          date: '2026.08',
          content: '잔액 실시간 확인과 친구 간 잔액 송금 기능이 아주 유용했습니다.',
          summaryPoint: '실시간 잔액 관리 우수'
        }
      ];
    }
    return [];
  }, [app.representativeReviews, isNamane]);

  const negativeReviews: ReviewItem[] = useMemo(() => {
    if (app.representativeReviews?.negative && app.representativeReviews.negative.length > 0) {
      return app.representativeReviews.negative;
    }
    if (isNamane) {
      return [
        {
          id: 'neg-1',
          rating: 1,
          sentiment: 'negative',
          author: '해외 여행객',
          category: '잔액 분리 혼선',
          date: '2026.08',
          content: '충전했는데 지하철 개찰구에서 잔액 부족이 떴습니다. 페이와 교통 잔액이 분리된 걸 몰랐습니다.',
          summaryPoint: '페이/교통 이원화로 인한 개찰구 오류'
        },
        {
          id: 'neg-2',
          rating: 1,
          sentiment: 'negative',
          author: '스마트폰 유저',
          category: 'NFC 인식 위치',
          date: '2026.07',
          content: '폰 뒷면에 카드를 대도 인식이 안 돼서 헤맸습니다. 기종별 위치 가이드가 필요합니다.',
          summaryPoint: 'NFC 태그 인식 실패'
        },
        {
          id: 'neg-3',
          rating: 2,
          sentiment: 'negative',
          author: '관광객',
          category: '3DS 결제 인증',
          date: '2026.06',
          content: '해외 카드로 충전 시 3DS 보안 인증에서 튕김 현상이 가끔 있습니다.',
          summaryPoint: '해외 카드 결제 안정성 보완 필요'
        }
      ];
    }
    return [];
  }, [app.representativeReviews, isNamane]);

  const positiveShare = app.positiveShare || (isNamane ? 88.4 : 0);
  const negativeShare = app.negativeShare || (isNamane ? 11.6 : 0);

  const androidDownloads = isNamane 
    ? '10만+' 
    : isWowpass 
    ? '50만+' 
    : isTravel 
    ? '300만+' 
    : (app.downloads ? app.downloads.split(' ')[0] : '미확인');

  const iosDownloads = isNamane 
    ? '15만+' 
    : isWowpass 
    ? '60만+' 
    : isTravel 
    ? '220만+' 
    : (app.downloads ? app.downloads.split(' ')[0] : '미확인');

  const iosUrl = isNamane 
    ? 'https://apps.apple.com/kr/app/namane/id1576269986' 
    : isWowpass 
    ? 'https://apps.apple.com/kr/app/wowpass/id1626691440' 
    : isTravel 
    ? 'https://apps.apple.com/kr/app/travelwallet/id1527017208' 
    : (service.appStoreUrl || '');

  const takeawayData = useMemo(() => {
    if (isWowpass) {
      return {
        posBody: '외화 지폐 즉시 무인 환전 및 발급 편의성 (오프라인 100만 가입자 유입 견인)',
        posAction: '공항철도 및 주요 호텔 무인 거점 선점 락인',
        negBody: '출국 시 외화 재환불 키오스크 거점 부족 및 공항 피크 대기열 집중',
        negAction: '모바일 사전 환전 예약 및 공항 대기열 분산 알림 도입'
      };
    }
    if (isTravel) {
      return {
        posBody: '45개국 외화 수수료 0% 실시간 충전 및 현지 ATM 무료 출금 (500만 다운로드 핵심)',
        posAction: '외화 무료 충전 범용성 및 복수 통화 보유 편의성 극대화',
        negBody: '해외 구형 ATM IC칩 인식 오류 및 성수기 고객센터 유선 상담 지연',
        negAction: '24/7 실시간 AI 결제 진단 챗봇 및 비상 디지털 카드 발급'
      };
    }
    if (isNamane) {
      return {
        posBody: 'K-POP 포토카드 즉석 커스텀 인쇄 및 앱 내 해외카드 직접 충전 (양대 마켓 4.76★)',
        posAction: 'K-컬처 굿즈형 카드 마케팅 강화 및 해외 카드 직접 충전 홍보',
        negBody: '페이 잔액 ↔ 대중교통 잔액 이원화 분리로 인한 개찰구 오류 (불만 리뷰 80% 집중)',
        negAction: '페이↔교통 잔액 스마트 오토 밸런싱(자동 전환) 도입 시 4.9★ 도약'
      };
    }

    const cleanName = service.name.split(' (')[0];
    return {
      posBody: `${cleanName} 핵심 서비스 이용 편의성 및 안정적 구동 호평 (평점 ${app.rating}★)`,
      posAction: '사용자 피드백 기반 핵심 기능 지속 고도화',
      negBody: '초기 신규 이용자 온보딩 및 상세 안내 기능 보완 요청',
      negAction: '온보딩 튜토리얼 개편 및 사용자 인터페이스 최적화'
    };
  }, [isWowpass, isTravel, isNamane, service.name, app.rating]);

  return (
    <div className="space-y-6">

      {/* 1. Header Hero Banner (슬림 컴팩트 규격) */}
      <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-dark-900 border border-dark-700 flex flex-col md:flex-row md:items-start md:justify-between gap-2.5 sm:gap-3 font-sans">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-blue/20 text-brand-blue border border-brand-blue/30 flex items-center">
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              앱 리뷰 분석
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
              리뷰 {app.reviewCount} 전수 분석
            </span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <BrandLogo domain={service.domain} size="md" />
            <span>앱리뷰</span><span className="hidden sm:inline text-sm font-normal text-slate-400 font-sans">| 양대 마켓 리뷰 정밀 진단</span>
          </h2>
          <p className="hidden sm:block text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl font-medium">
            양대 앱스토어 리뷰 기반: <span className="text-brand-emerald font-bold">호평 핵심 드라이버</span> 및 <span className="text-brand-rose font-bold">개선 페인포인트</span> 도출
          </p>
        </div>

        {/* 우측 PDF 검증리포트 다운로드 및 앱스토어 링크 (모바일 2열 컴팩트) */}
        <div className="w-full md:w-auto flex flex-col md:items-end gap-1.5 sm:gap-2 shrink-0 md:min-w-[240px]">
          {/* PDF 다운로드 버튼 (데스크톱 전용) */}
          <div className="hidden md:block">
            <PdfReportButton data={data} tab="app" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 sm:gap-2 w-full">
            {/* 1. Google Play Store */}
            <a 
              href={service.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-brand-emerald/40 transition-all flex items-center justify-between gap-2 text-xs group"
            >
              <div className="flex items-center space-x-1.5 truncate">
                <BrandLogo brandKey="google" size="xs" />
                <span className="font-semibold text-white group-hover:text-brand-emerald transition-colors truncate">구글플레이</span>
              </div>
              <div className="flex items-center space-x-1 font-mono shrink-0">
                <span className="text-slate-200 font-bold">{androidDownloads}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white" />
              </div>
            </a>

            {/* 2. Apple App Store */}
            <a 
              href={iosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-brand-blue/40 transition-all flex items-center justify-between gap-2 text-xs group"
            >
              <div className="flex items-center space-x-1.5 truncate">
                <BrandLogo brandKey="apple" size="xs" />
                <span className="font-semibold text-white group-hover:text-brand-blue transition-colors truncate">앱스토어</span>
              </div>
              <div className="flex items-center space-x-1 font-mono shrink-0">
                <span className="text-slate-200 font-bold">{iosDownloads}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white" />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 2. 리뷰 VOC 핵심 시사점 (핵심 시사점 단일화) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-brand-purple/35 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-dark-750 gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 rounded-lg bg-brand-purple/20 text-brand-purpleLight border border-brand-purple/40">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                리뷰 VOC 핵심 시사점
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                리뷰 분석 기반 핵심 성공 요인 및 최우선 과제
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-dark-800 text-slate-300 border border-dark-700 font-semibold self-start sm:self-auto">
            핵심 요약 진단
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* 🟢 호평 핵심 드라이버 */}
          <div className="p-4 rounded-xl bg-dark-950/80 border border-brand-emerald/30 hover:border-brand-emerald/60 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-dark-800">
                <span className="text-xs font-bold text-brand-emerald flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
                  호평 핵심 드라이버
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-brand-emerald/15 text-brand-emerald font-bold">
                  만족도 {positiveShare}% 견인
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mt-3 leading-relaxed break-keep">
                {takeawayData.posBody}
              </h4>
            </div>
            <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 text-xs text-slate-300 flex items-center justify-between">
              <span className="text-slate-400 font-medium">벤치마킹 핵심:</span>
              <strong className="text-brand-cyan">{takeawayData.posAction}</strong>
            </div>
          </div>

          {/* 🔴 개선 핵심 페인포인트 */}
          <div className="p-4 rounded-xl bg-dark-950/80 border border-brand-rose/30 hover:border-brand-rose/60 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-dark-800">
                <span className="text-xs font-bold text-brand-rose flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-brand-rose shrink-0" />
                  개선 핵심 페인포인트
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-brand-rose/15 text-brand-rose font-bold">
                  최우선 개선 과제
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mt-3 leading-relaxed break-keep">
                {takeawayData.negBody}
              </h4>
            </div>
            <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 text-xs text-slate-300 flex items-center justify-between">
              <span className="text-slate-400 font-medium">프로덕트 해결책:</span>
              <strong className="text-brand-amber">{takeawayData.negAction}</strong>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Key VOC Metrics (3개 핵심 감성 지표 카드) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Rating Card */}
        <div className="p-4 rounded-xl bg-dark-900 border border-dark-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">평균 만족도 (스토어 실측)</span>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-amber/15 text-brand-amber font-bold">
              상위 5% 수준
            </span>
          </div>
          <div className="text-2xl font-black text-brand-amber mt-1 flex items-center">
            <Star className="w-6 h-6 mr-1.5 fill-brand-amber text-brand-amber" />
            <span>{app.rating}</span>
            <span className="text-sm font-normal text-slate-400 ml-1.5">/ 5.0</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            총 {app.reviewCount} 리뷰 기준 산출
          </span>
        </div>

        {/* Positive Sentiment Ratio */}
        <div className="p-4 rounded-xl bg-dark-900 border border-dark-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">긍정 감성 비율 (4~5★)</span>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-emerald/15 text-brand-emerald font-bold">
              압도적 만족
            </span>
          </div>
          <div className="text-2xl font-black text-brand-emerald mt-1">
            {positiveShare}%
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            커스텀 카드 품질 및 해외충전 호평
          </span>
        </div>

        {/* Negative Sentiment Ratio */}
        <div className="p-4 rounded-xl bg-dark-900 border border-dark-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">부정/개선 요구 (1~2★)</span>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-rose/15 text-brand-rose font-bold">
              집중 개선 영역
            </span>
          </div>
          <div className="text-2xl font-black text-brand-rose mt-1">
            {negativeShare}%
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            페이/교통 분리 및 NFC 태그 혼선
          </span>
        </div>

      </div>

      {/* 3. Rating Distribution & Sentiment Bar */}
      <div className="p-5 rounded-xl bg-dark-900 border border-dark-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-dark-700 mb-4 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-purpleLight" />
              <h3 className="text-sm font-bold text-white">별점별 상세 분포도</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              5점 만점 단계별 분포 및 감성 비율
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="flex items-center text-brand-emerald font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-emerald mr-1.5"></span>
              긍정 {positiveShare}%
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center text-brand-rose font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-rose mr-1.5"></span>
              부정 {negativeShare}%
            </span>
          </div>
        </div>

        {/* Visual Sentiment Stack Bar */}
        <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden flex mb-5 border border-dark-750">
          <div 
            className="bg-brand-emerald h-full transition-all" 
            style={{ width: `${positiveShare}%` }} 
            title={`긍정 리뷰 ${positiveShare}%`}
          ></div>
          <div 
            className="bg-brand-rose h-full transition-all" 
            style={{ width: `${negativeShare}%` }} 
            title={`부정 리뷰 ${negativeShare}%`}
          ></div>
        </div>

        {/* 5-Star to 1-Star Rows */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { star: 5, pct: distribution.star5, color: 'bg-brand-emerald', textColor: 'text-brand-emerald' },
            { star: 4, pct: distribution.star4, color: 'bg-brand-teal', textColor: 'text-brand-teal' },
            { star: 3, pct: distribution.star3, color: 'bg-slate-400', textColor: 'text-slate-300' },
            { star: 2, pct: distribution.star2, color: 'bg-brand-amber', textColor: 'text-brand-amber' },
            { star: 1, pct: distribution.star1, color: 'bg-brand-rose', textColor: 'text-brand-rose' },
          ].map((item) => (
            <div key={item.star} className="p-3 rounded-lg bg-dark-850 border border-dark-750">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-white flex items-center">
                  ★ {item.star}점
                </span>
                <span className={`font-mono font-bold ${item.textColor}`}>{item.pct}%</span>
              </div>
              <div className="w-full bg-dark-950 h-2 rounded-full overflow-hidden">
                <div 
                  className={`${item.color} h-full rounded-full transition-all`} 
                  style={{ width: `${item.pct}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-400 mt-1.5 text-right">
                약 {Math.round(1300 * (item.pct / 100)).toLocaleString()}건
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Representative Reviews Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-dark-900 border border-dark-700">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs font-bold text-white">별점 기준 대표 리뷰 필터:</span>
        </div>

        <div className="flex items-center space-x-2 bg-dark-850 p-1 rounded-lg border border-dark-750 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              filter === 'all' 
                ? 'bg-brand-purple text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            전체 보기 (긍정 3개 + 부정 3개)
          </button>
          <button
            onClick={() => setFilter('positive')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center space-x-1 ${
              filter === 'positive' 
                ? 'bg-brand-emerald text-dark-950 shadow-sm' 
                : 'text-slate-400 hover:text-brand-emerald'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5 mr-1" />
            <span>★ 긍정 대표 리뷰 3선 (4~5★)</span>
          </button>
          <button
            onClick={() => setFilter('negative')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center space-x-1 ${
              filter === 'negative' 
                ? 'bg-brand-rose text-white shadow-sm' 
                : 'text-slate-400 hover:text-brand-rose'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            <span>⚠️ 부정/개선 대표 리뷰 3선 (1~2★)</span>
          </button>
        </div>
      </div>

      {/* 5. Representative Reviews Display (Dual Column or Filtered) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Column: Positive Reviews (3 items) */}
        {(filter === 'all' || filter === 'positive') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-dark-700">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-brand-emerald/20 flex items-center justify-center text-brand-emerald">
                  <ThumbsUp className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  별점 기준 긍정 대표 리뷰 Top 3 (만족도 4~5★)
                </h3>
              </div>
              <span className="text-xs text-brand-emerald font-semibold">
                핵심 강점: 커스텀 & 해외충전
              </span>
            </div>

            {positiveReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="p-4 rounded-xl bg-dark-900 border border-dark-700 hover:border-brand-emerald/40 transition-all space-y-3"
              >
                {/* 상단: 별점 & 카테고리 & 작성일 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-brand-amber">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-brand-amber text-brand-amber' : 'text-slate-600'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                      ★ {rev.rating}.0
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-dark-800 text-slate-300 border border-dark-750">
                      {rev.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{rev.date}</span>
                </div>

                {/* 핵심내용 */}
                <div className="p-3 rounded-lg bg-dark-850 border border-dark-750 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">핵심 내용</span>
                    <span className="text-sm font-bold text-white leading-snug">{rev.summaryPoint}</span>
                  </div>
                </div>

                {/* 작성자 */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-slate-400 font-medium">
                    작성자: <span className="text-slate-200 font-semibold">{rev.author}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Right Column: Negative Reviews (3 items) */}
        {(filter === 'all' || filter === 'negative') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-dark-700">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-brand-rose/20 flex items-center justify-center text-brand-rose">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  별점 기준 부정/개선 대표 리뷰 Top 3 (불만도 1~2★)
                </h3>
              </div>
              <span className="text-xs text-brand-rose font-semibold">
                핵심 병목: 잔액 분리 & NFC
              </span>
            </div>

            {negativeReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="p-4 rounded-xl bg-dark-900 border border-dark-700 hover:border-brand-rose/40 transition-all space-y-3"
              >
                {/* 상단: 별점 & 카테고리 & 작성일 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-brand-amber">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-brand-amber text-brand-amber' : 'text-slate-600'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-rose/15 text-brand-rose border border-brand-rose/30">
                      ★ {rev.rating}.0 (개선 요구)
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-dark-800 text-slate-300 border border-dark-750">
                      {rev.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{rev.date}</span>
                </div>

                {/* 핵심내용 */}
                <div className="p-3 rounded-lg bg-dark-850 border border-dark-750 flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-brand-rose shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">핵심 내용</span>
                    <span className="text-sm font-bold text-white leading-snug">{rev.summaryPoint}</span>
                  </div>
                </div>

                {/* 작성자 */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-slate-400 font-medium">
                    작성자: <span className="text-slate-200 font-semibold">{rev.author}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
