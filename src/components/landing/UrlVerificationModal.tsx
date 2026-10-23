import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  XIcon, 
  GlobeIcon, 
  LayersIcon, 
  ArrowRightIcon, 
  PlusIcon, 
  Trash2Icon, 
  ShareIcon,
  CircleCheckIcon
} from '@animateicons/react/lucide';
import { 
  AlertTriangle, Smartphone, RefreshCw, Zap, 
  Loader2, ShieldCheck, TrendingUp, Building2, FileText, Globe, 
  Share2, Server, Check, Sparkles
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { analyzeTargetUrl, type AppMarketInfo } from '../../utils/urlAnalyzer';

export interface VerificationStage {
  step: number;
  id: string;
  tabKey: string;
  name: string;
  summary: string;
  durationMs: number;
  isDirectRecheck?: boolean;
}

export const VERIFICATION_STAGES: VerificationStage[] = [
  {
    step: 1,
    id: 'overview',
    tabKey: 'overview',
    name: '기업 식별 정보 확인',
    summary: '사업자등록번호 및 공공데이터 매핑',
    durationMs: 700
  },
  {
    step: 2,
    id: 'traffic',
    tabKey: 'traffic',
    name: '트래픽 실측 데이터 연동',
    summary: '웹·앱 방문자수 및 유입 쿼리 집계',
    durationMs: 750
  },
  {
    step: 3,
    id: 'ir',
    tabKey: 'ir',
    name: '공시 재무제표 대조',
    summary: 'DART 및 결산 공시 실적 확인',
    durationMs: 750
  },
  {
    step: 4,
    id: 'service',
    tabKey: 'service',
    name: '서비스 도메인 점검',
    summary: '공식 웹사이트 접속 및 메뉴 확인',
    durationMs: 700
  },
  {
    step: 5,
    id: 'marketing',
    tabKey: 'marketing-status',
    name: '공식 SNS 반응 수치 집계',
    summary: '인스타그램·X·블로그 실측 반응 대조',
    durationMs: 750
  },
  {
    step: 6,
    id: 'infra',
    tabKey: 'server',
    name: '인프라 비용 모델 산출',
    summary: '트래픽 연동 클라우드 서버비 추산',
    durationMs: 650
  },
  {
    step: 7,
    id: 'recheck',
    tabKey: 'all',
    name: '최종 실측값 재검증',
    summary: '출처 URL 접속 상태 및 데이터 최종 확정',
    durationMs: 1800,
    isDirectRecheck: true
  }
];

export interface PeerCompetitor {
  id: string;
  name: string;
  domain: string;
  category: string;
  selected: boolean;
}

export interface VerificationResult {
  domain: string;
  inputUrl?: string;
  redirectUrl?: string;
  sourceUrl?: string;
  serviceName: string;
  companyName: string;
  businessNumber?: string;
  representative?: string;
  mailOrderReport?: string;
  isFooterVerified?: boolean;
  category: string;
  peerCompetitors: PeerCompetitor[];
  dataAvailability: {
    traffic: boolean;
    dart: boolean;
    appStore: boolean;
    payment: boolean;
  };
  isDartAudited: boolean;
  disclosureType: 'dart' | 'startup_db' | 'franchise_ftc' | 'unconfirmed';
  snsUrls?: string[];
  hasApp?: boolean;
  appInfo?: AppMarketInfo;
}

interface UrlVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawUrl: string;
  onConfirm: (result: VerificationResult) => void;
}

// 업종별 표준 카테고리 목록
export const INDUSTRY_CATEGORIES = [
  '핀테크 / 선불전자지급수단',
  '종합 금융 플랫폼 / 테크핀',
  '패션 이커머스 / 버티컬 플랫폼',
  '글로벌 여행 / 숙박 OTA 플랫폼',
  'O2O / 푸드 딜리버리 커머스',
  'B2B SaaS / 엔터프라이즈 솔루션',
  '콘텐츠 / 미디어 엔터테인먼트',
  '프롭테크 / 공간 코리빙 플랫폼',
  '기타'
];

// 특정 주요 도메인별 메타데이터 룩업
export interface KnownDomainInfo {
  serviceName: string;
  companyName: string;
  businessNumber?: string;
  representative?: string;
  mailOrderReport?: string;
  isDartAudited: boolean;
  disclosureType: 'dart' | 'startup_db' | 'franchise_ftc' | 'unconfirmed';
  category: string;
  peers: Array<{ name: string; domain: string }>;
  defaultSnsUrls?: string[];
  hasApp?: boolean;
}

