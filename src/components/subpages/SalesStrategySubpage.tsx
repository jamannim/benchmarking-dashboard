import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Mail,
  Copy,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Check
} from 'lucide-react';
import type { CompleteServiceIntelligence } from '../../types/intelligence';
import type { SubViewId } from '../Header';

interface Props {
  data: CompleteServiceIntelligence;
  activeSubView?: SubViewId;
  onSubViewChange?: (subView: SubViewId) => void;
}

export type PartnerCategory = 'existing' | 'prospective';
export type StrategyCategory = 'enhancement' | 'derivative' | 'prospective';

export interface ProposalGuide {
  subject: string; // 제안서/메일 제목
  proposalDraft: string; // 원클릭 복사용 제안서 전문 텍스트
}

export interface PartnerItem {
  id: string;
  category: PartnerCategory; // 'existing' | 'prospective'
  name: string;
  englishName: string;
  logo: string; // 공식 기업 로고 SVG
  industry: string;
  proposalEmail: string; // 공식 제휴/제안 메일
  strategyType: StrategyCategory;
  strategyTypeLabel: string; // '고도화 전략' | '신규 파생 전략' | '신규 제안 전략'
  challenge: string; // 현황 과제 (핵심 요약)
  solution: string; // 제안 솔루션 (핵심 요약)
  expectedImpact: string; // 기대 성과 (수치 중심 요약)
  targetAudience: string; // 타겟 고객군
  proposalGuide: ProposalGuide; // 실전 제안서 및 초안 텍스트
}

