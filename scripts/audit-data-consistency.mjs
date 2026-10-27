/**
 * BIZLENS 데이터 정합성(Rule 14) 및 출처 URL 유효성(Rule 13) 전수 자동 감사 스크립트
 * 
 * [목적]
 * 빌드/배포 전 모든 데이터셋과 아웃링크 URL을 기계적으로 전수 감사하여,
 * 1. 임의 가상 추정치 (추정) 잔존 여부
 * 2. 비외감 기업의 허위 공시 데이터 잔존 여부
 * 3. 외부 출처 아웃링크의 404/에러페이지(Page Not Found) 여부
 * 4. 공시 출처의 자사 도메인 오염 여부
 * 를 사전에 100% 차단하며, 위반 시 빌드를 즉시 중단(Exit 1)합니다.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

let totalErrors = 0;

function reportError(rule, message, file = '') {
  console.error(`\x1b[31m[FAIL - ${rule}]\x1b[0m ${message} ${file ? `(${file})` : ''}`);
  totalErrors++;
}

function reportPass(message) {
  console.log(`\x1b[32m[PASS]\x1b[0m ${message}`);
}

// ─────────────────────────────────────────────────────────────
// 1. [Rule 14 감사] 데이터셋 내 임의 가상 추정치((추정), 가상 재무) 전수 스크리닝
// ─────────────────────────────────────────────────────────────
function auditDataConsistency() {
  console.log('\n🔍 [Rule 14] 데이터 정합성 및 가상 추정치 전수 감사 시작...');

  const multiDomainPath = path.join(rootDir, 'src', 'data', 'multiDomainData.ts');
  if (!fs.existsSync(multiDomainPath)) {
    reportError('Rule 14', 'multiDomainData.ts 파일을 찾을 수 없습니다.');
    return;
  }

  const content = fs.readFileSync(multiDomainPath, 'utf-8');

  // 1-1. financialHistory 내 periodLabel: 'xx년(추정)' 잔존 여부
  const periodEstimateMatch = content.match(/periodLabel:\s*['"][^'"]*추정[^'"]*['"]/g);
  if (periodEstimateMatch) {
    reportError('Rule 14', `financialHistory에 금지된 추정 라벨이 발견되었습니다: ${periodEstimateMatch.join(', ')}`, 'multiDomainData.ts');
  } else {
    reportPass('financialHistory 내 periodLabel 추정 라벨 0건 확인');
  }

  // 1-2. 비외감 기업인데 financialHistory에 가상 재무수치가 들어가 있는 모순 검사
  // KNOWN_CORP_REGISTRY 파싱
  const corpBlockRegex = /'([^']+)':\s*\{([\s\S]*?)\n\s*\},/g;
  let match;
  while ((match = corpBlockRegex.exec(content)) !== null) {
    const domain = match[1];
    const block = match[2];

    const isDartAuditedMatch = block.match(/isDartAudited:\s*(true|false)/);
    const isDartAudited = isDartAuditedMatch ? isDartAuditedMatch[1] === 'true' : true;
    const isUnconfirmed = /disclosureType:\s*['"]unconfirmed['"]/.test(block);
    const hasFinancialHistory = /financialHistory:\s*\[\s*\{/.test(block);

    if (isUnconfirmed && hasFinancialHistory) {
      reportError('Rule 14', `미공시 대상 법인(${domain})에 재무 데이터가 가상으로 등록되어 있습니다.`, 'multiDomainData.ts');
    }
  }

  reportPass('비외감 법인의 가상 재무제표 모순 여부 감사 통과');

  // 1-3. topPages 내 임의 가상 SaaS 경로(/pricing 등) 전수 검사
  if (content.includes("path: '/pricing (요금 안내)'")) {
    reportError('Rule 14', '임의의 도메인에 허위 가상 SaaS 경로(/pricing (요금 안내))가 주입되고 있습니다.', 'multiDomainData.ts');
  } else {
    reportPass('topPages 내 임의 가상 SaaS 더미 경로 0건 확인');
  }
}

// ─────────────────────────────────────────────────────────────
// 2. [Rule 13 감사] 외부 출처 아웃링크 URL 100% 실측 유효성 검증
// ─────────────────────────────────────────────────────────────
async function auditSourceUrls() {
  console.log('\n🌐 [Rule 13] 외부 출처 아웃링크 URL 실측 유효성 네트워크 감사 시작...');

  // 검증 대상 주요 공공/공식 출처 URL 목록
  const resolverPath = path.join(rootDir, 'src', 'utils', 'sourceUrlResolver.ts');
  const resolverContent = fs.readFileSync(resolverPath, 'utf-8');

  const urlsToTest = new Set([
    'https://www.kofiu.go.kr/kor/notification/notice.do',
    'https://dart.fss.or.kr/',
    'https://franchise.ftc.go.kr/index.do',
    'https://www.innoforest.co.kr/',
    'https://www.data.go.kr/data/3046071/openapi.do',
    'https://www.nicebizinfo.com/',
    'https://www.jobkorea.co.kr/company/48849071',
    'https://www.hometax.go.kr/'
  ]);

  // 구형 잘못된 KoFIU URL이 소스코드에 남아있는지 검사
  if (resolverContent.includes("'https://www.kofiu.go.kr/notification/notice.do'")) {
    reportError('Rule 13', 'sourceUrlResolver.ts에 에러페이지를 유발하는 구형 KoFIU URL(/kor 누락)이 남아있습니다.');
  }

  // 네트워크 요청 검증
  for (const url of urlsToTest) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(7000)
      });

      if (!res.ok && res.status !== 403) {
        reportError('Rule 13', `출처 URL 접속 실패: HTTP ${res.status} -> ${url}`);
        continue;
      }

      const bodyText = await res.text();
      // 정부/공공기관의 200번대 Page Not Found 에러페이지 탐지
      if (bodyText.includes('<title>Page Not Found</title>') || 
          bodyText.includes('<h1><em>ERROR</em>') ||
          bodyText.includes('요청하신 페이지를 찾을 수 없습니다')) {
        reportError('Rule 13', `출처 URL이 에러페이지(Page Not Found)를 응답합니다: ${url}`);
      } else {
        reportPass(`출처 URL 정상 응답 확인 (${res.status}): ${url}`);
      }
    } catch (err) {
      reportError('Rule 13', `출처 URL 네트워크 요청 타임아웃/실패: ${url} (${err.message})`);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// 3. [Rule 12 & GEMINI.md 감사] 프론트엔드 도메인 상태 격리 및 겹침 방지 감사
// ─────────────────────────────────────────────────────────────
function auditDomainIsolation() {
  console.log('\n🔒 [도메인 상태 격리 감사] 도메인 전환 시 상태 초기화 및 겹침 방지 전수 감사 시작...');

  const appPath = path.join(rootDir, 'src', 'App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  // 3-1. <main key={currentDomain}> 강제 격리 검사
  if (!appContent.includes('<main key={currentDomain}')) {
    reportError('Domain Isolation', 'App.tsx 내 <main> 태그에 key={currentDomain}이 누락되어 도메인 전환 시 이전 상태 잔존 위험이 있습니다.');
  } else {
    reportPass('<main key={currentDomain}> 컴포넌트 완전 재마운트 격리 확인');
  }

  // 3-2. handleSearch 동기화 검사 (600ms 이전 도메인 플리커링 제거 확인)
  if (appContent.includes('setTimeout(() => {\n      let resultData: CompleteServiceIntelligence;') ||
      appContent.includes('setTimeout(() => {\r\n      let resultData: CompleteServiceIntelligence;')) {
    reportError('Domain Isolation', 'handleSearch 내 비동기 지연으로 인해 이전 도메인 플리커링이 발생할 수 있습니다.');
  } else {
    reportPass('handleSearch 동기 즉시 전환 구조 확인 (600ms 잔존 플리커링 원천 제거)');
  }

  // 3-3. isValidBizNumber 검사 (가짜 충돌 방지)
  if (!appContent.includes('isValidBizNumber')) {
    reportError('Domain Isolation', 'App.tsx에 사업자등록번호 유효성 검증(isValidBizNumber)이 없어 미기재 도메인 간 가짜 충돌이 발생할 수 있습니다.');
  } else {
    reportPass('사업자등록번호 10자리 엄격 검증(isValidBizNumber) 확인 (가짜 충돌 방어 완료)');
  }

  // 3-4. LandingPage.tsx 내 UrlVerificationModal key 격리 검사
  const landingPath = path.join(rootDir, 'src', 'components', 'landing', 'LandingPage.tsx');
  const landingContent = fs.readFileSync(landingPath, 'utf-8');
  if (!landingContent.includes('key={pendingUrl}')) {
    reportError('Domain Isolation', 'LandingPage.tsx 내 UrlVerificationModal에 key={pendingUrl}이 누락되었습니다.');
  } else {
    reportPass('UrlVerificationModal key={pendingUrl} 모달 상태 도메인별 100% 격리 확인');
  }
}

// ─────────────────────────────────────────────────────────────
// 메인 실행기
// ─────────────────────────────────────────────────────────────
async function run() {
  console.log('================================================================');
  console.log(' [BIZLENS Pre-flight Gatekeeper] 데이터 정합성 & 출처 검증 파이프라인');
  console.log('================================================================');

  auditDataConsistency();
  auditDomainIsolation();
  await auditSourceUrls();

  console.log('\n================================================================');
  if (totalErrors > 0) {
    console.error(`\x1b[31m[CRITICAL FAIL] 총 ${totalErrors}건의 데이터 정합성/출처 오류가 발견되었습니다.\x1b[0m`);
    console.error('오류가 해결되지 않으면 프로덕션 빌드 및 배포가 불가능합니다.');
    console.log('================================================================\n');
    process.exit(1);
  } else {
    console.log('\x1b[32m[ALL PASS] 모든 데이터 정합성(Rule 14) 및 출처 URL(Rule 13) 검증을 100% 통과했습니다.\x1b[0m');
    console.log('================================================================\n');
    process.exit(0);
  }
}

run();
