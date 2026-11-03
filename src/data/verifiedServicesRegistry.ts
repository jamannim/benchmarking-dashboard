import type { VerificationResult } from '../components/landing/UrlVerificationModal';
import { 
  CORPORATE_MASTER_DATASET, 
  getCorporateItemsByScale,
  type CorporateScale,
  type VerifiedServiceItem 
} from './corporateMasterDataset';

export type { CorporateScale, VerifiedServiceItem };

/**
 * 사전 검증된 대한민국 주요 기업 및 웹·앱 서비스 마스터 레지스트리
 * (대기업, 상장사, 중견기업, 플랫폼 유니콘, 중소기업 총망라)
 */
export const VERIFIED_SERVICES_REGISTRY: VerifiedServiceItem[] = CORPORATE_MASTER_DATASET;

// ── 한글 초성 및 가나다순 처리 유틸리티 ──

const CHOSUNG_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

/**
 * 한글 문자열에서 초성을 추출하는 함수
 * (예: "삼성전자" -> "ㅅㅅㅈㅈ", "엔플랫폼" -> "ㅇㅍㄹㅍ", "나마네" -> "ㄴㅁㄴ", "토스" -> "ㅌㅅ")
 */
export function getChosung(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const chosungIndex = Math.floor((code - 0xac00) / 588);
      result += CHOSUNG_LIST[chosungIndex];
    } else {
      result += text[i].toLowerCase();
    }
  }
  return result;
}

/**
 * 텍스트의 첫 음절 초성 자음 반환
 * (예: "엔플랫폼" -> "ㅇ", "토스" -> "ㅌ", "Samsung" -> "A-Z")
 */
export function getFirstInitialConsonant(text: string): string {
  const clean = text.trim();
  if (!clean) return '기타';
  const code = clean.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const chosungIndex = Math.floor((code - 0xac00) / 588);
    const initial = CHOSUNG_LIST[chosungIndex];
    // 쌍자음 통합 (ㄲ->ㄱ, ㄸ->ㄷ, ㅃ->ㅂ, ㅆ->ㅅ, ㅉ->ㅈ)
    if (initial === 'ㄲ') return 'ㄱ';
    if (initial === 'ㄸ') return 'ㄷ';
    if (initial === 'ㅃ') return 'ㅂ';
    if (initial === 'ㅆ') return 'ㅅ';
    if (initial === 'ㅉ') return 'ㅈ';
    return initial;
  }
  if (/[a-zA-Z]/.test(clean[0])) {
    return 'A-Z';
  }
  return '기타';
}

/**
 * 대표 초성 필터 목록
 */
export const INITIAL_CONSONANTS = [
  '전체',
  'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  'A-Z'
] as const;

export type InitialConsonant = typeof INITIAL_CONSONANTS[number];

/**
 * 전체 검증 서비스 목록을 가나다순으로 정렬하여 반환
 */
export function getAllVerifiedServicesSorted(): VerifiedServiceItem[] {
  return [...VERIFIED_SERVICES_REGISTRY].sort((a, b) => 
    a.serviceName.localeCompare(b.serviceName, 'ko-KR')
  );
}

/**
 * 초성 또는 특정 자음으로 필터링된 가나다순 목록 반환
 */
export function getVerifiedServicesByInitial(initial: string, scale?: CorporateScale | 'all'): VerifiedServiceItem[] {
  const baseList = scale && scale !== 'all' ? getCorporateItemsByScale(scale) : getAllVerifiedServicesSorted();
  if (!initial || initial === '전체') return baseList;
  return baseList.filter((item) => getFirstInitialConsonant(item.serviceName) === initial);
}

/**
 * 추천 / 인기 분석 서비스 목록 (가나다순)
 */
export function getPopularVerifiedServices(): VerifiedServiceItem[] {
  return VERIFIED_SERVICES_REGISTRY.filter((item) => item.isPopular).sort((a, b) =>
    a.serviceName.localeCompare(b.serviceName, 'ko-KR')
  );
}