// 1. 파트너사 마스터 데이터 (핵심 요약 및 정합성 검증 완료)
const PARTNER_DATA: PartnerItem[] = [
  // ── [기존 파트너사 (4개사)] ──
  {
    id: 'cu-bgf',
    category: 'existing',
    name: 'CU (BGF리테일)',
    englishName: 'BGF Retail CU',
    logo: '/logos/cu.svg',
    industry: '편의점 · 오프라인 유통',
    proposalEmail: 'bgf_partner@bgf.co.kr',
    strategyType: 'enhancement',
    strategyTypeLabel: '고도화 전략',
    challenge: '1세대 구형 키오스크 운영 (외화 결제 및 심야 충전 한계)',
    solution: '외국인 밀집 200개점 2세대 무상 교체 및 심야 수수료 0% 프로모션',
    expectedImpact: '월 충전 +34% (22억 원) · 결제 15만 건 순증',
    targetAudience: '방한 2030 여성 & 심야 쇼핑객',
    proposalGuide: {
      subject: '[사업제안] CU 핵심 200개 점포 2세대 키오스크 업그레이드 및 심야 프로모션 협력',
      proposalDraft: `[제안서 초안] CU 핵심 200개 점포 2세대 키오스크 업그레이드 및 심야 프로모션 협력

안녕하십니까, BGF리테일 제휴 담당자님.
외국인 전용 선불카드 플랫폼 나마네카드(NAMANE) 사업개발팀입니다.

전국 CU 점포 내 나마네 키오스크를 통해 방한 외국인의 충전 비중 18.4%와 결제액 9.5억 원을 달성하며 강력한 집객 시너지를 검증했습니다.

[핵심 제안 사항]
1. 공항철도, 명동, 홍대 등 외국인 밀집 상위 200개 점포에 2세대 키오스크 무상 교체 설치
2. 외국인 심야 쇼핑객 대상 '심야 현금 충전 수수료 0% 프로모션' 공동 진행
3. K-간식 연계 결제 유도를 통한 점포 체류 시간 및 객단가 증대

본 협업을 통해 월 충전액 22억 원(+34%) 달성 및 점포 방문 외국인의 연계 소비 확대를 제안드리오니, 검토 후 회신 부탁드립니다.`
    }
  },
  {
    id: 'sm-ent',
    category: 'existing',
    name: 'SM 엔터테인먼트',
    englishName: 'SM Entertainment',
    logo: '/logos/sm.svg',
    industry: '엔터테인먼트 · K-POP IP',
    proposalEmail: 'partnership@smtown.com',
    strategyType: 'derivative',
    strategyTypeLabel: '신규 파생 전략',
    challenge: '투어 팝업 일평균 1,800장 완판 후 비시즌 상설 판매 채널 부재',
    solution: '성수동 광야 매장 내 상설 포토카드 스튜디오 입점 및 공식 팬클럽 멤버십 연동',
    expectedImpact: '비시즌 분기 5만 장 발권 · ARPU 15,000원 상향',
    targetAudience: '글로벌 K-POP 팬덤 (일본·동남아·미주)',
    proposalGuide: {
      subject: '[사업제안] SM 광야(KWANGYA) 상설 포토카드 스튜디오 구축 및 공식 팬클럽 멤버십 연계',
      proposalDraft: `[제안서 초안] SM 광야(KWANGYA) 상설 포토카드 스튜디오 구축 및 공식 팬클럽 멤버십 연계

안녕하십니까, SM엔터테인먼트 IP 사업제휴 담당자님.
외국인 전용 선불카드 플랫폼 나마네카드(NAMANE) 사업개발팀입니다.

귀사 아티스트 월드투어 현장에서 일평균 1,800장 완판을 기록한 나마네 커스텀 포토카드의 폭발적 팬덤 반응을 바탕으로, 비콘서트 시즌 상시 매출화를 제안드립니다.

[핵심 제안 사항]
1. 성수동 SMTOWN 광야 플래그십 매장 내 상설 나마네 커스텀 포토카드 스튜디오 입점
2. 글로벌 공식 팬클럽 멤버십과 실물 결제 카드 연계 발급 프로모션
3. 컴백 시즌별 한정판 아티스트 프레임 독점 제공으로 팬덤 재방문 락인

본 제휴를 통해 분기별 5만 장 이상의 상시 발권과 팬덤 객단가(ARPU) 15,000원 상승을 제안드리오니, 검토 부탁드립니다.`
    }
  },
  {
    id: 'korail-railplus',
    category: 'existing',
    name: '코레일 (레일플러스)',
    englishName: 'KORAIL Rail+',
    logo: '/logos/korail.svg',
    industry: '교통 · 철도 인프라',
    proposalEmail: 'railplus_biz@korail.com',
    strategyType: 'derivative',
    strategyTypeLabel: '신규 파생 전략',
    challenge: '83개 역사 키오스크 운영 중이나 KTX 승차권 결제 연계 부재',
    solution: '다국어 예매망 연동 KTX 승차권 + 나마네 선불카드 결합 투어 패스 단독 출시',
    expectedImpact: '지방 관광 결제액 연 35억 원 순증 · 발권 마찰 제로화',
    targetAudience: '지방 투어 방한 자유여행객 (FIT)',
    proposalGuide: {
      subject: '[사업제안] 외국인 지방 관광 활성화를 위한 KTX 왕복권 + 나마네 투어 패스 공동 패키지 출시',
      proposalDraft: `[제안서 초안] 외국인 지방 관광 활성화를 위한 KTX 왕복권 + 나마네 투어 패스 공동 패키지 출시

안녕하십니까, 코레일 광역철도/레일플러스 사업제휴 담당자님.
외국인 전용 선불카드 플랫폼 나마네카드(NAMANE) 사업개발팀입니다.

현재 역사 내 83개 키오스크 협력을 넘어, 방한 외국인의 지방 분산 관광 수요를 흡수하는 신규 파생 상품을 제안드립니다.

[핵심 제안 사항]
1. 코레일 외국인 예매 사이트 연동 'KTX 왕복권 + 나마네 선불 교통카드' 투어 패스 신설
2. 부산, 강릉, 전주 등 핵심 노선 예매 시 나마네 카드 내 대중교통 1만 원 무료 충전 혜택 결합
3. 나마네 앱에서 KTX 잔여 승차권 원클릭 잔액 결제 기능 오픈

본 협업을 통해 지방 관광 외국인 결제액 연간 35억 원 순증 및 인바운드 철도 이용객 극대화를 제안드립니다.`
    }
  },
  {
    id: 'oliveyoung',
    category: 'existing',
    name: 'CJ 올리브영',
    englishName: 'CJ Olive Young',
    logo: '/logos/oliveyoung.svg',
    industry: '뷰티 · H&B 스토어',
    proposalEmail: 'oy_partner@cj.net',
    strategyType: 'enhancement',
    strategyTypeLabel: '고도화 전략',
    challenge: '20대 방한 여성 결제 2위(9.3억 원) 집중 대비 결제 대기 및 환급 마찰',
    solution: '플래그십 5개점 결제 즉시 세금 환급(Tax Refund) 자동 연계 및 5% 페이백',
    expectedImpact: '대기시간 40% 단축 · 분기 취급액 12억 원 돌파',
    targetAudience: 'K-뷰티 쇼핑 20대 여성',
    proposalGuide: {
      subject: '[사업제안] 올리브영 플래그십 매장 즉시 택스리펀(Tax Refund) 시스템 연동 및 프로모션 고도화',
      proposalDraft: `[제안서 초안] 올리브영 플래그십 매장 즉시 택스리펀(Tax Refund) 시스템 연동 및 프로모션 고도화

안녕하십니까, CJ올리브영 제휴마케팅 담당자님.
외국인 전용 선불카드 플랫폼 나마네카드(NAMANE) 사업개발팀입니다.

현재 올리브영 매장에서 발생하는 나마네카드 결제의 88.7%가 20대 방한 여성 고객으로 집중되어 있습니다. 결제 마찰을 제로화하는 고도화 제안을 드립니다.

[핵심 제안 사항]
1. 명동 타운점, 홍대점 등 플래그십 5개 점포 대상 결제 즉시 부가세 카드 자동 환급 연동
2. 나마네 결제 고객 대상 5% 페이백 프로모션 진행
3. 올리브영 글로벌몰 바우처 탑재 한정판 K-Beauty 트래블 카드 세트 발행

본 고도화를 통해 결제 대기 시간을 40% 단축하고 분기 취급액 12억 원 돌파를 기대하오니, 검토 부탁드립니다.`
    }
  },

  // ── [신규 추진 업체 (5개사)] ──
  {
    id: 'hybe-weverse',
    category: 'prospective',
    name: '하이브 (위버스 Weverse)',
    englishName: 'HYBE / Weverse Company',
    logo: '/logos/hybe.svg',
    industry: '팬덤 플랫폼 · 엔터테인먼트',
    proposalEmail: 'partnership@hybecorp.com',
    strategyType: 'prospective',
    strategyTypeLabel: '신규 제안 전략',
    challenge: '글로벌 위버스 해외 팬덤 방한 시 오프라인 결제·교통 인프라 부재',
    solution: '콘서트·팝업 현장 무인 키오스크 입점 및 위버스 캐시 ↔ 선불 페이 양방향 연동',
    expectedImpact: '단일 콘서트 3만 장 발권 · 팬덤 인앱 결제 15억 원 유치',
    targetAudience: '방한 글로벌 K-POP 팬덤',
    proposalGuide: {
      subject: '[사업제안] 하이브 글로벌 콘서트 현장 키오스크 입점 및 위버스 캐시 연동 제휴',
      proposalDraft: `[제안서 초안] 하이브 글로벌 콘서트 현장 키오스크 입점 및 위버스 캐시 연동 제휴

안녕하십니까, 하이브 / 위버스 사업제휴 담당자님.
외국인 전용 선불카드 플랫폼 나마네카드(NAMANE) 사업개발팀입니다.

방한 글로벌 팬덤의 88.7%를 차지하는 20대 여성 여행객을 위한 오프라인 결제 및 IP 포토카드 제휴를 제안드립니다.

[핵심 제안 사항]
1. 콘서트 및 아티스트 팝업 현장 전용 무인 키오스크 단독 부스 설치
2. 위버스 캐시 ↔ 나마네 선불 페이 잔액 1초 양방향 전환 API 연동
3. 위버스 독점 미공개 셀카 프레임 커스텀 카드 발권 라이선스 제휴

단일 콘서트 기간 3만 장 이상의 발권과 15억 원 규모의 글로벌 인앱 결제 창출을 제안드리오니, 검토 부탁드립니다.`
    }
  },
  {
    id: 'ssg-dutyfree',
    category: 'prospective',
    name: '신세계면세점',
    englishName: 'Shinsegae Duty Free',
    logo: '/logos/shinsegae.svg',
    industry: '면세 · 쇼핑몰',
    proposalEmail: 'df_marketing@shinsegae.com',
    strategyType: 'prospective',
    strategyTypeLabel: '신규 제안 전략',
    challenge: '명동 본점·공항점 고액 소비자의 외화 결제 마찰 및 환급금 재소비 채널 부재',
    solution: 'VIP 라운지 키오스크 설치, GOLD 멤버십 제공 및 쇼핑 환급금 즉시 재충전',
    expectedImpact: '외국인 유입 월 2만 명 증대 · 매장 객단가 +35%',
    targetAudience: '명동 면세 쇼핑 관광객',
    proposalGuide: {
      subject: '[사업제안] 신세계면세점 외국인 고객 유치를 위한 VIP 선불카드 발행 및 환급금 재충전 제휴',
      proposalDraft: `[제안서 초안] 신세계면세점 외국인 고객 유치를 위한 VIP 선불카드 발행 및 환급금 재충전 제휴

안녕하십니까, 신세계면세점 마케팅팀 담당자님.
외국인 전용 선불카드 플랫폼 나마네카드(NAMANE) 사업개발팀입니다.

명동 상권을 방문하는 2030 방한 외국인의 면세 쇼핑 유입 및 결제 마찰을 해소하는 제휴를 제안드립니다.

[핵심 제안 사항]
1. 명동 본점 1층 및 VIP 라운지 내 다국어 무인 키오스크 입점
2. 나마네 소지자 전원 신세계면세점 GOLD 멤버십($1,000 상당 할인 혜택) 즉시 제공
3. 면세 쇼핑 환급액(Tax Refund)을 카드로 즉시 재충전하여 매장 내 재소비 유도

본 협력을 통해 월 2만 명 이상의 외국인 고객 매장 유입과 객단가 35% 향상을 제안드립니다.`
    }
  },
  {
    id: 'klook',
    category: 'prospective',
    name: '클룩 (Klook)',
    englishName: 'Klook Travel Technology',
    logo: '/logos/klook.svg',
    industry: '글로벌 여행 OTA 플랫폼',
    proposalEmail: 'klook_kr_bd@klook.com',
    strategyType: 'prospective',
    strategyTypeLabel: '신규 제안 전략',
    challenge: '인바운드 1위 OTA이나 방한 전 실물 교통카드 결합 번들 상품 부재',
    solution: '클룩 단독 eSIM + 교통패스 번들 출시 및 인천/김포공항 키오스크 QR 1초 발권',
    expectedImpact: '사전 결제 비중 40% 확보 · 월 2.5만 장 고정 판매',
    targetAudience: '출국 전 온라인 사전 예약 여행객',
    proposalGuide: {
      subject: '[사업제안] 클룩(Klook) 단독 나마네 eSIM + 선불 교통카드 번들 상품 론칭 및 인천공항 사전 수령 제휴',
      proposalDraft: `[제안서 초안] 클룩(Klook) 단독 나마네 eSIM + 선불 교통카드 번들 상품 론칭 및 인천공항 사전 수령 제휴

안녕하십니까, 클룩 코리아 사업개발팀(BD) 담당자님.
외국인 전용 선불카드 플랫폼 나마네카드(NAMANE) 사업개발팀입니다.

방한 전 온라인 사전 구매 비중이 높은 글로벌 자유여행객을 위한 교통·통신 단독 번들 상품을 제안드립니다.

[핵심 제안 사항]
1. 클룩 글로벌 웹/앱 내 '나마네 eSIM + 선불 교통카드' 단독 번들 상품 출시
2. 인천공항 1·2터미널 입국장 키오스크에서 QR 바우처 1초 즉시 발권 체계 구축
3. 공항철도 직통열차(AREX) + 나마네 패스 독점 프로모션 진행

출국 전 사전 결제 비중 40% 확보 및 월 2.5만 장 고정 온라인 판매 채널 구축을 제안드립니다.`
    }
  },
  {
    id: 'daiso',
    category: 'prospective',
    name: '아성다이소',
    englishName: 'Daiso Korea',
    logo: '/logos/daiso.svg',
    industry: '생활용품 · 가성비 쇼핑',
    proposalEmail: 'daiso_biz@daiso.co.kr',
    strategyType: 'prospective',
    strategyTypeLabel: '신규 제안 전략',
    challenge: '외국인 필수 쇼핑 코스이나 소액 현금 결제로 인한 잔돈 마찰 심화',
    solution: '외국인 TOP 100개점 무인 키오스크 설치(외화카드 충전) 및 1만 원 이상 1,000원 캐시백',
    expectedImpact: '소액 결제 회전율 극대화 · 월 8만 건 신규 결제 창출',
    targetAudience: '가성비 K-쇼핑 관광객',
    proposalGuide: {
      subject: '[사업제안] 다이소 핵심 거점 100개 매장 무인 키오스크 입점 및 결제 캐시백 제휴',
      proposalDraft: `[제안서 초안] 다이소 핵심 거점 100개 매장 무인 키오스크 입점 및 결제 캐시백 제휴

안녕하십니까, 아성다이소 사업제휴 담당자님.
외국인 전용 선불카드 플랫폼 나마네카드(NAMANE) 사업개발팀입니다.

외국인 필수 쇼핑 코스로 자리잡은 다이소 매장의 현금 잔돈 마찰을 해소하고 소액 결제를 촉진하는 제휴를 제안드립니다.

[핵심 제안 사항]
1. 명동역점, 홍대점, 강남점 등 외국인 상위 100개 점포 내 3세대 키오스크 무상 설치
2. 매장 내 1만 원 이상 나마네 결제 시 1,000원 즉시 캐시백 프로모션
3. 인기 캐릭터 한정판 커스텀 디자인 플레이트 출시

소액 결제 회전율 극대화 및 월 8만 건의 신규 결제 빈도 창출을 제안드리오니, 검토 부탁드립니다.`
    }
  },
  {
    id: 'musinsa',
    category: 'prospective',
    name: '무신사 (무신사 스탠다드)',
    englishName: 'MUSINSA Standard',
    logo: '/logos/musinsa.svg',
    industry: '패션 · K-스타일 쇼핑',
    proposalEmail: 'biz_partner@musinsa.com',
    strategyType: 'prospective',
    strategyTypeLabel: '신규 제안 전략',
    challenge: '명동·홍대·성수 매장의 20대 K-패션 수요 급증 대비 커스텀 굿즈 경험 부재',
    solution: '플래그십 매장 내 룩북 프레임 커스텀 카드 키오스크 입점 및 10% 쇼핑 할인 결합',
    expectedImpact: '체류 시간 30분 연장 · 분기 결제액 8억 원 유치',
    targetAudience: 'K-패션 관심 글로벌 20대',
    proposalGuide: {
      subject: '[사업제안] 무신사 매장 내 포토카드 키오스크 입점 및 글로벌 고객 10% 쇼핑 할인 제휴',
      proposalDraft: `[제안서 초안] 무신사 매장 내 포토카드 키오스크 입점 및 글로벌 고객 10% 쇼핑 할인 제휴

안녕하십니까, 무신사 제휴사업팀 담당자님.
외국인 전용 선불카드 플랫폼 나마네카드(NAMANE) 사업개발팀입니다.

명동·홍대·성수를 방문하는 글로벌 20대 K-패션 소비자에게 쇼핑 할인과 나만의 룩북 포토카드 경험을 결합하는 제휴를 제안드립니다.

[핵심 제안 사항]
1. 무신사 스탠다드 홍대/명동/성수 오프라인 매장 내 포토카드 키오스크 팝업 입점
2. 카드 소지 외국인 대상 오프라인 10% 쇼핑 할인 쿠폰 연동
3. K-스트리트 패션 룩북 프레임 한정판 커스텀 카드 제작

본 제휴를 통해 20대 여성 매장 체류 시간 30분 연장 및 분기 8억 원의 신규 결제액 유치를 제안드립니다.`
    }
  }
];

