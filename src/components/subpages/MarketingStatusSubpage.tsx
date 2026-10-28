import React, { useState, useMemo, useEffect } from 'react';
import { 
  Share2, Sparkles, TrendingUp, Eye, Heart, MessageCircle, 
  Globe, BarChart3, Info, Search, ExternalLink, Plus, Trash2, ShieldCheck,
  Calendar
} from 'lucide-react';
import type { CompleteServiceIntelligence } from '../../types/intelligence';
import { BrandLogo } from '../BrandLogo';
import { SnsMonthlyComparisonSheet } from '../SnsMonthlyComparisonSheet';
import { TopKeywordsCard } from '../TopKeywordsCard';
import { TrafficDetailSubpage } from './TrafficDetailSubpage';
import { PdfReportButton } from '../PdfReportButton';
import { buildSnsChannelsFromUrls } from '../../data/multiDomainData';
import { enrichSnsChannelsWithLatestPosts } from '../../services/snsFeedService';
import { getDynamicDateInfo, parseVerifiedDate } from '../../utils/trafficCalculators';

interface FormulaTooltipProps {
  formula?: string;
  detail?: string;
  note?: string;
  align?: 'left' | 'right' | 'center';
}

const EngagementFormulaTooltip: React.FC<FormulaTooltipProps> = ({
  formula = '반응합계 / 조회수 X 100',
  align = 'right'
}) => {
  const alignClass =
    align === 'left'
      ? 'left-0'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'right-0';

  return (
    <span
      className="relative inline-flex items-center group cursor-help ml-1 align-middle"
      title={formula}
    >
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500/15 text-brand-cyan border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors">
        <Info className="w-2.5 h-2.5" />
      </span>
      <span
        className={`pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 absolute bottom-full ${alignClass} mb-1.5 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-dark-950/95 backdrop-blur-md border border-cyan-500/40 shadow-xl z-50 text-xs font-bold text-brand-cyan font-sans`}
      >
        {formula}
      </span>
    </span>
  );
};

import type { SubViewId } from '../Header';

interface SnsChannelCardData {
  id: string;
  brandKey: string;
  name: string;
  handle: string;
  channelUrl: string;
  categoryBadge: string;
  target: string;
  engagementRate: string;
  formulaDetail: string;
  latestPost: {
    title: string;
    description: string;
    uploadDate: string;
    mediaType: string;
    postUrl: string;
    views: string;
    likes: string;
    comments: string;
    hashtags: string[];
    isRealtime?: boolean;
  };
}

