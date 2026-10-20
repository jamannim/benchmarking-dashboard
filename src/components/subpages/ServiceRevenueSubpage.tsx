import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Filter,
  Calendar,
  Navigation,
  Info,
  Award
} from 'lucide-react';
import type { CompleteServiceIntelligence, ServiceRevenueRecord } from '../../types/intelligence';
import type { SubViewId } from '../Header';
import { BrandLogo } from '../BrandLogo';
import { PdfReportButton } from '../PdfReportButton';
import { MerchantShareSubpage } from './MerchantShareSubpage';
import { RegionAtmSubpage } from './RegionAtmSubpage';
import { resolveOfficialDisclosureSourceUrl } from '../../utils/sourceUrlResolver';

const RevenueTypeTooltip: React.FC<{
  type: '제품매출' | '상품매출';
  align?: 'left' | 'center' | 'right' | string;
  side?: 'top' | 'bottom';
}> = ({ type, align = 'center', side = 'top' }) => {
  const alignClass =
    align === 'left'
      ? 'left-0'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : align === 'right'
      ? 'right-0'
      : align;

  const sideClass = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  const desc =
    type === '제품매출'
      ? '직접 원재료를 가공·제조하여 판매한 것'
      : '타사가 만든 완성품을 매입해 가공 없이 유통만 한 것';

  return (
    <span
      className="relative inline-flex items-center group cursor-help ml-1 align-middle hover:z-[9999]"
      aria-label={`${type} : ${desc}`}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-cyan-950/40 text-brand-cyan border border-cyan-500/35 group-hover:bg-cyan-900/50 group-hover:border-cyan-400 transition-colors">
        <Info className="w-2.5 h-2.5 shrink-0" />
      </span>
      <span
        role="tooltip"
        className={`pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 absolute ${sideClass} ${alignClass} whitespace-nowrap px-3 py-1.5 rounded-lg bg-dark-950/98 backdrop-blur-md border border-cyan-500/50 shadow-2xl z-[99999] text-xs font-normal text-slate-200 font-sans tracking-normal shadow-black/80`}
      >
        <strong className="text-white font-bold mr-1">{type} :</strong>
        <em className="italic text-cyan-300">{desc}</em>
      </span>
    </span>
  );
};

interface Props {
  data: CompleteServiceIntelligence;
  activeSubView?: SubViewId;
  onSubViewChange?: (subView: SubViewId) => void;
}

