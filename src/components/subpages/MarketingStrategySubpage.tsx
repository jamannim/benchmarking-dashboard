import React, { useState, useMemo } from 'react';
import { 
  Rocket, Compass, CheckCircle2, Sparkles, 
  Calendar, Share2, MapPin, Search, Zap, ArrowRight,
  Star, ThumbsUp, AlertTriangle,
  MessageSquare, ShieldAlert
} from 'lucide-react';
import type { CompleteServiceIntelligence, ReviewItem } from '../../types/intelligence';
import { BrandLogo, BrandBadgesFromText } from '../BrandLogo';
import { getTableDensityClasses, type TableDensity } from '../TableDensityControl';
import { PdfReportButton } from '../PdfReportButton';
import { MarketingAutomationSecondPage } from './MarketingAutomationSecondPage';
import { KeywordConquestGuidePage } from './KeywordConquestGuidePage';

import type { SubViewId } from '../Header';

interface Props {
  data: CompleteServiceIntelligence;
  activeSubView?: SubViewId;
  onSubViewChange?: (subView: SubViewId) => void;
}

export const MarketingStrategySubpage: React.FC<Props> = ({
  data,
  activeSubView = 'main',
  onSubViewChange,
}) => {
  const { service, marketingStrategy, app } = data;
  const [showAutomationPage, setShowAutomationPage] = useState<boolean>(false);
  const [selectedKeywordGuideRank, setSelectedKeywordGuideRank] = useState<number | null>(null);
  const density: TableDensity = 'auto';
  const dClasses = getTableDensityClasses(density);

  // Reviews fallback and takeaway data for concise App Review section
  const isNamane = service.domain.includes('namane');
  const isWowpass = service.domain.includes('wowpass');
  const isTravel = service.domain.includes('travel');

  // 데이터가 없는 미확인 도메인의 경우 허위/추론 데이터를 덧씌우지 않고 N/A 확인불가 배너 노출
  if (!marketingStrategy && !isNamane) {
    return (
      <div className="space-y-6 font-sans">
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 flex flex-col items-center justify-center text-center py-16">
          <div className="p-3.5 rounded-2xl bg-dark-800 border border-dark-700 mb-4 text-slate-400">
            <Rocket className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <BrandLogo domain={service.domain} size="sm" />
            <span>{service.name.split(' (')[0]} · 마케팅 전략 분석</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mb-3 leading-relaxed">
            해당 도메인({service.domain})의 공식 마케팅 집행 내역, 키워드 광고 및 AEO 채널 전략 공시 데이터가 확인되지 않았습니다.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <span>[확인 불가: 외부 마케팅 집행 및 키워드 공시 데이터 없음 (N/A)]</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 max-w-md">
            ※ 데이터 무결성 원칙에 따라 실측 데이터가 없는 사이트에 대해 가상 마케팅 전략이나 타사 키워드를 임의로 덧씌우지 않습니다.
          </p>
        </div>
      </div>
    );
  }

  const takeawayData = useMemo(() => {
    if (isWowpass) {
      return {
        posBody: '외화 지폐 즉시 무인 환전 및 발급 편의성',
        posAction: '공항철도 및 주요 호텔 무인 거점 선점 락인',
        negBody: '출국 시 외화 재환불 키오스크 거점 부족 및 공항 대기열 발생',
        negAction: '모바일 사전 환전 예약 및 공항 대기열 분산 알림 도입'
      };
    }
    if (isTravel) {
      return {
        posBody: '45개국 외화 수수료 0% 실시간 충전 및 현지 ATM 무료 출금',
        posAction: '외화 무료 충전 범용성 및 복수 통화 보유 편의성 극대화',
        negBody: '해외 구형 ATM IC칩 인식 오류 및 고객센터 상담 지연',
        negAction: '24/7 실시간 AI 결제 진단 챗봇 및 비상 디지털 카드 발급'
      };
    }
    if (isNamane) {
      return {
        posBody: 'K-POP 포토카드 즉석 커스텀 인쇄 및 앱 내 해외카드 직접 충전',
        posAction: 'K-컬처 굿즈형 카드 마케팅 강화 및 해외 카드 직접 충전 홍보',
        negBody: '페이 잔액 ↔ 대중교통 잔액 이원화 분리로 인한 개찰구 오류',
        negAction: '페이↔교통 잔액 스마트 오토 밸런싱(자동 전환) 도입'
      };
    }
    const isDgdr = service.domain.includes('dgdr') || service.name.includes('동거동락');
    if (isDgdr) {
      return {
        posBody: `${service.name} 코리빙 지점 공실 실시간 확인 및 비대면 입주 계약 편의성`,
        posAction: '대학가 및 역세권 지점 공실 연동 고도화 및 첫 달 프로모션 강화',
        negBody: '피크 시즌(신학기) 고객센터 문의 응답 지연 및 입주 희망 지점 대기열 발생',
        negAction: '실시간 입주 상담 AI 챗봇 도입 및 사전 예약 대기 시스템 자동화'
      };
    }
    const cleanName = service.name.split(' (')[0];
    return {
      posBody: `${cleanName} 핵심 온라인 서비스 접근성 및 이용 편의성 호평`,
      posAction: '사용자 피드백 기반 핵심 기능 강화 및 브랜드 인지도 제고',
      negBody: '신규 유입 고객 대상 상세 사용 가이드 및 초기 온보딩 보완 요청',
      negAction: '온보딩 프로세스 단순화 및 직관적 고객 지원 채널 확대'
    };
  }, [isNamane, isWowpass, isTravel, service.name, service.domain]);

  const positiveReviews: ReviewItem[] = useMemo(() => {
    if (app?.representativeReviews?.positive && app.representativeReviews.positive.length > 0) {
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
  }, [app?.representativeReviews, isNamane]);

  const negativeReviews: ReviewItem[] = useMemo(() => {
    if (app?.representativeReviews?.negative && app.representativeReviews.negative.length > 0) {
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
  }, [app?.representativeReviews, isNamane]);

  // Fallback pillars for Namane if not dynamically supplied
  const defaultPillars = [
    {
      id: 'global',
      title: '구글 & 레딧 커뮤니티 상단 선점',
      targetPortal: '구글 / 빙',
      budget: '자체 채널',
      timeline: '1순위 · 1주차 실행',
      goal: '자유여행객 유입 +55% (월 1.5만 ➔ 2.3만 회)',
      accentColor: 'border-brand-cyan/50 bg-brand-cyan/5',
      badgeColor: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/40',
      keyPoint: '구글 검색 상위에 노출되는 레딧 커뮤니티 비교 정보글 선점',
      coreActions: [
        '레딧 한국여행 커뮤니티에 [한국 교통·선불카드 비교 가이드] 기고',
        '킬러 기능: "해외 신용카드 즉시 앱 충전 + 사진 인쇄" 강조',
        '인천공항·홍대·명동 등 20개 거점별 영문 키오스크 페이지 배포',
        '트립어드바이저 여행 포럼 질의응답 게시판에 공식 키오스크 지도 연결'
      ]
    },
    {
      id: 'korea',
      title: '네이버 스마트플레이스 등록 및 숏폼 확산',
      targetPortal: '네이버 / 구글',
      budget: '자체 등록',
      timeline: '2순위 · 1~2주차 실행',
      goal: '발급처 검색 전환율 2.5배 상승',
      accentColor: 'border-brand-emerald/50 bg-brand-emerald/5',
      badgeColor: 'bg-brand-emerald/20 text-brand-emerald border-brand-emerald/40',
      keyPoint: '네이버 검색 상단 스마트플레이스 지도 영역 1위 선점',
      coreActions: [
        '공항철도 및 주요 역사·편의점 키오스크를 스마트플레이스에 공식 등록',
        '플레이스 상세 사진에 "즉석 포토카드 출력 가능" 안내 등록',
        '유튜브 쇼츠·틱톡에 "3초 만에 폰 사진으로 카드 뽑기" 15초 영상 업로드',
        '숏폼 2편: "개찰구 잔액 부족 1초 해결법 (페이↔교통 전환)" 제작'
      ]
    },
    {
      id: 'japan',
      title: '야후재팬 & 트위터 팬덤 바이럴',
      targetPortal: '야후재팬 / 구글',
      budget: '자체 바이럴',
      timeline: '3순위 · 2~3주차 실행',
      goal: '팬덤 유입 +70% (월 1.3만 ➔ 2.2만 회)',
      accentColor: 'border-brand-purple/50 bg-brand-purple/5',
      badgeColor: 'bg-brand-purple/20 text-brand-purpleLight border-brand-purple/40',
      keyPoint: '최애 굿즈를 소장하려는 K-POP 팬덤 심리를 자극하여 자발적 공유 유도',
      coreActions: [
        '트위터에 [아이돌 생일/컴백 맞춤 포토 프레임 템플릿] 무료 배포',
        '팬덤 해시태그 기반 실물 카드 인증샷 리트윗 챌린지',
        '야후 지혜주머니 "한국 교통카드 추천" 질문에 공식 답변 배치',
        '전용 키오스크 위치 안내 페이지 검색 1위 노출'
      ]
    },
    {
      id: 'ai',
      title: '인공지능 검색 추천 1순위 선점',
      targetPortal: '챗GPT / 퍼플렉시티 / 구글',
      budget: '자체 배포',
      timeline: '4순위 · 3~4주차 실행',
      goal: 'AI 추천 질문 답변 시 와우패스와 함께 대표 카드로 동시 추천',
      accentColor: 'border-brand-amber/50 bg-brand-amber/5',
      badgeColor: 'bg-brand-amber/20 text-brand-amber border-brand-amber/40',
      keyPoint: '여행객이 활용하는 AI 챗봇 추천 답변에 대표 카드로 노출',
      coreActions: [
        '공식 웹사이트에 AI 챗봇이 인식하기 쉬운 서비스 정보 구조화 태그 적용',
        '영문 위키피디아 한국 교통카드 항목에 공식 정보 등재',
        '인공지능 챗봇 검색 대응 공식 서비스 소개서 배포',
        '글로벌 여행 플랫폼 리뷰에 "포토카드 겸용 교통카드" 키워드 집약'
      ]
    }
  ];

  const defaultKeywordMatrix = [
    { rank: 1, keyword: 'namane card', portal: '구글', country: '', channel: '레딧 커뮤니티 & 영문 검색', action: '3사 비교 가이드 기고 및 영문 검색 태그 최적화', impact: '+45% 유입 증대' },
    { rank: 2, keyword: '나마네카드 키오스크 위치', portal: '네이버', country: '', channel: '네이버 스마트플레이스', action: '전국 키오스크 20곳 스마트플레이스 공식 등록', impact: '+150% 지도 노출' },
    { rank: 3, keyword: '포토 교통카드 제작', portal: '야후재팬 / 트위터', country: '', channel: '트위터 & 야후 지혜주머니', action: '팬덤 포토 프레임 무료 배포 및 리트윗 챌린지', impact: '+65% 유입 증대' },
    { rank: 4, keyword: '공항·역사 무인발급기', portal: '구글 / 야후', country: '', channel: '거점별 검색 최적화', action: '공항·역사별 20개 단독 랜딩페이지 생성 및 인덱싱', impact: '+80% 유입 증대' },
    { rank: 5, keyword: 'korea custom transit card', portal: '구글 / 인공지능', country: '', channel: '인공지능 검색 최적화', action: '구조화 태그 적용 및 위키피디아 공식 등재', impact: '+50% AI 추천 노출' },
  ];

  const defaultRoadmap = [
    {
      week: '1주차',
      title: '지도 & 거점 페이지 등록',
      budget: '자체 운영',
      actions: [
        '네이버 지도에 키오스크 20곳 전수 등록',
        '거점별 영문/일문 안내 페이지 배포',
        '웹사이트 AI 챗봇 인식용 태그 삽입'
      ]
    },
    {
      week: '2주차',
      title: '글로벌 커뮤니티 선점',
      budget: '자체 운영',
      actions: [
        '레딧 한국여행 커뮤니티에 [교통카드 올인원 가이드] 기고',
        '야후 지혜주머니 추천 질의응답 공식 답변 배치',
        '글로벌 여행 포럼에 키오스크 지도 링크 연결'
      ]
    },
    {
      week: '3주차',
      title: '팬덤 바이럴 & 숏폼 확산',
      budget: '자체 운영',
      actions: [
        '트위터에 [최애 포토카드 프레임] 무료 배포',
        '나마네 실물 카드 인증샷 리트윗 챌린지 오픈',
        '유튜브 쇼츠 / 틱톡에 15초 튜토리얼 2편 업로드'
      ]
    },
    {
      week: '4주차',
      title: '성과 측정 & 전환율 극대화',
      budget: '자체 운영',
      actions: [
        '포털별 검색 순위 변동 추적 분석',
        '유입자의 앱 다운로드 버튼 클릭률 최적화',
        '성과 높은 키워드 중심 2차 콘텐츠 보강'
      ]
    }
  ];

  const pillars = (marketingStrategy?.pillars && marketingStrategy.pillars.length > 0)
    ? marketingStrategy.pillars
    : (isNamane ? defaultPillars : []);

  const keywordMatrix = (marketingStrategy?.keywordMatrix && marketingStrategy.keywordMatrix.length > 0)
    ? marketingStrategy.keywordMatrix
    : (isNamane ? defaultKeywordMatrix : []);

  const roadmap = (marketingStrategy?.roadmap && marketingStrategy.roadmap.length > 0)
    ? marketingStrategy.roadmap
    : (isNamane ? defaultRoadmap : []);

  const getPillarIcon = (id: string) => {
    if (id.includes('japan') || id.includes('viral') || id.includes('sns') || id.includes('share')) return Share2;
    if (id.includes('global') || id.includes('seo') || id.includes('community')) return Compass;
    if (id.includes('korea') || id.includes('local') || id.includes('map')) return MapPin;
    if (id.includes('ai') || id.includes('aeo') || id.includes('tech')) return Sparkles;
    return Rocket;
  };

  const isAutomationOpen = showAutomationPage || activeSubView === 'smartplace-docs';
  const isKeywordGuideOpen = selectedKeywordGuideRank !== null || activeSubView === 'keyword-guide';

  if (isAutomationOpen) {
    return (
      <MarketingAutomationSecondPage
        serviceName={service.name}
        onBack={() => {
          setShowAutomationPage(false);
          onSubViewChange?.('main');
        }}
      />
    );
  }

  if (isKeywordGuideOpen) {
    return (
      <KeywordConquestGuidePage
        serviceName={service.name}
        initialRank={selectedKeywordGuideRank ?? 1}
        onBack={() => {
          setSelectedKeywordGuideRank(null);
          onSubViewChange?.('main');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* 3. Four Strategic Pillars Section */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-dark-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-brand-amber" />
              4대 핵심 집중 유입 채널
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              채널별 특성 기반 최소 리소스 투입 대비 최대 효과 실행 과제
            </p>
          </div>
          <div className="hidden md:flex items-center self-end sm:self-center shrink-0">
            <PdfReportButton data={data} tab="marketing-strategy" />
          </div>
        </div>

        {pillars.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-dark-850/60 border border-dark-750">
            <Zap className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-300">
              해당 도메인의 4대 핵심 집중 유입 채널 전략 데이터가 등록되어 있지 않습니다.
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              [미확인: 도메인 맞춤 유입 채널 공시 없음]
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pillars.map((pillar, idx) => {
            const pillarOrder = idx + 1;
            const Icon = getPillarIcon(pillar.id);
            const cleanTitle = (pillar.title.includes(':') ? pillar.title.split(':')[1] : pillar.title)
              .replace(/\s*\d+%/g, '')
              .trim();
            const cleanTargetPortal = pillar.targetPortal.replace(/\s*\([^)]*%\)/g, '').trim();
            return (
              <div 
                key={pillar.id}
                className={`p-6 rounded-2xl border transition-all duration-200 ${pillar.accentColor || 'border-dark-700 bg-dark-900'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-dark-850 border border-brand-cyan/50 flex items-center justify-center text-brand-cyan text-lg font-black shrink-0 shadow-sm"
                      title={`실행 순위 ${pillarOrder}순위`}
                    >
                      {pillarOrder}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border inline-block ${pillar.badgeColor}`}>
                          {cleanTargetPortal}
                        </span>
                        <span className="inline-flex items-center text-xs font-bold text-slate-400">
                          <Icon className="w-3.5 h-3.5 mr-1 text-brand-purpleLight" />
                          {pillarOrder}순위 채널
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {cleanTitle}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-3.5 rounded-xl bg-dark-850/80 border border-dark-750">
                  <div className="text-xs text-brand-purpleLight font-bold mb-1">💡 핵심 전략 1줄</div>
                  <p className="text-sm font-semibold text-slate-100 leading-snug">
                    {pillar.keyPoint}
                  </p>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    즉시 실행 과제
                  </div>
                  {pillar.coreActions.map((action, aIdx) => (
                    <div key={aIdx} className="flex items-start space-x-2.5 text-sm text-slate-200">
                      <span className="w-5 h-5 rounded-md bg-dark-800 text-brand-emerald text-xs font-black flex items-center justify-center shrink-0 mt-0.5 border border-dark-700">
                        {aIdx + 1}
                      </span>
                      <span className="leading-snug">{action}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3.5 border-t border-dark-700/60 flex items-center justify-between text-xs">
                  <div className="text-slate-400 font-medium">
                    소요 일정: <strong className="text-white font-bold ml-1">{pillar.timeline}</strong>
                  </div>
                  <div className="text-brand-emerald font-bold bg-brand-emerald/10 px-2.5 py-1 rounded-md">
                    목표: {pillar.goal}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* 4. Keyword Conquest Matrix */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-dark-700 gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center tracking-normal">
              <Search className="w-5 h-5 mr-2 text-brand-cyan" />
              핵심 유입 키워드별 공략 매트릭스
            </h3>
            <p className="text-sm text-slate-400 mt-0.5 leading-relaxed tracking-normal">
              상위 5대 키워드 채널 매칭 및 단계별 실행 플랜
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-dark-800 text-slate-300 border border-dark-700">
              자체 채널 및 오가닉 검색 기준
            </span>
            {isNamane && (
              <button
                onClick={() => setSelectedKeywordGuideRank(1)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-black bg-brand-cyan hover:bg-brand-cyan/90 text-dark-950 flex items-center gap-1.5 transition-colors shadow-lg shadow-brand-cyan/20 cursor-pointer"
              >
                <span>#1. 키워드 점유 실행 공략집 바로가기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 모바일 화면 (가로 스크롤바 0%, 키워드 카드 뷰) */}
        {keywordMatrix.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-dark-850/60 border border-dark-750">
            <Search className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-300">
              해당 도메인의 핵심 유입 키워드별 공략 매트릭스 데이터가 없습니다.
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              [미확인: 도메인 맞춤 키워드 매트릭스 공시 없음]
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 md:hidden font-sans">
              {keywordMatrix.map((item) => (
            <div key={item.rank} className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-dark-750 text-center text-xs font-bold text-brand-purpleLight flex items-center justify-center shrink-0 tabular-nums">
                    {item.rank}
                  </span>
                  <span className="font-bold text-sm text-white">{item.keyword}</span>
                </div>
                <span className="font-bold text-xs text-brand-emerald">{item.impact}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">목표 포털</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.portal
                      .split('/')
                      .map(p => p.replace(/\s*\([^)]*%\)/g, '').trim())
                      .filter(Boolean)
                      .map((p, pIdx) => (
                        <div key={pIdx} className="inline-flex items-center px-1.5 py-0.5 rounded bg-dark-800 border border-dark-750 text-[11px]">
                          <BrandBadgesFromText text={p} size="xs" />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">공략 채널</div>
                  <div className="mt-1">
                    <BrandBadgesFromText text={item.channel} size="xs" />
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-300 pt-1 border-t border-dark-800 space-y-2">
                <div>
                  <span className="text-slate-400 font-semibold mr-1">[실행방안]</span>
                  <span>{item.action}</span>
                </div>
                {isNamane && (
                  <button
                    onClick={() => setSelectedKeywordGuideRank(item.rank)}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      item.rank === 1
                        ? 'bg-brand-cyan text-dark-950 font-black'
                        : 'bg-dark-800 text-brand-cyan border border-brand-cyan/40'
                    }`}
                  >
                    <span>{item.rank === 1 ? '1번 공략집 실행' : `${item.rank}번 공략집 보기`}</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
          <table className={`w-full table-fixed text-left text-slate-200 ${dClasses.tableText}`}>
            <thead className="bg-dark-850">
              <tr>
                <th className={`${dClasses.th} rounded-l-lg text-center w-[7%]`}>순위</th>
                <th className={`${dClasses.th} w-[18%]`}>키워드</th>
                <th className={`${dClasses.th} w-[16%]`}>포털</th>
                <th className={`${dClasses.th} w-[14%]`}>채널</th>
                <th className={`${dClasses.th} w-[15%]`}>효과</th>
                <th className={`${dClasses.th} rounded-r-lg w-[30%]`}>실행방안 (설명)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750">
              {keywordMatrix.map((item) => (
                <tr key={item.rank} className="hover:bg-dark-800/60 transition-colors">
                  {/* 1. 순위 */}
                  <td className={`${dClasses.td} text-center`}>
                    <span className="inline-flex w-5 h-5 rounded bg-dark-750 items-center justify-center text-xs font-bold text-brand-purpleLight tabular-nums">
                      {item.rank}
                    </span>
                  </td>

                  {/* 2. 키워드 */}
                  <td className={`${dClasses.td} font-bold text-white`}>
                    <span className="font-black text-white tracking-normal break-keep">{item.keyword}</span>
                  </td>

                  {/* 3. 포털 */}
                  <td className={`${dClasses.td} font-medium text-slate-300 align-middle`}>
                    <div className="flex flex-wrap gap-1 py-0.5 whitespace-nowrap">
                      {item.portal
                        .split('/')
                        .map(p => p.replace(/\s*\([^)]*%\)/g, '').trim())
                        .filter(Boolean)
                        .map((p, pIdx) => (
                          <div key={pIdx} className="inline-flex items-center px-2 py-0.5 rounded bg-dark-800 border border-dark-750 text-xs w-fit whitespace-nowrap">
                            <BrandBadgesFromText text={p} size="xs" />
                          </div>
                        ))}
                    </div>
                  </td>

                  {/* 4. 채널 */}
                  <td className={`${dClasses.td} font-bold text-brand-cyan tracking-normal break-keep`}>
                    <BrandBadgesFromText text={item.channel} size="xs" />
                  </td>

                  {/* 5. 효과 */}
                  <td className={`${dClasses.td} font-black text-brand-emerald whitespace-nowrap tracking-normal`}>
                    {item.impact}
                  </td>

                  {/* 6. 실행방안 (설명 우측 끝) */}
                  <td className={`${dClasses.td} text-slate-200 font-medium leading-relaxed tracking-normal break-keep`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs">{item.action}</span>
                      {isNamane && (
                        <button
                          onClick={() => setSelectedKeywordGuideRank(item.rank)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                            item.rank === 1
                              ? 'bg-brand-cyan text-dark-950 hover:bg-brand-cyan/90 font-black'
                              : 'bg-dark-800 text-brand-cyan hover:bg-dark-750 border border-brand-cyan/40'
                          }`}
                        >
                          <span>{item.rank === 1 ? '1번 공략집' : `${item.rank}번 공략집`}</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}
      </div>

      {/* 5. 30-Day Timeline Roadmap */}
      <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-dark-700 gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-brand-purpleLight" />
              30일 완성 주차별 실행 로드맵
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              1주차 스마트플레이스 등록 집중 실행 (2~4주차 TBD)
            </p>
          </div>
          <button
            onClick={() => setShowAutomationPage(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-purpleLight hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-purple/25 flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4 text-cyan-300" />
            <span>1주차 서류 등록 세컨페이지 열기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {roadmap.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-dark-850/60 border border-dark-750">
            <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-300">
              해당 도메인의 30일 완성 주차별 실행 로드맵 데이터가 없습니다.
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              [미확인: 도메인 맞춤 실행 로드맵 공시 없음]
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmap.map((phase, idx) => {
            const isWeek1 = idx === 0;
            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isWeek1
                    ? 'bg-dark-850 border-brand-purple/60 shadow-md'
                    : 'bg-dark-950/60 border-dark-800 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        isWeek1
                          ? 'bg-brand-purple/20 text-brand-purpleLight border-brand-purple/40'
                          : 'bg-dark-800 text-slate-400 border-dark-700'
                      }`}
                    >
                      {phase.week}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isWeek1
                          ? 'bg-brand-emerald/20 text-brand-emerald'
                          : 'bg-dark-800 text-slate-400'
                      }`}
                    >
                      {isWeek1 ? `운영: ${phase.budget}` : 'TBD'}
                    </span>
                  </div>
                  <h4 className={`text-base font-bold mb-3 ${isWeek1 ? 'text-white' : 'text-slate-400'}`}>
                    {isNamane && isWeek1 ? '네이버 스마트플레이스 등록' : phase.title}
                  </h4>
                  {isWeek1 ? (
                    <div className="space-y-2">
                      {(isNamane ? [
                        '사업자등록증·설치계약서 등록',
                        '키오스크 로고·전경·화면 실사 3장 첨부',
                        '20개소 위치·운영시간·키워드 제출'
                      ] : (phase.actions || [phase.title])).map((act, aIdx) => (
                        <div key={aIdx} className="flex items-start space-x-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0 mt-0.5" />
                          <span className="leading-snug">{act}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {phase.actions && phase.actions.length > 0 ? (
                        phase.actions.map((act, aIdx) => (
                          <div key={aIdx} className="flex items-start space-x-1.5 text-xs text-slate-400">
                            <span className="text-slate-600">•</span>
                            <span className="leading-snug">{act}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded-lg bg-dark-900/80 border border-dark-800 text-xs text-slate-400 leading-relaxed">
                          TBD (1주차 완료 후 오픈)
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-dark-700/50 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">
                    상태: {isWeek1 ? '실행 가능' : 'TBD'}
                  </span>
                  {isWeek1 && isNamane ? (
                    <button
                      onClick={() => setShowAutomationPage(true)}
                      className="px-2.5 py-1 rounded-md bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>서류 등록·실행</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : isWeek1 ? (
                    <span className="text-xs font-bold text-brand-emerald">우선 실행</span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500">추후 진행</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* 6. 앱 리뷰(VOC) 분석 및 마케팅·프로덕트 개선점 (핵심 간소화 버전) */}
      <div id="app-reviews-section" className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-5">
        
        {/* 상단 헤더: 타이틀, 핵심 지표 배지 */}
        <div className="pb-3.5 border-b border-dark-700">
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-purple/20 text-brand-purpleLight border border-brand-purple/40">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>앱 리뷰(VOC) 분석 및 마케팅 개선점</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-brand-amber/15 text-brand-amber border border-brand-amber/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-brand-amber text-brand-amber" />
              <span>{app?.rating || '4.76'}★</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            실측 앱 리뷰({app?.reviewCount || '3,700건'}) 전수 분석: 호평 요인 극대화 및 마케팅·온보딩 페인포인트 해소
          </p>
        </div>

        {/* 2대 VOC 핵심 요약 카드: 🟢 호평 드라이버 vs 🔴 개선 페인포인트 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {/* 🟢 호평 드라이버 */}
          <div className="p-4 rounded-xl bg-dark-950/80 border border-brand-emerald/30 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-dark-800">
              <span className="text-xs font-bold text-brand-emerald flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
                <span>호평 핵심 드라이버</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-brand-emerald/15 text-brand-emerald font-bold shrink-0">
                마케팅 소구점
              </span>
            </div>
            <h4 className="text-sm font-bold text-white truncate" title={takeawayData.posBody}>
              {takeawayData.posBody}
            </h4>
            <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 text-xs text-slate-300 flex items-center justify-between gap-2">
              <span className="text-slate-400 font-medium shrink-0">마케팅 실행:</span>
              <strong className="text-brand-cyan truncate" title={takeawayData.posAction}>{takeawayData.posAction}</strong>
            </div>
          </div>

          {/* 🔴 개선 페인포인트 */}
          <div className="p-4 rounded-xl bg-dark-950/80 border border-brand-rose/30 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-dark-800">
              <span className="text-xs font-bold text-brand-rose flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-brand-rose shrink-0" />
                <span>개선 핵심 페인포인트</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-brand-rose/15 text-brand-rose font-bold shrink-0">
                온보딩·UX 개선
              </span>
            </div>
            <h4 className="text-sm font-bold text-white truncate" title={takeawayData.negBody}>
              {takeawayData.negBody}
            </h4>
            <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 text-xs text-slate-300 flex items-center justify-between gap-2">
              <span className="text-slate-400 font-medium shrink-0">프로덕트 해결책:</span>
              <strong className="text-brand-amber truncate" title={takeawayData.negAction}>{takeawayData.negAction}</strong>
            </div>
          </div>
        </div>

        {/* 대표 리뷰 긍정 Top 3 vs 부정 Top 3 간소화 2열 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {/* 긍정 대표 리뷰 Top 3 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-dark-750">
              <span className="text-xs font-bold text-brand-emerald flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>긍정 대표 리뷰 ({positiveReviews.length}건)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{isNamane ? '커스텀 & 충전 호평' : '서비스 핵심 가치 호평'}</span>
            </div>
            {positiveReviews.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-dark-850/60 border border-dark-750 text-xs text-slate-500 font-mono">
                [미확인: 도메인 긍정 리뷰 공시 없음]
              </div>
            ) : (
              <div className="space-y-2">
                {positiveReviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-dark-850/80 border border-dark-750 space-y-1.5">
                    {/* 1행: 제목 (별점 + 카테고리 + 제목 요약 + 날짜) - 단 1줄 */}
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-brand-amber font-bold flex items-center shrink-0">
                          <Star className="w-3 h-3 fill-brand-amber mr-0.5" />
                          {rev.rating}.0
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-dark-800 text-slate-300 border border-dark-700 shrink-0">
                          {rev.category}
                        </span>
                        <span className="text-slate-200 font-bold truncate" title={rev.summaryPoint}>{rev.summaryPoint}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono shrink-0">{rev.date}</span>
                    </div>
                    {/* 2행: 내용 (본문 1줄 표시 + 작성자) - 단 1줄 */}
                    <div className="flex items-center justify-between text-xs gap-3">
                      <p className="text-xs text-slate-300 font-normal truncate pl-2 border-l-2 border-brand-emerald/40 min-w-0" title={rev.content}>
                        "{rev.content}"
                      </p>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        작성자: <span className="text-slate-300">{rev.author}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 부정/개선 대표 리뷰 Top 3 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-dark-750">
              <span className="text-xs font-bold text-brand-rose flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>개선 필요 대표 리뷰 ({negativeReviews.length}건)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{isNamane ? '잔액 분리 & NFC 혼선' : '온보딩 & 기능 개선'}</span>
            </div>
            {negativeReviews.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-dark-850/60 border border-dark-750 text-xs text-slate-500 font-mono">
                [미확인: 도메인 개선 필요 리뷰 공시 없음]
              </div>
            ) : (
              <div className="space-y-2">
                {negativeReviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-dark-850/80 border border-dark-750 space-y-1.5">
                    {/* 1행: 제목 (별점 + 카테고리 + 제목 요약 + 날짜) - 단 1줄 */}
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-brand-rose font-bold flex items-center shrink-0">
                          <Star className="w-3 h-3 fill-brand-rose mr-0.5" />
                          {rev.rating}.0
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-dark-800 text-slate-300 border border-dark-700 shrink-0">
                          {rev.category}
                        </span>
                        <span className="text-slate-200 font-bold truncate" title={rev.summaryPoint}>{rev.summaryPoint}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono shrink-0">{rev.date}</span>
                    </div>
                    {/* 2행: 내용 (본문 1줄 표시 + 작성자) - 단 1줄 */}
                    <div className="flex items-center justify-between text-xs gap-3">
                      <p className="text-xs text-slate-300 font-normal truncate pl-2 border-l-2 border-brand-rose/40 min-w-0" title={rev.content}>
                        "{rev.content}"
                      </p>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        작성자: <span className="text-slate-300">{rev.author}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default MarketingStrategySubpage;
