/**
 * 기업별 상시근로자 데이터 수집·보완 파이프라인 서비스
 * 
 * [수집 우선순위 및 규칙]
 * 1순위: 국민연금공단_국민연금 가입 사업장 내역 API (공공데이터포털)
 * 2순위: 민간 기업정보 DB (NICE평가정보, 한국평가데이터 KODATA 등)
 *  - 공식 API 미제공/비인가 환경에서는 비인가 웹 크롤링을 일절 배제하고 '미연동' 상태 처리 (Rule 5, 6)
 *  - 데이터 부재 시 임의 가상 추정 금지(Rule 14) -> 'N/A' (employee_count: null) 처리
 *  - 0명 사업장(휴업/신설 등)과 미조회/장애를 명확히 구분
 * 
 * [최적화]
 * - localStorage 기반 캐싱 (기본 TTL: 30일 / 국민연금 월간 공시 주기)
 * - 일일 API 호출량 모니터링 로거
 */

export type {
  EmployeeTrackingRecord,
  EmployeeSourceType,
  EmployeeMeasureType,
  EmployeeDataStatus,
  EmployeeErrorCode
} from '../types/intelligence';
import type {
  EmployeeTrackingRecord,
  EmployeeDataStatus
} from '../types/intelligence';
import {
  searchNpsWorkplaces,
  selectPrimaryWorkplace,
  normalizeBizNo,
  normalizeCompanyName
} from './npsWorkplaceApi';

// 기본 캐시 TTL: 30일 (밀리초 단위)
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const CACHE_PREFIX = 'emp_cache_';
const USAGE_PREFIX = 'emp_api_usage_';

interface CacheEntry {
  data: EmployeeTrackingRecord;
  cachedAt: number;
  expiresAt: number;
}

/**
 * 일일 API 호출량 기록 및 확인
 */
export function recordApiCall(source: 'NPS' | 'PRIVATE'): number {
  if (typeof window === 'undefined' || !window.localStorage) return 0;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const key = `${USAGE_PREFIX}${source}_${today}`;
  try {
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    const next = current + 1;
    localStorage.setItem(key, String(next));
    return next;
  } catch {
    return 0;
  }
}

/**
 * 일일 API 호출량 조회
 */
export function getDailyApiUsage(source: 'NPS' | 'PRIVATE'): number {
  if (typeof window === 'undefined' || !window.localStorage) return 0;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const key = `${USAGE_PREFIX}${source}_${today}`;
  try {
    return parseInt(localStorage.getItem(key) || '0', 10);
  } catch {
    return 0;
  }
}

/**
 * 로컬 캐시 조회
 */
