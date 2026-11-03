import { 
  searchVerifiedServices, 
  findVerifiedServiceByDomain, 
  convertVerifiedServiceToResult, 
  getPopularVerifiedServices,
  getAllVerifiedServicesSorted,
  getVerifiedServicesByInitial,
  getChosung
} from '../src/data/verifiedServicesRegistry.js';

console.log('🧪 [Unit Test] verifiedServicesRegistry 검색, 초성 및 가나다 정렬 정합성 테스트');

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

// 3. 초성 검색 테스트 (ㅇㅍㄹㅍ -> 엔플랫폼, ㄴㅁㄴ -> 나마네카드, ㅌㅅ -> 토스)
const resChosung1 = searchVerifiedServices('ㅇㅍㄹㅍ');
if (resChosung1.length === 0 || !resChosung1.some(i => i.domain === 'nplatform.ai')) {
  throw new Error('Test 3-1 Failed: 초성 "ㅇㅍㄹㅍ" 검색 실패');
}
console.log('✅ Test 3-1 통과: 초성 "ㅇㅍㄹㅍ" -> 엔플랫폼(nplatform.ai) 매칭');

const resChosung2 = searchVerifiedServices('ㄴㅁㄴ');
if (resChosung2.length === 0 || !resChosung2.some(i => i.domain === 'namanecard.com')) {
  throw new Error('Test 3-2 Failed: 초성 "ㄴㅁㄴ" 검색 실패');
}
console.log('✅ Test 3-2 통과: 초성 "ㄴㅁㄴ" -> 나마네카드(namanecard.com) 매칭');

const resChosung3 = searchVerifiedServices('ㅌㅅ');
if (resChosung3.length === 0 || !resChosung3.some(i => i.domain === 'toss.im')) {
  throw new Error('Test 3-3 Failed: 초성 "ㅌㅅ" 검색 실패');
}
console.log('✅ Test 3-3 통과: 초성 "ㅌㅅ" -> 토스(toss.im) 매칭');

// 4. 가나다순 전체 정렬 테스트
const allSorted = getAllVerifiedServicesSorted();
if (allSorted.length < 30) {
  throw new Error(`Test 4 Failed: 등록 기업 수 부족 (${allSorted.length}개)`);
}
for (let i = 0; i < allSorted.length - 1; i++) {
  if (allSorted[i].serviceName.localeCompare(allSorted[i + 1].serviceName, 'ko-KR') > 0) {
    throw new Error(`Test 4 Failed: 가나다순 정렬 위반 (${allSorted[i].serviceName} > ${allSorted[i + 1].serviceName})`);
  }
}
console.log(`✅ Test 4 통과: 전체 기업 ${allSorted.length}개사 가나다순 완벽 정렬 검증`);

// 5. 초성 필터링 테스트 (ㄱ, ㄴ, ㄷ, ㅋ...)
const kGroup = getVerifiedServicesByInitial('ㄱ');
if (kGroup.length === 0 || !kGroup.every(i => i.serviceName.startsWith('굿') || i.serviceName.startsWith('그'))) {
  throw new Error('Test 5 Failed: "ㄱ" 초성 필터링 실패');
}
console.log(`✅ Test 5 통과: 초성 "ㄱ" 필터링 ${kGroup.length}개사 검증`);

// 6. 사업자등록번호 검색 (하이픈 및 숫자만)
const resNum1 = searchVerifiedServices('507-87-02631');
const resNum2 = searchVerifiedServices('5078702631');
if (resNum1.length === 0 || resNum2.length === 0) {
  throw new Error('Test 6 Failed: 사업자번호 검색 실패');
}
console.log('✅ Test 6 통과: 사업자번호 ("507-87-02631" / "5078702631") 검색 일치');

// 7. 도메인 직접 단건 조회 및 Result 변환
const found = findVerifiedServiceByDomain('nplatform.ai');
if (!found) {
  throw new Error('Test 7 Failed: 도메인 검색 실패');
}
const converted = convertVerifiedServiceToResult(found);
if (converted.businessNumber !== '507-87-02631' || converted.companyName !== '트랜스파머(주)') {
  throw new Error('Test 7 Failed: Result 변환 정합성 불일치');
}
console.log('✅ Test 7 통과: 도메인("nplatform.ai") -> VerificationResult 100% 매핑 완료');

console.log('🎉 모든 마스터 레지스트리 초성·가나다 검색 및 정합성 테스트 통과!');
