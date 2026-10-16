import React, { useState, useRef } from 'react';
import {
  ArrowLeft, ArrowRight, Copy, Check, ExternalLink,
  CheckCircle2, Sparkles, Code2, MessageSquare,
  Upload, Trash2, FileText
} from 'lucide-react';

interface UploadedSampleFile {
  name: string;
  sizeBytes: number;
  previewUrl?: string;
  uploadedAt: string;
}

interface KeywordPlaybook {
  rank: number;
  keyword: string;
  portal: string;
  channel: string;
  action: string;
  impact: string;
  oneLineWhy: string;
  part1Title: string;
  part1Badge: string;
  part1TargetUrl: string;
  part1TargetLabel: string;
  part1Steps: string[];
  templateTitleLabel: string;
  templateTitleValue: string;
  templateBodyLabel: string;
  templateBodyValue: string;
  part2Title: string;
  part2Badge: string;
  part2Desc: string;
  codeBlockLabel: string;
  codeBlockValue: string;
  checklist: string[];
}

const KEYWORD_PLAYBOOKS: KeywordPlaybook[] = [
  {
    rank: 1,
    keyword: 'namane card',
    portal: '구글',
    channel: '레딧 커뮤니티 & 영문 검색',
    action: '3사 비교 가이드 기고 및 영문 검색 태그 최적화',
    impact: '+45% 유입 증대',
    oneLineWhy: '구글 검색 상단 1~3위는 레딧 여행 후기글과 공식 영문 메타태그가 결정합니다.',
    part1Title: 'STEP 1. r/koreatravel 3사 비교 가이드 기고',
    part1Badge: '상단 노출 1순위',
    part1TargetUrl: 'https://www.reddit.com/r/koreatravel/submit',
    part1TargetLabel: 'r/koreatravel 글쓰기',
    part1Steps: [
      'r/koreatravel 접속 후 [Create Post] 클릭 (Guide 카테고리 선택)',
      '[T-money vs WOWPASS vs NAMANE 3사 비교 본문] 복사 후 붙여넣기',
      '핵심 차별점(① 포토카드 출력 ② 해외 신용카드 앱 충전 ③ 잔액 자유 이동) 강조'
    ],
    templateTitleLabel: '게시글 영문 제목',
    templateTitleValue: '[2026 Guide] Korea Transit & Prepaid Cards Compared: T-money vs. WOWPASS vs. NAMANE Card',
    templateBodyLabel: '게시글 영문 본문 템플릿',
    templateBodyValue: `Quick 2026 comparison of the 3 main transit & prepaid cards in Korea:

1. **T-money Card**
- Best for: Short trips using only subways and buses.
- Cons: Cash-only top-up (KRW) at stations or convenience stores.

2. **WOWPASS**
- Best for: Cashless currency exchange at kiosks.
- Cons: Transit balance still requires separate cash top-up.

3. **NAMANE Card**
- **Custom Photo Design**: Print your own photo on the card in 1 minute.
- **Foreign Card Top-up**: Load both Pay & Transit balances in the app via Visa/Mastercard/Apple Pay.
- **Instant Balance Transfer**: Move remaining money between Transit and Pay wallets anytime.
- **Kiosk Locations**: Incheon Airport (T1/T2 AREX), Hongik Univ. Stn, Myeongdong, Seoul Stn (20+ spots).`,
    part2Title: 'STEP 2. 공식 영문 웹페이지 검색 태그 최적화',
    part2Badge: '영문 SEO 코드',
    part2Desc: '구글 검색봇이 공식 홈페이지를 최우선 색인하도록 <head> 메타태그와 FAQ 구조화 데이터를 적용합니다.',
    codeBlockLabel: '영문 웹페이지 <head> 메타태그 & JSON-LD 코드',
    codeBlockValue: `<title>NAMANE Card | Custom Photo Transit & Prepaid Card in Korea</title>
<meta name="description" content="Design your own custom photo card in Korea. Use NAMANE Card for subway, bus, and shopping everywhere. Top up instantly with foreign credit cards." />
<link rel="canonical" href="https://www.namanecard.com/en" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Where can I buy a NAMANE Card?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Print in 1 minute at 20+ kiosks including Incheon Airport (T1/T2 AREX), Seoul Station, Myeongdong, and Hongik Univ. Station."
    }
  },{
    "@type": "Question",
    "name": "Can I top up with a foreign credit card?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Yes, the app supports instant top-ups via Visa, Mastercard, JCB, and Apple Pay for both transit and shopping balances."
    }
  }]
}
</script>`,
    checklist: [
      'r/koreatravel 비교 가이드 게시글 업로드',
      '게시글 댓글에 키오스크 지도 링크 고정',
      '공식 영문 페이지 Title 및 Meta Description 반영',
      '구글 서치콘솔 색인 생성 요청'
    ]
  },
  {
    rank: 2,
    keyword: '나마네카드 키오스크 위치',
    portal: '네이버',
    channel: '네이버 스마트플레이스',
    action: '전국 키오스크 20곳 스마트플레이스 공식 등록',
    impact: '+150% 지도 노출',
    oneLineWhy: '네이버 검색 상단 지도 영역에 무인발급기 20개 거점이 노출되어야 현장 즉시 발급으로 이어집니다.',
    part1Title: 'STEP 1. 스마트플레이스 20개 거점 표준 등록',
    part1Badge: '지도 상단 독점',
    part1TargetUrl: 'https://new.smartplace.naver.com/',
    part1TargetLabel: '스마트플레이스 바로가기',
    part1Steps: [
      '스마트플레이스 접속 후 상호명을 [나마네카드 무인발급기 OO역점]으로 통일 입력',
      '찾아가는 길에 출구 번호·층수·주변 지형지물을 구체적으로 기입',
      '키오스크 전면 실사 2장 + 작동 화면 사진 1장 첨부 후 심사 제출'
    ],
    templateTitleLabel: '표준 상호명 및 대표 키워드',
    templateTitleValue: '나마네카드 무인발급기 홍대입구역점 (키워드: 포토교통카드, 선불카드, 무인발급기)',
    templateBodyLabel: '스마트플레이스 상세 설명 텍스트',
    templateBodyValue: `휴대폰 사진으로 1분 만에 직접 만드는 커스텀 교통·선불카드 무인발급기입니다.
- 주요 기능: 커스텀 포토카드 즉시 출력 / 전국 지하철·버스 교통카드 / 가맹점 결제
- 찾아가는 길: 홍대입구역 4번 출구 지하 1층 공항철도 환승통로 세븐일레븐 맞은편
- 운영 시간: 매일 05:30 ~ 24:00`,
    part2Title: 'STEP 2. 키오스크 위치 페이지 검색 수집 태그 적용',
    part2Badge: '웹마스터 태그',
    part2Desc: '네이버 서치어드바이저가 키오스크 매장 위치 페이지를 즉시 수집하도록 오픈그래프 태그를 설정합니다.',
    codeBlockLabel: '키오스크 안내 페이지 메타태그',
    codeBlockValue: `<title>전국 키오스크 위치 안내 | 공항·지하철 무인발급기 찾기</title>
<meta property="og:title" content="전국 키오스크 위치 및 운영시간 안내" />
<meta property="og:description" content="인천공항, 서울역, 홍대입구, 명동 등 주요 거점 무인발급기 위치와 재고 현황을 실시간으로 확인하세요." />`,
    checklist: [
      '주요 역사 및 공항 키오스크 20곳 스마트플레이스 등록',
      '거점별 상세 출구 안내 및 실사 사진 3장 업로드',
      '네이버 서치어드바이저 페이지 수집 요청'
    ]
  },
  {
    rank: 3,
    keyword: '포토 교통카드 제작',
    portal: '야후재팬 · 트위터',
    channel: '트위터 & 야후 지혜주머니',
    action: '팬덤 포토 프레임 무료 배포 및 리트윗 챌린지',
    impact: '+65% 유입 증대',
    oneLineWhy: '야후 지혜주머니 Q&A와 트위터 실물 포토카드 인증샷이 팬덤의 발급 전환을 결정합니다.',
    part1Title: 'STEP 1. 트위터 팬덤 포토 프레임 배포 & 인증 캠페인',
    part1Badge: '팬덤 바이럴 핵심',
    part1TargetUrl: 'https://x.com/compose/post',
    part1TargetLabel: '트위터 작성 바로가기',
    part1Steps: [
      '아이돌 생일·컴백 시즌 맞춤 투명 PNG 포토 프레임 3종 배포',
      '해시태그(#韓国旅行 #推し活) 기반 실물 카드 인증샷 리트윗 이벤트 진행',
      '야후 지혜주머니 "韓国 交通カード おすすめ" 질문에 비교 답변 등록'
    ],
    templateTitleLabel: '트위터 캠페인 고정글 제목',
    templateTitleValue: '【韓国旅行×推し活】自分だけのオリジナル写真交通カード無料フレーム配布✨',
    templateBodyLabel: '트위터 & 야후 지혜주머니 복사용 본문',
    templateBodyValue: `韓国の地下鉄・バスもカフェ決済もこれ1枚！💳
好きな推しの写真で作れる限定フレームを無料配布します✨

✅ 仁川空港・弘大入口・明洞キオスクで1分発行
✅ クレジットカードでアプリからいつでもチャージ可能
✅ 交通残高⇔ペイ残高をアプリで1秒移動！

#韓国旅行 #渡韓準備 #推し活`,
    part2Title: 'STEP 2. 일문 페이지(/ja) 검색 태그 최적화',
    part2Badge: '일문 SEO 코드',
    part2Desc: '야후재팬 검색 시 최상단에 노출되는 일문 전용 메타태그입니다.',
    codeBlockLabel: '일문 웹페이지(/ja) <head> 메타태그',
    codeBlockValue: `<title>推し写真で作る韓国交通カード・プリペイドカード公式ガイド</title>
<meta name="description" content="仁川空港・明洞・弘大のキオスクで1分発行！クレジットカードでアプリチャージできるオリジナル写真交通カード公式ガイド。" />
<link rel="canonical" href="https://www.namanecard.com/ja" />`,
    checklist: [
      '공식 트위터 포토 프레임 배포 트윗 고정',
      '야후 지혜주머니 교통카드 질문 상위 5개 답변 등록',
      '일문 웹페이지(/ja) 메타태그 업데이트'
    ]
  },
  {
    rank: 4,
    keyword: '공항·역사 무인발급기',
    portal: '구글 · 야후',
    channel: '거점별 검색 최적화',
    action: '공항·역사별 20개 단독 랜딩페이지 생성 및 인덱싱',
    impact: '+80% 유입 증대',
    oneLineWhy: '입국 직후 거점명(인천공항, 홍대입구, 명동 등)으로 검색할 때 즉시 노출되는 단독 URL이 필요합니다.',
    part1Title: 'STEP 1. 주요 거점 20곳 단독 랜딩 URL 배포',
    part1Badge: '거점 검색 선점',
    part1TargetUrl: 'https://search.google.com/search-console',
    part1TargetLabel: '구글 서치콘솔 바로가기',
    part1Steps: [
      '단일 팝업 대신 거점별 고유 URL(/kiosk/incheon-airport-t1 등) 20개 생성',
      '페이지 상단에 출구 도보 사진 3장과 구글 지도 핀 삽입',
      'sitemap.xml에 20개 거점 URL 추가 후 서치콘솔 일괄 색인 요청'
    ],
    templateTitleLabel: '거점별 단독 랜딩페이지 URL 표준안',
    templateTitleValue: 'https://www.namanecard.com/en/kiosk/incheon-airport-terminal-1',
    templateBodyLabel: '거점 페이지 본문 핵심 템플릿',
    templateBodyValue: `# Kiosk Location - Incheon Airport Terminal 1 (AREX)
- **Exact Location**: B1F AREX Travel Center entrance (Next to Olive Young)
- **Operating Hours**: 06:00 - 22:30 Daily
- **Available Services**: Custom Photo Card Issuance & Cash Top-up
- **Walk Time**: 3 minutes from Arrival Hall B/C via escalator down to B1F.`,
    part2Title: 'STEP 2. 거점별 LocalBusiness 구조화 데이터 삽입',
    part2Badge: '지도 연동 스키마',
    part2Desc: '검색 결과 우측에 키오스크 위치와 운영시간이 즉시 카드 형태로 표시되도록 설정합니다.',
    codeBlockLabel: '거점 페이지 JSON-LD LocalBusiness 스키마',
    codeBlockValue: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AutomatedTeller",
  "name": "Kiosk - Incheon Airport T1",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "272 Gonghang-ro, Jung-gu",
    "addressLocality": "Incheon"
  },
  "openingHours": "Mo-Su 06:00-22:30"
}
</script>`,
    checklist: [
      '인천공항·서울역·홍대·명동 상위 5대 거점 단독 페이지 오픈',
      '나머지 15개 거점 페이지 템플릿 일괄 생성',
      'sitemap.xml 제출 및 서치콘솔 색인 완료'
    ]
  },
  {
    rank: 5,
    keyword: 'korea custom transit card',
    portal: '구글 · 인공지능',
    channel: '인공지능 검색 최적화',
    action: '구조화 태그 적용 및 위키피디아 공식 등재',
    impact: '+50% AI 추천 노출',
    oneLineWhy: '브랜드명을 모르는 여행객이 AI 챗봇에 "한국 커스텀 교통카드 추천"을 질문할 때 1순위로 인용되게 만듭니다.',
    part1Title: 'STEP 1. 위키보야지 공식 등재 및 AI 요약 파일 배포',
    part1Badge: 'AI 학습 데이터 원천',
    part1TargetUrl: 'https://en.wikivoyage.org/wiki/South_Korea#Get_around',
    part1TargetLabel: '위키보야지 바로가기',
    part1Steps: [
      '위키보야지 [South Korea > Get around] 교통카드 섹션에 항목 추가',
      '객관적 사실 기반(발급처, 커스텀 사진 인쇄, 앱 충전 지원) 3문장 요약 서술',
      '웹사이트 루트 경로에 AI 검색 전용 요약 문서(/llms.txt) 배포'
    ],
    templateTitleLabel: '위키 등재용 표준 제목',
    templateTitleValue: 'Custom Photo Prepaid & Transit Card',
    templateBodyLabel: 'AI 챗봇 인용 최적화 공식 요약본 (/llms.txt 겸용)',
    templateBodyValue: `Official customizable prepaid transit and payment card in South Korea.
