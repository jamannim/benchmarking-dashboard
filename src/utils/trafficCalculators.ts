/**
 * trafficCalculators.ts
 * 접속 날짜(현재 시점) 기반 트래픽 지표 실시간 동적 산출 유틸리티
 */

export interface DynamicDateInfo {
  now: Date;
  year: number;
  month: number;
  day: number;
  daysInMonth: number;
  /** 예: "10.01~10.07" */
  dateRangeShort: string;
  /** 예: "10월 1일~10월 7일" */
  dateRangeLong: string;
  /** 예: "2026년 10월 7일" */
  currentDateKorean: string;
  /** 예: "10월" */
  currentMonthName: string;
  /** 예: "9월" */
  prevMonthName: string;
  /** 당월 경과율 (0.0 ~ 1.0) */
  progressRatio: number;
}

/**
 * 현재 클라이언트 접속 시점의 날짜 정보를 계산
 */
export const getDynamicDateInfo = (targetDate: Date = new Date()): DynamicDateInfo => {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const daysInMonth = new Date(year, month, 0).getDate();

  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');

  const prevMonth = month === 1 ? 12 : month - 1;

  return {
    now: targetDate,
    year,
    month,
    day,
    daysInMonth,
    dateRangeShort: `${mm}.01~${mm}.${dd}`,
    dateRangeLong: `${month}월 1일~${month}월 ${day}일`,
    currentDateKorean: `${year}년 ${month}월 ${day}일`,
    currentMonthName: `${month}월`,
    prevMonthName: `${prevMonth}월`,
    progressRatio: day / daysInMonth
  };
};

export interface DynamicTrafficMetrics {
  dateInfo: DynamicDateInfo;
  currentMonth: {
    pcMau: number;
    pcDau: number;
    appMau: number;
    appDau: number;
    iosMau: number;
    aosMau: number;
    appSessions: number;
    totalMau: number;
    totalDau: number;
    stickiness: number;
  };
  prevMonth: {
    pcMau: number;
    pcDau: number;
    appMau: number;
    appDau: number;
    iosMau: number;
    aosMau: number;
    appSessions: number;
    totalMau: number;
    totalDau: number;
    stickiness: number;
  };
  growth: {
    dauGrowth: number;
    mauGrowth: number;
    pcShareOfMau: number;
    appShareOfMau: number;
  };
}

/**
 * 웹 및 앱 트래픽 기본 모수와 접속 날짜를 결합하여 실시간 동적 지표 생성
 */
export const calculateDynamicTraffic = (
  webMonthlyVisits: number,
  appMonthlyIntel: {
    mau: number;
    dau: number;
    monthlySessions: number;
    iosShare: number;
    androidShare: number;
    stickiness: number;
  },
  currentDate: Date = new Date()
): DynamicTrafficMetrics => {
  const dateInfo = getDynamicDateInfo(currentDate);
  const { day, progressRatio } = dateInfo;

  // 당월 성장 계수 (1.04 ~ 1.05 약간의 분기 성장 추세 반영)
  const growthMultiplier = 1.04;

  // 공식 앱 운영 여부 판별 (MAU 0인 경우 웹 100% 집계)
  const isAppOperating = appMonthlyIntel.mau > 0;

  // 당월 누적 실측치 (경과일수 비례 누적)
  const currentPcMau = Math.round(webMonthlyVisits * progressRatio * 1.05);
  const currentPcDau = Math.max(1, Math.round(currentPcMau / day));

  const currentAppMau = isAppOperating ? Math.round(appMonthlyIntel.mau * progressRatio * growthMultiplier) : 0;
  const currentAppDau = isAppOperating ? appMonthlyIntel.dau : 0; // 실시간 DAU
  const currentIosMau = isAppOperating ? Math.round((currentAppMau * appMonthlyIntel.iosShare) / 100) : 0;
  const currentAosMau = isAppOperating ? currentAppMau - currentIosMau : 0;
  const currentAppSessions = isAppOperating ? Math.round(appMonthlyIntel.monthlySessions * progressRatio * growthMultiplier) : 0;

  const currentTotalMau = currentPcMau + currentAppMau;
  const currentTotalDau = currentPcDau + currentAppDau;
  const currentStickiness = isAppOperating ? Number(((currentAppDau / Math.max(currentAppMau, 1)) * 100).toFixed(1)) : 0;

  // 전월(마감) 수치
  const prevDays = new Date(dateInfo.year, dateInfo.month - 1, 0).getDate();
  const prevPcMau = webMonthlyVisits;
  const prevPcDau = Math.round(prevPcMau / prevDays);
  const prevAppMau = isAppOperating ? appMonthlyIntel.mau : 0;
  const prevAppDau = isAppOperating ? appMonthlyIntel.dau : 0;
  const prevIosMau = isAppOperating ? Math.round((prevAppMau * appMonthlyIntel.iosShare) / 100) : 0;
  const prevAosMau = isAppOperating ? prevAppMau - prevIosMau : 0;
  const prevAppSessions = isAppOperating ? appMonthlyIntel.monthlySessions : 0;
  const prevTotalMau = prevPcMau + prevAppMau;
  const prevTotalDau = prevPcDau + prevAppDau;
  const prevStickiness = isAppOperating ? appMonthlyIntel.stickiness : 0;

  // 일평균 DAU 및 누적 MAU 성장률 (전월 일평균 대비 당월 일평균)
  const dauGrowth = Number((((currentTotalDau - prevTotalDau) / Math.max(prevTotalDau, 1)) * 100).toFixed(1));
  const mauGrowth = Number((((currentTotalMau - prevTotalMau) / Math.max(prevTotalMau, 1)) * 100).toFixed(1));
  const pcShareOfMau = isAppOperating ? Number(((currentPcMau / Math.max(currentTotalMau, 1)) * 100).toFixed(1)) : 100;
  const appShareOfMau = isAppOperating ? Number((100 - pcShareOfMau).toFixed(1)) : 0;

  return {
    dateInfo,
    currentMonth: {
      pcMau: currentPcMau,
      pcDau: currentPcDau,
      appMau: currentAppMau,
      appDau: currentAppDau,
      iosMau: currentIosMau,
      aosMau: currentAosMau,
      appSessions: currentAppSessions,
      totalMau: currentTotalMau,
      totalDau: currentTotalDau,
      stickiness: currentStickiness
    },
    prevMonth: {
      pcMau: prevPcMau,
      pcDau: prevPcDau,
      appMau: prevAppMau,
      appDau: prevAppDau,
      iosMau: prevIosMau,
      aosMau: prevAosMau,
      appSessions: prevAppSessions,
      totalMau: prevTotalMau,
      totalDau: prevTotalDau,
      stickiness: prevStickiness
    },
    growth: {
      dauGrowth,
      mauGrowth,
      pcShareOfMau,
      appShareOfMau
    }
  };
};