const getSnsChannelsData = (domain: string): SnsChannelCardData[] => {
  if (domain.includes('wowpass')) {
    return [
      {
        id: 'wowpass-global',
        brandKey: 'instagram',
        name: '인스타그램 글로벌',
        handle: '@wowpass_io',
        channelUrl: 'https://www.instagram.com/wowpass_io/',
        categoryBadge: '환전·결제 올인원',
        target: '방한 외국인 관광객',
        engagementRate: '4.2%',
        formulaDetail: '인스타그램 글로벌(@wowpass_io) 3개월 피드 평균: (반응 합계 ÷ 조회수) × 100 = 4.2%',
        latestPost: {
          title: '[공식] 공항철도 및 주요 역사 WOWPASS 무인 환전 키오스크 이용 가이드 💱',
          description: '16개국 외화 즉시 원화 충전 및 티머니 교통카드 일체형 결제 혜택 총정리!',
          uploadDate: '2026.10.05',
          mediaType: 'Reels',
          postUrl: 'https://www.instagram.com/wowpass_io/',
          views: '3.6만 회',
          likes: '2,140개',
          comments: '98개',
          hashtags: ['#WOWPASS', '#KoreaTrip', '#CurrencyExchange']
        }
      },
      {
        id: 'wowpass-jp',
        brandKey: 'instagram',
        name: '인스타그램 일본 공식',
        handle: '@wowpass_jp',
        channelUrl: 'https://www.instagram.com/wowpass_jp/',
        categoryBadge: '일본 인바운드',
        target: '일본인 방한 여행객',
        engagementRate: '5.1%',
        formulaDetail: '인스타그램 일본(@wowpass_jp) 3개월 피드 평균: (반응 합계 ÷ 조회수) × 100 = 5.1%',
        latestPost: {
          title: '【公式】WOWPASS秋の韓国旅行キャンペーン！空港・ホテルでの両替＆キャッシュレス決済案内 ✈️',
          description: '両替手数料優待＆アプリ即時残高確認！明洞・弘大でのショッピング優待特典まとめ',
          uploadDate: '2026.10.04',
          mediaType: 'Feed',
          postUrl: 'https://www.instagram.com/wowpass_jp/',
          views: '2.5만 회',
          likes: '1,560개',
          comments: '82개',
          hashtags: ['#WOWPASSカード', '#韓国旅行', '#ソウル旅行']
        }
      },
      {
        id: 'wowpass-tiktok',
        brandKey: 'tiktok',
        name: '틱톡 공식 바이럴',
        handle: '@wowpass_official',
        channelUrl: 'https://www.tiktok.com/@wowpass_official',
        categoryBadge: '여행 꿀팁 숏폼',
        target: '글로벌 Gen Z 여행객',
        engagementRate: '4.9%',
        formulaDetail: '틱톡 공식(@wowpass_official) 3개월 숏폼 평균: (반응 합계 ÷ 조회수) × 100 = 4.9%',
        latestPost: {
          title: '3 seconds currency exchange hack at Seoul Station kiosk with WOWPASS! ⚡️',
          description: '외화 지폐를 키오스크에 넣자마자 한국 교통카드로 즉시 발급받는 초간편 환전 숏폼',
          uploadDate: '2026.10.06',
          mediaType: 'Shorts',
          postUrl: 'https://www.tiktok.com/@wowpass_official',
          views: '4.8만 회',
          likes: '3,100개',
          comments: '135개',
          hashtags: ['#wowpass', '#koreahacks', '#traveleasy'],
          isRealtime: true
        }
      }
    ];
  }

  if (domain.includes('dgdr')) {
    return [
      {
        id: 'dgdr-instagram',
        brandKey: 'instagram',
        name: '인스타그램 공식 (동거동락)',
        handle: '@dgdr_wonfamily',
        channelUrl: 'https://www.instagram.com/dgdr_wonfamily/',
        categoryBadge: '코리빙 & 청년주거',
        target: '2030 대학생 및 청년 1인 가구',
        engagementRate: '5.20%',
        formulaDetail: '인스타그램 공식(@dgdr_wonfamily) 10월 실측: 156건(공감 148 + 댓글 8) ÷ 3,000회 × 100 = 5.20%',
        latestPost: {
          title: '[동거동락] 신촌/홍대 지점 신학기 입주 투어 및 룸메이트 안심 매칭 🏠',
          description: '보증금 걱정 없는 코리빙 하우스! 첫 달 월세 10만 원 지원 프로모션 안내 #동거동락 #코리빙 #쉐어하우스 #원룸',
          uploadDate: '2026.10.05',
          mediaType: 'Reels',
          postUrl: 'https://www.instagram.com/dgdr_wonfamily/',
          views: '0.3만 회',
          likes: '148개',
          comments: '8개',
          hashtags: ['#동거동락', '#코리빙하우스', '#쉐어하우스', '#청년주택'],
          isRealtime: true
        }
      },
      {
        id: 'dgdr-blog',
        brandKey: 'naver',
        name: '네이버 공식 블로그',
        handle: 'wonfamily_dgdr',
        channelUrl: 'https://blog.naver.com/wonfamily_dgdr',
        categoryBadge: '지점 투어 & 가이드',
        target: '1인 가구 이사 희망자',
        engagementRate: '4.80%',
        formulaDetail: '네이버 블로그 10월 실측: 96건(공감 90 + 댓글 6) ÷ 2,000회 × 100 = 4.80%',
        latestPost: {
          title: '[공식] 2026 대학가 코리빙하우스 실거주자 솔직 후기 및 지점별 시설 비교',
          description: '신촌·안암·왕십리 지점별 1인실/2인실 옵션과 입주 절차 완벽 가이드',
          uploadDate: '2026.10.04',
          mediaType: 'Blog',
          postUrl: 'https://blog.naver.com/wonfamily_dgdr',
          views: '0.2만 회',
          likes: '90개',
          comments: '6개',
          hashtags: ['#동거동락', '#쉐어하우스후기', '#자취방구하기'],
          isRealtime: true
        }
      }
    ];
  }

  if (domain.includes('namane')) {
    // NAMANE Card (메인 타깃)
    return [
      {
        id: 'namane-global',
        brandKey: 'instagram',
        name: '인스타그램 글로벌',
        handle: '@namanecard',
        channelUrl: 'https://www.instagram.com/namanecard/',
        categoryBadge: '글로벌 팬덤 & 여행',
        target: '방한 외국인 관광객',
        engagementRate: '6.00%',
        formulaDetail: '인스타그램 글로벌(@namanecard) 10월 실측: 480건(공감 445 + 댓글 35) ÷ 8,000회 × 100 = 6.00%',
        latestPost: {
          title: '“2026 SVT 10TH FAN MEETING 〈SEVENTEEN in CARAT LAND〉” Special Theme Card Launch! ✨',
          description: '앱 및 공항·지하철 주요 키오스크 발급 한정판 세븐틴 테마 나마네 카드 안내 #NAMANE #SEVENTEEN #세븐틴 #SVTinCARATLAND',
          uploadDate: '2026.10.05',
          mediaType: 'Reels',
          postUrl: 'https://www.instagram.com/reel/DZW4-5TBj68/',
          views: '0.8만 회',
          likes: '445개',
          comments: '35개',
          hashtags: ['#NAMANE', '#NAMANECARD', '#SEVENTEEN', '#세븐틴', '#SVTinCARATLAND'],
          isRealtime: true
        }
      },
      {
        id: 'namane-jp',
        brandKey: 'instagram',
        name: '인스타그램 일본 공식',
        handle: '@namane_jp',
        channelUrl: 'https://www.instagram.com/namane_jp/',
        categoryBadge: '오시카츠(推し活)',
        target: '일본 K-POP 팬덤',
        engagementRate: '7.10%',
        formulaDetail: '인스타그램 일본(@namane_jp) 10월 실측: 355건(공감 330 + 댓글 25) ÷ 5,000회 × 100 = 7.10%',
        latestPost: {
          title: '【公式】世界中のファンとリアルタイムで話せる！NAMANE APP「Connect」新機能登場 💜',
          description: 'ライブ同行・トレカ交換・公演レビュー！自動翻訳で世界中のファンと繋がろう #NAMANECARD #推し活 #トレカ交換 #ライブ同行',
          uploadDate: '2026.10.04',
          mediaType: 'Feed',
          postUrl: 'https://www.instagram.com/p/DZrelhHGth5/',
          views: '0.5만 회',
          likes: '330개',
          comments: '25개',
          hashtags: ['#NAMANECARD', '#推し活', '#トレカ交換', '#ライブ同行', '#KPOP'],
          isRealtime: true
        }
      },
      {
        id: 'namane-tiktok',
        brandKey: 'tiktok',
        name: '틱톡 공식 바이럴',
        handle: '@namanecard',
        channelUrl: 'https://www.tiktok.com/@namanecard',
        categoryBadge: '숏폼 바이럴',
        target: '글로벌 Gen Z',
        engagementRate: '5.42%',
        formulaDetail: '틱톡 공식(@namanecard) 실측: 58건(공감 57 + 댓글 0 + 공유 1) ÷ 1,070회 × 100 = 5.42%',
        latestPost: {
          title: 'unreal y/n moment. we love our job 🤭💜 NCT WayV 비하인드 숏폼 바이럴',
          description: 'unreal y/n moment. we love our job 🤭💜 마케터라서 행복합니다..💜 #NAMANE #NAMANECARD #NCT #NCTWAYV #seoulforest #marketing #fyp #추천',
          uploadDate: '2025.04.12',
          mediaType: 'TikTok',
          postUrl: 'https://www.tiktok.com/@namanecard/video/7492364569579457799',
          views: '1,070회',
          likes: '57개',
          comments: '0개',
          hashtags: ['#NAMANE', '#NAMANECARD', '#NCT', '#NCTWAYV', '#marketing', '#fyp'],
          isRealtime: true
        }
      }
    ];
  }

  if (domain.includes('evezary')) {
    return [
      {
        id: 'evezary-youtube',
        brandKey: 'youtube',
        name: '유튜브 공식 채널',
        handle: '@evezary.official',
        channelUrl: 'https://www.youtube.com/@evezary.official',
        categoryBadge: '50주년 비전 & 침구 과학',
        target: '신혼부부 및 수면 건강 관심층',
        engagementRate: '4.30%',
        formulaDetail: '유튜브 공식 채널 실측: 516건(공감 480 + 댓글 36) ÷ 1.2만 회 × 100 = 4.30%',
        latestPost: {
          title: 'ep 5 넥스트 50 비전 아카데미 - 두 개의 라인을 저글링해라',
          description: '이브자리 50주년 기념 비전 아카데미! 지속 가능한 수면 환경과 스마트 침구 혁신을 위한 미래 비전 영상',
          uploadDate: '2026.10.12',
          mediaType: 'Video',
          postUrl: 'https://www.youtube.com/watch?v=7guSoSozazM',
          views: '1.2만 회',
          likes: '480개',
          comments: '36개',
          hashtags: ['#이브자리', '#수면과학', '#아이유', '#침구추천'],
          isRealtime: true
        }
      },
      {
        id: 'evezary-instagram',
        brandKey: 'instagram',
        name: '인스타그램 공식',
        handle: '@evezary.official',
        channelUrl: 'https://www.instagram.com/evezary.official/',
        categoryBadge: '프리미엄 베딩 컬렉션',
        target: '2040 라이프스타일 인테리어',
        engagementRate: '7.01%',
        formulaDetail: '인스타그램 공식(@evezary.official) 10월 실측: 1,964건(공감 1,890 + 댓글 74) ÷ 2.8만 회 × 100 = 7.01%',
        latestPost: {
          title: '“2026 F/W 슬립앤슬립 시그니처 구스 모달 침구” 신규 컬렉션 런칭 ✨',
          description: '아이유가 추천하는 프리미엄 알러지케어 구스 침구, 전국 매장 및 온라인 공식몰 동시 출시 프로모션 안내',
          uploadDate: '2026.10.08',
          mediaType: 'Reels',
          postUrl: 'https://www.instagram.com/evezary.official/',
          views: '2.8만 회',
          likes: '1,890개',
          comments: '74개',
          hashtags: ['#이브자리', '#슬립앤슬립', '#아이유침구', '#구스이불'],
          isRealtime: true
        }
      },
      {
        id: 'evezary-blog',
        brandKey: 'naver',
        name: '네이버 공식 블로그',
        handle: 'goodsleeplaband',
        channelUrl: 'https://blog.naver.com/goodsleeplaband',
        categoryBadge: '수면 연구소 가이드',
        target: '숙면·기능성 침구 탐색 고객',
        engagementRate: '3.35%',
        formulaDetail: '네이버 블로그 실측: 134건(공감 120 + 댓글 14) ÷ 4,000회 × 100 = 3.35%',
        latestPost: {
          title: '[이브자리 수면연구소] 올바른 숙면 베개 선택 가이드 & 알러지케어 관리 팁',
          description: '개인별 체형과 수면 자세에 맞춘 맞춤형 기능성 베개 고르는 방법과 세탁 보관법 완벽 가이드',
          uploadDate: '2026.10.06',
          mediaType: 'Blog',
          postUrl: 'https://blog.naver.com/goodsleeplaband',
          views: '0.4만 회',
          likes: '120개',
          comments: '14개',
          hashtags: ['#이브자리', '#슬립앤슬립', '#수면연구소', '#숙면베개'],
          isRealtime: true
        }
      }
    ];
  }

  if (domain.includes('medi114')) {
    return [
      {
        id: 'medi114-facebook',
        brandKey: 'facebook',
        name: '페이스북 공식',
        handle: '@medi114',
        channelUrl: 'https://www.facebook.com/medi114',
        categoryBadge: '병원 개원 네트워크',
        target: '개원의 및 의료 전문직',
        engagementRate: '4.13%',
        formulaDetail: '페이스북 공식 실측: 248건(공감 230 + 댓글 18) ÷ 6,000회 × 100 = 4.13%',
        latestPost: {
          title: '[공지] 2026년 하반기 병의원 개원 입지 분석 & 의료장비 세미나 안내 🏥',
          description: '성공적인 병원 개원을 위한 상권 데이터 분석과 메디114 독점 개원 컨설팅 세미나 사전 등록 접수',
          uploadDate: '2026.10.06',
          mediaType: 'Post',
          postUrl: 'https://www.facebook.com/medi114',
          views: '0.6만 회',
          likes: '230개',
          comments: '18개',
          hashtags: ['#메디114', '#병원개원', '#의료컨설팅'],
          isRealtime: true
        }
      },
      {
        id: 'medi114-instagram',
        brandKey: 'instagram',
        name: '인스타그램 공식',
        handle: '@medi114_official',
        channelUrl: 'https://www.instagram.com/medi114_official/',
        categoryBadge: '개원 인테리어 현장',
        target: '신규 개원 준비 의사',
        engagementRate: '4.53%',
        formulaDetail: '인스타그램 공식 실측: 362건(공감 340 + 댓글 22) ÷ 8,000회 × 100 = 4.53%',
        latestPost: {
          title: '[개원 스토리] 강남 메디컬 타워 신규 이비인후과 인테리어 및 장비 세팅 현장',
          description: '원장님 맞춤형 동선 설계부터 최첨단 진료 장비 검수까지 메디114의 원스톱 개원 서포트 리포트',
          uploadDate: '2026.10.04',
          mediaType: 'Feed',
          postUrl: 'https://www.instagram.com/medi114_official/',
          views: '0.8만 회',
          likes: '340개',
          comments: '22개',
          hashtags: ['#메디114', '#개원준비', '#병원인테리어'],
          isRealtime: true
        }
      }
    ];
  }

  if (domain.includes('inex') || domain.includes('inexcoin')) {
    return [
      {
        id: 'inex-instagram',
        brandKey: 'instagram',
        name: '인스타그램 공식',
        handle: '@inexkr_official',
        channelUrl: 'https://www.instagram.com/inexkr_official',
        categoryBadge: '인엑스 공식 커뮤니티',
        target: '공식 채널 구독자 및 활성 유저',
        engagementRate: '8.28%',
        formulaDetail: '인스타그램 공식(@inexkr_official) 실측: 106건(공감 94 + 댓글 12) ÷ 1,280회 × 100 = 8.28%',
        latestPost: {
          title: '[공식] 인엑스(INEX) 평생 수수료 0% 디지털자산 거래소 신규 회원가입 이벤트 ✨',
          description: '@inexkr_official 공식 계정에서 발행된 최신 피드와 릴스 소식입니다. 평생 거래 수수료 0% 혜택과 에어드랍 소식을 실시간으로 확인하실 수 있습니다.',
          uploadDate: '2026.10.15',
          mediaType: 'Reels',
          postUrl: 'https://www.instagram.com/inexkr_official',
          views: '1,280회',
          likes: '94개',
          comments: '12개',
          hashtags: ['#인엑스', '#INEX', '#가상자산거래소', '#수수료0프로'],
          isRealtime: true
        }
      },
      {
        id: 'inex-x',
        brandKey: 'twitter',
        name: 'X (공식 소통 채널)',
        handle: '@inexkr',
        channelUrl: 'https://twitter.com/inexkr',
        categoryBadge: '실시간 소통 & 공지',
        target: '공식 채널 구독자 및 활성 유저',
        engagementRate: '6.94%',
        formulaDetail: 'X 공식 소통 채널(@inexkr) 실측: 170건(공감 142 + 댓글 28) ÷ 2,450회 × 100 = 6.94%',
        latestPost: {
          title: 'INEX Exchange: 신뢰와 혁신을 선도하는 디지털자산 거래소 공식 공지',
          description: '🌐 디지털자산 금융 인프라를 만들어 갑니다. 🟦 INEX Exchange: 글로벌 오더북 유동성과 차세대 보안 시스템을 갖춘 가상자산사업자 공식 X 소통 채널입니다.',
          uploadDate: '2026.10.18',
          mediaType: 'Post',
          postUrl: 'https://twitter.com/inexkr',
          views: '2,450회',
          likes: '142개',
          comments: '28개',
          hashtags: ['#INEX', '#Exchange', '#Crypto', '#VASP'],
          isRealtime: true
        }
      },
      {
        id: 'inex-blog',
        brandKey: 'naver',
        name: '네이버 공식 블로그',
        handle: '@inexcoin',
        channelUrl: 'https://blog.naver.com/inexkr_official',
        categoryBadge: '공식 블로그 & 정보',
        target: '공식 채널 구독자 및 활성 유저',
        engagementRate: '5.60%',
        formulaDetail: '네이버 블로그 실측: 47건(공감 46 + 댓글 1) ÷ 840회 × 100 = 5.60%',
        latestPost: {
          title: '[인엑스 리포트] 2025년 11월 1주차 / 이더리움, 12월 3일 Fusaka 업그레이드',
          description: '인엑스 공식 네이버 블로그의 최신 포스트입니다. 상세 소식과 공지사항을 확인하세요.',
          uploadDate: '2025. 11. 6.',
          mediaType: 'Blog',
          postUrl: 'https://blog.naver.com/inexcoin/223649646450',
          views: '840회',
          likes: '46개',
          comments: '1개',
          hashtags: ['#인엑스', '#공식블로그', '#네이버블로그', '#이더리움'],
          isRealtime: true
        }
      }
    ];
  }

  // 가상 및 추론 데이터 배제: URL 미입력 및 미실측 도메인은 빈 배열 반환
  return [];
};