- Key Feature: Print custom photos on the card at 20+ airport and subway kiosks.
- Payment & Transit: Works nationwide on subways, buses, taxis, and IC card merchants.
- Top-up Method: Supports international credit/debit cards (Visa, Mastercard, JCB) inside the mobile app.`,
    part2Title: 'STEP 2. AI 검색 수집기용 요약 파일(/llms.txt) 배포',
    part2Badge: 'AI 챗봇 대응',
    part2Desc: 'ChatGPT, 퍼플렉시티가 사이트 방문 시 가장 먼저 참조하는 표준 요약 파일입니다.',
    codeBlockLabel: '루트 디렉토리 /public/llms.txt 파일 코드',
    codeBlockValue: `# Official AI Summary (llms.txt)
> Custom photo transit & prepaid payment card in South Korea.

## Core Advantages
- Custom Photo Printing: Instant 1-minute printing at Incheon Airport, Hongdae, Myeongdong kiosks.
- Foreign Credit Card Top-Up: Recharge both Pay and Transit balances in the app without cash.
- Dual Wallet Transfer: Freely transfer balance between Transit and Pay anytime.`,
    checklist: [
      '웹사이트 /public/llms.txt 파일 배포',
      '위키보야지 교통카드 섹션 정보 업데이트',
      'AI 챗봇 추천 프롬프트 노출 검증'
    ]
  }
];

interface Props {
  serviceName?: string;
  initialRank?: number;
  onBack: () => void;
}

export const KeywordConquestGuidePage: React.FC<Props> = ({
  serviceName,
  initialRank = 1,
  onBack,
}) => {
  const isNamane = serviceName ? (serviceName.includes('나마네') || serviceName.includes('namane')) : false;

  if (!isNamane) {
    return (
      <div className="space-y-5 animate-fadeIn font-sans">
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-dark-800 text-slate-200 hover:bg-dark-750 hover:text-white border border-dark-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-brand-cyan" />
            유입 채널 및 키워드로 돌아가기
          </button>
          <span className="text-xs text-slate-400 font-mono">
            [미확인: 도메인 맞춤 키워드 실행 공략집 공시 없음]
          </span>
        </div>
        <div className="p-12 text-center rounded-2xl bg-dark-850 border border-dark-750 space-y-3">
          <FileText className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">
            해당 도메인의 맞춤형 키워드 실행 공략집(Playbook)이 등록되지 않았습니다.
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {serviceName ? `[${serviceName}]` : '해당 도메인'}은 외부 공시된 키워드 실행 공략 템플릿 및 자동화 코드 데이터가 존재하지 않아 가상 템플릿을 생성하지 않고 공란(Null) 처리합니다.
          </p>
        </div>
      </div>
    );
  }

  const [selectedRank, setSelectedRank] = useState<number>(initialRank);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    '1-0': true,
  });
  const [sampleFiles, setSampleFiles] = useState<UploadedSampleFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentPlaybook =
    KEYWORD_PLAYBOOKS.find((p) => p.rank === selectedRank) || KEYWORD_PLAYBOOKS[0];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleCheck = (rank: number, idx: number) => {
    const key = `${rank}-${idx}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSampleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const added: UploadedSampleFile[] = Array.from(files).map((f) => ({
      name: f.name,
      sizeBytes: f.size,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      uploadedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }));
    setSampleFiles((prev) => [...prev, ...added]);
    e.target.value = '';
  };

  const completedCount = currentPlaybook.checklist.filter(
    (_, idx) => checkedItems[`${currentPlaybook.rank}-${idx}`]
  ).length;

  const nextPlaybook = KEYWORD_PLAYBOOKS.find((p) => p.rank === currentPlaybook.rank + 1);
  const prevPlaybook = KEYWORD_PLAYBOOKS.find((p) => p.rank === currentPlaybook.rank - 1);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Top Header & Back Navigation (브랜드 중복 문구 및 점유율/국가명 제거) */}
      <div className="p-5 rounded-2xl bg-dark-900 border border-brand-cyan/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onBack}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-dark-800 text-slate-200 hover:bg-dark-750 hover:text-white border border-dark-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-brand-cyan" />
              유입 채널 및 키워드로 돌아가기
            </button>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40">
              {currentPlaybook.portal} • {currentPlaybook.channel}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/40">
              {currentPlaybook.impact}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            #{currentPlaybook.rank}. 키워드 점유 실행 공략집
          </h2>
          <p className="text-xs text-slate-300">
            <span className="font-bold text-cyan-300 mr-1.5">[{currentPlaybook.keyword}]</span>
            {currentPlaybook.oneLineWhy}
          </p>
        </div>

        {/* Progress & Next Step Box */}
        <div className="bg-dark-850 px-4 py-3 rounded-xl border border-dark-700 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-xs text-slate-400">실행 체크</div>
            <div className="text-lg font-black text-brand-emerald mt-0.5">
              {completedCount} / {currentPlaybook.checklist.length} 완료
            </div>
          </div>
          {nextPlaybook && (
            <button
              onClick={() => setSelectedRank(nextPlaybook.rank)}
              className="px-3.5 py-2 rounded-lg text-xs font-black bg-brand-purple hover:bg-brand-purple/90 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <span>다음: #{nextPlaybook.rank} {nextPlaybook.keyword}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. 1번~5번 키워드 탭 네비게이션 (점유율 % 및 국가명 삭제, 핵심만 표시) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {KEYWORD_PLAYBOOKS.map((item) => {
          const isSelected = item.rank === selectedRank;
          return (
            <button
              key={item.rank}
              onClick={() => setSelectedRank(item.rank)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-cyan/15 border-brand-cyan text-white shadow-md'
                  : 'bg-dark-900 border-dark-750 text-slate-300 hover:bg-dark-850 hover:border-dark-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded ${
                    isSelected
                      ? 'bg-brand-cyan text-dark-950'
                      : 'bg-dark-800 text-brand-purpleLight'
                  }`}
                >
                  {item.rank}번
                </span>
                <span className="text-[11px] font-bold text-brand-emerald">{item.impact}</span>
              </div>
              <div className="text-xs font-black text-white truncate">{item.keyword}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.portal}</div>
            </button>
          );
        })}
      </div>

      {/* 3. 메인 2단 실행 가이드 (STEP 1 콘텐츠 기고 + STEP 2 검색 태그 적용) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 좌측 7컬럼: STEP 1 실행 순서 & 복사용 템플릿 */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-dark-750">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-base font-black text-white">{currentPlaybook.part1Title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                {currentPlaybook.part1Badge}
              </span>
              <a
                href={currentPlaybook.part1TargetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-brand-cyan text-dark-950 hover:bg-brand-cyan/90 transition-colors"
              >
                <span>{currentPlaybook.part1TargetLabel}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* 3단계 핵심 실행 순서 */}
          <div className="space-y-2">
            {currentPlaybook.part1Steps.map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-dark-850 border border-dark-750 flex items-center gap-2.5 text-xs text-slate-200"
              >
                <span className="w-5 h-5 rounded-full bg-brand-cyan/20 text-brand-cyan font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>

          {/* 원클릭 복사 템플릿: 제목 */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">{currentPlaybook.templateTitleLabel}</span>
              <button
                onClick={() => handleCopy('title', currentPlaybook.templateTitleValue)}
                className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-dark-800 hover:bg-dark-750 text-brand-cyan border border-dark-700 cursor-pointer"
              >
                {copiedId === 'title' ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-brand-emerald" />
                    복사 완료
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    제목 복사
                  </>
                )}
              </button>
            </div>
            <div className="p-3 rounded-lg bg-dark-950 border border-dark-750 text-xs font-bold text-white select-all">
              {currentPlaybook.templateTitleValue}
            </div>
          </div>

          {/* 원클릭 복사 템플릿: 본문 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">{currentPlaybook.templateBodyLabel}</span>
              <button
                onClick={() => handleCopy('body', currentPlaybook.templateBodyValue)}
                className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-dark-800 hover:bg-dark-750 text-brand-cyan border border-dark-700 cursor-pointer"
              >
                {copiedId === 'body' ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-brand-emerald" />
                    본문 복사 완료
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    본문 복사
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-dark-950 border border-dark-750 text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed max-h-56 overflow-y-auto select-all">
              {currentPlaybook.templateBodyValue}
            </pre>
          </div>

          {/* 첨부용 이미지 파일 등록 (내 PC 파일) */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-brand-purpleLight" />
                첨부용 비교표 · 실물 카드 사진 등록 (내 PC 파일)
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  multiple
                  aria-label="첨부용 이미지 파일 선택"
                  className="hidden"
                  onChange={handleSampleUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purpleLight border border-brand-purple/40 cursor-pointer"
                >
                  + 파일 선택
                </button>
              </div>
            </div>

            {sampleFiles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {sampleFiles.map((f, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-dark-900 border border-dark-700 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {f.previewUrl ? (
                        <img
                          src={f.previewUrl}
                          alt={f.name}
                          className="w-8 h-8 rounded object-cover border border-dark-600 shrink-0"
                        />
                      ) : (
                        <FileText className="w-4 h-4 text-brand-cyan shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{f.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {(f.sizeBytes / 1024).toFixed(1)} KB • {f.uploadedAt}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSampleFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="p-1 text-slate-400 hover:text-purple-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 우측 5컬럼: STEP 2 검색 태그/코드 최적화 + 실행 완료 체크리스트 */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-dark-750">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-brand-emerald" />
                <h3 className="text-base font-black text-white">{currentPlaybook.part2Title}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                {currentPlaybook.part2Badge}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentPlaybook.part2Desc}
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">{currentPlaybook.codeBlockLabel}</span>
                <button
                  onClick={() => handleCopy('code', currentPlaybook.codeBlockValue)}
                  className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-dark-800 hover:bg-dark-750 text-brand-emerald border border-dark-700 cursor-pointer"
                >
                  {copiedId === 'code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-brand-emerald" />
                      복사 완료
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      코드 복사
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-dark-950 border border-dark-750 text-[11px] text-cyan-300 whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto select-all">
                {currentPlaybook.codeBlockValue}
              </pre>
            </div>
          </div>

          {/* 실행 완료 체크리스트 */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-dark-750">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
                실행 완료 체크리스트
              </h4>
              <span className="text-xs font-bold text-brand-emerald">
                {Math.round((completedCount / currentPlaybook.checklist.length) * 100)}%
              </span>
            </div>

            <div className="space-y-2">
              {currentPlaybook.checklist.map((item, idx) => {
                const isChecked = !!checkedItems[`${currentPlaybook.rank}-${idx}`];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCheck(currentPlaybook.rank, idx)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-2.5 text-xs transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-brand-emerald/10 border-brand-emerald/40 text-white font-bold'
                        : 'bg-dark-850 border-dark-750 text-slate-300 hover:bg-dark-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        isChecked
                          ? 'bg-brand-emerald border-brand-emerald text-dark-950'
                          : 'border-slate-500 bg-dark-900'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={isChecked ? 'line-through text-slate-300' : ''}>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. 하단 이전/다음 키워드 공략집 이동 바 */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-dark-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-brand-amber shrink-0" />
          <span>1번부터 5번까지 순서대로 템플릿을 복사해 즉시 실행할 수 있습니다.</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {prevPlaybook && (
            <button
              onClick={() => setSelectedRank(prevPlaybook.rank)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-dark-800 hover:bg-dark-750 text-slate-200 border border-dark-700 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>이전: #{prevPlaybook.rank} {prevPlaybook.keyword}</span>
            </button>
          )}
          {nextPlaybook ? (
            <button
              onClick={() => setSelectedRank(nextPlaybook.rank)}
              className="px-4 py-2 rounded-xl text-xs font-black bg-brand-cyan hover:bg-brand-cyan/90 text-dark-950 flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <span>다음 공략 실행 (#{nextPlaybook.rank} {nextPlaybook.keyword})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl text-xs font-black bg-brand-emerald hover:bg-brand-emerald/90 text-dark-950 flex items-center gap-1.5 cursor-pointer"
            >
              <span>전체 공략 확인 완료</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