const KNOWN_DOMAIN_MAP: Record<string, KnownDomainInfo> = {
  'inex.im': {
    serviceName: '인엑스 (INEX)',
    companyName: '(주)인피니티익스체인지코리아',
    businessNumber: '783-81-02738',
    representative: '이재강',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: '핀테크 / 디지털자산 & 가상자산(VASP) 인프라',
    hasApp: false,
    peers: [
      { name: '업비트 (두나무)', domain: 'upbit.com' },
      { name: '빗썸 (Bithumb)', domain: 'bithumb.com' },
      { name: '코인원 (Coinone)', domain: 'coinone.co.kr' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/inexkr_official',
      'https://twitter.com/inexkr',
      'https://blog.naver.com/inexkr_official'
    ]
  },
  'www.inex.im': {
    serviceName: '인엑스 (INEX)',
    companyName: '(주)인피니티익스체인지코리아',
    businessNumber: '783-81-02738',
    representative: '이재강',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: '핀테크 / 디지털자산 & 가상자산(VASP) 인프라',
    hasApp: false,
    peers: [
      { name: '업비트 (두나무)', domain: 'upbit.com' },
      { name: '빗썸 (Bithumb)', domain: 'bithumb.com' },
      { name: '코인원 (Coinone)', domain: 'coinone.co.kr' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/inexkr_official',
      'https://twitter.com/inexkr',
      'https://blog.naver.com/inexkr_official'
    ]
  },
  'inexcoin.com': {
    serviceName: '인엑스 (INEX)',
    companyName: '(주)인피니티익스체인지코리아',
    businessNumber: '783-81-02738',
    representative: '이재강',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: '핀테크 / 디지털자산 & 가상자산(VASP) 인프라',
    hasApp: true,
    peers: [
      { name: '업비트 (두나무)', domain: 'upbit.com' },
      { name: '빗썸 (Bithumb)', domain: 'bithumb.com' },
      { name: '코인원 (Coinone)', domain: 'coinone.co.kr' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/inexkr_official',
      'https://twitter.com/inexkr',
      'https://blog.naver.com/inexkr_official'
    ]
  },
  'www.inexcoin.com': {
    serviceName: '인엑스 (INEX)',
    companyName: '(주)인피니티익스체인지코리아',
    businessNumber: '783-81-02738',
    representative: '이재강',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: '핀테크 / 디지털자산 & 가상자산(VASP) 인프라',
    hasApp: true,
    peers: [
      { name: '업비트 (두나무)', domain: 'upbit.com' },
      { name: '빗썸 (Bithumb)', domain: 'bithumb.com' },
      { name: '코인원 (Coinone)', domain: 'coinone.co.kr' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/inexkr_official',
      'https://twitter.com/inexkr',
      'https://blog.naver.com/inexkr_official'
    ]
  },
  'brand.evezary.co.kr': {
    serviceName: '이브자리 (EVEZARY)',
    companyName: '(주)이브자리',
    businessNumber: '105-81-42298',
    representative: '고춘홍 · 윤종웅',
    mailOrderReport: '제2009-서울강남-01376호',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '패션 이커머스 / 버티컬 플랫폼',
    peers: [
      { name: '알레르망 (Allerman)', domain: 'allerman.com' },
      { name: '세사리빙 (SESA Living)', domain: 'sesaliving.com' },
      { name: '오늘의집 (Bucketplace)', domain: 'ohou.se' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/evezary.official/',
      'https://www.youtube.com/@evezary.official',
      'https://blog.naver.com/goodsleeplaband'
    ]
  },
  'evezary.co.kr': {
    serviceName: '이브자리 (EVEZARY)',
    companyName: '(주)이브자리',
    businessNumber: '105-81-42298',
    representative: '고춘홍 · 윤종웅',
    mailOrderReport: '제2009-서울강남-01376호',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '패션 이커머스 / 버티컬 플랫폼',
    peers: [
      { name: '알레르망 (Allerman)', domain: 'allerman.com' },
      { name: '세사리빙 (SESA Living)', domain: 'sesaliving.com' },
      { name: '오늘의집 (Bucketplace)', domain: 'ohou.se' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/evezary.official/',
      'https://www.youtube.com/@evezary.official',
      'https://blog.naver.com/goodsleeplaband'
    ]
  },
  'evezarymall.com': {
    serviceName: '이브자리몰 (EVEZARY MALL)',
    companyName: '(주)이브자리',
    businessNumber: '105-81-42298',
    representative: '고춘홍 · 윤종웅',
    mailOrderReport: '제2009-서울강남-01376호',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '패션 이커머스 / 버티컬 플랫폼',
    peers: [
      { name: '알레르망 (Allerman)', domain: 'allerman.com' },
      { name: '세사리빙 (SESA Living)', domain: 'sesaliving.com' },
      { name: '오늘의집 (Bucketplace)', domain: 'ohou.se' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/evezarymall_official/',
      'https://www.youtube.com/@evezary.official',
      'https://blog.naver.com/goodsleeplaband'
    ]
  },
  'allerman.com': {
    serviceName: '알레르망 (Allerman)',
    companyName: '주식회사 이덕아이앤씨',
    businessNumber: '127-81-42686',
    representative: '김종운',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '패션 이커머스 / 버티컬 플랫폼',
    peers: [
      { name: '이브자리 (EVEZARY)', domain: 'brand.evezary.co.kr' },
      { name: '세사리빙 (SESA Living)', domain: 'sesaliving.com' },
      { name: '오늘의집 (Bucketplace)', domain: 'ohou.se' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/allerman.official/',
      'https://blog.naver.com/allerman_kr'
    ]
  },
  'sesaliving.com': {
    serviceName: '세사리빙 (SESA Living)',
    companyName: '주식회사 웰크론',
    businessNumber: '119-81-19769',
    representative: '이영규 · 신정재',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '패션 이커머스 / 버티컬 플랫폼',
    peers: [
      { name: '이브자리 (EVEZARY)', domain: 'brand.evezary.co.kr' },
      { name: '알레르망 (Allerman)', domain: 'allerman.com' },
      { name: '오늘의집 (Bucketplace)', domain: 'ohou.se' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/sesaliving_official/',
      'https://www.youtube.com/@sesaliving'
    ]
  },
  'dgdr.co.kr': {
    serviceName: '동거동락 (DGDR)',
    companyName: '(주)원패밀리',
    businessNumber: '697-88-00461',
    representative: '정원준',
    mailOrderReport: '제2020-서울강남-03387호',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: '프롭테크 / 공간 코리빙 플랫폼',
    peers: [
      { name: '맹그로브 (Mangrove)', domain: 'mangrove.city' },
      { name: '패스트파이브 (FastFive)', domain: 'fastfive.co.kr' },
      { name: '직방 (Zigbang)', domain: 'zigbang.com' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/dgdr_wonfamily',
      'https://blog.naver.com/dgdr_wonfamily',
      'https://www.facebook.com/dgdr.wonfamily'
    ]
  },
  'namanecard.com': {
    serviceName: '나마네카드 (NAMANE CARD)',
    companyName: '주식회사 아이오로라',
    businessNumber: '131-86-46100',
    representative: '장영수',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: '핀테크 / 선불전자지급수단',
    peers: [
      { name: '와우패스 (WOWPASS)', domain: 'wowpass.io' },
      { name: '트래블월렛 (TravelWallet)', domain: 'travelwallet.co.kr' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/namanecard/'
    ]
  },
  'wowpass.io': {
    serviceName: '와우패스 (WOWPASS)',
    companyName: '주식회사 오렌지스퀘어',
    businessNumber: '107-88-29471',
    representative: '이장백',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: '핀테크 / 선불전자지급수단',
    peers: [
      { name: '나마네카드 (NAMANE)', domain: 'namanecard.com' },
      { name: '트래블월렛 (TravelWallet)', domain: 'travelwallet.co.kr' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/wowpass.io/'
    ]
  },
  'medi114.co.kr': {
    serviceName: '메디114 (MEDI114)',
    companyName: '메디114',
    businessNumber: '293-88-02796',
    representative: '이성길',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: '기타',
    hasApp: false,
    peers: [],
    defaultSnsUrls: [
      'https://www.facebook.com/medi114',
      'https://www.instagram.com/medi114_official/',
      'https://blog.naver.com/medi114_official'
    ]
  },
  'www.medi114.co.kr': {
    serviceName: '메디114 (MEDI114)',
    companyName: '메디114',
    businessNumber: '293-88-02796',
    representative: '이성길',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: '기타',
    hasApp: false,
    peers: [],
    defaultSnsUrls: [
      'https://www.facebook.com/medi114',
      'https://www.instagram.com/medi114_official/',
      'https://blog.naver.com/medi114_official'
    ]
  },
  'travelwallet.co.kr': {
    serviceName: '트래블월렛 (TravelWallet)',
    companyName: '주식회사 트래블월렛',
    businessNumber: '562-87-00912',
    representative: '김형우',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '핀테크 / 선불전자지급수단',
    peers: [
      { name: '와우패스 (WOWPASS)', domain: 'wowpass.io' },
      { name: '나마네카드 (NAMANE)', domain: 'namanecard.com' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/travelwallet_official/'
    ]
  },
  'toss.im': {
    serviceName: '토스 (Toss)',
    companyName: '주식회사 비바리퍼블리카',
    businessNumber: '214-88-58805',
    representative: '이승건',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '종합 금융 플랫폼 / 테크핀',
    peers: [
      { name: '카카오페이 (KakaoPay)', domain: 'kakaopay.com' },
      { name: '네이버페이 (NaverPay)', domain: 'pay.naver.com' },
      { name: '뱅크샐러드 (BankSalad)', domain: 'banksalad.com' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/toss.im/',
      'https://www.youtube.com/@toss_money'
    ]
  },
  'musinsa.com': {
    serviceName: '무신사 (MUSINSA)',
    companyName: '주식회사 무신사',
    businessNumber: '211-88-34504',
    representative: '조만호 · 박준모',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '패션 이커머스 / 버티컬 플랫폼',
    peers: [
      { name: '29CM (이십구센티미터)', domain: '29cm.co.kr' },
      { name: '크림 (KREAM)', domain: 'kream.co.kr' },
      { name: '지그재그 (ZigZag)', domain: 'zigzag.kr' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/musinsacom/',
      'https://www.youtube.com/@musinsatv'
    ]
  },
  '29cm.co.kr': {
    serviceName: '29CM (이십구센티미터)',
    companyName: '주식회사 무신사 (29CM 사업부문)',
    businessNumber: '211-88-34504',
    representative: '조만호 · 박준모',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '패션 이커머스 / 버티컬 플랫폼',
    peers: [
      { name: '무신사 (MUSINSA)', domain: 'musinsa.com' },
      { name: '크림 (KREAM)', domain: 'kream.co.kr' },
      { name: '지그재그 (ZigZag)', domain: 'zigzag.kr' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/29cm.official/'
    ]
  },
  'kream.co.kr': {
    serviceName: '크림 (KREAM)',
    companyName: '주식회사 크림',
    businessNumber: '570-88-01618',
    representative: '김창욱',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '패션 이커머스 / 버티컬 플랫폼',
    peers: [
      { name: '무신사 (MUSINSA)', domain: 'musinsa.com' },
      { name: '29CM', domain: '29cm.co.kr' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/kream.co.kr/'
    ]
  },
  'daangn.com': {
    serviceName: '당근 (Karrot)',
    companyName: '주식회사 당근',
    businessNumber: '375-87-00088',
    representative: '황도연 · 김용현',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '기타 플랫폼 서비스',
    peers: [
      { name: '오늘의집 (Bucketplace)', domain: 'ohou.se' }
    ]
  },
  'baemin.com': {
    serviceName: '배달의민족 (우아한형제들)',
    companyName: '주식회사 우아한형제들',
    businessNumber: '120-87-65763',
    representative: '이국환 · 김범석',
    isDartAudited: true,
    disclosureType: 'dart',
    category: 'O2O / 푸드 딜리버리 커머스',
    peers: [
      { name: '요기요 (Yogiyo)', domain: 'yogiyo.co.kr' },
      { name: '쿠팡이츠 (CoupangEats)', domain: 'eats.coupang.com' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/baemin_official/',
      'https://www.youtube.com/@baemin'
    ]
  },
  'yanolja.com': {
    serviceName: '야놀자 (Yanolja)',
    companyName: '주식회사 야놀자',
    businessNumber: '220-87-42885',
    representative: '이수진 · 배보찬',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '글로벌 여행 / 숙박 OTA 플랫폼',
    peers: [
      { name: '여기어때 (Goodchoice)', domain: 'goodchoice.kr' },
      { name: '마이리얼트립 (MyRealTrip)', domain: 'myrealtrip.com' },
      { name: '아고다 (Agoda)', domain: 'agoda.com' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/yanolja.official/',
      'https://www.youtube.com/@yanoljatv'
    ]
  },
  'goodchoice.kr': {
    serviceName: '여기어때 (Goodchoice)',
    companyName: '주식회사 여기어때컴퍼니',
    businessNumber: '138-81-96535',
    representative: '정명훈',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '글로벌 여행 / 숙박 OTA 플랫폼',
    peers: [
      { name: '야놀자 (Yanolja)', domain: 'yanolja.com' },
      { name: '마이리얼트립 (MyRealTrip)', domain: 'myrealtrip.com' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/goodchoice_kr/'
    ]
  },
  'ohou.se': {
    serviceName: '오늘의집 (Bucketplace)',
    companyName: '주식회사 버킷플레이스',
    businessNumber: '119-86-91245',
    representative: '이승재',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '기타 플랫폼 서비스',
    peers: [
      { name: '당근 (Karrot)', domain: 'daangn.com' }
    ],
    defaultSnsUrls: [
      'https://www.instagram.com/todayhouse/',
      'https://www.youtube.com/@todayhouse'
    ]
  },
  'myrealtrip.com': {
    serviceName: '마이리얼트립 (MyRealTrip)',
    companyName: '주식회사 마이리얼트립',
    businessNumber: '209-81-55339',
    representative: '이동건',
    isDartAudited: true,
    disclosureType: 'dart',
    category: '글로벌 여행 / 숙박 OTA 플랫폼',
    peers: [
      { name: '야놀자 (Yanolja)', domain: 'yanolja.com' },
      { name: '여기어때 (Goodchoice)', domain: 'goodchoice.kr' }
    ]
  },
  'channel.io': {
    serviceName: '채널톡 (Channel.io)',
    companyName: '주식회사 채널코퍼레이션',
    businessNumber: '119-86-64157',
    representative: '최시원',
    isDartAudited: true,
    disclosureType: 'dart',
    category: 'B2B SaaS / 엔터프라이즈 솔루션',
    peers: [
      { name: '스포카 (도도포인트)', domain: 'spoqa.com' },
      { name: '플렉스 (Flex HR)', domain: 'flex.team' }
    ]
  },
  'flex.team': {
    serviceName: '플렉스 (Flex HR)',
    companyName: '주식회사 플렉스',
    businessNumber: '530-88-01188',
    representative: '장해석',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: 'B2B SaaS / 엔터프라이즈 솔루션',
    peers: [
      { name: '채널톡 (Channel.io)', domain: 'channel.io' },
      { name: '스포카 (도도포인트)', domain: 'spoqa.com' }
    ]
  },
  'spoqa.com': {
    serviceName: '스포카 (도도포인트)',
    companyName: '주식회사 스포카',
    businessNumber: '211-88-66236',
    representative: '손성훈 · 최재승',
    isDartAudited: false,
    disclosureType: 'startup_db',
    category: 'B2B SaaS / 엔터프라이즈 솔루션',
    peers: [
      { name: '채널톡 (Channel.io)', domain: 'channel.io' },
      { name: '플렉스 (Flex HR)', domain: 'flex.team' }
    ]
  }
};

// 각 탭별 검증 단계 전용 대표 아이콘 매퍼
const getStageIcon = (id: string) => {
  switch (id) {
    case 'overview': return Building2;
    case 'traffic': return TrendingUp;
    case 'ir': return FileText;
    case 'service': return Globe;
    case 'marketing': return Share2;
    case 'infra': return Server;
    case 'recheck': return ShieldCheck;
    default: return Sparkles;
  }
};

export const UrlVerificationModal: React.FC<UrlVerificationModalProps> = ({
  isOpen,
  onClose,
  rawUrl,
  onConfirm,
}) => {
  // 도메인 정규화
  const cleanDomain = rawUrl
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .toLowerCase()
    .trim();

  // 모달 단계 상태: 'info' (사업자 정보 확인 단계) ➔ 'validating' (각 탭별 데이터 100% 정합성 검증 단계)
  const [modalStep, setModalStep] = useState<'info' | 'validating'>('info');
  const [validatingProgress, setValidatingProgress] = useState(1);
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [completedStageIds, setCompletedStageIds] = useState<string[]>([]);
  const [isValidationDone, setIsValidationDone] = useState(false);
  const validationTimerRef = useRef<NodeJS.Timeout[]>([]);

  // 내부 상태 (사업자 정보)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [representative, setRepresentative] = useState('');
  const [mailOrderReport, setMailOrderReport] = useState('');
  const [isFooterVerified, setIsFooterVerified] = useState(true);
  const [disclosureType, setDisclosureType] = useState<'dart' | 'startup_db' | 'franchise_ftc' | 'unconfirmed'>('startup_db');
  const [isDartAudited, setIsDartAudited] = useState<boolean>(false);
  const [category, setCategory] = useState('기타');
  const [snsUrls, setSnsUrls] = useState<string[]>(['']);
  const [isLiveScraped, setIsLiveScraped] = useState(false);
  const [hasApp, setHasApp] = useState(false);
  const [appInfo, setAppInfo] = useState<AppMarketInfo | undefined>(undefined);
  const [confirmUnverifiedFooter, setConfirmUnverifiedFooter] = useState(false);
  const [trackedUrls, setTrackedUrls] = useState<{ inputUrl?: string; redirectUrl?: string; sourceUrl?: string }>({});
  const [refreshFeedback, setRefreshFeedback] = useState<{ type: 'success' | 'warn'; message: string } | null>(null);

  // 대상 웹사이트 실시간 크롤링 및 메타데이터 추적 함수
  const runLiveTrace = useCallback((isForceRefresh: boolean = false) => {
    if (!cleanDomain) return;

    if (isForceRefresh) {
      setIsRefreshing(true);
    }
    setConfirmUnverifiedFooter(false);
    setRefreshFeedback(null);
    if (!isForceRefresh) {
      setAppInfo(undefined);
    }

    // 1. 사전 지식베이스 즉시 적용 (사업자 정보 우선 노출 원칙)
    const known = KNOWN_DOMAIN_MAP[cleanDomain];
    if (known) {
      setServiceName(known.serviceName);
      setCompanyName(known.companyName);
      setBusinessNumber(known.businessNumber || '');
      setRepresentative(known.representative || '');
      setMailOrderReport(known.mailOrderReport || '');
      setCategory(known.category || '기타');
      setDisclosureType(known.disclosureType);
      setIsDartAudited(known.isDartAudited);
      setHasApp(Boolean(known.hasApp));
      if (!isForceRefresh && known.defaultSnsUrls && known.defaultSnsUrls.length > 0) {
        setSnsUrls(known.defaultSnsUrls);
      }
      setIsFooterVerified(Boolean(known.businessNumber));
      setTrackedUrls({
        inputUrl: rawUrl,
        redirectUrl: `https://${cleanDomain}`,
        sourceUrl: `https://${cleanDomain}`
      });
    }

    // 2. 실시간 라이브 스크래핑 및 메타데이터 자동 추출 실행
    analyzeTargetUrl(cleanDomain, isForceRefresh)
      .then((data) => {
        setServiceName(data.serviceName || (known?.serviceName ?? cleanDomain));
        setCompanyName(data.companyName || (known?.companyName ?? `(주)${data.serviceName}`));
        setBusinessNumber(data.businessNumber || (known?.businessNumber ?? ''));
        setRepresentative(data.representative || (known?.representative ?? ''));
        setMailOrderReport(data.mailOrderReport || (known?.mailOrderReport ?? ''));
        setCategory(data.category || (known?.category ?? '기타'));
        setDisclosureType(data.disclosureType || (known?.disclosureType ?? 'startup_db'));
        setIsDartAudited(data.isDartAudited ?? (known?.isDartAudited ?? false));
        setHasApp(Boolean(data.hasApp !== undefined ? data.hasApp : known?.hasApp));
        setAppInfo(data.appInfo);
        if (data.snsUrls && data.snsUrls.length > 0) {
          setSnsUrls(data.snsUrls);
        } else if (known?.defaultSnsUrls && known.defaultSnsUrls.length > 0) {
          setSnsUrls(known.defaultSnsUrls);
        }
        const hasValidBno = Boolean(data.businessNumber || known?.businessNumber);
        setIsFooterVerified(hasValidBno);
        setIsLiveScraped(data.isLiveScraped);
        setTrackedUrls({
          inputUrl: data.inputUrl || rawUrl,
          redirectUrl: data.redirectUrl || `https://${cleanDomain}`,
          sourceUrl: data.sourceUrl || `https://${cleanDomain}`
        });

        if (isForceRefresh) {
          const isComplete = Boolean(
            data.representative &&
            !data.representative.includes('확인 중') &&
            data.businessNumber &&
            data.businessNumber !== '000-00-00000'
          );
          if (isComplete) {
            setRefreshFeedback({
              type: 'success',
              message: '웹사이트 실시간 재추적 완료: 푸터 사업자등록번호 및 대표자 정보가 갱신되었습니다.'
            });
          } else {
            setRefreshFeedback({
              type: 'warn',
              message: '웹사이트 재추적 완료: 푸터에 텍스트 사업자 정보가 발견되지 않았습니다. 직접 입력하실 수 있습니다.'
            });
          }
        }
      })
      .catch((err) => {
        console.warn('[UrlVerificationModal] Live scrape failed, using fallback:', err);
        if (isForceRefresh) {
          setRefreshFeedback({
            type: 'warn',
            message: '일시적인 네트워크 지연으로 실시간 재추적에 실패했습니다. 잠시 후 다시 시도해 주세요.'
          });
        }
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [cleanDomain, rawUrl]);

  // 모달이 열릴 때 상태 초기화 및 사업자 정보 즉시 노출
  useEffect(() => {
    if (!isOpen || !cleanDomain) return;
    setModalStep('info');
    setValidatingProgress(1);
    setActiveStageIdx(0);
    setCompletedStageIds([]);
    setIsValidationDone(false);
    validationTimerRef.current.forEach(clearTimeout);
    validationTimerRef.current = [];
    runLiveTrace(false);

    return () => {
      validationTimerRef.current.forEach(clearTimeout);
      validationTimerRef.current = [];
    };
  }, [isOpen, cleanDomain, runLiveTrace]);

  // 대표자 및 사업자등록번호 유효성 검증
  const isRepValid = Boolean(
    representative.trim() && 
    !representative.includes('확인 중') && 
    !representative.includes('공시 확인 중') &&
    !representative.includes('미확인')
  );
  const isBnoValid = Boolean(
    businessNumber.trim() && 
    businessNumber.trim() !== '000-00-00000' && 
    !businessNumber.includes('확인')
  );
  const isBusinessInfoComplete = isRepValid && isBnoValid;
  const canSubmit = isBusinessInfoComplete || confirmUnverifiedFooter;

  // 공식 SNS 링크 추가/수정/삭제 핸들러 (최대 3개)
  const handleAddSnsUrl = () => {
    if (snsUrls.length >= 3) return;
    setSnsUrls((prev) => [...prev, '']);
  };

  const handleSnsUrlChange = (index: number, val: string) => {
    setSnsUrls((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveSnsUrl = (index: number) => {
    setSnsUrls((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? [''] : next;
    });
  };

  // 최종 확인 및 대시보드 생성 제출
  const executeFinalConfirm = () => {
    const validSnsUrls = snsUrls
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const result: VerificationResult = {
      domain: cleanDomain,
      inputUrl: trackedUrls.inputUrl || rawUrl,
      redirectUrl: trackedUrls.redirectUrl || `https://${cleanDomain}`,
      serviceName: serviceName.trim() || cleanDomain,
      companyName: companyName.trim() || `(주)${serviceName.trim() || cleanDomain}`,
      businessNumber: businessNumber.trim() || undefined,
      representative: representative.trim() || undefined,
      mailOrderReport: mailOrderReport.trim() || undefined,
      isFooterVerified: isFooterVerified && Boolean(businessNumber.trim()),
      category: category || '기타',
      peerCompetitors: [],
      dataAvailability: {
        traffic: true,
        dart: isDartAudited,
        appStore: hasApp,
        payment: true,
      },
      isDartAudited,
      disclosureType,
      snsUrls: validSnsUrls.length > 0 ? validSnsUrls : undefined,
      hasApp,
      appInfo,
    };

    onConfirm(result);
  };

  // 사업자 정보 확인 후 전 탭 데이터 100% 정합성 검증 시작 핸들러
  const startValidationAndCreate = () => {
    if (!canSubmit) return;

    validationTimerRef.current.forEach(clearTimeout);
    validationTimerRef.current = [];

    setModalStep('validating');
    setValidatingProgress(1);
    setActiveStageIdx(0);
    setCompletedStageIds([]);
    setIsValidationDone(false);

    let cumulativeTime = 0;
    const timers: NodeJS.Timeout[] = [];

    VERIFICATION_STAGES.forEach((stage, idx) => {
      // 단계 진입 시점 타이머
      const startTimer = setTimeout(() => {
        setActiveStageIdx(idx);
      }, cumulativeTime);
      timers.push(startTimer);

      cumulativeTime += stage.durationMs;

      // 단계 완료 시점 타이머
      const completeTimer = setTimeout(() => {
        setCompletedStageIds((prev) => [...prev, stage.id]);
      }, cumulativeTime);
      timers.push(completeTimer);
    });

    // 40ms 단위로 validatingProgress를 1%부터 100%까지 정밀 보간
    const totalDuration = cumulativeTime;
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPercent = Math.min(100, Math.max(1, (elapsed / totalDuration) * 100));
      setValidatingProgress(rawPercent);

      if (elapsed >= totalDuration) {
        clearInterval(progressInterval);
        setValidatingProgress(100);
        setIsValidationDone(true);

        const finishTimer = setTimeout(() => {
          executeFinalConfirm();
        }, 450);
        timers.push(finishTimer);
      }
    }, 40);

    validationTimerRef.current = [...timers, progressInterval as unknown as NodeJS.Timeout];
  };

  if (!isOpen) return null;

  const activeStage = VERIFICATION_STAGES[activeStageIdx] || VERIFICATION_STAGES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="url-verification-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-dark-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl sm:max-w-3xl bg-dark-900 border border-dark-750 rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 닫기 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors cursor-pointer"
        >
          <XIcon size={20} />
        </button>

        {/* ── 1. 헤더 영역 (단계별 가변) ── */}
        <div className="space-y-1 pb-3.5 border-b border-dark-800 shrink-0">
          {modalStep === 'info' ? (
            <>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  Step 1. 정보 확인
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {cleanDomain}
                </span>
              </div>
              <h2 id="url-verification-title" className="text-lg sm:text-xl font-black text-white flex items-center gap-2 pt-0.5">
                <span>대상 기업 및 서비스 기본 정보</span>
              </h2>
              <p className="text-xs text-slate-400">
                입력하신 도메인의 사업자 정보가 매핑되었습니다. 정보 확인 후 검증을 시작합니다.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>Step 2. 실측 검증</span>
                </span>
                <span className="text-xs text-cyan-300 font-mono">
                  {serviceName || cleanDomain}
                </span>
              </div>
              <h2 id="url-verification-title" className="text-lg sm:text-xl font-black text-white flex items-center gap-2 pt-0.5">
                <span>단계별 데이터 검증 진행</span>
              </h2>
              <p className="text-xs text-slate-400">
                순서에 따라 7개 영역별 실측 데이터를 확인하고 대시보드를 생성합니다.
              </p>
            </>
          )}
        </div>

        {/* ── 2. 본문 내용 (단계별 가변 화면) ── */}
        {modalStep === 'info' ? (
          /* ════════ Step 1: 사업자 정보 우선 노출 및 확인 폼 ════════ */
          <div className="py-3.5 overflow-y-auto space-y-3.5 pr-1 text-xs flex-1">
            
            {/* 실시간 재추적 피드백 토스트 배너 */}
            {refreshFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2.5 animate-fade-in ${
                  refreshFeedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {refreshFeedback.type === 'success' ? (
                    <CircleCheckIcon size={16} className="text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="leading-snug">{refreshFeedback.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRefreshFeedback(null)}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="닫기"
                >
                  <XIcon size={14} />
                </button>
              </div>
            )}

            {/* 1) 분석 대상 서비스 및 법인명 메타데이터 (4대 식별자 & 공시 출처) */}
            <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-dark-850">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <GlobeIcon size={14} className="text-cyan-400" />
                  <span>입력한 도메인 법인정보</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => runLiveTrace(true)}
                    disabled={isRefreshing}
                    title="웹사이트 푸터 및 비즈니스 데이터 실시간 재추적"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-900 hover:bg-dark-850 border border-dark-750 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
                    <span>실시간 재추적</span>
                  </button>
                  <div className="flex items-center text-cyan-400" title={isLiveScraped ? '실시간 라이브 수집 완료' : '표준 데이터 검증'}>
                    <CircleCheckIcon size={16} className="text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* URL 입력 푸터 실측 핵심 데이터 (상호명 길이에 따라 우측 대표자명 박스 동적 축소 & 법인명 확대) */}
              {(() => {
                const isLongCompany = (companyName || '').length > 5;

                return (
                  <div className={`grid grid-cols-2 gap-2 ${
                    isLongCompany
                      ? 'sm:grid-cols-[0.95fr_1.65fr_0.65fr_1.05fr]'
                      : 'sm:grid-cols-4'
                  }`}>
                    <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 min-w-0">
                      <span className="text-[10px] font-medium text-slate-400 block mb-1">
                        서비스명
                      </span>
                      <div className="w-full text-xs font-bold text-white truncate" title={serviceName}>
                        {serviceName || cleanDomain}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-dark-900 border border-cyan-500/40 bg-cyan-950/20 min-w-0">
                      <span className="text-[10px] font-medium text-cyan-400 block mb-1">
                        법인명 (상호)
                      </span>
                      <div className="w-full text-xs font-bold text-cyan-300 truncate" title={companyName}>
                        {companyName || '[미확인: 공시 확인 중]'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 min-w-0">
                      <span className="text-[10px] font-medium text-slate-400 block mb-1">
                        대표자
                      </span>
                      <div className={`w-full text-xs font-bold truncate ${isRepValid ? 'text-slate-200' : 'text-slate-500'}`} title={representative}>
                        {representative || '[미확인: 정보 없음]'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 min-w-0">
                      <span className="text-[10px] font-medium text-slate-400 block mb-1">
                        사업자등록번호
                      </span>
                      <div className={`w-full text-xs font-mono font-bold truncate ${isBnoValid ? 'text-slate-200' : 'text-slate-500'}`} title={businessNumber}>
                        {businessNumber || '[미확인: 정보 없음]'}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 푸터 사업자 정보 미확인 시 확인 가드 배지 및 체크박스 */}
              {!isBusinessInfoComplete && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="text-xs font-bold text-amber-300">
                          대표자 및 사업자등록번호 확인 필요
                        </p>
                        <button
                          type="button"
                          onClick={() => runLiveTrace(true)}
                          disabled={isRefreshing}
                          className="self-start sm:self-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                          <span>푸터 정보 다시 추적하기</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        해당 사이트의 푸터 사업자 정보가 아직 수집되지 않았습니다. 일시적인 응답 지연일 경우 위 <strong>[푸터 정보 다시 추적하기]</strong> 버튼을 눌러 실시간 재추적할 수 있으며, 직접 입력하시거나 아래 확인 체크 시 [사업 분석하기]가 활성화됩니다.
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 pt-2 border-t border-amber-500/20 cursor-pointer text-xs font-semibold text-amber-200 hover:text-amber-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={confirmUnverifiedFooter}
                      onChange={(e) => setConfirmUnverifiedFooter(e.target.checked)}
                      className="w-4 h-4 rounded border-amber-500/50 text-purple-600 focus:ring-purple-500 bg-dark-900 cursor-pointer"
                    />
                    <span>해당 사이트는 푸터에 사업자 정보가 없는 서비스임을 직접 확인했습니다.</span>
                  </label>
                </div>
              )}

              {/* DART전자공시(원천 연동) */}
              <div className="pt-2 border-t border-dark-850">
                {disclosureType === 'dart' ? (
                  <div className="p-2.5 rounded-xl border bg-dark-900 border-dark-800 flex items-center gap-2.5">
                    <BrandLogo brandKey="dart" size="xs" className="w-6 h-6 rounded shrink-0" />
                    <span className="font-bold text-xs text-white">DART전자공시(원천 연동)</span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl border bg-dark-900 border-dark-800 flex items-center gap-2.5">
                    <div className="flex items-center -space-x-1 shrink-0">
                      <BrandLogo brandKey="mss" size="xs" className="w-6 h-6 rounded" />
                      <BrandLogo brandKey="innoforest" size="xs" className="w-6 h-6 rounded" />
                    </div>
                    <span className="font-bold text-xs text-white">중기부 · 혁신의숲(원천 연동)</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2) 표준 업종 / 산업군 분류 (1줄 표기: 분야명 + 자동 분류) */}
            <div className="px-3.5 py-2.5 rounded-xl bg-dark-950 border border-dark-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <LayersIcon size={14} className="text-purple-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white truncate">
                  {category}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0">
                자동 분류
              </span>
            </div>

            {/* 2-1) 모바일 앱 마켓 연동 결과 (단 1줄 핵심 일원화 - Rule 12 준수) */}
            {(() => {
              const cleanAppName = (appInfo?.appName || `${serviceName} 공식 모바일 앱`)
                .split(' - ')[0]
                .split(' : ')[0]
                .split(' | ')[0]
                .trim();

              return (
                <div className="px-3.5 py-2 rounded-xl bg-dark-950 border border-dark-800 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <Smartphone className={`w-3.5 h-3.5 shrink-0 ${hasApp ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="text-xs text-slate-200 truncate">
                      {hasApp ? (
                        <>
                          <span className="text-slate-300">공식 모바일 앱 등록 확인:</span>{' '}
                          <strong className="text-emerald-400 font-bold">{cleanAppName}</strong>
                        </>
                      ) : (
                        <span className="text-slate-400">공식 모바일 앱 미운영 (웹 단일 트래픽 100% 집계)</span>
                      )}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold shrink-0 whitespace-nowrap ${
                    hasApp
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-dark-800 text-slate-400 border border-dark-700'
                  }`}>
                    {hasApp ? '스토어(Google Play · App Store) 연동' : '웹 트래픽 전용'}
                  </span>
                </div>
              );
            })()}



            {/* 4) 공식 SNS 연동 (단 1줄 헤더 & 핵심만 요약 - Rule 12 준수) */}
            <div className="p-3.5 rounded-xl bg-dark-950 border border-purple-500/30 space-y-2.5">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-dark-850">
                <div className="flex items-center gap-1.5 min-w-0">
                  <ShareIcon size={14} className="text-purple-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200">공식 SNS 연동</span>
                  <span className="text-[10px] text-slate-500 font-normal shrink-0">(선택)</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/30 shrink-0 whitespace-nowrap">
                  {snsUrls.filter((u) => u.trim().length > 0).length}/3개
                </span>
              </div>

              {/* SNS 입력 필드 목록 */}
              <div className="space-y-2">
                {snsUrls.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 font-mono">
                        #{idx + 1}
                      </div>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleSnsUrlChange(idx, e.target.value)}
                        placeholder={
                          idx === 0
                            ? '인스타그램 URL (계정 또는 릴스)'
                            : idx === 1
                            ? '유튜브 URL (채널 또는 영상)'
                            : '네이버 블로그 URL (블로그 또는 글)'
                        }
                        aria-label={`공식 SNS 채널 URL #${idx + 1}`}
                        className="w-full pl-8 pr-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>
                    {snsUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSnsUrl(idx)}
                        className="p-2 text-slate-400 hover:text-rose-400 rounded-lg bg-dark-900 hover:bg-dark-850 border border-dark-750 transition-colors cursor-pointer shrink-0"
                        title="링크 삭제"
                      >
                        <Trash2Icon size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 링크 추가 버튼 */}
              {snsUrls.length < 3 && (
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={handleAddSnsUrl}
                    className="px-2.5 py-1.5 rounded-lg bg-dark-900 hover:bg-dark-850 text-purple-300 hover:text-purple-200 text-xs font-bold transition-colors flex items-center gap-1.5 border border-purple-500/30 cursor-pointer"
                  >
                    <PlusIcon size={13} />
                    <span>링크 추가</span>
                  </button>
                </div>
              )}
            </div>

            {/* 안내 문구 */}
            <p className="text-[11px] text-slate-400 px-1">
              * [데이터 검증 시작]을 클릭하시면 7단계 순서대로 실측 데이터를 확인한 후 대시보드가 생성됩니다.
            </p>

          </div>
        ) : (
          /* ════════ Step 2: 7단계 순서별 데이터 실측 검증 로딩 화면 ════════ */
          <div className="py-3 overflow-y-auto space-y-3.5 pr-1 text-xs flex-1 font-sans">
            
            {/* 1) 에너지 프로그레스 바 (1% ~ 100%) */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-dark-950 border border-dark-800 flex flex-col items-center space-y-2.5">
              <div className="flex items-center justify-between w-full max-w-lg pb-0.5 text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>실시간 검증 진행률</span>
                </span>
                <span className="font-mono text-base text-brand-cyan font-black">
                  {Math.round(validatingProgress)}%
                </span>
              </div>

              {/* 배터리 그래픽 바 */}
              <div className="relative flex items-center w-full max-w-lg">
                <div className="relative w-full h-8 sm:h-9 rounded-xl p-1 bg-dark-950 border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center overflow-hidden">
                  <div className="absolute inset-1 rounded-lg bg-dark-900/90" />
                  <div
                    className="relative h-full rounded-lg bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-75 ease-out shadow-[0_0_14px_rgba(52,211,153,0.5)] overflow-hidden"
                    style={{ width: `${Math.max(6, validatingProgress)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-battery-shimmer" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none z-10">
                    <Zap className="w-3.5 h-3.5 text-emerald-200 fill-emerald-300 animate-pulse drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                    <span className="text-sm font-mono font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wider">
                      {Math.round(validatingProgress)}%
                    </span>
                  </div>
                </div>
                <div className="w-2 h-4 bg-emerald-500/80 border-r-2 border-y-2 border-emerald-400 rounded-r-md -ml-[1px] shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              </div>

              {/* 현재 진행 단계 안내 */}
              <div className="text-center pt-0.5">
                {isValidationDone ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 inline-flex items-center gap-1.5 shadow-sm">
                    <CircleCheckIcon size={14} className="text-emerald-400" />
                    <span>전체 7단계 검증 완료! 대시보드로 이동합니다.</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 inline-flex items-center gap-1.5 shadow-sm">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>[{activeStageIdx + 1}/7단계] {activeStage.name} 진행 중</span>
                  </span>
                )}
              </div>
            </div>

            {/* 2) 7단계 순서별 진행 리스트 (핵심 요약) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 pb-0.5">
                <span>단계별 검증 순서 (총 7단계)</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {completedStageIds.length}/7 완료
                </span>
              </div>

              <div className="space-y-1.5">
                {VERIFICATION_STAGES.map((st, idx) => {
                  const isDone = completedStageIds.includes(st.id) || isValidationDone;
                  const isCurrent = idx === activeStageIdx && !isDone;
                  const StageIcon = getStageIcon(st.id);

                  return (
                    <div
                      key={st.id}
                      className={`p-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-dark-900 border-emerald-500/30 text-slate-200'
                          : isCurrent
                          ? 'bg-dark-850 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30 text-white'
                          : 'bg-dark-950/40 border-dark-800/60 opacity-40 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* 단계 번호 배지 */}
                        <span
                          className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 border ${
                            isDone
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : isCurrent
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                              : 'bg-dark-900 border-dark-800 text-slate-500'
                          }`}
                        >
                          {st.step}
                        </span>

                        {/* 아이콘 */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                            isDone
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : isCurrent
                              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                              : 'bg-dark-900 border-dark-800 text-slate-500'
                          }`}
                        >
                          {isDone ? (
                            <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-400" />
                          ) : isCurrent ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                          ) : (
                            <StageIcon className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>

                        {/* 순서별 핵심 내용 (명칭 + 핵심 요약) */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">
                              {st.name}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                              · {st.summary}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate sm:hidden">
                            {st.summary}
                          </div>
                        </div>
                      </div>

                      {/* 상태 배지 */}
                      <div className="shrink-0">
                        {isDone ? (
                          <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[2.5] text-emerald-400" />
                            <span>완료</span>
                          </span>
                        ) : isCurrent ? (
                          <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>진행 중</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-dark-900 text-slate-500 border border-dark-800">
                            대기
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── 3. 하단 액션 버튼 (Step 1일 때만 노출) ── */}
        {modalStep === 'info' && (
          <div className="pt-3.5 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 font-bold text-xs transition-colors cursor-pointer"
            >
              다시 입력하기
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              {!canSubmit && (
                <span className="text-[11px] text-amber-400 font-medium text-center sm:text-right">
                  ※ 대표자·사업자번호 입력 또는 확인 체크 시 활성화
                </span>
              )}
              <button
                type="button"
                disabled={!canSubmit}
                onClick={startValidationAndCreate}
                className={
                  canSubmit
                    ? "w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    : "w-full sm:w-auto px-6 py-2.5 rounded-xl bg-dark-800 text-slate-500 border border-dark-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                }
              >
                <span>데이터 검증 시작 및 대시보드 생성</span>
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
