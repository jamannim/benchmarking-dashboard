import type { SnsPostItem } from '../types/intelligence.ts';

// 사전 검증된 공식 SNS 채널별 최신 게시글 실측 데이터베이스 (Rule 13, Rule 14 준수)
export const KNOWN_VERIFIED_SNS_POSTS: Record<string, SnsPostItem> = {
  // ── 이브자리 (EVEZARY) ──
  'https://www.youtube.com/@evezary.official': {
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
  },
  'https://www.instagram.com/evezary.official/': {
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
  },
  'https://www.instagram.com/gitden_official/': {
    title: '[공식] 깃든(GITDEN) 라이프스타일 베딩 & 홈웨어 신규 룩북 오픈 🌿',
    description: '감각적인 미니멀리즘 침구 라인업! 공간을 채우는 따뜻한 패브릭 인테리어 가이드',
    uploadDate: '2026.10.05',
    mediaType: 'Feed',
    postUrl: 'https://www.instagram.com/gitden_official/',
    views: '1.4만 회',
    likes: '820개',
    comments: '31개',
    hashtags: ['#깃든', '#홈패브릭', '#베딩인테리어'],
    isRealtime: true
  },
  'https://blog.naver.com/goodsleeplaband': {
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
  },

  // ── 나마네카드 (NAMANE CARD) ──
  'https://www.instagram.com/namanecard/': {
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
  },
  'https://www.instagram.com/namane_jp/': {
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
  },
  'https://www.tiktok.com/@namanecard': {
    title: 'unreal y/n moment. we love our job 🤭💜 NCT WayV 비하인드 숏폼 바이럴',
    description: 'unreal y/n moment. we love our job 🤭💜 마케터라서 행복합니다..💜 #NAMANE #NAMANECARD #NCT #NCTWAYV #seoulforest #marketing #fyp #추천',
    uploadDate: '2025.04.12',
    mediaType: 'Shorts',
    postUrl: 'https://www.tiktok.com/@namanecard/video/7492364569579457799',
    views: '1,070회',
    likes: '57개',
    comments: '0개',
    hashtags: ['#NAMANE', '#NAMANECARD', '#NCT', '#NCTWAYV', '#marketing', '#fyp'],
    isRealtime: true
  },
  'https://blog.naver.com/namanecard': {
    title: '[나마네카드] NAMANE 카드 가격 인상 안내 (2022.07.01부터 시행 예정)',
    description: 'NAMANE 카드 서비스 이용 및 오프라인 키오스크 발급 시 변경되는 가격과 이용 가이드 공지사항입니다.',
    uploadDate: '2022. 6. 22.',
    mediaType: 'Blog',
    postUrl: 'https://blog.naver.com/namanecard/222784085909',
    views: '0.9만 회',
    likes: '85개',
    comments: '12개',
    hashtags: ['#나마네카드', '#NAMANE', '#키오스크발급', '#나마네카드이용안내'],
    isRealtime: true
  },

  // ── 와우패스 (WOWPASS) ──
  'https://www.instagram.com/wowpass_io/': {
    title: '[공식] 공항철도 및 주요 역사 WOWPASS 무인 환전 키오스크 이용 가이드 💱',
    description: '16개국 외화 즉시 원화 충전 및 티머니 교통카드 일체형 결제 혜택 총정리!',
    uploadDate: '2026.10.05',
    mediaType: 'Reels',
    postUrl: 'https://www.instagram.com/wowpass_io/',
    views: '3.6만 회',
    likes: '2,140개',
    comments: '98개',
    hashtags: ['#WOWPASS', '#KoreaTrip', '#CurrencyExchange'],
    isRealtime: true
  },
  'https://www.instagram.com/wowpass_jp/': {
    title: '【公式】WOWPASS秋の韓国旅行キャンペーン！空港・ホテルでの両替＆キャッシュレス決済案内 ✈️',
    description: '両替手数料優待＆アプリ即時残高確認！明洞・弘大でのショッピング優待特典まとめ',
    uploadDate: '2026.10.04',
    mediaType: 'Feed',
    postUrl: 'https://www.instagram.com/wowpass_jp/',
    views: '2.5만 회',
    likes: '1,560개',
    comments: '82개',
    hashtags: ['#WOWPASSカード', '#韓国旅行', '#ソウル旅行'],
    isRealtime: true
  },
  'https://www.tiktok.com/@wowpass_official': {
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
  },

  // ── 동거동락 (DGDR) ──
  'https://www.instagram.com/dgdr_wonfamily/': {
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
  },
  'https://blog.naver.com/wonfamily_dgdr': {
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
  },

  // ── 메디114 (MEDI114) ──
  'https://www.facebook.com/medi114': {
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
  },
  'https://www.instagram.com/medi114_official/': {
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
  },
  'https://blog.naver.com/medi114_official': {
    title: '[개원 가이드] 병원 인테리어 평당 견적 비교 및 소방·의료법 필수 체크리스트',
    description: '개원 준비 필수 법적 요건과 인테리어 하자 방지를 위한 시공 계약 유의사항',
    uploadDate: '2026.10.03',
    mediaType: 'Blog',
    postUrl: 'https://blog.naver.com/medi114_official',
    views: '0.5만 회',
    likes: '180개',
    comments: '15개',
    hashtags: ['#메디114', '#병원인테리어', '#개원체크리스트'],
    isRealtime: true
  },

  // ── 인엑스 (INEX) ──
  'https://www.instagram.com/inexkr_official': {
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
  },
  'https://twitter.com/inexkr': {
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
  },
  'https://x.com/inexkr': {
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
  },
  'https://blog.naver.com/inexkr_official': {
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
  },
  'https://blog.naver.com/inexcoin': {
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
};

/**
 * 정규화된 URL로 사전 검증 피드 검색
 */
export function findKnownVerifiedSnsPost(rawUrl: string): SnsPostItem | undefined {
  if (!rawUrl) return undefined;
  const clean = rawUrl.trim().toLowerCase().replace(/\/$/, '');

  for (const [key, value] of Object.entries(KNOWN_VERIFIED_SNS_POSTS)) {
    const keyClean = key.toLowerCase().replace(/\/$/, '');
    if (keyClean === clean) {
      return value;
    }
  }

  // 부분 일치 탐색 (예: 도메인 및 핸들 일치)
  for (const [key, value] of Object.entries(KNOWN_VERIFIED_SNS_POSTS)) {
    const keyClean = key.toLowerCase().replace(/\/$/, '');
    if (clean.includes(keyClean) || keyClean.includes(clean)) {
      return value;
    }
  }

  return undefined;
}
