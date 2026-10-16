import React, { useState } from 'react';
import {
  CreditCard,
  Layers,
  Store,
  MapPin,
  ShieldCheck,
  PieChart,
  Navigation,
  Building2,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { CompleteServiceIntelligence } from '../../types/intelligence';
import type { SubViewId } from '../Header';
import { BrandLogo } from '../BrandLogo';
import { PdfReportButton } from '../PdfReportButton';

interface Props {
  data: CompleteServiceIntelligence;
  onSubViewChange?: (subView: SubViewId) => void;
}

export interface PortionSlice {
  label: string;
  pct: number;
  valueText?: string;
  subText?: string;
  color: string;
  isOther?: boolean;
}

// ============================================================================
// [실측 데이터 출처]: NAMANE_거래분석_공유용.html (26.01 ~ 26.06 아이오로라 내부 거래 데이터)
// - kb_sido: 전국 17개 시도 결제건수 및 금액
// - kb_sido_gu: 주요 구별 결제건수 및 금액
// - dep_types: 키오스크(현금/신용) ATM 충전 194,997건 / 111.1억 원
// ============================================================================

// 1. 전국 시·도 결제량 포션 (총 161.96억 원 기준)
const NATIONWIDE_PORTION_SLICES: PortionSlice[] = [
  {
    label: '서울',
    pct: 79.6,
    valueText: '128.99억 원',
    subText: '1,007,422건',
    color: '#38bdf8',
  },
  {
    label: '경기',
    pct: 5.4,
    valueText: '8.82억 원',
    subText: '86,897건',
    color: '#818cf8',
  },
  {
    label: '부산',
    pct: 5.1,
    valueText: '8.25억 원',
    subText: '74,669건',
    color: '#34d399',
  },
  {
    label: '인천',
    pct: 4.9,
    valueText: '7.94억 원',
    subText: '94,504건',
    color: '#f472b6',
  },
  {
    label: '기타 (13개 시·도)',
    pct: 5.0,
    valueText: '7.95억 원',
    subText: '제주·충남·강원·대구 외 94,397건',
    color: '#475569',
    isOther: true,
  },
];

// 2. 서울시 자치구 결제량 포션 (서울 128.99억 원 기준, 10% 기준 적용)
const SEOUL_DISTRICT_SLICES: PortionSlice[] = [
  {
    label: '마포구',
    pct: 24.4,
    valueText: '31.48억 원',
    subText: '247,402건 · 홍대·합정·연남',
    color: '#38bdf8',
  },
  {
    label: '중구',
    pct: 19.2,
    valueText: '24.80억 원',
    subText: '153,951건 · 명동·을지로·동대문',
    color: '#818cf8',
  },
  {
    label: '성동구',
    pct: 13.1,
    valueText: '16.84억 원',
    subText: '114,773건 · 성수 팝업·카페거리',
    color: '#34d399',
  },
  {
    label: '강남구',
    pct: 10.6,
    valueText: '13.67억 원',
    subText: '96,873건 · 강남역·신사·코엑스',
    color: '#f472b6',
  },
  {
    label: '기타 (10% 이내 구)',
    pct: 32.7,
    valueText: '42.20억 원',
    subText: '용산·종로·서대문·영등포·송파 외',
    color: '#475569',
    isOther: true,
  },
];

// 3. 지방 Top 3 시·도 결제량 포션 (서울 제외 지방 합계 32.97억 원 기준)
const PROVINCE_TOP3_SLICES: PortionSlice[] = [
  {
    label: '경기',
    pct: 26.7,
    valueText: '8.82억 원',
    subText: '86,897건 · 성남·하남·수원·고양',
    color: '#818cf8',
  },
  {
    label: '부산',
    pct: 25.0,
    valueText: '8.25억 원',
    subText: '74,669건 · 해운대·서면·남포동',
    color: '#34d399',
  },
  {
    label: '인천',
    pct: 24.1,
    valueText: '7.94억 원',
    subText: '94,504건 · 인천공항 T1/T2 관문',
    color: '#f472b6',
  },
  {
    label: '기타 지방 시·도',
    pct: 24.2,
    valueText: '7.95억 원',
    subText: '제주·충남·강원·대구 외 10개 시도',
    color: '#475569',
    isOther: true,
  },
];

// 각 시별 구/시/군 ATM/키오스크 사용량 상세 데이터
interface DistrictAtmUsage {
  sido: string;
  rankInSido: number;
  district: string;
  count: number;
  amount: number; // 원 단위
  shareInSido: number;
  atmCount: number;
  keyLocation: string;
}

const DISTRICT_ATM_TABLE: DistrictAtmUsage[] = [
  // 서울특별시 (52개소)
  {
    sido: '서울시',
    rankInSido: 1,
    district: '마포구',
    count: 247402,
    amount: 3148185998,
    shareInSido: 24.4,
    atmCount: 11,
    keyLocation: '홍대입구역(2호선·공철), 합정역, 연남동 카페거리 키오스크 집중지',
  },
  {
    sido: '서울시',
    rankInSido: 2,
    district: '중구',
    count: 153951,
    amount: 2480428201,
    shareInSido: 19.2,
    atmCount: 10,
    keyLocation: '명동역, 라인프렌즈 명동 플래그십, 을지로입구역, DDP 동대문',
  },
  {
    sido: '서울시',
    rankInSido: 3,
    district: '성동구',
    count: 114773,
    amount: 1683952441,
    shareInSido: 13.1,
    atmCount: 7,
    keyLocation: '성수역 2호선, 서울숲 팝업스토어, SM 사옥 인근 키오스크',
  },
  {
    sido: '서울시',
    rankInSido: 4,
    district: '강남구',
    count: 96873,
    amount: 1366993720,
    shareInSido: 10.6,
    atmCount: 6,
    keyLocation: '강남역 지하쇼핑센터, 신사역 가로수길, 삼성역 코엑스몰',
  },
  {
    sido: '서울시',
    rankInSido: 5,
    district: '용산구',
    count: 46688,
    amount: 846335906,
    shareInSido: 6.6,
    atmCount: 4,
    keyLocation: '용산역 KTX 환승역사, 아이파크몰, 하이브(HYBE) 본사, 이태원역',
  },
  {
    sido: '서울시',
    rankInSido: 6,
    district: '종로구',
    count: 43487,
    amount: 535893605,
    shareInSido: 4.2,
    atmCount: 3,
    keyLocation: '안국역, 인사동 쌈지길, 광화문역, 익선동 한옥마을',
  },
  {
    sido: '서울시',
    rankInSido: 7,
    district: '서대문구',
    count: 47707,
    amount: 474831620,
    shareInSido: 3.7,
    atmCount: 3,
    keyLocation: '신촌역 2호선 로데오거리, 이대역, 연희동 맛집거리',
  },
  {
    sido: '서울시',
    rankInSido: 8,
    district: '영등포구',
    count: 42680,
    amount: 464120753,
    shareInSido: 3.6,
    atmCount: 3,
    keyLocation: '여의도 더현대 서울, 영등포역 타임스퀘어 복합몰',
  },
  {
    sido: '서울시',
    rankInSido: 9,
    district: '송파구',
    count: 45417,
    amount: 364519943,
    shareInSido: 2.8,
    atmCount: 2,
    keyLocation: '잠실역 롯데월드몰, 석촌호수 송리단길 키오스크',
  },
  {
    sido: '서울시',
    rankInSido: 10,
    district: '광진구',
    count: 28122,
    amount: 267007916,
    shareInSido: 2.1,
    atmCount: 2,
    keyLocation: '건대입구역 맛의거리, 성수 북부 연계 상권',
  },
  {
    sido: '서울시',
    rankInSido: 11,
    district: '서초구',
    count: 19858,
    amount: 253400762,
    shareInSido: 2.0,
    atmCount: 1,
    keyLocation: '고속터미널 센트럴시티, 신세계백화점 강남점',
  },

  // 인천광역시 (11개소)
  {
    sido: '인천광역시',
    rankInSido: 1,
    district: '중구',
    count: 73684,
    amount: 642192817,
    shareInSido: 80.9,
    atmCount: 8,
    keyLocation: '인천국제공항 제1·2터미널 입국장 키오스크, 영종도 파라다이스시티',
  },
  {
    sido: '인천광역시',
    rankInSido: 2,
    district: '부평구',
    count: 8420,
    amount: 65120300,
    shareInSido: 8.2,
    atmCount: 1,
    keyLocation: '부평역 지하상가 환승역사, 부평 문화의거리',
  },
  {
    sido: '인천광역시',
    rankInSido: 3,
    district: '연수구',
    count: 6850,
    amount: 52180400,
    shareInSido: 6.6,
    atmCount: 1,
    keyLocation: '송도 센트럴파크, 현대프리미엄아울렛 송도점',
  },
  {
    sido: '인천광역시',
    rankInSido: 4,
    district: '남동구',
    count: 5550,
    amount: 34195100,
    shareInSido: 4.3,
    atmCount: 1,
    keyLocation: '구월동 로데오거리, 인천종합터미널역',
  },

  // 부산광역시 (9개소)
  {
    sido: '부산광역시',
    rankInSido: 1,
    district: '해운대구',
    count: 23273,
    amount: 273041330,
    shareInSido: 33.1,
    atmCount: 3,
    keyLocation: '해운대 구남로 해변도로, 신세계 센텀시티, 벡스코(BEXCO)',
  },
  {
    sido: '부산광역시',
    rankInSido: 2,
    district: '부산진구',
    count: 18940,
    amount: 212350000,
    shareInSido: 25.7,
    atmCount: 2,
    keyLocation: '서면역 중심 지하도상가, 전포 카페거리, 롯데백화점 본점',
  },
  {
    sido: '부산광역시',
    rankInSido: 3,
    district: '중구',
    count: 14210,
    amount: 158420000,
    shareInSido: 19.2,
    atmCount: 2,
    keyLocation: '남포동 비프(BIFF) 광장, 자갈치시장, 용두산공원',
  },
  {
    sido: '부산광역시',
    rankInSido: 4,
    district: '동구',
    count: 11350,
    amount: 114620000,
    shareInSido: 13.9,
    atmCount: 1,
    keyLocation: 'KTX 부산역 1·2번 출구 키오스크, 초량 이바구길 입구',
  },
  {
    sido: '부산광역시',
    rankInSido: 5,
    district: '수영구',
    count: 6896,
    amount: 66423739,
    shareInSido: 8.1,
    atmCount: 1,
    keyLocation: '광안리 해수욕장 해변 카페거리, 민락수변공원',
  },

  // 경기도 (7개소)
  {
    sido: '경기도',
    rankInSido: 1,
    district: '성남시',
    count: 12731,
    amount: 174055263,
    shareInSido: 19.7,
    atmCount: 2,
    keyLocation: '판교역 현대백화점, 판교 테크노밸리, 분당 서현역 로데오',
  },
  {
    sido: '경기도',
    rankInSido: 2,
    district: '하남시',
    count: 5132,
    amount: 132707034,
    shareInSido: 15.0,
    atmCount: 2,
    keyLocation: '스타필드 하남 1~3층 키오스크 집결 구역',
  },
  {
    sido: '경기도',
    rankInSido: 3,
    district: '수원시',
    count: 11840,
    amount: 118240000,
    shareInSido: 13.4,
    atmCount: 1,
    keyLocation: '수원역 복합환승센터, 스타필드 수원, 행궁동 공방거리',
  },
  {
    sido: '경기도',
    rankInSido: 4,
    district: '고양시',
    count: 9450,
    amount: 95410000,
    shareInSido: 10.8,
    atmCount: 1,
    keyLocation: '일산 킨텍스(KINTEX) 전시장, 스타필드 고양',
  },
  {
    sido: '경기도',
    rankInSido: 5,
    district: '평택시',
    count: 8210,
    amount: 88120000,
    shareInSido: 10.0,
    atmCount: 1,
    keyLocation: '평택역 상권, K-6 캠프 험프리스 미군기지 로데오',
  },

  // 기타 주요 지방 거점 (제주 3개소 · 충남 1개소)
  {
    sido: '제주도',
    rankInSido: 1,
    district: '제주시',
    count: 12367,
    amount: 157878855,
    shareInSido: 83.6,
    atmCount: 3,
    keyLocation: '제주국제공항 1층 입국장 키오스크, 연동 누웨마루거리',
  },
  {
    sido: '충청남도',
    rankInSido: 1,
    district: '천안시',
    count: 21884,
    amount: 147381654,
    shareInSido: 82.7,
    atmCount: 1,
    keyLocation: '천안아산역 KTX 환승통로, 천안종합터미널 신세계',
  },
];

interface VerticalDonutCardProps {
  title: string;
  centerLabel: string;
  centerValue: string;
  centerSub?: string;
  slices: PortionSlice[];
  size?: number;
  strokeWidth?: number;
}

const VerticalDonutCard: React.FC<VerticalDonutCardProps> = ({
  title,
  centerLabel,
  centerValue,
  centerSub,
  slices,
  size = 192,
  strokeWidth = 30,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const radius = (size - strokeWidth) / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const totalPct = slices.reduce((acc, s) => acc + s.pct, 0) || 100;

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  const sliceArcs = slices.map((slice, idx) => {
    const normalizedPct = (slice.pct / totalPct) * 100;
    const prevAngle = slices
      .slice(0, idx)
      .reduce((sum, prev) => sum + (prev.pct / totalPct) * 100, 0);
    return {
      slice,
      idx,
      strokeDasharray: `${(normalizedPct / 100) * circumference} ${circumference}`,
      strokeDashoffset: -((prevAngle / 100) * circumference),
    };
  });

  return (
    <div className="p-5 rounded-2xl bg-dark-850/90 border border-dark-750 flex flex-col justify-between space-y-4 hover:border-dark-650 transition-all h-full">
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-dark-750">
        <h4 className="text-base font-bold text-white flex items-center gap-1.5 min-w-0">
          <PieChart className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="truncate">{title}</span>
        </h4>
      </div>

      <div className="flex justify-center py-1">
        <div
          className="relative flex items-center justify-center shrink-0"
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 overflow-visible"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
            />
            {sliceArcs.map(({ slice, idx, strokeDasharray, strokeDashoffset }) => {
              const isHovered = hoveredIdx === idx;
              const isDimmed = hoveredIdx !== null && hoveredIdx !== idx;

              return (
                <circle
                  key={slice.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    opacity: isDimmed ? 0.35 : 1,
                    filter: isHovered
                      ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.35))'
                      : 'none',
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none font-sans">
            {activeSlice ? (
              <>
                <span className="text-xs font-bold text-slate-200 truncate max-w-[125px] font-sans">
                  {activeSlice.label}
                </span>
                <span
                  className="text-xl font-black font-sans tabular-nums mt-0.5"
                  style={{ color: activeSlice.color }}
                >
                  {activeSlice.pct.toFixed(1)}%
                </span>
                {activeSlice.valueText && (
                  <span className="text-xs font-sans tabular-nums text-white font-semibold mt-0.5 truncate max-w-[125px]">
                    {activeSlice.valueText}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-xs font-medium text-slate-400 font-sans">{centerLabel}</span>
                <span className="text-lg font-black text-white font-sans tabular-nums mt-0.5">
                  {centerValue}
                </span>
                {centerSub && (
                  <span className="text-xs font-sans tabular-nums text-brand-cyan mt-0.5 truncate max-w-[130px]">
                    {centerSub}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-1 font-sans">
        {slices.map((slice, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={slice.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2.5 rounded-xl border transition-all ${
                isHovered
                  ? 'bg-dark-800 border-cyan-400/60 shadow-sm'
                  : 'bg-dark-900/90 border-dark-750 hover:border-dark-650'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="font-bold text-white truncate font-sans">{slice.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-sans tabular-nums">
                  {slice.valueText && (
                    <span className="text-xs text-slate-300 font-sans tabular-nums">{slice.valueText}</span>
                  )}
                  <span className="font-black text-sm font-sans tabular-nums" style={{ color: slice.color }}>
                    {slice.pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="w-full h-1.5 bg-dark-950 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(slice.pct, 100)}%`,
                    backgroundColor: slice.color,
                  }}
                />
              </div>

              {slice.subText && (
                <div className="text-xs text-slate-400 font-sans mt-1 truncate">
                  {slice.subText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const RegionAtmSubpage: React.FC<Props> = ({ data, onSubViewChange }) => {
  const { service } = data;
  const isCardService = service.domain.includes('namane') || service.domain.includes('iaurora') || service.domain.includes('wowpass');

  if (!isCardService) {
    return (
      <div className="space-y-6 font-sans">
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 flex flex-col items-center justify-center text-center py-16">
          <div className="p-3.5 rounded-2xl bg-dark-800 border border-dark-700 mb-4 text-slate-400">
            <Navigation className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <BrandLogo domain={service.domain} size="sm" />
            <span>{service.name.split(' (')[0]} · 지역별 결제량(ATM)</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mb-2 leading-relaxed">
            본 서비스({service.domain})는 오프라인 무인 ATM / 키오스크 충전망을 운영하는 서비스가 아니므로, 
            지역별 결제량(ATM) 집계 데이터가 존재하지 않습니다.
          </p>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-dark-800 border border-dark-750 text-slate-400">
            [미확인: 오프라인 ATM 결제망 미운영 도메인]
          </span>
          {onSubViewChange && (
            <button
              onClick={() => onSubViewChange('main')}
              className="mt-6 px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-brand-cyan text-xs font-bold border border-cyan-500/30 transition-colors cursor-pointer"
            >
              ← 서비스 매출/수익 메인 화면으로 돌아가기
            </button>
          )}
        </div>
      </div>
    );
  }

  const [selectedSidoFilter, setSelectedSidoFilter] = useState<string>('ALL');
  const [showMinorDistricts, setShowMinorDistricts] = useState<boolean>(false);

  const filteredDistricts =
    selectedSidoFilter === 'ALL'
      ? DISTRICT_ATM_TABLE
      : DISTRICT_ATM_TABLE.filter((d) => d.sido === selectedSidoFilter);

  // 비중 10% 초과 주요 거점 vs 10% 이하 거점 분리 (Default: 접힌 상태)
  const majorDistricts = filteredDistricts.filter((d) => d.shareInSido > 10);
  const minorDistricts = filteredDistricts.filter((d) => d.shareInSido <= 10);
  const displayedDistricts = showMinorDistricts ? filteredDistricts : majorDistricts;

  const filteredAtmTotal = filteredDistricts.reduce((sum, d) => sum + d.atmCount, 0);
  const totalAtmAll = DISTRICT_ATM_TABLE.reduce((sum, d) => sum + d.atmCount, 0);

  const formatEok = (won: number) => `${(won / 1e8).toFixed(2)}억 원`;

  return (
    <div 
      className="space-y-6 font-sans"
      style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif' }}
    >
      {/* 1. 상단 헤더 & 핵심 지표 */}
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-700 shadow-lg relative overflow-hidden font-sans">
        <div className="hidden sm:block absolute top-0 right-0 w-80 h-80 bg-cyan-950/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-950/40 text-brand-cyan border border-cyan-500/30 flex items-center gap-1 font-sans">
                <Navigation className="w-3.5 h-3.5" />
                <span>아이오로라 내부 거래 데이터 (26.01 ~ 26.06)</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2 pt-0.5 font-sans">
              <BrandLogo domain={service.domain} size="md" />
              <span>지역별 결제량(ATM)</span>
            </h2>
          </div>

          <div className="w-full md:w-auto flex flex-wrap items-center gap-1.5 sm:gap-2.5 justify-start md:justify-end shrink-0">
            <button
              type="button"
              onClick={() => onSubViewChange?.('main')}
              className="h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all shadow-sm cursor-pointer font-sans border bg-dark-800 hover:bg-dark-750 text-white border-dark-650 hover:border-brand-cyan/50"
            >
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cyan" />
              <span>매출/수익 집계 돌아가기</span>
            </button>
            <button
              type="button"
              onClick={() => onSubViewChange?.('merchant-share')}
              className="h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all shadow-sm cursor-pointer font-sans border bg-dark-800 hover:bg-dark-750 text-white border-dark-650 hover:border-brand-cyan/50"
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cyan" />
              <span>가맹업종 결제 비중</span>
            </button>
            <div className="hidden md:block">
              <PdfReportButton data={data} tab="region-atm" />
            </div>
          </div>
        </div>

        {/* 상단 4대 KPI 박스 (모바일 2x2 컴팩트 배치) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-dark-750/80 font-sans">
          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                <Store className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">전국 총 결제액</span>
              </span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan font-sans tabular-nums mt-1">
              162.0억 원
            </div>
            <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
              1,357,889건 (건당 11,927원)
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                <Building2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">서울시 결제 비중</span>
              </span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-sans tabular-nums mt-1">
              129.0억 원 (79.6%)
            </div>
            <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
              1,007,422건 (압도적 집중)
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">지방 Top 3</span>
              </span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-sans tabular-nums mt-1">
              25.0억 원 (15.4%)
            </div>
            <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
              경기·부산·인천 (관문·관광)
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-cyan-500/40">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-bold text-brand-cyan font-sans">
                <Navigation className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">ATM 충전액</span>
              </span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan font-sans tabular-nums mt-1">
              111.1억 원
            </div>
            <span className="hidden sm:block text-xs text-slate-300 mt-1 font-sans">
              현금 108.7억 원 + 신용 2.4억 원
            </span>
          </div>
        </div>
      </div>

      {/* 2. 전국 > 서울시 > 지방 Top 3 순위별 원형 다이어그램 (3열) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3.5 border-b border-dark-750">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-brand-cyan" />
              <span>전국 · 서울시 · 지방 Top 3 지역별 결제량 포션</span>
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-normal">
            * 10% 이내 항목은 모두 &lsquo;기타&rsquo;로 묶어 표시.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* ① 전국 시·도 결제량 포션 */}
          <VerticalDonutCard
            title="전국 시·도 결제량"
            centerLabel="전국 총액"
            centerValue="162.0억 원"
            centerSub="서울 79.6% 집중"
            slices={NATIONWIDE_PORTION_SLICES}
            size={185}
            strokeWidth={28}
          />

          {/* ② 서울시 주요 자치구 결제량(ATM) 포션 */}
          <VerticalDonutCard
            title="서울시 주요 구 결제량"
            centerLabel="서울시 총액"
            centerValue="129.0억 원"
            centerSub="마포구 24.4% 1위"
            slices={SEOUL_DISTRICT_SLICES}
            size={185}
            strokeWidth={28}
          />

          {/* ③ 지방 Top 3 결제량 포션 */}
          <VerticalDonutCard
            title="지방 Top 3 시·도 결제량"
            centerLabel="지방 총액"
            centerValue="33.0억 원"
            centerSub="경기 26.7% · 부산 25.0%"
            slices={PROVINCE_TOP3_SLICES}
            size={185}
            strokeWidth={28}
          />
        </div>
      </div>

      {/* 3. ATM 결제 사용 순위(시/구별) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 pb-3 border-b border-dark-750">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Building2 className="w-5 h-5 text-brand-cyan" />
            <h3 className="text-base sm:text-lg font-bold text-white font-sans">
              ATM 결제 사용 순위(시/구별)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-bold bg-purple-950/40 text-purple-300 border border-purple-500/30">
              총 {totalAtmAll}개소
            </span>
            {minorDistricts.length > 0 && !showMinorDistricts && (
              <span className="px-2 py-0.5 rounded-md text-xs font-sans font-medium bg-dark-800 text-slate-400 border border-dark-700">
                비중 10% 이하 {minorDistricts.length}개 접힘
              </span>
            )}
          </div>

          {/* 시/도 필터 버튼 (한줄 요약 표시) */}
          <div className="flex items-center gap-1 bg-dark-850 p-1.5 rounded-xl border border-dark-750 shrink-0 whitespace-nowrap overflow-x-auto no-scrollbar">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5 shrink-0" />
            {[
              { id: 'ALL', label: '전체' },
              { id: '서울시', label: '서울' },
              { id: '인천광역시', label: '인천' },
              { id: '부산광역시', label: '부산' },
              { id: '경기도', label: '경기' },
              { id: '제주도', label: '제주' },
              { id: '충청남도', label: '충남' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedSidoFilter(tab.id);
                  setShowMinorDistricts(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedSidoFilter === tab.id
                    ? 'bg-brand-cyan text-dark-950 shadow-sm font-black'
                    : 'text-slate-300 hover:text-white hover:bg-dark-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 모바일 화면 (가로 스크롤바 0%, 지역별 카드 뷰) */}
        <div className="space-y-3 md:hidden font-sans">
          {displayedDistricts.map((item) => (
            <div
              key={item.sido + item.district}
              className={`p-3.5 rounded-xl border space-y-2.5 ${
                item.rankInSido === 1
                  ? 'bg-dark-850/90 border-cyan-500/40'
                  : 'bg-dark-850 border-dark-750'
              }`}
            >
              {/* 카드 상단: 시도 / 순위 / 지역명 / 거점 수 */}
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-dark-800 text-slate-200 border border-dark-650">
                    {item.sido}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] tabular-nums font-bold ${
                      item.rankInSido === 1
                        ? 'bg-cyan-950/40 text-brand-cyan font-black'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.rankInSido}위
                  </span>
                  <span className="font-bold text-sm text-white">{item.district}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-500/30 tabular-nums">
                  {item.atmCount}개소
                </span>
              </div>

              {/* 핵심 수치 3열 그리드 (숫자 정보) */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[11px] text-slate-400">결제건수</div>
                  <div className="font-bold text-white tabular-nums mt-0.5">
                    {item.count.toLocaleString()}건
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[11px] text-brand-cyan font-semibold">결제금액</div>
                  <div className="font-black text-brand-cyan tabular-nums mt-0.5">
                    {formatEok(item.amount)}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[11px] text-slate-400 font-semibold">시내비중</div>
                  <div className={`font-bold tabular-nums mt-0.5 ${item.shareInSido <= 10 ? 'text-slate-300' : 'text-cyan-300'}`}>
                    {item.shareInSido.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* 하단 설명 블록 (상권 특성) */}
              <div className="text-xs text-slate-300 pt-1.5 border-t border-dark-800">
                <span className="text-slate-400 font-semibold mr-1.5">[상권]</span>
                <span>{item.keyLocation}</span>
              </div>
            </div>
          ))}

          {/* 비중 10% 이하 더보기 / 접기 버튼 (모바일) */}
          {minorDistricts.length > 0 && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowMinorDistricts(!showMinorDistricts)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  showMinorDistricts
                    ? 'bg-dark-750 hover:bg-dark-700 text-slate-300 border border-dark-650'
                    : 'bg-cyan-950/40 hover:bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                <span>
                  {showMinorDistricts
                    ? `비중 10% 이하 지역 접기 (${minorDistricts.length}개소)`
                    : `비중 10% 이하 지역 더보기 (${minorDistricts.length}개소 펼치기)`}
                </span>
                {showMinorDistricts ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brand-cyan" />
                )}
              </button>
            </div>
          )}

          {/* 모바일 합계 요약 바 */}
          <div className="p-3.5 rounded-xl bg-dark-900 border border-cyan-500/40 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="text-white">합계 ({selectedSidoFilter === 'ALL' ? '전국' : selectedSidoFilter})</span>
              <span className="text-brand-cyan font-black text-sm tabular-nums">
                {formatEok(filteredDistricts.reduce((sum, d) => sum + d.amount, 0))}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-dark-800">
              <div className="text-slate-300">
                총 건수: <span className="font-bold text-white tabular-nums">{filteredDistricts.reduce((sum, d) => sum + d.count, 0).toLocaleString()}건</span>
              </div>
              <div className="text-slate-300 text-right">
                총 거점: <span className="font-bold text-purple-300 tabular-nums">{filteredAtmTotal}개소</span>
              </div>
            </div>
          </div>
        </div>

        {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
          <table 
            className="w-full text-left text-xs sm:text-sm table-fixed font-sans"
            style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif' }}
          >
            <thead className="bg-dark-850 text-slate-300 font-bold border-b border-dark-750 text-xs font-sans">
              <tr>
                <th className="py-3 px-3 w-[8%] font-bold text-slate-300">시도</th>
                <th className="py-3 px-2 text-center w-[6%] font-bold text-slate-300">순위</th>
                <th className="py-3 px-3 w-[10%] font-bold text-slate-300">지역</th>
                <th className="py-3 px-3 text-right w-[11%] font-bold text-slate-300">건수</th>
                <th className="py-3 px-3 text-right w-[12%] font-bold text-brand-cyan">금액</th>
                <th className="py-3 px-2.5 text-right w-[8%] font-bold text-slate-300">비중</th>
                <th className="py-3 px-3 text-center w-[10%] font-bold text-purple-300">거점</th>
                <th className="py-3 px-3.5 w-[35%] font-bold text-slate-300">상권 (설명)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750/70 font-sans">
              {displayedDistricts.map((item) => (
                <tr
                  key={item.sido + item.district}
                  className={`hover:bg-dark-800/50 transition-colors ${
                    item.rankInSido === 1 ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap font-sans">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-dark-800 text-slate-200 border border-dark-650 font-sans">
                      {item.sido}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center font-sans">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-xs tabular-nums font-bold ${
                        item.rankInSido === 1
                          ? 'bg-cyan-950/40 text-brand-cyan font-black'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.rankInSido}위
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-white font-sans">
                    {item.district}
                  </td>
                  <td className="py-3 px-3 text-right font-sans tabular-nums text-slate-200 font-medium">
                    {item.count.toLocaleString()}건
                  </td>
                  <td className="py-3 px-3 text-right font-sans tabular-nums font-bold text-brand-cyan">
                    {formatEok(item.amount)}
                  </td>
                  <td className="py-3 px-2.5 text-right font-sans tabular-nums font-bold text-white">
                    <span className={item.shareInSido <= 10 ? 'text-slate-300' : 'text-cyan-300'}>
                      {item.shareInSido.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-sans tabular-nums font-bold text-purple-300">
                    <span className="px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30">
                      {item.atmCount}개소
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-xs text-slate-300 font-sans truncate" title={item.keyLocation}>
                    {item.keyLocation}
                  </td>
                </tr>
              ))}

              {/* 비중 10% 이하 더보기▼ / 접기▲ 행 */}
              {minorDistricts.length > 0 && (
                <tr className="bg-dark-850/80 border-t border-dark-750">
                  <td colSpan={8} className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setShowMinorDistricts(!showMinorDistricts)}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
                        showMinorDistricts
                          ? 'bg-dark-750 hover:bg-dark-700 text-slate-300 hover:text-white border border-dark-650'
                          : 'bg-cyan-950/40 hover:bg-cyan-950/60 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400/60'
                      }`}
                    >
                      <span>
                        {showMinorDistricts
                          ? `비중 10% 이하 지역 접기 (${minorDistricts.length}개소 접기)`
                          : `비중 10% 이하 지역 더보기 (${minorDistricts.length}개소 펼쳐보기)`}
                      </span>
                      {showMinorDistricts ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-brand-cyan" />
                      )}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
            {/* 합계 하단 행 (tfoot) */}
            <tfoot className="bg-dark-850/95 border-t-2 border-dark-700 text-xs font-bold font-sans">
              <tr>
                <td colSpan={3} className="py-3 px-3.5 text-white font-sans">
                  <span className="text-brand-cyan font-black">
                    합계 ({selectedSidoFilter === 'ALL' ? '전국' : selectedSidoFilter})
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-sans tabular-nums text-white">
                  {filteredDistricts.reduce((sum, d) => sum + d.count, 0).toLocaleString()}건
                </td>
                <td className="py-3 px-3 text-right font-sans tabular-nums font-bold text-brand-cyan">
                  {formatEok(filteredDistricts.reduce((sum, d) => sum + d.amount, 0))}
                </td>
                <td className="py-3 px-2.5 text-right font-sans tabular-nums text-slate-400">
                  {selectedSidoFilter === 'ALL' ? '-' : '100.0%'}
                </td>
                <td className="py-3 px-3 text-center font-sans tabular-nums font-black text-purple-300">
                  <span className="px-2.5 py-1 rounded bg-purple-950/40 border border-purple-500/30 text-xs">
                    총 {filteredAtmTotal}개소
                  </span>
                </td>
                <td className="py-3 px-3.5 text-xs text-slate-400 font-normal font-sans">
                  {selectedSidoFilter === 'ALL'
                    ? `전국 공항철도·역사·편의점 등 공식 입점 거점 총 ${totalAtmAll}개소 전수 집계`
                    : `${selectedSidoFilter} 상권 내 공식 입점 거점 총 ${filteredAtmTotal}개소 운영`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 4. 하단 출처 기준 */}
      <div className="p-4 rounded-xl bg-dark-900 border border-dark-750 flex flex-col md:flex-row md:items-center md:justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-semibold text-slate-300">출처 기준 :</span>
          <span className="text-slate-200">
            아이오로라(i-aurora) 내부 거래분석 데이터 및 공식 홈페이지 입점 거점 공시 (총 83개소)
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegionAtmSubpage;
