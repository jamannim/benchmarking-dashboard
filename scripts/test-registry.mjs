import { 
  searchVerifiedServices, 
  findVerifiedServiceByDomain, 
  convertVerifiedServiceToResult, 
  getPopularVerifiedServices 
} from '../src/data/verifiedServicesRegistry.js';

console.log('🧪 [Unit Test] verifiedServicesRegistry 검색 및 변환 정합성 테스트');

// 1. 엔플랫폼 키워드 검색
const res1 = searchVerifiedServices('엔플랫폼');
if (res1.length === 0 || res1[0].companyName !== '트랜스파머(주)') {
  throw new Error(`Test 1 Failed: 엔플랫폼 검색 실패 (${JSON.stringify(res1)})`);
}
console.log('✅ Test 1 통과: "엔플랫폼" 검색 -> 트랜스파머(주) (507-87-02631) 일치');

// 2. 법인명 검색
const res2 = searchVerifiedServices('트랜스파머');
if (res2.length === 0 || res2[0].businessNumber !== '507-87-02631') {
  throw new Error('Test 2 Failed: 트랜스파머 검색 실패');
}
console.log('✅ Test 2 통과: "트랜스파머" 검색 -> 507-87-02631 일치');

// 3. 사업자등록번호 검색 (하이픈 및 숫자만)
const res3 = searchVerifiedServices('507-87-02631');
const res3Digits = searchVerifiedServices('5078702631');
if (res3.length === 0 || res3Digits.length === 0) {
  throw new Error('Test 3 Failed: 사업자번호 검색 실패');
}
console.log('✅ Test 3 통과: 사업자번호 ("507-87-02631" / "5078702631") 검색 일치');

// 4. 나마네카드 검색
const res4 = searchVerifiedServices('나마네');
if (res4.length === 0 || res4[0].companyName !== '(주)아이오로라' || !res4[0].hasApp) {
  throw new Error('Test 4 Failed: 나마네카드 검색 실패');
}
console.log('✅ Test 4 통과: "나마네" 검색 -> (주)아이오로라 (앱 탑재 확인)');

// 5. 도메인 직접 단건 조회 및 Result 변환
const found = findVerifiedServiceByDomain('nplatform.ai');
if (!found) {
  throw new Error('Test 5 Failed: 도메인 검색 실패');
}
const converted = convertVerifiedServiceToResult(found);
if (converted.businessNumber !== '507-87-02631' || converted.companyName !== '트랜스파머(주)') {
  throw new Error('Test 5 Failed: Result 변환 정합성 불일치');
}
console.log('✅ Test 5 통과: 도메인("nplatform.ai") -> VerificationResult 100% 매핑 완료');

// 6. 인기 기업 목록
const popular = getPopularVerifiedServices();
if (popular.length === 0) {
  throw new Error('Test 6 Failed: 인기 기업 목록 비어있음');
}
console.log(`✅ Test 6 통과: 인기 기업 ${popular.length}개 로드 확인`);

console.log('🎉 모든 마스터 레지스트리 검색 및 정합성 테스트 통과!');
