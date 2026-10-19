import React, { useState, useEffect, useCallback } from 'react';
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
import { AlertTriangle, Smartphone, RefreshCw } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { analyzeTargetUrl, type AppMarketInfo } from '../../utils/urlAnalyzer';

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
  disclosureType: 'dart' | 'startup_db';
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
  disclosureType: 'dart' | 'startup_db';
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
    isDartAudited: true,
    disclosureType: 'dart',
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
    isDartAudited: true,
    disclosureType: 'dart',
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
    isDartAudited: true,
    disclosureType: 'dart',
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
  'www.inexcoin.com': {
    serviceName: '인엑스 (INEX)',
    companyName: '(주)인피니티익스체인지코리아',
    businessNumber: '783-81-02738',
    representative: '이재강',
    isDartAudited: true,
    disclosureType: 'dart',
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

  // 내부 상태
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(1);
  const [serviceName, setServiceName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [representative, setRepresentative] = useState('');
  const [mailOrderReport, setMailOrderReport] = useState('');
  const [isFooterVerified, setIsFooterVerified] = useState(true);
  const [disclosureType, setDisclosureType] = useState<'dart' | 'startup_db'>('startup_db');
  const [isDartAudited, setIsDartAudited] = useState<boolean>(false);
  const [category, setCategory] = useState('기타');
  const [snsUrls, setSnsUrls] = useState<string[]>(['']);
  const [peers, setPeers] = useState<PeerCompetitor[]>([]);
  const [isLiveScraped, setIsLiveScraped] = useState(false);
  const [hasApp, setHasApp] = useState(false);
  const [appInfo, setAppInfo] = useState<AppMarketInfo | undefined>(undefined);
  const [confirmUnverifiedFooter, setConfirmUnverifiedFooter] = useState(false);
  const [trackedUrls, setTrackedUrls] = useState<{ inputUrl?: string; redirectUrl?: string; sourceUrl?: string }>({});
  const [refreshFeedback, setRefreshFeedback] = useState<{ type: 'success' | 'warn'; message: string } | null>(null);

  // 대상 웹사이트 실시간 크롤링 및 메타데이터 추적 함수 (새로고침 지원)
  const runLiveTrace = useCallback((isForceRefresh: boolean = false) => {
    if (!cleanDomain) return;

    setIsScanning(true);
    setScanStep(1);
    setConfirmUnverifiedFooter(false);
    setRefreshFeedback(null);
    if (!isForceRefresh) {
      setAppInfo(undefined);
      setPeers([]);
    }

    const step1Timer = setTimeout(() => {
      setScanStep(2);
    }, 350);

    const step2Timer = setTimeout(() => {
      setScanStep(3);
    }, 700);

    // 1. 사전 지식베이스 즉시 프리셋 적용 (빠른 UI 반응)
    const known = KNOWN_DOMAIN_MAP[cleanDomain];
    if (!isForceRefresh && known) {
      setServiceName(known.serviceName);
      setCompanyName(known.companyName);
      setBusinessNumber(known.businessNumber || '');
      setRepresentative(known.representative || '');
      setMailOrderReport(known.mailOrderReport || '');
      setCategory(known.category || '기타');
      setDisclosureType(known.disclosureType);
      setIsDartAudited(known.isDartAudited);
      setHasApp(Boolean(known.hasApp));
      setPeers(
        known.peers.slice(0, 2).map((p, idx) => ({
          id: `peer-${idx}`,
          name: p.name,
          domain: p.domain,
          category: known.category || '기타',
          selected: true
        }))
      );
      setSnsUrls(known.defaultSnsUrls && known.defaultSnsUrls.length > 0 ? known.defaultSnsUrls : ['']);
      setIsFooterVerified(Boolean(known.businessNumber));
      setTrackedUrls({
        inputUrl: rawUrl,
        redirectUrl: `https://${cleanDomain}`,
        sourceUrl: `https://${cleanDomain}`
      });
    } else if (!isForceRefresh) {
      // 사전 검증되지 않은 미확인 도메인은 경쟁사 자동 매칭 비활성화
      setPeers([]);
    }

    // 2. 실시간 라이브 스크래핑 및 메타데이터 자동 추출 실행 (어떤 URL이든 실시간 수집 지원)
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
        if (known && data.peers && data.peers.length > 0) {
          setPeers(data.peers.slice(0, 2).map((p, idx) => ({ ...p, id: p.id || `peer-${idx}`, selected: true })));
        } else if (data.peers && data.peers.length > 0) {
          setPeers(data.peers.slice(0, 2).map((p, idx) => ({ ...p, id: p.id || `peer-${idx}`, selected: true })));
        } else if (!known) {
          // 도메인이 확인되지 않은 정보는 경쟁사가 자동으로 설정되지 않도록 보장
          setPeers([]);
        }
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
        setTimeout(() => {
          setIsScanning(false);
        }, 900);
      });

    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
    };
  }, [cleanDomain, rawUrl]);

  // 모달이 열릴 때 도메인 기반 AI 탐색 및 웹사이트 실시간 실측 수집
  useEffect(() => {
    if (!isOpen || !cleanDomain) return;
    const cleanup = runLiveTrace(false);
    return () => {
      if (cleanup) cleanup();
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
  const handleConfirm = () => {
    const validSnsUrls = snsUrls
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const selectedPeers = peers.filter((p) => p.selected);

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
      peerCompetitors: selectedPeers,
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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="url-verification-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-dark-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-dark-900 border border-dark-750 rounded-2xl shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 닫기 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
        >
          <XIcon size={20} />
        </button>

        {/* ── 1. 헤더 영역 ── */}
        <div className="space-y-1 pb-4 border-b border-dark-800">
          <h2 id="url-verification-title" className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>분석 대상 서비스 및 법인명 확인</span>
          </h2>
          <p className="text-xs text-slate-400">
            해당 법인명 공시 출처 기준으로 IR 결산·재무 및 비즈니스 데이터가 연동됩니다.
          </p>
        </div>

        {/* ── 2. 스캔 로딩 애니메이션 ── */}
        {isScanning ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-purple-600/20 animate-ping" />
              <div className="relative w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500 flex items-center justify-center text-purple-300">
                <GlobeIcon size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                {scanStep === 1 && (
                  <>
                    <span className="sm:hidden">도메인 메타데이터 분석</span>
                    <span className="hidden sm:inline">웹사이트 [{cleanDomain}] 도메인 메타데이터 분석 중...</span>
                  </>
                )}
                {scanStep === 2 && (
                  <>
                    <span className="sm:hidden">표준산업 및 BM 판별</span>
                    <span className="hidden sm:inline">한국표준산업분류 및 비즈니스 모델(BM) 카테고리 판별 중...</span>
                  </>
                )}
                {scanStep >= 3 && (
                  <>
                    <span className="sm:hidden">공식 데이터 정합성 확인</span>
                    <span className="hidden sm:inline">공식 원천 데이터(DART, 시밀러웹, 앱스토어) 정합성 확인 중...</span>
                  </>
                )}
              </p>
              <p className="text-xs text-slate-400">
                <span className="sm:hidden">수집 가용성 자동 점검 중</span>
                <span className="hidden sm:inline">공식 원천 데이터(DART, 시밀러웹, 앱스토어) 수집 가용성을 함께 점검합니다.</span>
              </p>
            </div>
          </div>
        ) : (
          /* ── 3. 검증 완료 및 설정 폼 ── */
          <div className="py-4 overflow-y-auto space-y-4 pr-1 text-xs">
            
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
                    disabled={isScanning}
                    title="웹사이트 푸터 및 비즈니스 데이터 실시간 재추적"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-900 hover:bg-dark-850 border border-dark-750 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
                    <span>실시간 재추적</span>
                  </button>
                  <div className="flex items-center text-cyan-400" title={isLiveScraped ? '실시간 라이브 수집 완료' : '표준 데이터 검증'}>
                    <CircleCheckIcon size={16} className="text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* URL 입력 푸터 실측 핵심 데이터 (Read-Only 공식 검증 카드) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800">
                  <span className="text-[10px] font-medium text-slate-400 block mb-1">
                    서비스명
                  </span>
                  <div className="w-full text-xs font-bold text-white truncate" title={serviceName}>
                    {serviceName || cleanDomain}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-900 border border-cyan-500/40 bg-cyan-950/20">
                  <span className="text-[10px] font-medium text-cyan-400 block mb-1 flex items-center justify-between">
                    <span>법인명 (상호)</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-normal">공식 식별</span>
                  </span>
                  <div className="w-full text-xs font-bold text-cyan-300 truncate" title={companyName}>
                    {companyName || '[미확인: 공시 확인 중]'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800">
                  <span className="text-[10px] font-medium text-slate-400 block mb-1">
                    대표자
                  </span>
                  <div className={`w-full text-xs font-bold truncate ${isRepValid ? 'text-slate-200' : 'text-slate-500'}`} title={representative}>
                    {representative || '[미확인: 정보 없음]'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-800">
                  <span className="text-[10px] font-medium text-slate-400 block mb-1">
                    사업자등록번호
                  </span>
                  <div className={`w-full text-xs font-mono font-bold truncate ${isBnoValid ? 'text-slate-200' : 'text-slate-500'}`} title={businessNumber}>
                    {businessNumber || '[미확인: 정보 없음]'}
                  </div>
                </div>
              </div>

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
                          disabled={isScanning}
                          className="self-start sm:self-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
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

            {/* 2-1) 2대 모바일 앱 마켓(Google Play · App Store) 실시간 조회 결과 */}
            <div className="px-3.5 py-2.5 rounded-xl bg-dark-950 border border-dark-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200">
                    모바일 앱 마켓 실시간 조회 (Google Play · App Store)
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                  hasApp
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-dark-800 text-slate-400 border border-dark-700'
                }`}>
                  {hasApp ? 'Case 1: 공식 앱 확인됨' : 'Case 2: 앱 미운영'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-relaxed">
                {hasApp ? (
                  <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                    <span>✓ 스토어 등록 확인: <strong>{appInfo?.appName || `${serviceName} 공식 모바일 앱`}</strong></span>
                    <span className="text-slate-400">➔ 앱 트래픽(MAU/DAU) 자동 연동</span>
                  </span>
                ) : (
                  <span className="text-slate-400">
                    ※ 2대 공식 스토어 검색 0건: 공식 모바일 앱이 확인되지 않아 <strong className="text-slate-300">웹 PC 단일 트래픽(100%)</strong>만 불러옵니다.
                  </span>
                )}
              </div>
            </div>

            {/* 3) 비교 대상 경쟁사 (사전 검증 도메인 2곳 매칭 / 미확인 도메인 자동 설정 해제) */}
            {peers.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                    <LayersIcon size={14} className="text-cyan-400" />
                    <span>비교 대상 경쟁사</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    2곳 자동 매칭
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {peers.slice(0, 2).map((peer, idx) => (
                    <div
                      key={peer.id || idx}
                      className="p-2.5 rounded-xl border bg-cyan-950/20 border-cyan-500/50 text-white flex items-center justify-between"
                    >
                      <div className="truncate pr-1">
                        <div className="text-xs font-bold truncate">
                          {peer.name}
                        </div>
                        <div className="text-[10px] text-cyan-300 font-mono truncate">
                          {peer.domain}
                        </div>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-[10px] shrink-0 font-bold">
                        ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <LayersIcon size={14} className="text-slate-400" />
                    <span>비교 대상 경쟁사</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    자동 매칭 해제 (도메인 미확인)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed bg-dark-900/60 p-2.5 rounded-lg border border-dark-850">
                  ※ 도메인과 사업자 정보가 공식 확인되지 않은 사이트이므로 신뢰할 수 없는 임의의 경쟁사를 자동 설정하지 않습니다. (단일 기업 집중 진단 모드로 실행)
                </div>
              </div>
            )}

            {/* 4) 마케팅 분석 연동 - 공식 SNS 채널 링크 입력 (최대 3개) */}
            <div className="p-3.5 rounded-xl bg-dark-950 border border-purple-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-dark-855">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                    <ShareIcon size={14} className="text-purple-400" />
                    <span>마케팅 분석 연동 (공식 SNS 채널)</span>
                    <span className="text-[10px] text-slate-400 font-normal">[선택 옵션]</span>
                  </span>
                  <p className="text-[11px] text-purple-300 font-medium">
                    마케팅 분석을 원하시면, 운영 중인 공식 SNS 링크를 입력해 주세요. (최대 3개)
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/30 self-start sm:self-auto">
                  {snsUrls.filter((u) => u.trim().length > 0).length}/3개 입력됨
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
                            ? '예: https://www.instagram.com/official_brand'
                            : idx === 1
                            ? '예: https://www.youtube.com/@official_brand'
                            : '예: https://x.com/official_brand'
                        }
                        aria-label={`공식 SNS 채널 URL #${idx + 1}`}
                        className="w-full pl-8 pr-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>
                    {snsUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSnsUrl(idx)}
                        className="p-2 text-slate-400 hover:text-purple-300 rounded-lg bg-dark-900 hover:bg-dark-850 border border-dark-750 transition-colors cursor-pointer shrink-0"
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
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleAddSnsUrl}
                    className="px-3 py-1.5 rounded-lg bg-dark-900 hover:bg-dark-850 text-purple-300 hover:text-purple-200 text-xs font-bold transition-colors flex items-center gap-1.5 border border-purple-500/30 cursor-pointer"
                  >
                    <PlusIcon size={14} />
                    <span>공식 SNS 링크 추가 (현재 {snsUrls.length}/3개)</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── 4. 하단 액션 버튼 ── */}
        {!isScanning && (
          <div className="pt-4 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-3">
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
                onClick={handleConfirm}
                className={
                  canSubmit
                    ? "w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    : "w-full sm:w-auto px-6 py-2.5 rounded-xl bg-dark-800 text-slate-500 border border-dark-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                }
              >
                <span>사업 분석하기</span>
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