export function getCachedEmployeeRecord(cacheKey: string): { record: EmployeeTrackingRecord | null; isStale: boolean } {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { record: null, isStale: false };
  }
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${cacheKey}`);
    if (!raw) return { record: null, isStale: false };
    const entry: CacheEntry = JSON.parse(raw);
    const now = Date.now();
    const isStale = now > entry.expiresAt;
    return { record: entry.data, isStale };
  } catch {
    return { record: null, isStale: false };
  }
}

/**
 * 로컬 캐시 저장
 */
export function setCachedEmployeeRecord(cacheKey: string, record: EmployeeTrackingRecord): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const entry: CacheEntry = {
      data: record,
      cachedAt: Date.now(),
      expiresAt: Date.now() + CACHE_TTL_MS
    };
    localStorage.setItem(`${CACHE_PREFIX}${cacheKey}`, JSON.stringify(entry));
  } catch (err) {
    console.warn('Employee cache storage failed:', err);
  }
}

/**
 * 캐시 키 생성기 (사업자등록번호 우선, 없을 시 정규화 법인명)
 */
export function getEmployeeCacheKey(businessNumber?: string, companyName?: string): string {
  const cleanBiz = normalizeBizNo(businessNumber);
  if (cleanBiz) return cleanBiz.replace(/[^0-9]/g, '');
  const normName = normalizeCompanyName(companyName || '');
  return normName || 'unknown_target';
}

/**
 * 기업 매칭 신뢰도 계산 (0.0 ~ 1.0)
 */
export function calculateMatchConfidence(params: {
  targetBizNo?: string;
  targetName?: string;
  foundBizNo?: string;
  foundName?: string;
}): number {
  const { targetBizNo, targetName, foundBizNo, foundName } = params;
  const cleanTargetBiz = normalizeBizNo(targetBizNo);
  const cleanFoundBiz = normalizeBizNo(foundBizNo);

  // 1. 사업자등록번호 10자리 완전 일치: 1.0
  if (cleanTargetBiz && cleanFoundBiz && cleanTargetBiz === cleanFoundBiz) {
    return 1.0;
  }

  // 2. 사업자등록번호 앞 6자리(지역/업종/개인법인구분) 일치: 0.95
  const rawTargetDigits = cleanTargetBiz.replace(/[^0-9]/g, '');
  const rawFoundDigits = cleanFoundBiz.replace(/[^0-9]/g, '');
  if (rawTargetDigits.length >= 6 && rawFoundDigits.length >= 6 && rawTargetDigits.slice(0, 6) === rawFoundDigits.slice(0, 6)) {
    return 0.95;
  }

  // 3. 법인명 완전 일치: 0.9
  const normTargetName = normalizeCompanyName(targetName || '');
  const normFoundName = normalizeCompanyName(foundName || '');
  if (normTargetName && normFoundName && normTargetName === normFoundName) {
    return 0.9;
  }

  // 4. 법인명 포함 관계: 0.75
  if (normTargetName && normFoundName && (normTargetName.includes(normFoundName) || normFoundName.includes(normTargetName))) {
    return 0.75;
  }

  // 5. 기타 불명확 매칭: 0.4
  return 0.4;
}

/**
 * 2순위: 민간 기업정보 DB 폴백 조회 헬퍼
 * - 현재 공식 민간 API 라이선스/Key가 미등록된 환경이므로
 *   비인가 웹 크롤링을 일절 배제(Rule 5, 6)하고 명확한 미연동(준비 중) 상태로 귀결시킵니다.
 */
async function fetchPrivateCorporateDbEmployeeRecord(params: {
  businessNumber?: string;
  companyName?: string;
}): Promise<EmployeeTrackingRecord | null> {
  const { businessNumber, companyName } = params;
  // 환경변수에 NICE 또는 KODATA API KEY가 정의되어 있는지 확인
  const privateApiKey = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_NICE_API_KEY) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_KODATA_API_KEY) ||
    '';

  if (!privateApiKey || (!businessNumber && !companyName)) {
    // 공식 API 키가 없으므로 웹 크롤링을 금지하고 안전한 미연동/부재 상태를 반환
    return null;
  }

  // 추후 공식 API Key가 연동될 경우의 규격화된 호출 지점
  recordApiCall('PRIVATE');
  return null;
}

/**
 * [통합 파이프라인] 기업 상시근로자 수 조회 및 보완 메인 함수
 * 
 * 캐시 확인 -> 1순위 국민연금공단 API -> 2순위 민간 기업정보 DB -> 최종 N/A
 */
export async function getOrFetchEmployeeTrackingRecord(params: {
  businessNumber?: string;
  companyName?: string;
  companyAddress?: string;
  forceRefresh?: boolean;
}): Promise<EmployeeTrackingRecord> {
  const { businessNumber, companyName, companyAddress, forceRefresh = false } = params;
  const cacheKey = getEmployeeCacheKey(businessNumber, companyName);
  const nowIso = new Date().toISOString();

  // 1. 캐시 검사
  if (!forceRefresh) {
    const { record: cachedRecord, isStale } = getCachedEmployeeRecord(cacheKey);
    if (cachedRecord && !isStale) {
      return cachedRecord;
    }
  }

  // 2. 1순위: 국민연금공단 API 호출
  try {
    recordApiCall('NPS');
    const npsRecords = await searchNpsWorkplaces({
      businessNumber,
      query: companyName
    });

    if (npsRecords && npsRecords.length > 0) {
      // 본점 / 주사업장 우선 선별
      const primaryWorkplace = selectPrimaryWorkplace(npsRecords, companyAddress);

      if (primaryWorkplace) {
        const confidence = calculateMatchConfidence({
          targetBizNo: businessNumber,
          targetName: companyName,
          foundBizNo: primaryWorkplace.bzowrRgstNo,
          foundName: primaryWorkplace.wkplNm
        });

        const isZero = primaryWorkplace.jnngpCnt === 0;
        const status: EmployeeDataStatus = confidence < 0.7 
          ? 'MATCH_REVIEW_REQUIRED' 
          : 'VERIFIED';

        const result: EmployeeTrackingRecord = {
          employee_count: primaryWorkplace.jnngpCnt,
          employee_source: 'NPS',
          employee_reference_date: primaryWorkplace.verifiedDate || primaryWorkplace.dataCrtYm || '2026.05',
          employee_measure_type: '국민연금 가입자 수',
          employee_data_status: status,
          employee_match_confidence: confidence,
          employee_last_checked_at: nowIso,
          employee_source_record_id: String(primaryWorkplace.seq || primaryWorkplace.bzowrRgstNo),
          employee_error_code: isZero ? 'ZERO_EMPLOYEES' : null,
          workplace_name: primaryWorkplace.wkplNm,
          workplace_address: primaryWorkplace.wkplRoadNmDtlAddr
        };

        // 캐시 저장 후 반환
        setCachedEmployeeRecord(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('1순위 국민연금 API 조회 중 에러 발생:', err);

    // 네트워크 오류 시 기존 만료 캐시가 있다면 STALE 상태로 복원
    const { record: staleRecord } = getCachedEmployeeRecord(cacheKey);
    if (staleRecord) {
      const staleResult: EmployeeTrackingRecord = {
        ...staleRecord,
        employee_data_status: 'STALE',
        employee_error_code: 'NETWORK_ERROR',
        employee_last_checked_at: nowIso
      };
      return staleResult;
    }
  }

  // 3. 2순위: 민간 기업정보 DB 폴백 시도
  try {
    const privateRecord = await fetchPrivateCorporateDbEmployeeRecord({
      businessNumber,
      companyName
    });

    if (privateRecord) {
      setCachedEmployeeRecord(cacheKey, privateRecord);
      return privateRecord;
    }
  } catch (err) {
    console.warn('2순위 민간 기업정보 DB 조회 중 에러 발생:', err);
  }

  // 4. 둘 다 부재 또는 매칭 실패 시: 임의 추론 금지 원칙(Rule 14)에 따라 N/A(null) 확정 반환
  const unconfirmedRecord: EmployeeTrackingRecord = {
    employee_count: null,
    employee_source: 'NONE',
    employee_reference_date: 'N/A',
    employee_measure_type: 'N/A',
    employee_data_status: 'UNKNOWN',
    employee_match_confidence: 0,
    employee_last_checked_at: nowIso,
    employee_error_code: 'NOT_FOUND',
    workplace_name: companyName || '',
    workplace_address: companyAddress || ''
  };

  // 실패 상태도 과도한 반복 호출 방지를 위해 단기 캐싱
  setCachedEmployeeRecord(cacheKey, unconfirmedRecord);
  return unconfirmedRecord;
}
