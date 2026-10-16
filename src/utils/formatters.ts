/**
 * 숫자 및 한화(KRW) 표준 포맷터 유틸리티 (세자리 콤마 ',' 및 원화 표준 표기 준수)
 */

/**
 * 일반 숫자 세자리 콤마 포맷팅
 * 예: 1234567 -> '1,234,567'
 */
export function formatNumber(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === '') return '0';
  const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
  if (isNaN(num)) return String(val);
  return num.toLocaleString('ko-KR');
}

/**
 * 원 단위 금액 포맷팅 (원화 기호 또는 '원' 명시)
 * 예: 1250000 -> '1,250,000원' 또는 '₩1,250,000'
 */
export function formatWon(val: number | string | null | undefined, prefixWonSign: boolean = false): string {
  if (val === null || val === undefined || val === '') return prefixWonSign ? '₩0' : '0원';
  const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]/g, '')) : val;
  if (isNaN(num)) return String(val);
  const formatted = num.toLocaleString('ko-KR');
  return prefixWonSign ? `₩${formatted}` : `${formatted}원`;
}

/**
 * 억 단위 금액 포맷팅 (1,000억 이상일 때도 세자리 콤마 필수 적용, 10,000억 이상일 때 조 단위 분해)
 * 예: 624 -> '624억 원', 12400 -> '1조 2,400억 원', 70.7 -> '70.7억 원'
 */
export function formatEokWon(eokVal: number | string | null | undefined): string {
  if (eokVal === null || eokVal === undefined || eokVal === '') return '0억 원';
  const num = typeof eokVal === 'string' ? parseFloat(eokVal.replace(/[^0-9.-]/g, '')) : eokVal;
  if (isNaN(num)) return String(eokVal);

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  if (absNum >= 10000) {
    const jo = Math.floor(absNum / 10000);
    const restEok = Math.round((absNum % 10000) * 10) / 10;
    const joText = jo.toLocaleString('ko-KR');
    const restText = restEok > 0 ? ` ${restEok.toLocaleString('ko-KR')}억 원` : '조 원';
    return `${isNegative ? '-' : ''}${joText}${restText.startsWith('조') ? restText : `조${restText}`}`;
  }

  // 1,000억 이상 ~ 10,000억 미만
  if (absNum >= 1000) {
    const formatted = (Math.round(absNum * 10) / 10).toLocaleString('ko-KR');
    return `${isNegative ? '-' : ''}${formatted}억 원`;
  }

  // 1,000억 미만
  const formatted = (Math.round(absNum * 10) / 10).toLocaleString('ko-KR');
  return `${isNegative ? '-' : ''}${formatted}억 원`;
}

/**
 * 만 단위 금액 포맷팅
 * 예: 5200 -> '5,200만 원'
 */
export function formatManWon(manVal: number | string | null | undefined): string {
  if (manVal === null || manVal === undefined || manVal === '') return '0만 원';
  const num = typeof manVal === 'string' ? parseFloat(manVal.replace(/[^0-9.-]/g, '')) : manVal;
  if (isNaN(num)) return String(manVal);
  const formatted = Math.round(num).toLocaleString('ko-KR');
  return `${formatted}만 원`;
}
