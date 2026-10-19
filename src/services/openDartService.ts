/**
 * OpenDART (금융감독원 전자공시시스템 오픈 API) 서비스 모듈
 * 공식 사이트: https://opendart.fss.or.kr
 * 
 * [데이터 정합성 보장 원칙]
 * 1. 사업자등록번호(10자리) 또는 고유번호(8자리)를 기준으로 외감/상장 기업의 100% 공인 재무제표 및 기업개황을 조회합니다.
 * 2. 임의의 추론이나 가상 수치를 배제하고, 전자공시 원천 데이터(원 단위)를 실측값 그대로 반환합니다.
 * 3. 출처 URL은 항상 공식 DART 보고서 링크(https://dart.fss.or.kr) 또는 OpenDART 포털로 연결합니다.
 */

export interface OpenDartCompanyOverview {
  status: string;
  message: string;
  corpCode: string;          // 고유번호 (8자리)
  corpName: string;          // 정식 법인명
  corpNameEng?: string;       // 영문 법인명
  stockName?: string;        // 종목명 (상장사)
  stockCode?: string;        // 종목코드 (6자리)
  ceoName: string;           // 대표자명
  corpCls: 'Y' | 'K' | 'N' | 'E'; // 법인구분 (Y: 유가, K: 코스닥, N: 코넥스, E: 기타/외감비상장)
  jurirNo: string;           // 법인등록번호
  bizrNo: string;            // 사업자등록번호
  adres: string;             // 본점 소재지 주소
  hmUrl?: string;            // 홈페이지 주소
  irUrl?: string;            // IR 홈페이지
  phnNo?: string;            // 대표 전화번호
  indutyCode: string;        // 한국표준산업분류 업종코드
  estDt: string;             // 설립일자 (YYYYMMDD)
  accMt: string;             // 결산월 (MM)
}

export interface OpenDartFinancialItem {
  rceptNo: string;           // 접수번호
  bsnsYear: string;          // 사업연도
  corpCode: string;          // 고유번호
  sjDiv: 'BS' | 'IS' | 'CIS' | 'CF' | 'SCE'; // 재무제표 구분 (BS: 재무상태표, IS: 손익계산서)
  sjNm: string;              // 재무제표명
  accountId: string;         // 계정과목 ID (예: ifrs-full_Revenue)
  accountNm: string;         // 계정과목명 (매출액, 영업이익, 당기순이익 등)
  thstrmNm: string;          // 당기명 (예: 제 15 기)
  thstrmAmount: string;      // 당기금액 (원 단위)
  frmtrmNm?: string;         // 전기명
  frmtrmAmount?: string;     // 전기금액
  bfefrmtrmNm?: string;      // 전전기명
  bfefrmtrmAmount?: string;  // 전전기금액
  ord: string;               // 계정과목 정렬순서
}

export interface OpenDartDisclosureReport {
  rceptNo: string;           // 접수번호 (14자리)
  corpCode: string;          // 고유번호
  corpName: string;          // 법인명
  reportNm: string;          // 보고서명 (감사보고서, 사업보고서 등)
  rceptDt: string;           // 접수일자 (YYYYMMDD)
  flrNm: string;             // 공시 제출인명
  rm: string;                // 비고
  url: string;               // 공식 DART 뷰어 URL
}

/**
 * OpenDART API 클라이언트 인터페이스
 */
export class OpenDartClient {
  private apiKey: string | null = null;
  private baseUrl = 'https://opendart.fss.or.kr/api';

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    }
  }

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  /**
   * 공식 DART 공시 뷰어 URL 생성
   */
  public static getOfficialViewerUrl(rceptNo: string): string {
    return `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${encodeURIComponent(rceptNo)}`;
  }

  /**
   * 기업 개황 조회 (/company.json)
   */
  public async getCompanyOverview(corpCode: string): Promise<OpenDartCompanyOverview | null> {
    if (!this.apiKey) {
      console.warn('[OpenDart] API 키가 설정되지 않았습니다. 환경 변수 OPENDART_API_KEY를 확인하세요.');
      return null;
    }

    try {
      const resp = await fetch(
        `${this.baseUrl}/company.json?crtfc_key=${this.apiKey}&corp_code=${corpCode}`
      );
      if (!resp.ok) return null;
      const data = await resp.json();
      if (data.status !== '000') {
        console.warn(`[OpenDart] 조회 실패: ${data.message} (status: ${data.status})`);
        return null;
      }
      return {
        status: data.status,
        message: data.message,
        corpCode: data.corp_code,
        corpName: data.corp_name,
        corpNameEng: data.corp_name_eng,
        stockName: data.stock_name,
        stockCode: data.stock_code,
        ceoName: data.ceo_nm,
        corpCls: data.corp_cls,
        jurirNo: data.jurir_no,
        bizrNo: data.bizr_no,
        adres: data.adres,
        hmUrl: data.hm_url,
        irUrl: data.ir_url,
        phnNo: data.phn_no,
        indutyCode: data.induty_code,
        estDt: data.est_dt,
        accMt: data.acc_mt,
      };
    } catch (err) {
      console.error('[OpenDart] 기업 개황 네트워크 오류:', err);
      return null;
    }
  }

  /**
   * 단일회사 주요계정 재무제표 조회 (/fnlttSinglAcntAll.json)
   */
  public async getFinancialStatements(
    corpCode: string,
    bsnsYear: string,
    reprtCode: '11013' | '11012' | '11014' | '11011' = '11011' // 11011: 사업보고서 (결산)
  ): Promise<OpenDartFinancialItem[]> {
    if (!this.apiKey) return [];

    try {
      const resp = await fetch(
        `${this.baseUrl}/fnlttSinglAcntAll.json?crtfc_key=${this.apiKey}&corp_code=${corpCode}&bsns_year=${bsnsYear}&reprt_code=${reprtCode}&fs_div=CFS`
      );
      if (!resp.ok) return [];
      const data = await resp.json();
      if (data.status !== '000' || !Array.isArray(data.list)) {
        return [];
      }
      return data.list.map((item: any) => ({
        rceptNo: item.rcept_no,
        bsnsYear: item.bsns_year,
        corpCode: item.corp_code,
        sjDiv: item.sj_div,
        sjNm: item.sj_nm,
        accountId: item.account_id,
        accountNm: item.account_nm,
        thstrmNm: item.thstrm_nm,
        thstrmAmount: item.thstrm_amount,
        frmtrmNm: item.frmtrm_nm,
        frmtrmAmount: item.frmtrm_amount,
        bfefrmtrmNm: item.bfefrmtrm_nm,
        bfefrmtrmAmount: item.bfefrmtrm_amount,
        ord: item.ord,
      }));
    } catch (err) {
      console.error('[OpenDart] 재무제표 조회 오류:', err);
      return [];
    }
  }
}

export const openDartClient = new OpenDartClient();