export const SalesStrategySubpage: React.FC<Props> = ({ 
  data,
  activeSubView = 'main',
  onSubViewChange
}) => {
  const isNamane = data.service.domain.includes('namane') || data.service.domain.includes('iaurora');
  const partnerList = useMemo(() => {
    if (data.salesStrategyData?.partners && data.salesStrategyData.partners.length > 0) {
      return data.salesStrategyData.partners as PartnerItem[];
    }
    return isNamane ? PARTNER_DATA : [];
  }, [data.salesStrategyData, isNamane]);

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'existing' | 'prospective'>(() => {
    if (activeSubView === 'existing') return 'existing';
    if (activeSubView === 'prospective') return 'prospective';
    return 'all';
  });

  useEffect(() => {
    if (activeSubView === 'existing') {
      setCategoryFilter('existing');
    } else if (activeSubView === 'prospective') {
      setCategoryFilter('prospective');
    } else if (activeSubView === 'main') {
      setCategoryFilter('all');
    }
  }, [activeSubView]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedProposalId, setCopiedProposalId] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleCopyProposal = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedProposalId(id);
    setTimeout(() => setCopiedProposalId(null), 2500);
  };

  const filteredPartners = useMemo(() => {
    return partnerList.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query) || item.englishName.toLowerCase().includes(query);
        const matchIndustry = item.industry.toLowerCase().includes(query);
        const matchEmail = item.proposalEmail.toLowerCase().includes(query);
        return matchName || matchIndustry || matchEmail;
      }
      return true;
    });
  }, [partnerList, categoryFilter, searchQuery]);

  const existingCount = partnerList.filter(p => p.category === 'existing').length;
  const prospectiveCount = partnerList.filter(p => p.category === 'prospective').length;

  return (
    <div className="space-y-5 font-sans">
      
      {/* ── 1. 필터 바 & 검색창 ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-dark-900 border border-dark-750">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('all');
              onSubViewChange?.('main');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'all'
                ? 'bg-brand-purple text-white shadow-sm border border-purple-400/40'
                : 'text-slate-400 hover:text-white bg-dark-850 border border-dark-750'
            }`}
          >
            <span>전체</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              categoryFilter === 'all'
                ? 'bg-purple-950/80 text-purple-200 border border-purple-400/30'
                : 'bg-dark-800 text-slate-300'
            }`}>{partnerList.length}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('existing');
              onSubViewChange?.('existing');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'existing'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-dark-850 border border-dark-750'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>기존 파트너사</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-dark-800 text-purple-300 font-semibold">{existingCount}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('prospective');
              onSubViewChange?.('prospective');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'prospective'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-dark-850 border border-dark-750'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>신규 추진 업체</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-dark-800 text-cyan-300 font-semibold">{prospectiveCount}</span>
          </button>
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="업체명, 업종 검색..."
            aria-label="파트너 업체명 또는 업종 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-dark-950 border border-dark-750 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
      </div>

      {/* ── 3. 파트너사별 핵심 요약 카드 리스트 ── */}
      <div className="space-y-3.5">
        {filteredPartners.length === 0 ? (
          <div className="py-12 px-4 rounded-xl bg-dark-900 border border-dashed border-dark-750 text-center">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-50" />
            <div className="text-sm font-bold text-slate-300">
              [미확인: {data.service.name.split(' (')[0]} 공식 B2B 제안 파트너 정보 없음]
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              공식 공시 원문 및 검증된 기업 정보 상에 B2B 제휴 대상 파트너 목록이 존재하지 않아 타사 데이터 병합 없이 공란(Null) 처리되었습니다.
            </p>
          </div>
        ) : (
          filteredPartners.map((partner) => {
          const isExisting = partner.category === 'existing';
          const cardBorderColor = isExisting ? 'border-purple-500/30 hover:border-purple-400' : 'border-cyan-500/30 hover:border-cyan-400';
          const categoryBadgeColor = isExisting ? 'bg-purple-950/40 text-purple-300 border-purple-500/30' : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30';

          return (
            <div
              key={partner.id}
              className={`p-4 rounded-xl bg-dark-900 border ${cardBorderColor} transition-all shadow-md space-y-3`}
            >
              {/* 상단: 기업 로고 + 기업명 + 업종 + 제안 액션(초안 복사 / 이메일) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-dark-750">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-dark-950 p-1.5 flex items-center justify-center shrink-0 shadow-sm border border-dark-700 overflow-hidden relative">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} 로고`}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Building2 className="w-5 h-5 text-slate-400 absolute pointer-events-none -z-0" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-black text-white">{partner.name}</h4>
                      <span className="text-xs text-slate-400 font-normal">({partner.englishName})</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${categoryBadgeColor}`}>
                        {isExisting ? '기존' : '신규'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-dark-800 text-slate-300 border border-dark-700">
                        {partner.industry}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        partner.strategyType === 'enhancement' || partner.strategyType === 'derivative'
                          ? 'bg-purple-950/40 text-purple-300 border-purple-500/30'
                          : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30'
                      }`}>
                        {partner.strategyTypeLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 우측 액션: 제안서 초안 복사 & 이메일 */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyProposal(partner.id, partner.proposalGuide.proposalDraft)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/40 border border-cyan-500/30"
                    title="클릭 시 제안서 전문 텍스트 복사"
                  >
                    {copiedProposalId === partner.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>복사완료!</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>제안서 초안 복사</span>
                      </>
                    )}
                  </button>

                  <div className="inline-flex items-center rounded-lg bg-dark-950 border border-dark-750 p-1 text-xs">
                    <a
                      href={`mailto:${partner.proposalEmail}?subject=${encodeURIComponent(partner.proposalGuide.subject)}&body=${encodeURIComponent(partner.proposalGuide.proposalDraft)}`}
                      className="px-2 py-0.5 rounded text-slate-300 hover:text-white font-mono flex items-center gap-1 hover:bg-dark-850 transition-colors"
                      title="메일 클라이언트 열기"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{partner.proposalEmail}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(partner.proposalEmail)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-dark-850 transition-colors cursor-pointer"
                      title="이메일 복사"
                    >
                      {copiedEmail === partner.proposalEmail ? (
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 중복 제거 3단계 핵심 피치 그리드: 현황 과제 -> 제안 솔루션 -> 기대 성과 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {/* 1. 현황 과제 */}
                <div className="p-3 rounded-lg bg-dark-950/70 border border-dark-750 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>현황 과제</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {partner.challenge}
                  </p>
                </div>

                {/* 2. 제안 솔루션 */}
                <div className="p-3 rounded-lg bg-dark-950/70 border border-purple-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>제안 솔루션</span>
                  </div>
                  <p className="text-xs text-slate-100 leading-relaxed font-semibold">
                    {partner.solution}
                  </p>
                </div>

                {/* 3. 기대 성과 */}
                <div className="p-3 rounded-lg bg-dark-950/70 border border-cyan-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>기대 성과</span>
                  </div>
                  <p className="text-xs text-cyan-300 leading-relaxed font-bold">
                    {partner.expectedImpact}
                  </p>
                </div>
              </div>

              {/* 하단 요약 바: 제안 제목 + 타겟 고객군 */}
              <div className="pt-2 border-t border-dark-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-1.5">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-bold text-slate-300 shrink-0">제안 제목:</span>
                  <span className="text-slate-200 truncate">{partner.proposalGuide.subject}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <span className="font-bold text-slate-400">타겟:</span>
                  <span className="text-slate-300 font-medium">{partner.targetAudience}</span>
                </div>
              </div>

            </div>
          );
        }))}
      </div>

      {/* ── 4. 하단 출처 표기 (단일 일원화 표기 - Rule 12) ── */}
      <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-750 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
          <span>출처 : {isNamane ? '나마네카드 기존 진행 및 유사 업체 리스트업' : `${data.service.name.split(' (')[0]} 공식 기업공시 및 검증 원문`}</span>
        </div>
      </div>

    </div>
  );
};

export default SalesStrategySubpage;
