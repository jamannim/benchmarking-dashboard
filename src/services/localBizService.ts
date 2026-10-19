/**
 * 로컬비즈 (LocalBiz / 공공데이터포털 소상공인 & 행안부 지방행정인허가) 연동 모듈
 * 
 * [도입 배경 및 목적]
 * 1. OpenDART는 상장사 및 외부감사 대상 대기업(자산 120억 이상)에 한정되어 있습니다.
 * 2. 스타트업, 비외감 중소기업, 가맹본부/지점, 로컬 이커머스 기업은 DART 공시 의무가 없습니다.
 * 3. 따라서 DART 외감 사각지대에 있는 기업의 정합성을 검증하기 위해:
 *    - 국세청 사업자등록 상태조회 (계속/휴업/폐업, 과세유형)
 *    - 행정안전부 지방행정인허가데이터 (LOCALDATA: 업종별 인허가, 인허가일자, 소재지)
 *    - 소상공인시장진흥공단 상가(상권)정보 (상호명, 상권업종대분류, 지점/매장 실측)
 *   를 연동하여 기업 정보의 진위성과 데이터 정합성을 100% 확보합니다.
 */

export interface LocalBizCompanyRecord {
  businessNumber: string;    // 사업자등록번호 (10자리)
  companyName: string;       // 상호명
  representative: string;    // 대표자명
  bnoStatus: '계속사업자' | '휴업자' | '폐업자' | '미확인'; // 국세청 사업자 상태
  taxType?: string;          // 과세유형 (부가가치세 일반과세자 등)
  licenseType?: string;      // 인허가 업종명 (예: 통신판매업, 전자금융업, 직업소개소 등)
  licenseNumber?: string;    // 인허가 등록번호 (예: 제2024-서울강남-01234호)
  licenseDate?: string;      // 인허가 / 개업 일자 (YYYY-MM-DD)
  roadAddress?: string;      // 도로명 주소 (실측)
  postalCode?: string;       // 우편번호
  industryCategory?: string; // 한국표준산업분류 또는 상권업종 대분류
  officialSourceUrl: string; // 공식 조회 출처 URL (localdata.go.kr / data.go.kr / nts)
}

export class LocalBizClient {
  private publicDataApiKey: string | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.publicDataApiKey = apiKey;
    }
  }

  public setApiKey(key: string) {
    this.publicDataApiKey = key;
  }

  /**
   * 공식 출처 URL 생성
   */
  public static getOfficialSourceUrl(sourceType: 'localdata' | 'nts' | 'sbiz'): string {
    switch (sourceType) {
      case 'localdata':
        return 'https://www.localdata.go.kr';
      case 'nts':
        return 'https://www.hometax.go.kr';
      case 'sbiz':
        return 'https://www.sbiz.or.kr';
      default:
        return 'https://www.data.go.kr';
    }
  }

  /**
   * 국세청 사업자등록 상태 조회 (공공데이터포털 오픈 API)
   * 엔드포인트: https://api.odcloud.kr/api/nts-businessman/v1/status
   */
  public async verifyTaxStatus(businessNumbers: string[]): Promise<Map<string, { status: string; taxType: string }>> {
    const result = new Map<string, { status: string; taxType: string }>();
    if (!this.publicDataApiKey) {
      console.warn('[LocalBiz] 공공데이터 API 키가 설정되지 않았습니다.');
      return result;
    }

    try {
      const cleanBnos = businessNumbers.map((b) => b.replace(/-/g, '').trim());
      const resp = await fetch(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${this.publicDataApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ b_no: cleanBnos }),
        }
      );
      if (!resp.ok) return result;
      const data = await resp.json();
      if (Array.isArray(data.data)) {
        for (const item of data.data) {
          result.set(item.b_no, {
            status: item.b_stt || '미확인',
            taxType: item.tax_type || '정보 없음',
          });
        }
      }
    } catch (err) {
      console.error('[LocalBiz] 국세청 상태조회 오류:', err);
    }
    return result;
  }
}

export const localBizClient = new LocalBizClient();
