/**
 * 출처 및 URL 정합성 사전 검증 원칙(Rule 13) 및 데이터 정합성 지침(Rule 14)을 준수하는 전역 출처 리졸버
 * 
 * [핵심 목적]
 * 1. 자사 도메인 오염 방지: 공시/공공데이터 출처 명칭이 기재되어 있음에도 링크 URL이 분석 대상 자사 사이트(inex.im, namanecard.com 등)로 연결되는 오류를 100% 원천 차단.
 * 2. 공시 기관 100% 실측 매핑: 금융정보분석원(FIU), DART, 공정거래위원회, 혁신의숲 등 공시 기관에 부합하는 실제 공적 조회 웹사이트 URL 반환.
 */

/**
 * 분석 대상 자사 도메인과 출처 URL 간의 동일성(오염 여부) 검사
 */
export function isTargetDomainPolluted(candidateUrl?: string, targetDomain?: string): boolean {
  if (!candidateUrl || !targetDomain) return false;

  const cleanTarget = targetDomain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];

  if (!cleanTarget) return false;

  const cleanCandidate = candidateUrl
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];

  return cleanCandidate === cleanTarget || cleanCandidate.endsWith(`.${cleanTarget}`);
}

/**
 * 출처 명칭(sourceName) 및 기업명에 기반한 공적 공시처 실측 URL 반환 함수
 */
export function resolveOfficialDisclosureSourceUrl(
  sourceName?: string,
  companyName?: string,
  targetDomain?: string,
  candidateUrl?: string
): string {
  const normSource = (sourceName || '').trim();
  const normCompany = (companyName || '').trim().replace(/\(주\)|주식회사/g, '').trim();

  // 1. 자사 도메인 오염 검사 및 구형 URL 보정
  if (candidateUrl && candidateUrl.includes('kofiu.go.kr/notification/notice.do')) {
    candidateUrl = candidateUrl.replace('kofiu.go.kr/notification/notice.do', 'kofiu.go.kr/kor/notification/notice.do');
  }
  const isPolluted = isTargetDomainPolluted(candidateUrl, targetDomain);

  // 2. 출처 기관명 기준 100% 실측 공공기관 URL 매핑 (Rule 13 준수)
  // 1) 금융정보분석원 (FIU) / 가상자산사업자 (VASP)
  if (/금융정보분석원|fiu|가상자산사업자|vasp|특정금융정보법/i.test(normSource)) {
    return 'https://www.kofiu.go.kr/kor/notification/notice.do';
  }

  // 2) 금융감독원 전자공시시스템 (DART)
  if (/dart|전자공시|감사보고서|금융감독원|fss/i.test(normSource)) {
    if (normCompany) {
      return `https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=${encodeURIComponent(normCompany)}`;
    }
    return 'https://dart.fss.or.kr/';
  }

  // 3) 공정거래위원회 가맹사업정보제공시스템
  if (/공정거래위원회|가맹사업|정보공개서|프랜차이즈|ftc/i.test(normSource)) {
    return 'https://franchise.ftc.go.kr/index.do';
  }

  // 4) 중소벤처기업부 / 혁신의숲 / 스타트업 DB
  if (/혁신의숲|innoforest/i.test(normSource)) {
    if (normCompany) {
      return `https://www.innoforest.co.kr/search?query=${encodeURIComponent(normCompany)}`;
    }
    return 'https://www.innoforest.co.kr/';
  }

  // 5) 더브이씨 (The VC)
  if (/더브이씨|thevc/i.test(normSource)) {
    return 'https://thevc.kr/';
  }

  // 6) 국민연금공단 공공데이터
  if (/국민연금|사업장\s*내역/i.test(normSource)) {
    return 'https://www.data.go.kr/data/3046071/openapi.do';
  }

  // 7) NICE평가정보
  if (/nice|나이스평가정보/i.test(normSource)) {
    return 'https://www.nicebizinfo.com/';
  }

  // 8) 잡코리아 (JobKorea) 기업정보
  if (/잡코리아|jobkorea/i.test(normSource)) {
    if (candidateUrl && candidateUrl.includes('jobkorea.co.kr')) {
      return candidateUrl;
    }
    if (normCompany) {
      return `https://www.jobkorea.co.kr/Search/?stext=${encodeURIComponent(normCompany)}`;
    }
    return 'https://www.jobkorea.co.kr/company/';
  }

  // 9) 국세청 홈택스
  if (/국세청|홈택스/i.test(normSource)) {
    return 'https://www.hometax.go.kr/';
  }

  // 3. candidateUrl이 오염되지 않은 유효한 외부 URL인 경우 허용
  if (candidateUrl && !isPolluted && /^https?:\/\//i.test(candidateUrl)) {
    return candidateUrl;
  }

  // 4. 폴백: 기본적으로 회사명이 있으면 DART 검색 페이지, 없으면 DART 메인
  if (normCompany) {
    return `https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=${encodeURIComponent(normCompany)}`;
  }
  return 'https://dart.fss.or.kr/';
}

/**
 * 출처 기관에 부합하는 BrandLogo 키 식별
 */
export function resolveSourceBrandKey(sourceName?: string, isDartAudited?: boolean): string {
  const norm = (sourceName || '').toLowerCase();
  if (norm.includes('금융정보분석원') || norm.includes('fiu') || norm.includes('vasp')) return 'fiu';
  if (norm.includes('공정위') || norm.includes('가맹사업') || norm.includes('ftc')) return 'ftc';
  if (norm.includes('dart') || norm.includes('전자공시') || norm.includes('감사보고서') || isDartAudited) return 'dart';
  if (norm.includes('혁신의숲') || norm.includes('innoforest')) return 'innoforest';
  if (norm.includes('중소벤처기업부') || norm.includes('중기부')) return 'mss';
  if (norm.includes('thevc') || norm.includes('더브이씨')) return 'thevc';
  if (norm.includes('nice') || norm.includes('나이스')) return 'nice';
  if (norm.includes('잡코리아') || norm.includes('jobkorea')) return 'jobkorea';
  if (norm.includes('사람인')) return 'saramin';
  return isDartAudited ? 'dart' : 'nice';
}