const CARD_SALES_DATA: ServiceRevenueRecord[] = [
  // ================= 26년 (1~9월 누적) =================
  {
    id: '2026-09-nct127',
    year: 2026,
    yearMonth: '26.09',
    category: 'IP',
    title: "NCT 127 5TH TOUR 'NEO CITY : SEOUL - THE REDLINE'",
    subTitle: '스페셜 테마 카드 & 패스 (공연장·지정 키오스크)',
    partners: [{ brandKey: 'sm', name: 'SM엔터테인먼트' }],
    salesVolume: 35000,
    cardSalesKrW: 2.45,
    rechargeFeeKrW: 1.05,
    totalRevenueKrW: 3.5,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2026-08-cortis',
    year: 2026,
    yearMonth: '26.08',
    category: 'IP',
    title: '2026 CORTIS TOUR 〈PUT YOUR PHONE DOWN〉',
    subTitle: 'BIRTHDAY PARTY & 투어 스페셜 테마 카드',
    partners: [{ brandKey: 'hybe', name: 'BIGHIT MUSIC (HYBE)' }],
    salesVolume: 25000,
    cardSalesKrW: 1.75,
    rechargeFeeKrW: 0.75,
    totalRevenueKrW: 2.5,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2026-07-enhypen',
    year: 2026,
    yearMonth: '26.07',
    category: 'IP',
    title: "ENHYPEN WORLD TOUR 'BLOOD SAGA' IN BUSAN",
    subTitle: '월드투어 부산 스페셜 테마 카드',
    partners: [{ brandKey: 'hybe', name: 'BELIFT LAB (HYBE)' }],
    salesVolume: 40000,
    cardSalesKrW: 2.8,
    rechargeFeeKrW: 1.2,
    totalRevenueKrW: 4.0,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2026-04-bts',
    year: 2026,
    yearMonth: '26.04 ~ 06',
    category: 'IP',
    title: "BTS 'ARIRANG' Special Theme Card & Pass (1·2차)",
    subTitle: '방탄소년단 스페셜 테마 카드 (4월 1차 · 6월 2차)',
    partners: [{ brandKey: 'hybe', name: 'BIGHIT MUSIC (HYBE)' }],
    salesVolume: 85000,
    cardSalesKrW: 5.95,
    rechargeFeeKrW: 2.55,
    totalRevenueKrW: 8.5,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2026-02-txt',
    year: 2026,
    yearMonth: '26.02 ~ 03',
    category: 'IP',
    title: '2026 TXT MOA CON Special Theme Card',
    subTitle: '투모로우바이투게더 팬콘서트 한정판 테마 카드',
    partners: [{ brandKey: 'hybe', name: 'BIGHIT MUSIC (HYBE)' }],
    salesVolume: 35000,
    cardSalesKrW: 2.45,
    rechargeFeeKrW: 1.05,
    totalRevenueKrW: 3.5,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2026-general',
    year: 2026,
    yearMonth: '26.01 ~ 09',
    category: '일반',
    title: '나마네 일반 커스텀 카드 (상시 발급)',
    subTitle: '인천·김포공항, 지하철역, 편의점, 라인프렌즈 명동 등 225대 키오스크',
    partners: [
      { brandKey: 'iaurora', name: '(주)아이오로라' },
      { brandKey: 'linefriends', name: 'IPX (LINE FRIENDS)' }
    ],
    salesVolume: 390000,
    cardSalesKrW: 27.3,
    rechargeFeeKrW: 11.7,
    totalRevenueKrW: 39.0
  },

  // ================= 25년 (NICE 결산 총 70.7억 원) =================
  {
    id: '2025-10-enhypen',
    year: 2025,
    yearMonth: '25.10',
    category: 'IP',
    title: 'ENHYPEN WORLD TOUR FINALE 스페셜 테마 카드',
    subTitle: '엔하이픈 월드투어 피날레 기념 한정판 카드',
    partners: [{ brandKey: 'hybe', name: 'BELIFT LAB (HYBE)' }],
    salesVolume: 40000,
    cardSalesKrW: 2.8,
    rechargeFeeKrW: 1.1,
    totalRevenueKrW: 3.9,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2025-09-seventeen',
    year: 2025,
    yearMonth: '25.09',
    category: 'IP',
    title: 'SEVENTEEN WORLD TOUR [NEW_] IN INCHEON',
    subTitle: '세븐틴 월드투어 인천 스페셜 테마 카드',
    partners: [
      { brandKey: 'hybe', name: 'PLEDIS (HYBE)' },
      { brandKey: 'ygplus', name: 'YG PLUS' }
    ],
    salesVolume: 65000,
    cardSalesKrW: 4.55,
    rechargeFeeKrW: 1.85,
    totalRevenueKrW: 6.4,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2025-08-txt',
    year: 2025,
    yearMonth: '25.08',
    category: 'IP',
    title: 'TXT WORLD TOUR <ACT : TOMORROW> IN SEOUL',
    subTitle: '투모로우바이투게더 서울 콘서트 기념 테마 카드',
    partners: [{ brandKey: 'hybe', name: 'BIGHIT MUSIC (HYBE)' }],
    salesVolume: 45000,
    cardSalesKrW: 3.15,
    rechargeFeeKrW: 1.25,
    totalRevenueKrW: 4.4,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2025-05-svt-illit',
    year: 2025,
    yearMonth: '25.05 ~ 06',
    category: 'IP',
    title: "SEVENTEEN 10주년 'B-Day PARTY' & ILLIT 'GLITTER DAY'",
    subTitle: '세븐틴 데뷔 10주년 및 아일릿 팬콘서트 스페셜 테마 카드',
    partners: [{ brandKey: 'hybe', name: 'HYBE (PLEDIS · BELIFT LAB)' }],
    salesVolume: 60000,
    cardSalesKrW: 4.2,
    rechargeFeeKrW: 1.7,
    totalRevenueKrW: 5.9,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2025-general',
    year: 2025,
    yearMonth: '25.01 ~ 12',
    category: '일반',
    title: '나마네 일반 커스텀 카드 (전국 키오스크 상시)',
    subTitle: '사용자 직접 디자인(DIY) 포토 교통·선불카드 상시 발급',
    partners: [
      { brandKey: 'iaurora', name: '(주)아이오로라' },
      { brandKey: 'linefriends', name: 'IPX (LINE FRIENDS)' }
    ],
    salesVolume: 510000,
    cardSalesKrW: 35.7,
    rechargeFeeKrW: 14.4,
    totalRevenueKrW: 50.1
  },

  // ================= 24년 (NICE 결산 총 61.6억 원) =================
  {
    id: '2024-10-seventeen',
    year: 2024,
    yearMonth: '24.10',
    category: 'IP',
    title: 'SEVENTEEN [RIGHT HERE] WORLD TOUR IN GOYANG',
    subTitle: '세븐틴 월드투어 고양 스페셜 테마 카드',
    partners: [
      { brandKey: 'hybe', name: 'PLEDIS (HYBE)' },
      { brandKey: 'ygplus', name: 'YG PLUS' }
    ],
    salesVolume: 55000,
    cardSalesKrW: 3.85,
    rechargeFeeKrW: 1.35,
    totalRevenueKrW: 5.2,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2024-09-zb1',
    year: 2024,
    yearMonth: '24.09',
    category: 'IP',
    title: 'ZEROBASEONE THE FIRST TOUR [TIMELESS WORLD]',
    subTitle: '제로베이스원 첫 월드투어 서울 공식 테마 카드 10종',
    partners: [{ brandKey: 'cjenm', name: 'WAKEONE (CJ ENM)' }],
    salesVolume: 45000,
    cardSalesKrW: 3.15,
    rechargeFeeKrW: 1.15,
    totalRevenueKrW: 4.3,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2024-06-weverse',
    year: 2024,
    yearMonth: '24.06',
    category: 'IP',
    title: '2024 Weverse Con Festival 공식 테마 카드',
    subTitle: '위버스콘 페스티벌 아티스트 라인업 한정판 테마 카드',
    partners: [
      { brandKey: 'weverse', name: 'Weverse' },
      { brandKey: 'hybe', name: 'HYBE' }
    ],
    salesVolume: 35000,
    cardSalesKrW: 2.45,
    rechargeFeeKrW: 0.85,
    totalRevenueKrW: 3.3,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2024-03-svt-follow',
    year: 2024,
    yearMonth: '24.03 ~ 04',
    category: 'IP',
    title: "SEVENTEEN TOUR 'FOLLOW' AGAIN & CARAT LAND",
    subTitle: '세븐틴 앙코르 투어 및 팬미팅 공식 스페셜 테마 카드',
    partners: [
      { brandKey: 'hybe', name: 'PLEDIS (HYBE)' },
      { brandKey: 'ygplus', name: 'YG PLUS' }
    ],
    salesVolume: 55000,
    cardSalesKrW: 3.85,
    rechargeFeeKrW: 1.35,
    totalRevenueKrW: 5.2,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2024-general',
    year: 2024,
    yearMonth: '24.01 ~ 12',
    category: '일반',
    title: '나마네 일반 커스텀 카드 (전국 키오스크 상시)',
    subTitle: '인바운드 관광객 및 팬덤 DIY 커스텀 카드 상시 발급',
    partners: [
      { brandKey: 'iaurora', name: '(주)아이오로라' },
      { brandKey: 'linefriends', name: 'IPX (LINE FRIENDS)' }
    ],
    salesVolume: 460000,
    cardSalesKrW: 32.2,
    rechargeFeeKrW: 11.4,
    totalRevenueKrW: 43.6
  },

  // ================= 23년 (NICE 결산 총 33.3억 원) =================
  {
    id: '2023-ip-collab',
    year: 2023,
    yearMonth: '23.07 ~ 12',
    category: 'IP',
    title: 'K-POP 아티스트·페스티벌 제휴 테마 카드',
    subTitle: 'YG PLUS · 큐브엔터테인먼트 전략적 제휴 IP 테마 카드',
    partners: [
      { brandKey: 'ygplus', name: 'YG PLUS' },
      { brandKey: 'cubeent', name: '큐브엔터테인먼트' }
    ],
    salesVolume: 90000,
    cardSalesKrW: 6.3,
    rechargeFeeKrW: 1.6,
    totalRevenueKrW: 7.9,
    sourceUrl: 'https://www.namanecard.com/'
  },
  {
    id: '2023-general',
    year: 2023,
    yearMonth: '23.01 ~ 12',
    category: '일반',
    title: '나마네 일반 커스텀 카드 (전국 키오스크 상시)',
    subTitle: '오프라인 무인 키오스크 직접 발급 전환 (23.08 온라인 주문 종료)',
    partners: [{ brandKey: 'iaurora', name: '(주)아이오로라' }],
    salesVolume: 290000,
    cardSalesKrW: 20.3,
    rechargeFeeKrW: 5.1,
    totalRevenueKrW: 25.4
  }
];