/**
 * 키워드 기반 실시간 스마트 자동완성 검색 함수
 * (초성 검색, 영문, 국문, 도메인, 사업자번호 숫자 검색 지원 및 가나다순 정렬 반환)
 */
export function searchVerifiedServices(query: string, scale?: CorporateScale | 'all'): VerifiedServiceItem[] {
  const clean = query.trim().toLowerCase();
  const basePool = scale && scale !== 'all' ? getCorporateItemsByScale(scale) : VERIFIED_SERVICES_REGISTRY;

  if (!clean) {
    return [...basePool].sort((a, b) => a.serviceName.localeCompare(b.serviceName, 'ko-KR'));
  }

  const queryChosung = getChosung(clean);
  const digitsOnly = clean.replace(/[^0-9]/g, '');

  const matches = basePool.filter((item) => {
    // 1. 도메인 일치
    if (item.domain.toLowerCase().includes(clean)) return true;

    // 2. 서비스명 / 회사명 / 대표자명 일치
    if (item.serviceName.toLowerCase().includes(clean)) return true;
    if (item.companyName.toLowerCase().includes(clean)) return true;
    if (item.representative.toLowerCase().includes(clean)) return true;

    // 3. 초성(Chosung) 일치 (예: 'ㅇㅍㄹㅍ' -> '엔플랫폼', 'ㄴㅁㄴ' -> '나마네', 'ㅅㅅ' -> '삼성전자')
    const serviceChosung = getChosung(item.serviceName);
    const companyChosung = getChosung(item.companyName);
    if (serviceChosung.includes(clean) || serviceChosung.includes(queryChosung)) return true;
    if (companyChosung.includes(clean) || companyChosung.includes(queryChosung)) return true;

    // 4. 카테고리 일치
    if (item.category.toLowerCase().includes(clean)) return true;

    // 5. 사업자등록번호 일치 (하이픈 포함 또는 순수 숫자)
    if (item.businessNumber.includes(clean)) return true;
    if (digitsOnly.length >= 3 && item.businessNumber.replace(/[^0-9]/g, '').includes(digitsOnly)) return true;

    // 6. 별칭(Aliases) 일치
    if (item.aliases.some((alias) => alias.toLowerCase().includes(clean))) return true;

    return false;
  });

  return matches.sort((a, b) => a.serviceName.localeCompare(b.serviceName, 'ko-KR'));
}

/**
 * 도메인 기반 검증 서비스 단건 조회
 */
export function findVerifiedServiceByDomain(rawUrl: string): VerifiedServiceItem | undefined {
  const clean = rawUrl
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0];

  return VERIFIED_SERVICES_REGISTRY.find(
    (item) => item.domain.toLowerCase() === clean || item.aliases.includes(clean)
  );
}

/**
 * 검증된 서비스 객체를 대시보드 VerificationResult 규격으로 변환
 * (중간 모달/크롤링 지연 없이 즉시 로드 가능)
 */
export function convertVerifiedServiceToResult(service: VerifiedServiceItem): VerificationResult {
  return {
    domain: service.domain,
    inputUrl: `https://${service.domain}`,
    redirectUrl: `https://${service.domain}`,
    sourceUrl: `https://${service.domain}`,
    serviceName: service.serviceName,
    companyName: service.companyName,
    businessNumber: service.businessNumber,
    representative: service.representative,
    mailOrderReport: service.mailOrderReport,
    category: service.category,
    peerCompetitors: [],
    dataAvailability: {
      traffic: true,
      dart: service.isDartAudited,
      appStore: service.hasApp,
      payment: true,
    },
    isDartAudited: service.isDartAudited,
    disclosureType: service.disclosureType,
    hasApp: service.hasApp,
    appInfo: service.appInfo,
  };
}

export { getCorporateItemsByScale };
