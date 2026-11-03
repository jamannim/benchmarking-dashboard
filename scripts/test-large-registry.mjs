import { 
  searchVerifiedServices, 
  getAllVerifiedServicesSorted,
  getCorporateItemsByScale,
  getVerifiedServicesByInitial,
  getChosung 
} from '../src/data/verifiedServicesRegistry.js';
import corporateSearchHandler from '../api/search-corporate.js';

console.log('🧪 [Unit Test] 대규모 기업 인덱스(1단계) 및 실시간 공공 API(2단계) 통합 검증');

// 1. 대기업 검색 테스트 (삼성전자, 현대차)
const samsung = searchVerifiedServices('삼성전자');
if (samsung.length === 0 || samsung[0].companyName !== '삼성전자주식회사' || samsung[0].scale !== 'enterprise') {
  throw new Error(`Test 1 Failed: 삼성전자 검색 실패 (${JSON.stringify(samsung[0])})`);
}
console.log('✅ Test 1 통과: 대기업 "삼성전자" (124-81-00998) scale=enterprise 확인');

// 2. 초성 검색 테스트 ('ㅅㅅ' -> 삼성전자, 'ㅇㅍㄹㅍ' -> 엔플랫폼, 'ㅌㅅ' -> 토스)
const chosungSam = searchVerifiedServices('ㅅㅅ');
if (!chosungSam.some(i => i.serviceName.includes('삼성전자'))) {
  throw new Error('Test 2-1 Failed: 초성 "ㅅㅅ" -> 삼성전자 매칭 실패');
}
console.log('✅ Test 2-1 통과: 초성 "ㅅㅅ" -> 삼성전자 매칭');

const chosungNpl = searchVerifiedServices('ㅇㅍㄹㅍ');
if (!chosungNpl.some(i => i.domain === 'nplatform.ai')) {
  throw new Error('Test 2-2 Failed: 초성 "ㅇㅍㄹㅍ" -> 엔플랫폼 매칭 실패');
}
console.log('✅ Test 2-2 통과: 초성 "ㅇㅍㄹㅍ" -> 엔플랫폼 매칭');

// 3. 기업 규모별 필터링 테스트
const enterprises = getCorporateItemsByScale('enterprise');
const mids = getCorporateItemsByScale('mid');
const startups = getCorporateItemsByScale('startup');
const smes = getCorporateItemsByScale('sme');

if (enterprises.length === 0 || mids.length === 0 || startups.length === 0 || smes.length === 0) {
  throw new Error('Test 3 Failed: 규모별 데이터 분류 누락');
}
console.log(`✅ Test 3 통과: 기업 규모별 분류 정상 (대기업: ${enterprises.length}, 중견: ${mids.length}, 스타트업: ${startups.length}, 중소/소기업: ${smes.length})`);

// 4. 가나다순 정렬 검증
const all = getAllVerifiedServicesSorted();
for (let i = 0; i < all.length - 1; i++) {
  if (all[i].serviceName.localeCompare(all[i + 1].serviceName, 'ko-KR') > 0) {
    throw new Error(`Test 4 Failed: 가나다순 정렬 위반 (${all[i].serviceName} > ${all[i + 1].serviceName})`);
  }
}
console.log(`✅ Test 4 통과: 전체 기업 ${all.length}개사 가나다순 정렬 무결성 검증`);

// 5. 2단계 실시간 서버리스 핸들러 모의 쿼리 테스트
const mockReq = {
  method: 'GET',
  query: { query: '카카오', scale: 'all' }
};

let responseCode = 0;
let responseHeaders = {};
let responseBody = '';

const mockRes = {
  setHeader: (k, v) => { responseHeaders[k] = v; },
  set statusCode(code) { responseCode = code; },
  get statusCode() { return responseCode; },
  end: (payload) => { responseBody = payload; }
};

await corporateSearchHandler(mockReq, mockRes);
const apiResult = JSON.parse(responseBody);

if (responseCode !== 200 || !apiResult.success || apiResult.count === 0) {
  throw new Error(`Test 5 Failed: search-corporate API 모의 호출 실패 (${responseBody})`);
}
console.log(`✅ Test 5 통과: /api/search-corporate API 응답 200 OK (${apiResult.count}건 공공 매핑 확인)`);

console.log('🎉 1단계(대규모 가나다순 인덱스) & 2단계(실시간 공공 API) 검증 100% 통과!');