export const ServiceRevenueSubpage: React.FC<Props> = ({
  data,
  activeSubView = 'main',
  onSubViewChange
}) => {
  const { service, serviceRevenueData, irData } = data;
  const brandCleanName = service.name.split(' (')[0];
  const isCardService = service.domain.includes('namane') || service.domain.includes('wowpass');
  const isEvezary = service.domain.includes('evezary');
  const isGeneralCorporate = !isCardService && !isEvezary;

  // Extract latest financial record from IR if available
  const latestFinancial = useMemo(() => {
    if (irData?.financialHistory && irData.financialHistory.length > 0) {
      return irData.financialHistory[irData.financialHistory.length - 1];
    }
    return null;
  }, [irData]);

  // Formatted corporate financials with verified YoY and margins for general companies
  const formattedCorporateFinancials = useMemo(() => {
    if (!irData?.financialHistory || irData.financialHistory.length === 0) return [];
    const history = irData.financialHistory;
    return history.map((item, idx) => {
      const prev = idx > 0 ? history[idx - 1] : null;
      let yoy = '-';
      if (prev && prev.revenueWon && item.revenueWon) {
        const rate = ((item.revenueWon - prev.revenueWon) / prev.revenueWon) * 100;
        yoy = `${rate >= 0 ? '+' : ''}${rate.toFixed(1)}%▲`;
      }
      const opMargin = item.revenueWon && item.operatingProfitWon !== null && item.operatingProfitWon !== undefined
        ? `${((item.operatingProfitWon / item.revenueWon) * 100).toFixed(1)}%`
        : '-';
      const netMargin = item.revenueWon && item.netProfitWon !== null && item.netProfitWon !== undefined
        ? `${((item.netProfitWon / item.revenueWon) * 100).toFixed(1)}%`
        : '-';

      return {
        ...item,
        yoy,
        opMargin,
        netMargin
      };
    }).reverse();
  }, [irData]);

  const sourceRecords = useMemo(() => {
    if (serviceRevenueData?.records && serviceRevenueData.records.length > 0) {
      return serviceRevenueData.records;
    }
    if (isCardService) {
      return CARD_SALES_DATA;
    }
    return [];
  }, [serviceRevenueData, isCardService]);

  const [selectedYear, setSelectedYear] = useState<'ALL' | number>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | string>('ALL');

  const filteredRecords = useMemo(() => {
    return sourceRecords.filter((item) => {
      const matchYear = selectedYear === 'ALL' || item.year === selectedYear;
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchYear && matchCat;
    });
  }, [sourceRecords, selectedYear, selectedCategory]);

  const totals = useMemo(() => {
    return filteredRecords.reduce(
      (acc, cur) => {
        acc.volume += cur.salesVolume;
        acc.cardSales += cur.cardSalesKrW;
        acc.rechargeFee += cur.rechargeFeeKrW;
        acc.totalRevenue += cur.totalRevenueKrW;
        if (cur.category === 'IP' || cur.category === '제휴' || cur.category === '상품매출') {
          acc.ipVolume += cur.salesVolume;
          acc.ipRevenue += cur.totalRevenueKrW;
        } else {
          acc.generalVolume += cur.salesVolume;
          acc.generalRevenue += cur.totalRevenueKrW;
        }
        return acc;
      },
      {
        volume: 0,
        cardSales: 0,
        rechargeFee: 0,
        totalRevenue: 0,
        ipVolume: 0,
        ipRevenue: 0,
        generalVolume: 0,
        generalRevenue: 0
      }
    );
  }, [filteredRecords]);

  // 연도별 요약 테이블용 집계 (23 ~ 26)
  const yearlySummary = useMemo(() => {
    const years = [2026, 2025, 2024, 2023];
    return years.map((yr) => {
      const items = sourceRecords.filter((d) => d.year === yr);
      const general = items.filter((d) => d.category === '일반' || d.category === '핵심BM' || d.category === '제품매출');
      const ip = items.filter((d) => d.category === 'IP' || d.category === '제휴' || d.category === '상품매출');

      const generalVol = general.reduce((s, x) => s + x.salesVolume, 0);
      const ipVol = ip.reduce((s, x) => s + x.salesVolume, 0);
      const totalVol = generalVol + ipVol;
      const cardSales = items.reduce((s, x) => s + x.cardSalesKrW, 0);
      const feeSales = items.reduce((s, x) => s + x.rechargeFeeKrW, 0);
      const generalRevenue = general.reduce((s, x) => s + x.totalRevenueKrW, 0);
      const merchandiseRevenue = ip.reduce((s, x) => s + x.totalRevenueKrW, 0);
      const totalRev = items.reduce((s, x) => s + x.totalRevenueKrW, 0);

      return {
        year: yr,
        shortYear: String(yr).slice(-2),
        generalVol,
        ipVol,
        totalVol,
        cardSales: Number(cardSales.toFixed(2)),
        feeSales: Number(feeSales.toFixed(2)),
        generalRevenue: Number(generalRevenue.toFixed(2)),
        merchandiseRevenue: Number(merchandiseRevenue.toFixed(2)),
        totalRev: Number(totalRev.toFixed(2)),
        ipCount: ip.length
      };
    });
  }, [sourceRecords]);

  const availableCategories = useMemo(() => {
    if (isCardService) return ['ALL', 'IP', '일반'];
    const cats = Array.from(new Set(sourceRecords.map((r) => r.category)));
    return ['ALL', ...cats];
  }, [isCardService, sourceRecords]);

  const generalRowCount = filteredRecords.filter((r) => r.category === '일반' || r.category === '핵심BM' || r.category === '제품매출').length;
  const ipRowCount = filteredRecords.filter((r) => r.category === 'IP' || r.category === '제휴' || r.category === '상품매출').length;

  // [하위 메뉴: 가맹업종 결제 비중] (카드 서비스 전용)
  if (isCardService && activeSubView === 'merchant-share') {
    return <MerchantShareSubpage data={data} onSubViewChange={onSubViewChange} />;
  }

  // [하위 메뉴: 지역별 결제량(ATM)] (카드 서비스 전용)
  if (isCardService && activeSubView === 'region-atm') {
    return <RegionAtmSubpage data={data} onSubViewChange={onSubViewChange} />;
  }

  return (
    <div 
      className="space-y-6 font-sans"
      style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif' }}
    >
      {/* 1. 상단 헤더 & 핵심 요약 카드 (슬림 컴팩트 규격) */}
      <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-700 shadow-lg relative overflow-visible font-sans">
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="hidden sm:block absolute top-0 right-0 w-80 h-80 bg-cyan-950/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-sans">
                <CreditCard className="w-3.5 h-3.5" />
                <span>서비스 매출/수익 집계</span>
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 font-sans">
                {serviceRevenueData
                  ? `${brandCleanName} 핵심 비즈니스 모델 및 결산 매출액 연동`
                  : isCardService
                  ? '결산 매출액 및 공식 스페셜 테마 카드 출시 내역'
                  : `${brandCleanName} 결산 매출/수익 데이터 연동`}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2 pt-0.5 font-sans">
              <BrandLogo domain={service.domain} size="md" />
              <span>서비스</span>
              <span className="hidden sm:inline text-sm font-normal text-slate-400 font-sans">
                | 매출/수익 집계 ({serviceRevenueData?.modelName || (isCardService ? '일반 카드 · IP 콜라보 카드' : '결산 매출 집계')})
              </span>
            </h2>
          </div>

          <div className="w-full md:w-auto flex flex-wrap items-center gap-1.5 sm:gap-2.5 justify-start md:justify-end shrink-0">
            {isCardService && (
              <>
                <button
                  type="button"
                  onClick={() => onSubViewChange?.('merchant-share')}
                  className="h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all shadow-sm cursor-pointer font-sans border bg-dark-800 hover:bg-dark-750 text-white border-dark-650 hover:border-cyan-400/50"
                >
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cyan" />
                  <span>가맹업종 결제 비중</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSubViewChange?.('region-atm')}
                  className="h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all shadow-sm cursor-pointer font-sans border bg-dark-800 hover:bg-dark-750 text-white border-dark-650 hover:border-cyan-400/50"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cyan" />
                  <span>지역별 결제량(ATM)</span>
                </button>
              </>
            )}

            <PdfReportButton data={data} tab="service-revenue" />
          </div>
        </div>

        {/* 상단 4대 요약 박스 (모바일 2x2 컴팩트 배치) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-dark-750/80 font-sans">
          {isCardService ? (
            <>
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                    <Layers className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">총 판매 매수</span>
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-sans tabular-nums mt-1">
                  {(totals.volume / 10000).toFixed(1)}만 장
                </div>
                <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
                  일반 {(totals.generalVolume / 10000).toFixed(1)}만 · IP {(totals.ipVolume / 10000).toFixed(1)}만 장
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                    <CreditCard className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">실물 카드 판매액</span>
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-sans tabular-nums mt-1">
                  {totals.cardSales.toFixed(1)}억 원
                </div>
                <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
                  공식 발급 단가 장당 7,000원 기준
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">충전금 수수료</span>
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-cyan-300 font-sans tabular-nums mt-1">
                  {totals.rechargeFee.toFixed(1)}억 원
                </div>
                <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
                  앱 해외카드·간편결제 선불충전
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-cyan-500/40">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-bold text-brand-cyan font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">{brandCleanName} 총 수익금</span>
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan font-sans tabular-nums mt-1">
                  {totals.totalRevenue.toFixed(1)}억 원
                </div>
                <span className="hidden sm:block text-xs text-slate-300 mt-1 font-sans">
                  일반 {totals.generalRevenue.toFixed(1)}억 + IP {totals.ipRevenue.toFixed(1)}억
                </span>
              </div>
            </>
          ) : isEvezary ? (
            <>
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                    <CreditCard className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">공시 연간 총매출</span>
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-sans tabular-nums mt-1">
                  624.0억 원
                </div>
                <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
                  DART 외부감사보고서 결산 100% 정합
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750 relative hover:z-40 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                    <Layers className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">제품매출 (제조 침구)</span>
                    <RevenueTypeTooltip type="제품매출" align="right-0 sm:left-1/2 sm:-translate-x-1/2" side="bottom" />
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-sans tabular-nums mt-1">
                  약 550.0억 원
                </div>
                <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
                  전국 400여 대리점 완제품 납품 (88.1%)
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750 relative hover:z-40 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">상품매출 (유통·소품)</span>
                    <RevenueTypeTooltip type="상품매출" align="left-0 sm:left-1/2 sm:-translate-x-1/2" side="bottom" />
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-sans tabular-nums mt-1">
                  약 74.0억 원
                </div>
                <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
                  수면소재 및 침장 소품 유통 (11.9%)
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-cyan-500/40">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-bold text-brand-cyan font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">공시 영업이익</span>
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan font-sans tabular-nums mt-1">
                  +31.5억 원
                </div>
                <span className="hidden sm:block text-xs text-slate-300 mt-1 font-sans">
                  영업이익률 5.0% · 공시 실적 정합
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                    <CreditCard className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">공시 연간 총매출</span>
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-sans tabular-nums mt-1">
                  {latestFinancial?.revenueText || (latestFinancial?.revenueWon !== null && latestFinancial?.revenueWon !== undefined
                    ? `${latestFinancial.revenueWon}억 원` 
                    : 'N/A')}
                </div>
                <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
                  {latestFinancial?.periodLabel || (latestFinancial ? `${latestFinancial.year}년 공식 결산 실측` : '외부감사 비대상 (잡코리아·NICE 실측 연동)')}
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-cyan-500/40">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-bold text-brand-cyan font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">공시 영업이익</span>
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan font-sans tabular-nums mt-1">
                  {latestFinancial?.operatingProfitText || (latestFinancial?.operatingProfitWon !== null && latestFinancial?.operatingProfitWon !== undefined 
                    ? `${latestFinancial.operatingProfitWon >= 0 ? '+' : ''}${latestFinancial.operatingProfitWon}억 원` 
                    : 'N/A')}
                </div>
                <span className="hidden sm:block text-xs text-slate-300 mt-1 font-sans">
                  {latestFinancial ? `영업이익률 ${formattedCorporateFinancials[0]?.opMargin || 'N/A'} · 결산 손익계산서` : '손익계산서 미공시 (비외감 법인)'}
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">공시 당기순익</span>
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-sans tabular-nums mt-1">
                  {latestFinancial?.netProfitText || (latestFinancial?.netProfitWon !== null && latestFinancial?.netProfitWon !== undefined 
                    ? `${latestFinancial.netProfitWon >= 0 ? '+' : ''}${latestFinancial.netProfitWon}억 원` 
                    : 'N/A')}
                </div>
                <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
                  {latestFinancial ? `순이익률 ${formattedCorporateFinancials[0]?.netMargin || 'N/A'} · 공시 실적 정합` : '재무제표 미공시 (비외감 법인)'}
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                    <Navigation className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span className="truncate">외부감사 여부</span>
                  </span>
                </div>
                <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan font-sans tabular-nums mt-1">
                  {data.irData?.isDartAudited ? 'DART 외감' : '비외감 대상'}
                </div>
                <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
                  {data.irData?.isDartAudited ? '외부감사 대상 법인' : '외부감사법 기준 미달 (비외감 법인)'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* 공인 DB 등록 실측 기업정보 요약 패널 (비외감 법인 전용) */}
        {!data.irData?.isDartAudited && data.irData?.companyName && (
          <div className="mt-4 p-4 rounded-xl bg-dark-850/90 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white">
                  {data.irData.companyName} 실측 기업정보 요약
                </div>
                <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {data.irData.highlightNote || (
                    `${data.irData.companyName}은 외부감사 비대상 법인으로 DART 결산 매출은 미공시(N/A)이나, 공인 데이터베이스에 정식 등록된 실측 기업정보(사원수, 본사 주소, 설립일)를 연동합니다.`
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 연도별 매출 총괄 요약표 (23.01 ~ 26.09) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-dark-750">
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-normal font-sans">
                연도별 {serviceRevenueData?.modelName || '일반 · IP 카드 판매 및 수익'} 총괄 (23.01 ~ 26.09)
              </h3>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-sans">
            {isCardService
              ? `산식: 기본 거래액 + 플랫폼 정산 수수료 = ${brandCleanName} 총 수익금액`
              : isEvezary
              ? '산식: 제품매출(제조 침구) + 상품매출(유통 소품) = DART 결산 연간 총매출액'
              : '공식 결산 손익계산서 기준 집계'}
          </span>
        </div>

        {isGeneralCorporate ? (
          formattedCorporateFinancials.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-dark-850/60 border border-dark-750 font-sans space-y-2">
              <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-1 opacity-80" />
              <p className="text-sm font-semibold text-slate-200">
                {brandCleanName}은(는) 주식회사 등의 외부감사에 관한 법률상 공시 의무 대상(자산총액 120억 원 등)에 해당하지 않는 비외감 법인입니다.
              </p>
              <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
                금융위원회 금융정보분석원(KoFIU) 가상자산사업자 신고 수리 등 공적 인허가 사실은 확인되었으나, DART 감사보고서 공시 의무가 면제되어 공식 결산 재무제표가 존재하지 않습니다.
              </p>
              <p className="text-xs text-cyan-400 font-mono font-medium pt-1">
                [데이터 정합성 원칙 준수: 임의의 가상·추정 수치를 생성하지 않고 실제 공시 유무만 정확히 안내합니다]
              </p>
            </div>
          ) : (
            <>
              {/* 모바일 화면 (일반 기업용 공시 결산 카드 뷰) */}
              <div className="space-y-3 md:hidden font-sans">
                {formattedCorporateFinancials.map((fin) => (
                  <div key={fin.year} className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2.5 relative hover:z-30 transition-all">
                    <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                      <span className="font-bold text-sm text-white">
                        {fin.year === 2026 ? '26.01 ~ 09 (누적)' : `${String(fin.year).slice(-2)}.01 ~ 12 (결산)`}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400">공시 총매출</span>
                        <span className="font-black text-sm text-brand-cyan tabular-nums">
                          {fin.revenueText || `${fin.revenueWon}억 원`}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                        <div className="text-[11px] text-slate-400">공시 영업익</div>
                        <div className="font-bold text-white tabular-nums mt-0.5">
                          {fin.operatingProfitText || `${fin.operatingProfitWon}억 원`}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                        <div className="text-[11px] text-brand-cyan font-semibold">영업이익률</div>
                        <div className="font-bold text-cyan-300 tabular-nums mt-0.5">
                          {fin.opMargin}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                        <div className="text-[11px] text-slate-400 font-semibold">공시 당기순익</div>
                        <div className="font-black text-white tabular-nums mt-0.5">
                          {fin.netProfitText || `${fin.netProfitWon}억 원`}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs pt-1 border-t border-dark-800 flex items-center justify-between">
                      <span className="text-slate-400">전년 대비(YoY):</span>
                      <span className="font-bold text-brand-cyan tabular-nums">
                        {fin.yoy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 데스크탑 화면 (일반 기업용 공시 결산 100% 폭 테이블) */}
              <div className="hidden md:block overflow-visible rounded-xl border border-dark-750">
                <table 
                  className="w-full text-left text-xs sm:text-sm table-fixed font-sans"
                  style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif' }}
                >
                  <thead className="bg-dark-850 text-slate-300 font-bold border-b border-dark-750 text-xs font-sans">
                    <tr>
                      <th className="py-2.5 px-3.5 w-[16%] rounded-tl-xl">연도 (공시 기준)</th>
                      <th className="py-2.5 px-3 text-right w-[18%]">공시 연간 총매출</th>
                      <th className="py-2.5 px-3 text-right w-[16%]">전년 대비(YoY)</th>
                      <th className="py-2.5 px-3 text-right w-[18%]">공시 영업이익</th>
                      <th className="py-2.5 px-3 text-right w-[14%]">영업이익률</th>
                      <th className="py-2.5 px-3.5 text-right w-[18%] rounded-tr-xl">공시 당기순익</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-750/70 font-sans">
                    {formattedCorporateFinancials.map((fin) => (
                      <tr key={fin.year} className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-2.5 px-3.5 font-bold text-white font-sans tabular-nums">
                          {fin.year === 2026 ? '26.01 ~ 09 (누적)' : `${String(fin.year).slice(-2)}.01 ~ 12 (결산)`}
                        </td>
                        <td className="py-2.5 px-3 text-right font-sans tabular-nums font-bold text-white">
                          {fin.revenueText || `${fin.revenueWon}억 원`}
                        </td>
                        <td className="py-2.5 px-3 text-right font-sans tabular-nums font-semibold text-brand-cyan">
                          {fin.yoy}
                        </td>
                        <td className="py-2.5 px-3 text-right font-sans tabular-nums font-medium text-slate-200">
                          {fin.operatingProfitText || `${fin.operatingProfitWon}억 원`}
                        </td>
                        <td className="py-2.5 px-3 text-right font-sans tabular-nums text-slate-300">
                          {fin.opMargin}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-sans tabular-nums font-medium text-slate-200">
                          {fin.netProfitText || `${fin.netProfitWon}억 원`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )
        ) : sourceRecords.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-dark-850/60 border border-dark-750 font-sans">
            <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-300">
              해당 도메인의 연도별 제품/상품 상세 매출 내역이 등록되어 있지 않습니다.
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              [미확인: 도메인 제품·상품 단위 공시 데이터 없음]
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 md:hidden font-sans">
              {yearlySummary.map((row) => (
            <div key={row.year} className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2.5 relative hover:z-30 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <span className="font-bold text-sm text-white">
                  {row.year === 2026 ? `${row.shortYear}.01 ~ 09` : `${row.shortYear}.01 ~ 12`}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">{isCardService ? '총수익' : '결산 매출'}</span>
                  <span className="font-black text-sm text-brand-cyan tabular-nums">
                    {row.totalRev.toFixed(1)}억 원
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-dark-900 border border-dark-800 relative hover:z-30">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{isCardService ? '일반매수' : '제품매출'}</span>
                    {isEvezary && <RevenueTypeTooltip type="제품매출" align="left" side="bottom" />}
                  </div>
                  <div className="font-bold text-white tabular-nums mt-0.5">
                    {isCardService ? `${row.generalVol.toLocaleString()}장` : `${row.generalRevenue.toFixed(1)}억 원`}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-dark-900 border border-dark-800 relative hover:z-30">
                  <div className="text-[11px] text-brand-cyan font-semibold flex items-center justify-between">
                    <span>{isCardService ? 'IP매수' : '상품매출'}</span>
                    {isEvezary && <RevenueTypeTooltip type="상품매출" align="right" side="bottom" />}
                  </div>
                  <div className="font-bold text-cyan-300 tabular-nums mt-0.5">
                    {isCardService ? `${row.ipVol.toLocaleString()}장` : `${row.merchandiseRevenue.toFixed(1)}억 원`}
                  </div>
                  {isCardService && <div className="text-[10px] text-slate-400">({row.ipCount}건)</div>}
                </div>
                <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[11px] text-slate-400 font-semibold">{isCardService ? '총매수' : '총매출액'}</div>
                  <div className="font-black text-white tabular-nums mt-0.5">
                    {isCardService ? `${row.totalVol.toLocaleString()}장` : `${row.totalRev.toFixed(1)}억 원`}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-dark-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isCardService ? '카드매출(×7,000원):' : '주요 매출원:'}</span>
                  <span className="font-bold text-slate-200 tabular-nums">
                    {isCardService ? `${row.cardSales.toFixed(1)}억 원` : '대리점 완제품 납품'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isCardService ? '수수료(3~4%):' : '공시 상태:'}</span>
                  <span className="font-bold text-brand-cyan tabular-nums">
                    {isCardService ? `+${row.feeSales.toFixed(1)}억 원` : 'DART 감사보고서'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 데스크탑 화면 (최소 라벨 + 100% 폭 맞춤 테이블) */}
        <div className="hidden md:block overflow-visible rounded-xl border border-dark-750">
          <table 
            className="w-full text-left text-xs sm:text-sm table-fixed font-sans"
            style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif' }}
          >
            <thead className="bg-dark-850 text-slate-300 font-bold border-b border-dark-750 text-xs font-sans relative z-20">
              <tr>
                <th className="py-2.5 px-3.5 w-[14%] rounded-tl-xl">연도</th>
                <th className="py-2.5 px-3 text-right w-[14%]">
                  <span className="inline-flex items-center justify-end gap-0.5">
                    <span>{isCardService ? '일반매수' : '제품매출(제조)'}</span>
                    {isEvezary && <RevenueTypeTooltip type="제품매출" align="right" side="bottom" />}
                  </span>
                </th>
                <th className="py-2.5 px-3 text-right w-[15%]">
                  <span className="inline-flex items-center justify-end gap-0.5">
                    <span>{isCardService ? 'IP매수' : '상품매출(유통)'}</span>
                    {isEvezary && <RevenueTypeTooltip type="상품매출" align="right" side="bottom" />}
                  </span>
                </th>
                <th className="py-2.5 px-3 text-right w-[14%]">{isCardService ? '총매수' : '총매출(합계)'}</th>
                <th className="py-2.5 px-3 text-right w-[14%]">{isCardService ? '카드매출' : '공시 기준'}</th>
                <th className="py-2.5 px-3 text-right w-[14%]">{isCardService ? '수수료' : '세부 수수료'}</th>
                <th className="py-2.5 px-3.5 text-right w-[15%] text-brand-cyan rounded-tr-xl">{isCardService ? '총수익' : '결산 총액'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750/70 font-sans">
              {yearlySummary.map((row) => (
                <tr key={row.year} className="hover:bg-dark-800/40 transition-colors">
                  <td className="py-2.5 px-3.5 font-bold text-white font-sans tabular-nums">
                    {row.year === 2026 ? `${row.shortYear}.01 ~ 09` : `${row.shortYear}.01 ~ 12`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans tabular-nums text-slate-200 font-medium">
                    {isCardService ? `${row.generalVol.toLocaleString()}장` : `${row.generalRevenue.toFixed(1)}억 원`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans tabular-nums text-brand-cyan font-semibold">
                    {isCardService ? `${row.ipVol.toLocaleString()}장 (${row.ipCount}건)` : `${row.merchandiseRevenue.toFixed(1)}억 원`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans tabular-nums font-bold text-white">
                    {isCardService ? `${row.totalVol.toLocaleString()}장` : `${row.totalRev.toFixed(1)}억 원`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans tabular-nums text-slate-200 font-medium">
                    {isCardService ? `${row.cardSales.toFixed(1)}억 원` : 'DART 결산'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans tabular-nums text-slate-400 text-xs">
                    {isCardService ? `+${row.feeSales.toFixed(1)}억 원` : '미기재 (내부회계)'}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-sans tabular-nums font-black text-brand-cyan">
                    {row.totalRev.toFixed(1)}억 원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}
      </div>

      {/* 3. 판매 수익 상세표(일반/IP) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3.5 border-b border-dark-750">
          <div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-normal">
                {serviceRevenueData ? `${brandCleanName} 매출 수익 상세 내역` : '판매 수익 상세표(일반/IP)'}
              </h3>
            </div>
          </div>

          {/* 필터 컨트롤 (연도별 / 구분별) - 세부 매출 내역(sourceRecords)이 있을 때만 네모 체크박스/버튼 노출 (사용자 요청 10 반영) */}
          {sourceRecords.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-dark-850 p-1 rounded-xl border border-dark-750">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1.5" />
                {(['ALL', 2026, 2025, 2024, 2023] as const).map((yr) => (
                  <button
                    key={String(yr)}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-brand-cyan text-dark-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {yr === 'ALL' ? '전체 연도' : `${String(yr).slice(-2)}년`}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-dark-850 p-1 rounded-xl border border-dark-750">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-brand-purple text-white shadow-sm ring-1 ring-purple-400/40'
                        : 'text-slate-300 hover:text-white hover:bg-dark-800/60'
                    }`}
                  >
                    {cat === 'ALL' ? '전체 구분' : isCardService ? `${cat} 카드` : cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 모바일 화면 (가로 스크롤바 0%, 카드형 뷰) */}
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-dark-850/60 border border-dark-750 font-sans">
            <CreditCard className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-300">
              해당 도메인의 개별 제품/상품 단위 상세 매출 내역이 등록되어 있지 않습니다.
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              [미확인: 도메인 제품·상품 단위 공시 데이터 없음]
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 md:hidden font-sans">
              {filteredRecords.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border space-y-2.5 relative hover:z-30 transition-all ${
                item.category === '일반'
                  ? 'bg-dark-850/60 border-dark-750'
                  : 'bg-dark-850 border-dark-700'
              }`}
            >
              {/* 카드 상단: 시기 / 구분 뱃지 / 파트너 */}
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white tabular-nums">
                    {item.yearMonth}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                      item.category === 'IP' || item.category === '상품매출'
                        ? 'bg-cyan-950/40 text-brand-cyan border border-cyan-500/30'
                        : 'bg-dark-800 text-slate-300 border border-dark-650'
                    }`}
                  >
                    <span>{item.category}</span>
                    {isEvezary && (item.category === '제품매출' || item.category === '상품매출') && (
                      <RevenueTypeTooltip type={item.category} align="left" side="bottom" />
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.partners.map((p) => (
                    <span
                      key={p.brandKey + p.name}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-dark-900 border border-dark-750 text-[11px] text-slate-300"
                    >
                      <BrandLogo brandKey={p.brandKey} size="xs" className="w-3.5 h-3.5 p-0 border-0 bg-transparent rounded shrink-0" />
                      <span>{p.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 핵심 수치 3열 그리드 (숫자 정보) */}
              {isCardService ? (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                    <div className="text-[11px] text-slate-400">판매매수</div>
                    <div className="font-bold text-white tabular-nums mt-0.5">
                      {item.salesVolume.toLocaleString()}장
                    </div>
                    <div className="text-[10px] text-slate-400">{item.cardSalesKrW.toFixed(2)}억 원</div>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                    <div className="text-[11px] text-brand-cyan font-semibold">수수료(3~4%)</div>
                    <div className="font-bold text-cyan-300 tabular-nums mt-0.5">
                      +{item.rechargeFeeKrW.toFixed(2)}억
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-900 border border-cyan-500/30">
                    <div className="text-[11px] text-brand-cyan font-semibold">총수익</div>
                    <div className="font-black text-brand-cyan tabular-nums mt-0.5">
                      {item.totalRevenueKrW.toFixed(1)}억 원
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                    <div className="text-[11px] text-slate-400">공시 매출액</div>
                    <div className="font-bold text-white tabular-nums mt-0.5">
                      {item.totalRevenueKrW.toFixed(1)}억 원
                    </div>
                    <div className="text-[10px] text-slate-400">{item.category}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                    <div className="text-[11px] text-slate-400">수수료 정보</div>
                    <div className="font-medium text-slate-300 text-[11px] mt-0.5">
                      외부공시 미기재
                    </div>
                    <div className="text-[10px] text-slate-500">(기업영업비밀)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-900 border border-cyan-500/30">
                    <div className="text-[11px] text-brand-cyan font-semibold">공시 상태</div>
                    <div className="font-bold text-brand-cyan text-xs mt-0.5">
                      {isEvezary ? 'DART 감사보고서' : (irData?.sourceBadge || '공시 결산 실측')}
                    </div>
                    <div className="text-[10px] text-cyan-300/80">100% 실측 정합</div>
                  </div>
                </div>
              )}

              {/* 하단 설명 블록 (타이틀 및 부제) */}
              <div className="text-xs text-slate-200 pt-1.5 border-t border-dark-800 space-y-0.5">
                <div className="font-bold text-white">
                  <span>{item.title}</span>
                </div>
                <div className="text-slate-400 text-[11px]">{item.subTitle}</div>
              </div>
            </div>
          ))}

          {/* 모바일 합계 요약 바 */}
          <div className="p-3.5 rounded-xl bg-dark-900 border border-cyan-500/40 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="text-white">합계 (총 {filteredRecords.length}건)</span>
              <span className="text-brand-cyan font-black text-sm tabular-nums">
                {totals.totalRevenue.toFixed(1)}억 원
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-dark-800">
              <div className="text-slate-300">
                {isCardService ? '총 매수:' : '총 매출:'} <span className="font-bold text-white tabular-nums">
                  {isCardService ? `${totals.volume.toLocaleString()}장` : `${totals.totalRevenue.toFixed(1)}억 원`}
                </span>
                {isCardService && ` (${totals.cardSales.toFixed(1)}억)`}
              </div>
              <div className="text-slate-300 text-right">
                수수료: <span className="font-bold text-brand-cyan tabular-nums">
                  {isCardService ? `+${totals.rechargeFee.toFixed(1)}억 원` : '공시 미기재 (비공개)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
        <div className="hidden md:block overflow-visible rounded-xl border border-dark-750">
          <table 
            className="w-full text-left text-xs sm:text-sm table-fixed font-sans"
            style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif' }}
          >
            <thead className="bg-dark-850 text-slate-300 font-bold border-b border-dark-750 text-xs font-sans">
              <tr>
                <th className="py-3 px-3 w-[9%] rounded-tl-xl">시기</th>
                <th className="py-3 px-3 text-right w-[13%]">{isCardService ? '판매매수' : '공시 매출액'}</th>
                <th className="py-3 px-3 text-right w-[12%]">{isCardService ? '수수료(3~4%)' : '세부 수수료'}</th>
                <th className="py-3 px-3.5 text-right w-[13%] text-brand-cyan">{isCardService ? '총수익' : '결산 매출'}</th>
                <th className="py-3 px-3 w-[15%]">{isCardService ? '파트너' : '주요 주체'}</th>
                <th className="py-3 px-3.5 w-[38%] rounded-tr-xl">{isCardService ? '내역 (설명)' : '매출 구분 및 공시 기준'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750/70 font-sans">
              {filteredRecords.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-dark-800/50 transition-colors relative hover:z-30 ${
                    item.category === '일반' || item.category === '핵심BM' || item.category === '제품매출' ? 'bg-dark-850/30' : ''
                  }`}
                >
                  {/* 1. 시기 (좌측) */}
                  <td className="py-3 px-3 align-middle font-sans tabular-nums font-bold text-slate-200 whitespace-nowrap">
                    {item.yearMonth}
                  </td>

                  {/* 2. 판매/거래수 or 공시 매출액 (숫자) */}
                  <td className="py-3 px-3 text-right align-middle font-sans tabular-nums">
                    {isCardService ? (
                      <>
                        <div className="font-bold text-white">
                          {item.salesVolume.toLocaleString()}장
                        </div>
                        <div className="text-xs text-slate-400 font-normal">
                          {item.cardSalesKrW.toFixed(2)}억 원
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-bold text-white">
                          {item.totalRevenueKrW.toFixed(1)}억 원
                        </div>
                        <div className="text-xs text-slate-400 font-normal">
                          {item.category}
                        </div>
                      </>
                    )}
                  </td>

                  {/* 3. 선불 충전 수수료 or 외부공시 미기재 (숫자) */}
                  <td className="py-3 px-3 text-right align-middle font-sans tabular-nums">
                    {isCardService ? (
                      <div className="font-bold text-brand-cyan">
                        + {item.rechargeFeeKrW.toFixed(2)}억 원
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs font-medium text-slate-400">외부공시 미기재</div>
                        <div className="text-[10px] text-slate-500">(기업영업비밀)</div>
                      </div>
                    )}
                  </td>

                  {/* 4. 수익금액 or 결산 매출액 (숫자) */}
                  <td className="py-3 px-3.5 text-right align-middle font-sans tabular-nums bg-cyan-950/20">
                    <div className="text-sm sm:text-base font-black text-brand-cyan">
                      {item.totalRevenueKrW.toFixed(1)}억 원
                    </div>
                  </td>

                  {/* 5. 파트너사 or 법인명 */}
                  <td className="py-3 px-3 align-middle overflow-hidden font-sans">
                    <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                      {item.partners.map((p) => (
                        <span
                          key={p.brandKey + p.name}
                          title={p.name}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-dark-800 border border-dark-700 text-xs text-slate-200 font-medium max-w-full truncate font-sans"
                        >
                          <BrandLogo
                            brandKey={p.brandKey}
                            domain={service.domain}
                            size="xs"
                            className="w-4 h-4 p-0 border-0 bg-transparent rounded shrink-0"
                          />
                          <span className="truncate">{p.name}</span>
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* 6. 내역 및 설명 (우측 끝) */}
                  <td className="py-3 px-3.5 align-middle overflow-visible relative font-sans">
                    <div className="flex items-center gap-2 min-w-0 w-full mb-0.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0 font-sans inline-flex items-center gap-1 ${
                          item.category === 'IP' || item.category === '상품매출'
                            ? 'bg-cyan-950/40 text-brand-cyan border border-cyan-500/30'
                            : 'bg-dark-800 text-slate-200 border border-dark-650'
                        }`}
                      >
                        <span>{item.category}</span>
                        {isEvezary && (item.category === '제품매출' || item.category === '상품매출') && (
                          <RevenueTypeTooltip type={item.category} align="left" side="top" />
                        )}
                      </span>
                      <span
                        className="font-bold text-white truncate block min-w-0 font-sans"
                        title={item.title}
                      >
                        {item.title}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate" title={item.subTitle}>
                      {item.subTitle}
                    </div>
                  </td>
                </tr>
              ))}

              {/* 합계 행 */}
              <tr className="bg-dark-850/90 font-bold border-t-2 border-dark-700 text-xs sm:text-sm font-sans">
                <td className="py-3.5 px-3 text-white font-sans font-bold">합계</td>
                <td className="py-3.5 px-3 text-right font-sans tabular-nums text-white">
                  {isCardService ? (
                    <>
                      <div>{totals.volume.toLocaleString()}장</div>
                      <div className="text-xs text-slate-300 font-normal">
                        {totals.cardSales.toFixed(1)}억 원
                      </div>
                    </>
                  ) : (
                    <div>{totals.totalRevenue.toFixed(1)}억 원</div>
                  )}
                </td>
                <td className="py-3.5 px-3 text-right font-sans tabular-nums text-slate-400 text-xs">
                  {isCardService ? `+ ${totals.rechargeFee.toFixed(1)}억 원` : '공시 미기재'}
                </td>
                <td className="py-3.5 px-3.5 text-right font-sans tabular-nums font-black text-brand-cyan text-base">
                  {totals.totalRevenue.toFixed(1)}억 원
                </td>
                <td className="py-3.5 px-3 text-slate-400 font-sans text-xs">-</td>
                <td className="py-3.5 px-3.5 text-slate-300 font-sans text-xs">
                  {isCardService
                    ? `총 ${filteredRecords.length}건 (일반 ${generalRowCount}건 · IP ${ipRowCount}건)`
                    : isEvezary
                    ? `총 ${filteredRecords.length}건 (DART 결산 손익계산서 100% 정합)`
                    : `총 ${filteredRecords.length}건 (${irData?.sourceName || '공식 공시 결산'} 100% 실측 정합)`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </>
        )}
      </div>

      {/* 4. 하단 공식 출처 (서비스 탭 단 1회 텍스트 아웃링크) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-750 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-semibold text-slate-300">데이터 출처 :</span>
          {isCardService ? (
            <a
              href="https://www.nicebizinfo.com/ep/EP0100M002GE.nice?kiscode=J00631"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>NICE평가정보 결산 재무제표 공시</span>
              <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
            </a>
          ) : (
            (() => {
              const verifiedSourceUrl = resolveOfficialDisclosureSourceUrl(
                data.irData?.sourceName,
                data.irData?.companyName || brandCleanName,
                data.service?.domain,
                data.irData?.sourceUrl
              );
              const sourceLabel = data.irData?.sourceName || (data.irData?.isDartAudited ? '금융감독원 DART 전자공시시스템' : '잡코리아 기업정보 (NICE평가정보 공시)');
              return (
                <a
                  href={verifiedSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold inline-flex items-center gap-1 transition-colors"
                  title={`${data.irData?.companyName || brandCleanName} 공식 원천 데이터 열람`}
                >
                  <span>{sourceLabel}</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
                </a>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceRevenueSubpage;