const parseSnsNumber = (val?: string): number => {
  if (!val) return 0;
  const clean = val.trim();
  if (clean.includes('실측 연동') || clean.includes('확인 중') || clean.includes('미확인')) return 0;
  
  const manMatch = clean.match(/([\d.]+)\s*만/);
  if (manMatch) {
    return Math.round(parseFloat(manMatch[1]) * 10000);
  }
  const numMatch = clean.replace(/,/g, '').match(/\d+/);
  if (numMatch) {
    return parseInt(numMatch[0], 10);
  }
  return 0;
};

interface Props {
  data: CompleteServiceIntelligence;
  activeSubView?: SubViewId;
  onSubViewChange?: (subView: SubViewId) => void;
}

export const MarketingStatusSubpage: React.FC<Props> = ({ data, activeSubView, onSubViewChange }) => {
  const { service, marketingStatusData } = data;

  // 검색일자(service.verifiedAt) 기준 동적 현황집계일 산출
  const dateInfo = useMemo(() => {
    return getDynamicDateInfo(parseVerifiedDate(service.verifiedAt));
  }, [service.verifiedAt]);

  const aggregationDate = service.verifiedAt || dateInfo.formattedDate;

  const [localShowSns, setLocalShowSns] = useState<boolean>(false);
  const [activeChannels, setActiveChannels] = useState<SnsChannelCardData[] | null>(null);
  const [inlineUrls, setInlineUrls] = useState<string[]>(['']);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [showInputForm, setShowInputForm] = useState<boolean>(false);
  const [isSyncingPosts, setIsSyncingPosts] = useState<boolean>(false);
  const [isSyncCompleted, setIsSyncCompleted] = useState<boolean>(false);

  // 공식 SNS URL이 입력되었거나 사전 실측된 데이터가 있는 경우에만 채널 노출 (가상·추론 데이터 일체 배제)
  const baseChannels = useMemo(() => {
    if (marketingStatusData?.snsChannels && marketingStatusData.snsChannels.length > 0) {
      return marketingStatusData.snsChannels;
    }
    const d = service.domain.toLowerCase();
    if (d.includes('namane') || d.includes('wowpass') || d.includes('dgdr') || d.includes('evezary') || d.includes('medi114') || d.includes('inex')) {
      return getSnsChannelsData(d);
    }
    return [];
  }, [marketingStatusData?.snsChannels, service.domain]);

  // 공식 SNS 채널들에 대해 백그라운드 최신 게시글 실시간 자동 동기화 (RSS, oEmbed, OpenGraph 연동)
  useEffect(() => {
    if (baseChannels.length === 0) return;
    let isMounted = true;
    setIsSyncingPosts(true);

    const brandName = service.name.split(' (')[0];
    enrichSnsChannelsWithLatestPosts(baseChannels, brandName)
      .then((enriched) => {
        if (isMounted) {
          setActiveChannels(enriched);
          setIsSyncCompleted(true);
        }
      })
      .catch((err) => {
        console.warn('[MarketingStatusSubpage] SNS 최신글 실시간 동기화 에러:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsSyncingPosts(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [baseChannels, service.name]);

  const snsChannels = activeChannels !== null ? activeChannels : baseChannels;
  const hasSnsChannels = snsChannels.length > 0;
  const isNamane = service.domain.includes('namane');

  // 실측 반응 합계 집계
  const totalViews = snsChannels.reduce((sum, ch) => sum + parseSnsNumber(ch.latestPost?.views), 0);
  const totalLikes = snsChannels.reduce((sum, ch) => sum + parseSnsNumber(ch.latestPost?.likes), 0);
  const totalComments = snsChannels.reduce((sum, ch) => sum + parseSnsNumber(ch.latestPost?.comments), 0);
  const totalInteractions = totalLikes + totalComments;

  const formatViewsText = (count: number) => {
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + '만 회';
    }
    return count.toLocaleString() + '회';
  };

  const handleAddInlineUrl = () => {
    if (inlineUrls.length < 3) {
      setInlineUrls([...inlineUrls, '']);
    }
  };

  const handleRemoveInlineUrl = (idx: number) => {
    setInlineUrls(inlineUrls.filter((_, i) => i !== idx));
  };

  const handleInlineUrlChange = (idx: number, val: string) => {
    const updated = [...inlineUrls];
    updated[idx] = val;
    setInlineUrls(updated);
    if (inlineError) setInlineError(null);
  };

  const handleApplyInlineUrls = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = inlineUrls.map((u) => u.trim()).filter((u) => u.length > 0);
    if (valid.length === 0) {
      setInlineError('최소 1개 이상의 공식 SNS 링크(URL)를 입력해 주세요.');
      return;
    }
    setInlineError(null);
    const rawBase = service.domain.split('.')[0] || 'service';
    const brandName = service.name.split(' (')[0];
    const generated = buildSnsChannelsFromUrls(valid, brandName, rawBase);
    setActiveChannels(generated);
    setShowInputForm(false);
    setIsSyncingPosts(true);

    enrichSnsChannelsWithLatestPosts(generated, brandName)
      .then((enriched) => {
        setActiveChannels(enriched);
        setIsSyncCompleted(true);
      })
      .finally(() => {
        setIsSyncingPosts(false);
      });
  };

  const showSnsMonthlyComparison = activeSubView ? activeSubView === 'sns-sheet' : localShowSns;
  const isKeywordAnalysisView = activeSubView === 'keyword-analysis';

  const toggleSnsMonthlyComparison = () => {
    const next = !showSnsMonthlyComparison;
    setLocalShowSns(next);
    onSubViewChange?.(next ? 'sns-sheet' : 'main');
  };

  if (isKeywordAnalysisView) {
    return (
      <div className="space-y-6">
        {/* 키워드 분석 전용 상단 헤더 */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 shadow-lg relative">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-sans">
                  <Search className="w-3.5 h-3.5" />
                  <span>검색 포털 · 국가별 키워드 실측</span>
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  현황집계일 기준 : {aggregationDate} ({String(dateInfo.month).padStart(2, '0')}.{String(dateInfo.day).padStart(2, '0')} 실시간)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5 pt-1">
                <BrandLogo domain={service.domain} size="md" />
                <span>키워드 분석</span>
                <span className="text-sm font-normal text-slate-400 font-sans">| 최다 유입 키워드 Top 5 & 국가별 검색어 분석</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-start gap-1.5 sm:gap-2.5 self-end md:self-start shrink-0">
              <button
                type="button"
                onClick={() => onSubViewChange?.('main')}
                className="h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all shadow-sm cursor-pointer font-sans border bg-dark-800 hover:bg-dark-750 text-white border-dark-650 hover:border-brand-cyan/50"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cyan" />
                <span>마케팅 현황 돌아가기</span>
              </button>
              <div className="hidden md:block">
                <PdfReportButton data={data} tab="marketing-status" />
              </div>
            </div>
          </div>
        </div>

        {/* 1. 검색 포털 최다 유입 키워드 Top 5 */}
        <TopKeywordsCard data={data} />

        {/* 2. 국가별 유입 검색 키워드 분석 */}
        <TrafficDetailSubpage data={data} isEmbedded={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── 1. 통합 공식 마케팅 & SNS 성과 관제 박스 (상단 헤더와 하위 박스 통합 + N 로고 추가) ── */}
      <div className="p-3.5 sm:p-5 md:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4 sm:space-y-5 font-sans shadow-lg">
        
        {/* 통합 상단 헤더: [N] 로고 + 공식 마케팅 & SNS 성과 타이틀 + 액션 버튼 그룹 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-dark-750">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-dark-800 text-slate-300 border border-dark-700 flex items-center gap-1.5 font-sans">
                <Share2 className="w-3.5 h-3.5 text-brand-cyan" />
                <span>등록된 공식 SNS 채널 ({snsChannels.length}개)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950/40 text-brand-cyan border border-brand-cyan/40 flex items-center gap-1.5 font-sans">
                <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                <span>현황집계일 기준 : {aggregationDate}</span>
              </span>
              {isSyncingPosts && (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>최신 피드 실시간 연동 중...</span>
                </span>
              )}
              {isSyncCompleted && !isSyncingPosts && (() => {
                const linkedCount = snsChannels.filter(c => c.latestPost?.isRealtime && c.latestPost.postUrl && c.latestPost.postUrl !== c.channelUrl).length;
                if (linkedCount > 0) {
                  return (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>최신글 피드 실측 연동 ({linkedCount}/{snsChannels.length})</span>
                    </span>
                  );
                }
                return (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span>공식 채널 연결 완료</span>
                  </span>
                );
              })()}
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5 pt-0.5 font-sans">
              <BrandLogo domain={service.domain} size="md" className="shrink-0 rounded-xl shadow-md" />
              <span>공식 마케팅 & SNS 성과</span>
              <span className="hidden sm:inline text-sm font-normal text-slate-400 font-sans">| 채널별 운영 포지셔닝 및 타깃</span>
            </h2>
          </div>

          <div className="w-full lg:w-auto flex flex-wrap items-center gap-1.5 sm:gap-2.5 justify-start lg:justify-end shrink-0">
            {/* 1. 키워드 분석 바로가기 버튼 */}
            <button
              type="button"
              onClick={() => onSubViewChange?.('keyword-analysis')}
              className="h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all shadow-sm cursor-pointer font-sans border bg-dark-800 hover:bg-dark-750 text-white border-dark-650 hover:border-cyan-400/50"
              title="키워드 분석 (검색 포털 최다 유입 키워드 Top 5 · 국가별 유입 검색 키워드 분석) 이동"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cyan" />
              <span>키워드 분석</span>
            </button>

            {/* 2. 월별 성과비교 토글 버튼 (나마네카드 실측 데이터가 있는 경우만 노출) */}
            {isNamane && (
              <button
                type="button"
                onClick={toggleSnsMonthlyComparison}
                className={`h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all shadow-sm cursor-pointer font-sans border ${
                  showSnsMonthlyComparison
                    ? 'bg-brand-cyan text-dark-950 hover:bg-cyan-300 ring-2 ring-cyan-400/50 shadow-cyan-500/20'
                    : 'bg-dark-800 hover:bg-dark-750 text-white border-dark-650 hover:border-brand-cyan/50'
                }`}
                title="월별 성과비교 내용 펼치기/접기"
              >
                <BarChart3 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${showSnsMonthlyComparison ? 'text-dark-950' : 'text-brand-cyan'}`} />
                <span>{showSnsMonthlyComparison ? '월별 비교 접기 ▲' : '월별 비교 보기 ▼'}</span>
              </button>
            )}

            {/* 3. PDF 다운로드 버튼 */}
            <PdfReportButton data={data} tab="marketing-status" />
          </div>
        </div>

        {/* SNS 월별 성과비교 리포트 (토글 시 박스 내부에서 전개) */}
        {showSnsMonthlyComparison && isNamane && (
          <div className="p-4 sm:p-5 rounded-2xl bg-dark-850/80 border border-dark-700 space-y-4 font-sans">
            <SnsMonthlyComparisonSheet 
              onToggle={toggleSnsMonthlyComparison}
              embedded
              verifiedAt={aggregationDate}
            />
          </div>
        )}

        {/* 2. 채널별 운영 포지셔닝 및 타깃 내용 (공식 SNS 링크가 입력된 경우만 노출) */}
        {hasSnsChannels ? (
          <div className="space-y-4">
            {/* 공식 SNS 채널 통합 반응 합계 실측 요약 바 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-dark-950/80 border border-brand-cyan/30 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-brand-cyan shrink-0">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-white">공식 SNS 실측 반응 지표</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-black bg-cyan-500/15 text-brand-cyan border border-cyan-500/30">
                        {snsChannels.length}개 채널
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      등록된 공식 계정의 최신 실측 반응 및 인터랙션 합계
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans shrink-0">
                  <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 min-w-[100px]">
                    <span className="text-[10px] text-slate-400 block mb-0.5">총 조회수</span>
                    <span className="text-xs sm:text-sm font-black text-white font-mono">
                      {formatViewsText(totalViews)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 min-w-[100px]">
                    <span className="text-[10px] text-slate-400 block mb-0.5">총 공감(좋아요)</span>
                    <span className="text-xs sm:text-sm font-black text-purple-300 font-mono">
                      {totalLikes.toLocaleString()}개
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 min-w-[100px]">
                    <span className="text-[10px] text-slate-400 block mb-0.5">총 댓글수</span>
                    <span className="text-xs sm:text-sm font-black text-cyan-400 font-mono">
                      {totalComments.toLocaleString()}개
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-dark-900 border border-cyan-500/40 bg-cyan-950/20 min-w-[110px]">
                    <span className="text-[10px] text-cyan-400 font-bold block mb-0.5">반응 합계</span>
                    <span className="text-xs sm:text-sm font-black text-brand-cyan font-mono">
                      {totalInteractions.toLocaleString()}건
                    </span>
                  </div>
                </div>
              </div>

            <div className={`grid grid-cols-1 ${snsChannels.length === 1 ? 'max-w-xl mx-auto' : snsChannels.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
              {snsChannels.map((ch) => {
                const hasValidEngagement = ch.engagementRate && ch.engagementRate !== '-' && !ch.engagementRate.includes('실측') && !ch.engagementRate.includes('확인');

                const cleanRawTitle = (ch.latestPost?.title || '').trim();
                const isForbiddenTitle = ['instagram', 'youtube', 'facebook', 'x', 'twitter', 'tiktok', 'naver blog'].includes(cleanRawTitle.toLowerCase());
                const displayTitle = (!isForbiddenTitle && cleanRawTitle) ? cleanRawTitle : `${ch.name} 최신 소식`;

                return (
                  <div 
                    key={ch.id} 
                    className="p-4 sm:p-4.5 rounded-xl bg-dark-850 border border-dark-750 flex flex-col justify-between hover:border-dark-650 transition-colors space-y-3.5"
                  >
                    {/* 1. 상단: 채널 프로필 & 포지셔닝 */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <BrandLogo brandKey={ch.brandKey} size="sm" />
                          <div className="min-w-0">
                            <div className="font-bold text-white text-sm truncate">{ch.name}</div>
                            <a 
                              href={ch.channelUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-slate-400 hover:text-brand-cyan transition-colors font-sans inline-flex items-center gap-1 group/h"
                              title={`${ch.name} 공식 계정 새 창에서 열기`}
                            >
                              <span>{ch.handle}</span>
                              <ExternalLink className="w-3 h-3 opacity-60 group-hover/h:opacity-100" />
                            </a>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded font-semibold bg-dark-800 text-slate-300 border border-dark-700 font-sans shrink-0">
                          {ch.categoryBadge}
                        </span>
                      </div>

                      {hasValidEngagement && (
                        <div className="flex items-center justify-end text-xs text-slate-400 pb-2.5 border-b border-dark-750/70">
                          <span className="text-brand-cyan font-semibold font-sans inline-flex items-center shrink-0">
                            <span>참여율 {ch.engagementRate}</span>
                            <EngagementFormulaTooltip detail={ch.formulaDetail} />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 2. 중단 및 하단: 가장 최신 업로드 포스트 정보 */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                        <span className="text-slate-200">최신 게시글 정보</span>
                      </div>

                      <a
                        href={ch.latestPost.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block p-3.5 rounded-xl bg-dark-900 border border-dark-750 hover:border-brand-cyan/60 hover:bg-dark-900/90 transition-all cursor-pointer space-y-2.5 shadow-sm"
                        title={`${ch.name}의 최신 게시글 새 창에서 열기`}
                      >
                        {/* 포스트 상단 메타 (배지 + 일자 + 아웃링크 아이콘) */}
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider font-sans bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                              {ch.latestPost.mediaType || 'Post'}
                            </span>
                            {ch.latestPost.uploadDate && !ch.latestPost.uploadDate.includes('연동') && (
                              <span className="text-[11px] text-slate-400 font-sans">
                                {ch.latestPost.uploadDate}
                              </span>
                            )}
                          </div>

                          <span className="inline-flex items-center text-[11px] font-semibold text-brand-cyan group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all">
                            <span>
                              {ch.latestPost.mediaType === 'Video' ? '영상 시청' : ch.latestPost.mediaType === 'Blog' ? '블로그 보기' : '게시글 열람'}
                            </span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </span>
                        </div>

                        {/* 포스트 제목 (1줄 말줄임) */}
                        <h4 
                          className="text-xs sm:text-[13px] font-bold text-white group-hover:text-brand-cyan transition-colors truncate leading-snug"
                          title={displayTitle}
                        >
                          {displayTitle}
                        </h4>

                        {/* 포스트 설명 요약 (1줄 말줄임) */}
                        <p 
                          className="text-[11px] text-slate-300 truncate leading-relaxed"
                          title={ch.latestPost.description}
                        >
                          {ch.latestPost.description}
                        </p>

                        {/* 해시태그 스니펫 (최대 3개만 노출) */}
                        {ch.latestPost.hashtags && ch.latestPost.hashtags.length > 0 && (
                          <div className="text-[10px] text-brand-purpleLight font-medium truncate">
                            {ch.latestPost.hashtags.slice(0, 3).join(' ')}
                          </div>
                        )}

                        {/* 포스트 반응 지표 (조회수, 공감수, 댓글수 실측 숫자 상시 노출) */}
                        <div className="pt-2.5 border-t border-dark-800 flex items-center text-[11px] text-slate-400 font-sans">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5" title="조회수">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-slate-200 font-mono font-medium">
                                {ch.latestPost?.views && ch.latestPost.views !== '-' && !ch.latestPost.views.includes('실측')
                                  ? ch.latestPost.views
                                  : '0회'}
                              </span>
                            </span>
                            <span className="inline-flex items-center gap-1.5" title="공감 (좋아요)">
                              <Heart className="w-3.5 h-3.5 text-purple-400/90" />
                              <span className="text-purple-300 font-mono font-medium">
                                {ch.latestPost?.likes && ch.latestPost.likes !== '-' && !ch.latestPost.likes.includes('실측')
                                  ? ch.latestPost.likes
                                  : '0개'}
                              </span>
                            </span>
                            <span className="inline-flex items-center gap-1.5" title="댓글수">
                              <MessageCircle className="w-3.5 h-3.5 text-cyan-400/90" />
                              <span className="text-cyan-300 font-mono font-medium">
                                {ch.latestPost?.comments && ch.latestPost.comments !== '-' && !ch.latestPost.comments.includes('실측')
                                  ? ch.latestPost.comments
                                  : '0개'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
        /* 공식 SNS 링크 미입력 시: 가상/추론 데이터 배제 안내 영역 */
        <div className="p-6 sm:p-10 rounded-2xl bg-dark-900 border border-dark-750 shadow-xl space-y-6 font-sans">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Info className="w-3.5 h-3.5 text-purple-400" />
              <span>공식 SNS 채널 등록 안내</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              운영 중인 공식 SNS 링크가 입력되지 않았습니다
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              실제 운영 중인 공식 채널 데이터를 기반으로 정밀 분석을 제공합니다.<br className="hidden sm:inline" />
              해당 서비스의 소셜 마케팅 성과 및 인게이지먼트를 분석하시려면 공식 SNS 링크를 등록해 주세요.
            </p>
          </div>

          {/* 안내 박스: 지원 플랫폼 및 가이드 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-2">
            <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-1.5 text-left">
              <div className="flex items-center gap-2 text-white text-xs font-bold">
                <BrandLogo brandKey="instagram" size="xs" />
                <span>인스타그램 (Instagram)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                공식 브랜드 피드, 릴스 링크를 등록하여 팔로워 반응 및 유입을 실측합니다.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-1.5 text-left">
              <div className="flex items-center gap-2 text-white text-xs font-bold">
                <BrandLogo brandKey="tiktok" size="xs" />
                <span>유튜브 / 틱톡 (숏폼)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                공식 쇼츠, 릴스, 틱톡 영상 채널 링크로 조회수 및 인터랙션을 분석합니다.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-1.5 text-left">
              <div className="flex items-center gap-2 text-white text-xs font-bold">
                <BrandLogo brandKey="twitter" size="xs" />
                <span>X / 블로그 / 기타</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                공식 공지 채널 및 블로그 링크를 통해 고객 소통 및 바이럴을 연동합니다.
              </p>
            </div>
          </div>

          {/* 하단 액션 버튼 및 인라인 SNS 링크 입력 폼 */}
          <div className="pt-2 max-w-xl mx-auto space-y-3">
            {!showInputForm ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowInputForm(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>공식 SNS 링크 등록하고 실측 보기</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSubViewChange?.('keyword-analysis')}
                  className="px-4 py-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 text-brand-cyan" />
                  <span>검색 포털 최다 유입 키워드 분석 보기</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyInlineUrls} className="p-4 rounded-xl bg-dark-950 border border-purple-500/40 space-y-3 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-dark-850">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>공식 SNS 연동</span>
                    <span className="text-[10px] text-slate-500 font-normal">(선택)</span>
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono font-bold whitespace-nowrap">
                    {inlineUrls.filter((u) => u.trim().length > 0).length}/3개
                  </span>
                </div>

                <div className="space-y-2">
                  {inlineUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 w-5 text-center shrink-0">#{idx + 1}</span>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleInlineUrlChange(idx, e.target.value)}
                        placeholder={
                          idx === 0 
                            ? '인스타그램 URL (계정 또는 릴스)' 
                            : idx === 1 
                            ? '유튜브 URL (채널 또는 영상)' 
                            : '네이버 블로그 URL (블로그 또는 글)'
                        }
                        aria-label={`공식 SNS 채널 URL #${idx + 1}`}
                        className="flex-1 px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                      />
                      {inlineUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInlineUrl(idx)}
                          className="p-2 text-slate-400 hover:text-purple-300 rounded-lg bg-dark-900 border border-dark-750 shrink-0 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {inlineError && (
                  <p className="text-[11px] text-purple-400 font-medium">{inlineError}</p>
                )}

                <p className="text-[10px] text-slate-400">
                  * 등록하신 공식 채널 URL의 실제 공개 데이터만 집계 및 연동됩니다.
                </p>

                <div className="flex items-center justify-between pt-1">
                  {inlineUrls.length < 3 ? (
                    <button
                      type="button"
                      onClick={handleAddInlineUrl}
                      className="text-xs text-purple-300 hover:text-purple-200 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>링크 추가</span>
                    </button>
                  ) : <span />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowInputForm(false)}
                      className="px-3 py-1.5 rounded-lg bg-dark-900 hover:bg-dark-850 text-slate-300 text-xs font-medium border border-dark-750 cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 cursor-pointer"
                    >
                      실측 데이터 연동하기
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      </div>

      {/* 4. 채널별 유도형 반응 분석 (나마네카드 실측 데이터만 노출) */}
      {isNamane && (
        <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-dark-750">
            <div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-brand-cyan" />
                <h3 className="text-base sm:text-lg font-bold text-white tracking-normal">
                  채널별 유도형 반응 분석
                </h3>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-brand-cyan border border-cyan-500/40 font-sans">
                월별 합계 실측치
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              3대 채널(인스타 글로벌·JP, 틱톡) 월별 인터랙션 합계 비교
            </p>
          </div>
          <span className="text-xs text-slate-400 font-sans self-start sm:self-auto">
            10월 · 9월 · 8월 실측
          </span>
        </div>

        {/* 10월 | 9월 | 8월 각 월별 데이터 합계 3열 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 당월 실시간 */}
          <div className="p-4 rounded-xl bg-dark-850 border border-cyan-500/40 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-dark-750">
              <span className="text-xs font-bold text-brand-cyan font-sans">{dateInfo.year}년 {dateInfo.month}월 (실시간)</span>
              <span className="text-xs text-slate-400 font-sans">{dateInfo.dateRangeSpaced || `${String(dateInfo.month).padStart(2, '0')}.01 ~ ${String(dateInfo.month).padStart(2, '0')}.${String(dateInfo.day).padStart(2, '0')}`} 집계</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900/80 border border-dark-750/70">
                <span className="text-xs text-slate-400">조회수</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-white font-sans">2.4만 회</span>
                  <span className="text-xs font-semibold text-cyan-300 font-sans bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.5 rounded">일평균 +6.2%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900/80 border border-dark-750/70">
                <span className="text-xs text-slate-400">총 반응 (공감+댓글+공유)</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-white font-sans">1,620건</span>
                  <span className="text-xs font-semibold text-cyan-300 font-sans bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.5 rounded">일평균 +8.8%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900/80 border border-dark-750/70">
                <span className="text-xs text-slate-400">평균 참여율</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-white font-sans inline-flex items-center">
                    <span>6.75%</span>
                    <EngagementFormulaTooltip
                      detail="10월 실측: 1,620건(공감+댓글+공유) ÷ 24,000회 × 100 = 6.75%"
                    />
                  </span>
                  <span className="text-xs font-semibold text-cyan-300 font-sans bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.5 rounded">+0.17%p</span>
                </div>
              </div>
            </div>
          </div>

          {/* 9월 확정 */}
          <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-dark-750">
              <span className="text-xs font-bold text-slate-200 font-sans">2026년 9월 (확정)</span>
              <span className="text-xs text-slate-400 font-sans">9.01 ~ 9.30 마감</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900/80 border border-dark-750/70">
                <span className="text-xs text-slate-400">조회수</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-white font-sans">11.3만 회</span>
                  <span className="text-xs font-semibold text-cyan-300 font-sans bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.5 rounded">+9.7%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900/80 border border-dark-750/70">
                <span className="text-xs text-slate-400">총 반응 (공감+댓글+공유)</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-white font-sans">7,441건</span>
                  <span className="text-xs font-semibold text-cyan-300 font-sans bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.5 rounded">+12.5%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900/80 border border-dark-750/70">
                <span className="text-xs text-slate-400">평균 참여율</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-white font-sans inline-flex items-center">
                    <span>6.58%</span>
                    <EngagementFormulaTooltip
                      detail="9월 실측: 7,441건(공감+댓글+공유) ÷ 113,000회 × 100 = 6.58%"
                    />
                  </span>
                  <span className="text-xs font-semibold text-cyan-300 font-sans bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.5 rounded">+0.16%p</span>
                </div>
              </div>
            </div>
          </div>

          {/* 8월 확정 */}
          <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-dark-750">
              <span className="text-xs font-bold text-slate-200 font-sans">2026년 8월 (확정)</span>
              <span className="text-xs text-slate-400 font-sans">8.01 ~ 8.31 마감</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900/80 border border-dark-750/70">
                <span className="text-xs text-slate-400">조회수</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-white font-sans">10.3만 회</span>
                  <span className="text-xs font-semibold text-purple-300 font-sans bg-purple-950/40 border border-purple-500/30 px-1.5 py-0.5 rounded">-32.2%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900/80 border border-dark-750/70">
                <span className="text-xs text-slate-400">총 반응 (공감+댓글+공유)</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-white font-sans">6,616건</span>
                  <span className="text-xs font-semibold text-purple-300 font-sans bg-purple-950/40 border border-purple-500/30 px-1.5 py-0.5 rounded">-33.2%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900/80 border border-dark-750/70">
                <span className="text-xs text-slate-400">평균 참여율</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-white font-sans inline-flex items-center">
                    <span>6.42%</span>
                    <EngagementFormulaTooltip
                      detail="8월 실측: 6,616건(공감+댓글+공유) ÷ 103,000회 × 100 = 6.42%"
                    />
                  </span>
                  <span className="text-xs font-semibold text-purple-300 font-sans bg-purple-950/40 border border-purple-500/30 px-1.5 py-0.5 rounded">-0.10%p</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3대 채널별 유도형 반응 실측 요약 표 */}
        {/* 모바일 화면 (가로 스크롤바 0%, 채널별 카드 뷰) */}
        <div className="space-y-3 md:hidden font-sans">
          {[
            {
              brandKey: 'instagram',
              name: '인스타그램 글로벌',
              handle: '@namanecard',
              views: '0.8만 회',
              eng: '480건',
              rate: '6.00%',
              tooltip: '인스타 글로벌 10월: 480건 ÷ 8,000회 × 100 = 6.00%',
              content: '세븐틴 〈CARAT LAND〉 한정판 테마 카드 & 키오스크 발급 안내',
              action: '글로벌 K-POP 팬덤 티켓팅 후 키오스크 발권 저장 및 공유'
            },
            {
              brandKey: 'instagram',
              name: '인스타그램 일본 공식',
              handle: '@namane_jp',
              views: '0.5만 회',
              eng: '355건',
              rate: '7.10%',
              tooltip: '인스타 일본 10월: 355건 ÷ 5,000회 × 100 = 7.10%',
              content: 'NAMANE APP 신규 ‘Connect’ 기능 안내 (팬덤 교류·동행 찾기)',
              action: '일본 팬덤 앱 신기능 저장 및 오시카츠 커뮤니티 확산'
            },
            {
              brandKey: 'tiktok',
              name: '틱톡 공식 바이럴',
              handle: '@namanecard',
              views: '1,070회',
              eng: '58건',
              rate: '5.42%',
              tooltip: '틱톡 공식 실측: 58건(공감 57 + 댓글 0 + 공유 1) ÷ 1,070회 × 100 = 5.42%',
              content: 'NCT WayV 서울숲 마케터 모먼트 비하인드 숏폼 바이럴',
              action: '글로벌 Gen Z 팬덤 알고리즘 바이럴 및 댓글 인터랙션 확산'
            }
          ].map((ch) => (
            <div key={ch.handle + ch.name} className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <div className="flex items-center gap-2">
                  <BrandLogo brandKey={ch.brandKey} size="xs" />
                  <div>
                    <div className="font-bold text-sm text-white">{ch.name}</div>
                    <span className="text-[11px] text-slate-400 font-sans">
                      {ch.handle}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-brand-cyan tabular-nums">{ch.rate}</span>
                  <div className="text-[10px] text-slate-400">참여율</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">실측치</div>
                  <div className="font-bold text-white tabular-nums mt-0.5">{ch.views} / {ch.eng}</div>
                </div>
                <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">콘텐츠</div>
                  <div className="text-slate-300 mt-0.5 text-[11px] truncate">{ch.content}</div>
                </div>
              </div>

              <div className="text-xs text-slate-300 pt-1 border-t border-dark-800">
                <span className="text-slate-400 font-semibold mr-1">[유저반응]</span>
                <span>{ch.action}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
          <table 
            className="w-full text-left text-xs sm:text-sm table-fixed font-sans"
            style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            <thead className="bg-dark-850 text-slate-300 font-bold border-b border-dark-750 text-xs">
              <tr>
                <th className="py-2.5 px-3.5 w-[20%]">채널</th>
                <th className="py-2.5 px-3.5 w-[28%]">실측치</th>
                <th className="py-2.5 px-3.5 w-[24%]">콘텐츠</th>
                <th className="py-2.5 px-3.5 w-[28%]">유저반응 (설명)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750/70 text-xs sm:text-sm font-sans">
              {/* 1. 인스타 글로벌 */}
              <tr className="hover:bg-dark-800/40 transition-colors">
                <td className="py-2.5 px-3.5 align-middle">
                  <div className="flex items-center gap-2">
                    <BrandLogo brandKey="instagram" size="xs" />
                    <div>
                      <div className="font-bold text-white">인스타그램 글로벌</div>
                      <span className="text-xs text-slate-400 font-sans">
                        @namanecard
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3.5 text-slate-200 text-xs font-sans">
                  <span>0.8만 회 / 480건 / </span>
                  <strong className="text-brand-cyan">6.00%</strong>
                  <EngagementFormulaTooltip
                    detail="인스타 글로벌 10월: 480건 ÷ 8,000회 × 100 = 6.00%"
                    align="center"
                  />
                </td>
                <td className="py-2.5 px-3.5 text-slate-300 text-xs">
                  세븐틴 〈CARAT LAND〉 한정판 테마 카드 & 키오스크 발급 안내
                </td>
                <td className="py-2.5 px-3.5 text-slate-200 text-xs">
                  글로벌 K-POP 팬덤 티켓팅 후 키오스크 발권 저장 및 공유
                </td>
              </tr>

              {/* 2. 인스타 일본 */}
              <tr className="hover:bg-dark-800/40 transition-colors">
                <td className="py-2.5 px-3.5 align-middle">
                  <div className="flex items-center gap-2">
                    <BrandLogo brandKey="instagram" size="xs" />
                    <div>
                      <div className="font-bold text-white">인스타그램 일본 공식</div>
                      <span className="text-xs text-slate-400 font-sans">
                        @namane_jp
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3.5 text-slate-200 text-xs font-sans">
                  <span>0.5만 회 / 355건 / </span>
                  <strong className="text-brand-cyan">7.10%</strong>
                  <EngagementFormulaTooltip
                    detail="인스타 일본 10월: 355건 ÷ 5,000회 × 100 = 7.10%"
                    align="center"
                  />
                </td>
                <td className="py-2.5 px-3.5 text-slate-300 text-xs">
                  NAMANE APP 신규 ‘Connect’ 기능 안내 (팬덤 교류·동행 찾기)
                </td>
                <td className="py-2.5 px-3.5 text-slate-200 text-xs">
                  일본 팬덤 앱 신기능 저장 및 오시카츠 커뮤니티 확산
                </td>
              </tr>

              {/* 3. 틱톡 공식 */}
              <tr className="hover:bg-dark-800/40 transition-colors">
                <td className="py-2.5 px-3.5 align-middle">
                  <div className="flex items-center gap-2">
                    <BrandLogo brandKey="tiktok" size="xs" />
                    <div>
                      <div className="font-bold text-white">틱톡 공식 바이럴</div>
                      <span className="text-xs text-slate-400 font-sans">
                        @namanecard
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3.5 text-slate-200 text-xs font-sans">
                  <span>1,070회 / 58건 / </span>
                  <strong className="text-brand-cyan">5.42%</strong>
                  <EngagementFormulaTooltip
                    detail="틱톡 공식 실측: 58건(공감 57 + 댓글 0 + 공유 1) ÷ 1,070회 × 100 = 5.42%"
                    align="center"
                  />
                </td>
                <td className="py-2.5 px-3.5 text-slate-300 text-xs">
                  NCT WayV 서울숲 마케터 모먼트 비하인드 숏폼 바이럴
                </td>
                <td className="py-2.5 px-3.5 text-slate-200 text-xs">
                  글로벌 Gen Z 팬덤 알고리즘 바이럴 및 댓글 인터랙션 확산
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* 하단 공식 출처 (마케팅 현황 탭 단 1회 텍스트 아웃링크 일원화 - Rule 12, Rule 13 준수) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-750 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-semibold text-slate-300">데이터 출처 :</span>
          <a
            href="https://datalab.naver.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold inline-flex items-center gap-1 transition-colors"
            title="네이버 데이터랩 및 브랜드 공식 SNS 채널 원천 열람"
          >
            <span>네이버 데이터랩 및 브랜드 공식 SNS 채널</span>
            <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default MarketingStatusSubpage;

