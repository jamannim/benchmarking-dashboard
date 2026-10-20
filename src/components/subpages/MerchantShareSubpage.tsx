import React, { useState } from 'react';
import {
  Layers,
  CreditCard,
  Globe,
  Users,
  Store,
  ShieldCheck,
  PieChart,
  Navigation,
  ExternalLink
} from 'lucide-react';
import type { CompleteServiceIntelligence } from '../../types/intelligence';
import type { SubViewId } from '../Header';
import { BrandLogo } from '../BrandLogo';
import { CountryFlag } from '../CountryFlag';
import { PdfReportButton } from '../PdfReportButton';

interface Props {
  data: CompleteServiceIntelligence;
  onSubViewChange?: (subView: SubViewId) => void;
}

export interface PortionSlice {
  id?: string;
  label: string;
  pct: number;
  valueText?: string;
  subText?: string;
  color: string;
  code?: string;
  isOther?: boolean;
}

interface CountryHierarchyData {
  code: string;
  country: string;
  depAmount: number;
  wdTotalEok: number;
  middleCategorySlices: PortionSlice[];
  minorSubCategories: PortionSlice[];
  minorRegionSlices: PortionSlice[];
  minorChargeSlices: PortionSlice[];
}

const COUNTRY_HIERARCHY: Record<string, CountryHierarchyData> = {
  ALL: {
    code: 'ALL',
    country: '전체 국적',
    depAmount: 15369079563,
    wdTotalEok: 161.96,
    middleCategorySlices: [
      {
        label: '한식',
        pct: 12.9,
        valueText: '20.85억 원',
        color: '#38bdf8',
      },
      {
        label: '편의점',
        pct: 12.8,
        valueText: '20.66억 원',
        color: '#818cf8',
      },
      {
        label: '기타',
        pct: 74.3,
        valueText: '120.45억 원',
        subText: '화장품점 · 커피/음료 · 자동판매기 외',
        color: '#475569',
        isOther: true,
      },
    ],
    minorSubCategories: [
      {
        label: '화장품점',
        pct: 8.4,
        valueText: '13.61억 원',
        color: '#a855f7',
      },
      {
        label: '커피/음료전문점',
        pct: 7.1,
        valueText: '11.53억 원',
        color: '#10b981',
      },
      {
        label: '자동판매기 운영업',
        pct: 4.7,
        valueText: '7.66억 원',
        color: '#f43f5e',
      },
      {
        label: '일반음식점 기타',
        pct: 4.3,
        valueText: '6.97억 원',
        color: '#38bdf8',
      },
      {
        label: '기타',
        pct: 49.8,
        valueText: '80.68억 원',
        subText: '기성복점 · 일반잡화 · 백화점 외',
        color: '#64748b',
        isOther: true,
      },
    ],
    minorRegionSlices: [
      {
        label: '서울 마포구',
        pct: 21.4,
        color: '#38bdf8',
      },
      {
        label: '서울 중구',
        pct: 16.2,
        color: '#818cf8',
      },
      {
        label: '서울 성동구',
        pct: 11.1,
        color: '#34d399',
      },
      {
        label: '기타',
        pct: 51.3,
        subText: '강남구 · 용산구 · 종로구 외',
        color: '#475569',
        isOther: true,
      },
    ],
    minorChargeSlices: [
      {
        label: '키오스크(현금)',
        pct: 52.8,
        color: '#38bdf8',
      },
      {
        label: 'CU현금입금',
        pct: 18.4,
        color: '#34d399',
      },
      {
        label: '해외카드 · Alipay+',
        pct: 16.5,
        color: '#f472b6',
      },
      {
        label: '기타',
        pct: 12.3,
        subText: '가상계좌 · 오픈뱅킹 외',
        color: '#475569',
        isOther: true,
      },
    ],
  },
  CN: {
    code: 'CN',
    country: '중국',
    depAmount: 8385730902,
    wdTotalEok: 98.48,
    middleCategorySlices: [
      {
        label: '한식',
        pct: 14.7,
        valueText: '14.45억 원',
        color: '#38bdf8',
      },
      {
        label: '편의점',
        pct: 14.3,
        valueText: '14.07억 원',
        color: '#818cf8',
      },
      {
        label: '기타',
        pct: 71.0,
        valueText: '69.96억 원',
        subText: '화장품점 · 커피/음료 · 자동판매기 외',
        color: '#475569',
        isOther: true,
      },
    ],
    minorSubCategories: [
      {
        label: '화장품점',
        pct: 7.5,
        valueText: '7.41억 원',
        color: '#f472b6',
      },
      {
        label: '커피/음료전문점',
        pct: 7.2,
        valueText: '7.03억 원',
        color: '#34d399',
      },
      {
        label: '자동판매기 운영업',
        pct: 6.6,
        valueText: '6.48억 원',
        color: '#fbbf24',
      },
      {
        label: '기타',
        pct: 49.7,
        valueText: '49.04억 원',
        subText: '기성복점 · 백화점 · 잡화 외',
        color: '#64748b',
        isOther: true,
      },
    ],
    minorRegionSlices: [
      {
        label: '서울 마포구',
        pct: 22.5,
        color: '#38bdf8',
      },
      {
        label: '서울 중구',
        pct: 13.3,
        color: '#818cf8',
      },
      {
        label: '서울 성동구',
        pct: 11.8,
        color: '#34d399',
      },
      {
        label: '기타',
        pct: 52.4,
        subText: '강남구 · 용산구 외',
        color: '#475569',
        isOther: true,
      },
    ],
    minorChargeSlices: [
      {
        label: '키오스크(현금)',
        pct: 60.2,
        valueText: '50.48억 원',
        color: '#38bdf8',
      },
      {
        label: 'CU현금입금',
        pct: 19.6,
        valueText: '16.44억 원',
        color: '#34d399',
      },
      {
        label: '가상계좌',
        pct: 12.2,
        valueText: '10.23억 원',
        color: '#fbbf24',
      },
      {
        label: '기타',
        pct: 8.0,
        valueText: '6.71억 원',
        subText: 'Alipay+ · 해외카드 외',
        color: '#475569',
        isOther: true,
      },
    ],
  },
  JP: {
    code: 'JP',
    country: '일본',
    depAmount: 1927290026,
    wdTotalEok: 16.38,
    middleCategorySlices: [
      {
        label: '화장품점',
        pct: 12.1,
        valueText: '1.98억 원',
        color: '#f472b6',
      },
      {
        label: '한식',
        pct: 10.9,
        valueText: '1.79억 원',
        color: '#38bdf8',
      },
      {
        label: '기타',
        pct: 77.0,
        valueText: '12.61억 원',
        subText: '커피/음료 · 편의점 · 기성복점 외',
        color: '#475569',
        isOther: true,
      },
    ],
    minorSubCategories: [
      {
        label: '커피/음료전문점',
        pct: 8.1,
        valueText: '1.33억 원',
        color: '#34d399',
      },
      {
        label: '편의점',
        pct: 7.5,
        valueText: '1.24억 원',
        color: '#818cf8',
      },
      {
        label: '기성복점',
        pct: 6.9,
        valueText: '1.14억 원',
        color: '#a78bfa',
      },
      {
        label: '기타',
        pct: 54.5,
        valueText: '8.90억 원',
        subText: '일반음식점 · 잡화 · 제과점 외',
        color: '#64748b',
        isOther: true,
      },
    ],
    minorRegionSlices: [
      {
        label: '서울 중구',
        pct: 24.7,
        color: '#f472b6',
      },
      {
        label: '서울 강남구',
        pct: 14.1,
        color: '#38bdf8',
      },
      {
        label: '기타',
        pct: 61.2,
        subText: '성동구 · 마포구 · 종로구 외',
        color: '#475569',
        isOther: true,
      },
    ],
    minorChargeSlices: [
      {
        label: '키오스크(현금)',
        pct: 52.4,
        valueText: '10.10억 원',
        color: '#38bdf8',
      },
      {
        label: '해외카드',
        pct: 29.0,
        valueText: '5.59억 원',
        color: '#f472b6',
      },
      {
        label: 'CU현금입금',
        pct: 13.2,
        valueText: '2.54억 원',
        color: '#34d399',
      },
      {
        label: '기타',
        pct: 5.4,
        valueText: '1.04억 원',
        subText: 'PayPay · 기타 수단',
        color: '#475569',
        isOther: true,
      },
    ],
  },
  HK: {
    code: 'HK',
    country: '홍콩',
    depAmount: 1875134275,
    wdTotalEok: 16.03,
    middleCategorySlices: [
      {
        label: '화장품점',
        pct: 11.6,
        valueText: '1.85억 원',
        color: '#f472b6',
      },
      {
        label: '한식',
        pct: 10.9,
        valueText: '1.75억 원',
        color: '#38bdf8',
      },
      {
        label: '기타',
        pct: 77.5,
        valueText: '12.43억 원',
        subText: '편의점 · 기성복점 · 커피/음료 외',
        color: '#475569',
        isOther: true,
      },
    ],
    minorSubCategories: [
      {
        label: '편의점',
        pct: 7.4,
        valueText: '1.18억 원',
        color: '#818cf8',
      },
      {
        label: '기성복점',
        pct: 6.7,
        valueText: '1.08억 원',
        color: '#a78bfa',
      },
      {
        label: '커피/음료전문점',
        pct: 6.4,
        valueText: '1.03억 원',
        color: '#34d399',
      },
      {
        label: '기타',
        pct: 57.0,
        valueText: '9.14억 원',
        subText: '백화점 · 잡화 · 택시 외',
        color: '#64748b',
        isOther: true,
      },
    ],
    minorRegionSlices: [
      {
        label: '서울 마포구',
        pct: 23.8,
        color: '#38bdf8',
      },
      {
        label: '서울 중구',
        pct: 18.0,
        color: '#f472b6',
      },
      {
        label: '기타',
        pct: 58.2,
        subText: '성동구 · 강남구 · 인천 중구 외',
        color: '#475569',
        isOther: true,
      },
    ],
    minorChargeSlices: [
      {
        label: '키오스크(현금)',
        pct: 39.8,
        valueText: '7.46억 원',
        color: '#38bdf8',
      },
      {
        label: 'ALIPAY HK(Ali+)',
        pct: 36.8,
        valueText: '6.90억 원',
        color: '#f472b6',
      },
      {
        label: 'CU현금입금',
        pct: 16.2,
        valueText: '3.04억 원',
        color: '#34d399',
      },
      {
        label: '기타',
        pct: 7.2,
        valueText: '1.35억 원',
        subText: '해외카드 외',
        color: '#475569',
        isOther: true,
      },
    ],
  },
  KR: {
    code: 'KR',
    country: '한국',
    depAmount: 1523946961,
    wdTotalEok: 5.78,
    middleCategorySlices: [
      {
        label: '편의점',
        pct: 24.8,
        valueText: '1.43억 원',
        color: '#818cf8',
      },
      {
        label: '한식',
        pct: 13.6,
        valueText: '0.79억 원',
        color: '#38bdf8',
      },
      {
        label: '기타',
        pct: 61.6,
        valueText: '3.56억 원',
        subText: '커피/음료 · 일반잡화 · 화장품점 외',
        color: '#475569',
        isOther: true,
      },
    ],
    minorSubCategories: [
      {
        label: '커피/음료전문점',
        pct: 8.9,
        valueText: '0.51억 원',
        color: '#34d399',
      },
      {
        label: '일반잡화판매점',
        pct: 7.5,
        valueText: '0.43억 원',
        color: '#fbbf24',
      },
      {
        label: '화장품점',
        pct: 6.5,
        valueText: '0.37억 원',
        color: '#f472b6',
      },
      {
        label: '기타',
        pct: 38.7,
        valueText: '2.25억 원',
        subText: '제과점 · 휴게음식점 외',
        color: '#64748b',
        isOther: true,
      },
    ],
    minorRegionSlices: [
      {
        label: '서울 마포구',
        pct: 21.0,
        color: '#38bdf8',
      },
      {
        label: '서울 중구',
        pct: 15.2,
        color: '#818cf8',
      },
      {
        label: '서울 성동구',
        pct: 12.4,
        color: '#34d399',
      },
      {
        label: '서울 강남구',
        pct: 10.1,
        color: '#fbbf24',
      },
      {
        label: '기타',
        pct: 41.3,
        subText: '용산구 외 전국 자치구',
        color: '#475569',
        isOther: true,
      },
    ],
    minorChargeSlices: [
      {
        label: '가상계좌',
        pct: 30.8,
        valueText: '4.69억 원',
        color: '#38bdf8',
      },
      {
        label: 'CU현금입금',
        pct: 27.5,
        valueText: '4.19억 원',
        color: '#34d399',
      },
      {
        label: '오픈뱅킹',
        pct: 15.4,
        valueText: '2.35억 원',
        color: '#818cf8',
      },
      {
        label: '기타',
        pct: 26.3,
        valueText: '4.01억 원',
        subText: '국내카드 · 키오스크 외',
        color: '#475569',
        isOther: true,
      },
    ],
  },
};

const MAJOR_NATIONALITY_SLICES: PortionSlice[] = [
  {
    id: 'CN',
    code: 'CN',
    label: '중국',
    pct: 54.6,
    valueText: '83.86억 원',
    color: '#38bdf8',
  },
  {
    id: 'JP',
    code: 'JP',
    label: '일본',
    pct: 12.5,
    valueText: '19.27억 원',
    color: '#f472b6',
  },
  {
    id: 'HK',
    code: 'HK',
    label: '홍콩',
    pct: 12.2,
    valueText: '18.75억 원',
    color: '#a78bfa',
  },
  {
    id: 'KR',
    code: 'KR',
    label: '한국',
    pct: 9.9,
    valueText: '15.24억 원',
    color: '#34d399',
  },
  {
    id: 'ALL',
    label: '기타',
    pct: 10.8,
    valueText: '16.57억 원',
    subText: '대만 · 미국 · 필리핀 · 싱가포르 외',
    color: '#475569',
    isOther: true,
  },
];

const AGE_PORTION_SLICES: PortionSlice[] = [
  {
    label: '20대',
    pct: 67.9,
    valueText: '119.48억 원',
    color: '#38bdf8',
  },
  {
    label: '30대',
    pct: 15.1,
    valueText: '26.56억 원',
    color: '#818cf8',
  },
  {
    label: '기타',
    pct: 17.0,
    valueText: '29.92억 원',
    subText: '10대 · 40대 · 50대 · 60대+',
    color: '#475569',
    isOther: true,
  },
];

const GENDER_AGE_PORTION_SLICES: PortionSlice[] = [
  {
    label: '20대 여성',
    pct: 53.5,
    valueText: '80.06억 원',
    color: '#a855f7',
  },
  {
    label: '30대 여성',
    pct: 14.4,
    valueText: '21.62억 원',
    color: '#818cf8',
  },
  {
    label: '기타',
    pct: 32.1,
    valueText: '48.06억 원',
    subText: '20대 남성 · 10대 여성 · 40대 여성 외',
    color: '#475569',
    isOther: true,
  },
];

const FRANCHISE_PORTION_SLICES: PortionSlice[] = [
  {
    label: 'CU',
    pct: 23.3,
    valueText: '9.47억 원',
    color: '#38bdf8',
  },
  {
    label: '올리브영',
    pct: 22.7,
    valueText: '9.26억 원',
    color: '#f472b6',
  },
  {
    label: 'GS25',
    pct: 12.5,
    valueText: '5.08억 원',
    color: '#34d399',
  },
  {
    label: '기타',
    pct: 41.5,
    valueText: '16.90억 원',
    subText: '다이소 · 하이브 · 티머니 · 세븐일레븐 외',
    color: '#475569',
    isOther: true,
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
  selectedId?: string;
  onSliceSelect?: (slice: PortionSlice) => void;
}

const VerticalDonutCard: React.FC<VerticalDonutCardProps> = ({
  title,
  centerLabel,
  centerValue,
  centerSub,
  slices,
  size = 192,
  strokeWidth = 30,
  selectedId,
  onSliceSelect,
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
      {/* 카드 헤더 (제목만 깔끔하게 유지) */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-dark-750">
        <h4 className="text-base font-bold text-white flex items-center gap-1.5 min-w-0">
          <PieChart className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="truncate">{title}</span>
        </h4>
      </div>

      {/* 상단 원형 도넛 다이어그램 */}
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
              const isSelected = selectedId && slice.id === selectedId;
              const isDimmed = hoveredIdx !== null && hoveredIdx !== idx;

              return (
                <circle
                  key={slice.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered || isSelected ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    opacity: isDimmed ? 0.35 : 1,
                    filter:
                      isHovered || isSelected
                        ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.35))'
                        : 'none',
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => onSliceSelect?.(slice)}
                />
              );
            })}
          </svg>

          {/* 도넛 중앙 정보 */}
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

      {/* 하단 포션 리스트 */}
      <div className="space-y-2 pt-1 font-sans">
        {slices.map((slice, idx) => {
          const isHovered = hoveredIdx === idx;
          const isSelected = selectedId && slice.id === selectedId;
          return (
            <div
              key={slice.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSliceSelect?.(slice)}
              className={`p-2.5 rounded-xl border transition-all ${
                onSliceSelect ? 'cursor-pointer' : ''
              } ${
                isHovered || isSelected
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
                  {slice.code && <CountryFlag code={slice.code} size="xs" />}
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

export const MerchantShareSubpage: React.FC<Props> = ({ data, onSubViewChange }) => {
  const { service } = data;
  const isCardService = service.domain.includes('namane') || service.domain.includes('iaurora') || service.domain.includes('wowpass');

  if (!isCardService) {
    return (
      <div className="space-y-6 font-sans">
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 flex flex-col items-center justify-center text-center py-16">
          <div className="p-3.5 rounded-2xl bg-dark-800 border border-dark-700 mb-4 text-slate-400">
            <Store className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <BrandLogo domain={service.domain} size="sm" />
            <span>{service.name.split(' (')[0]} · 가맹업종 결제 비중</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mb-2 leading-relaxed">
            본 서비스({service.domain})는 오프라인 선불카드 결제망 가맹점 네트워크를 직접 운영하는 금융 서비스가 아니므로, 
            가맹업종 결제 비중 집계 데이터가 존재하지 않습니다.
          </p>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-dark-800 border border-dark-750 text-slate-400">
            [미확인: 선불카드 결제 가맹점 미운영 도메인]
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

  const [selectedCountry, setSelectedCountry] = useState<'ALL' | 'CN' | 'JP' | 'HK' | 'KR'>('ALL');
  const [minorViewMode, setMinorViewMode] = useState<'subcat' | 'region' | 'charge'>('subcat');

  const activeData = COUNTRY_HIERARCHY[selectedCountry] || COUNTRY_HIERARCHY.ALL;

  const minorConfig =
    minorViewMode === 'subcat'
      ? {
          title: `${activeData.country} · 기타 업종 상세`,
          centerLabel: '주요 세부 업종',
          centerValue: `${activeData.minorSubCategories[0].label} ${activeData.minorSubCategories[0].pct}%`,
          centerSub: activeData.minorSubCategories[0].valueText,
          slices: activeData.minorSubCategories,
        }
      : minorViewMode === 'region'
      ? {
          title: `${activeData.country} · 소비 상권`,
          centerLabel: '주요 상권',
          centerValue: `${activeData.minorRegionSlices[0].pct}%`,
          centerSub: activeData.minorRegionSlices[0].label,
          slices: activeData.minorRegionSlices,
        }
      : {
          title: `${activeData.country} · 충전 수단`,
          centerLabel: '주요 충전 수단',
          centerValue: `${activeData.minorChargeSlices[0].pct}%`,
          centerSub: activeData.minorChargeSlices[0].label,
          slices: activeData.minorChargeSlices,
        };

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
                <Store className="w-3.5 h-3.5" />
                <span>아이오로라 내부 거래 데이터 (26.01 ~ 26.06)</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2 pt-0.5 font-sans">
              <BrandLogo domain={service.domain} size="md" />
              <span>가맹업종 결제 비중</span>
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
              onClick={() => onSubViewChange?.('region-atm')}
              className="h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all shadow-sm cursor-pointer font-sans border bg-dark-800 hover:bg-dark-750 text-white border-dark-650 hover:border-brand-cyan/50"
            >
              <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cyan" />
              <span>지역별 결제량(ATM)</span>
            </button>
            <div className="hidden md:block">
              <PdfReportButton data={data} tab="merchant-share" />
            </div>
          </div>
        </div>

        {/* 상단 4대 KPI 박스 (모바일 2x2 컴팩트 배치) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-dark-750/80 font-sans">
          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                <Store className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">오프라인 결제액</span>
              </span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan font-sans tabular-nums mt-1">
              162.0억 원
            </div>
            <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
              외부출금(186.4억 원)의 86.9%
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                <Layers className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">총 결제건수</span>
              </span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-sans tabular-nums mt-1">
              1,357,889건
            </div>
            <span className="hidden sm:block text-xs text-slate-400 mt-1 font-sans">
              건당 평균 11,927원
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-dark-750">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-200 font-sans">
                <Users className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">핵심 소비층</span>
              </span>
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-black text-white font-sans tabular-nums mt-1">
              여성 88.7% · 남성 12.3%
            </div>
            <span className="block text-[11px] sm:text-xs text-slate-400 mt-1 font-sans">
              세부는 하단 표에서 확인
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl bg-dark-900/80 border border-cyan-500/40">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-bold text-brand-cyan font-sans">
                <Globe className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">핵심 업종</span>
              </span>
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan font-sans tabular-nums mt-1">
              한식 20.8억 원 / CU 9.5억 원
            </div>
            <span className="hidden sm:block text-xs text-slate-300 mt-1 font-sans">
              편의점 20.7억 원 · 올리브영 9.3억 원
            </span>
          </div>
        </div>
      </div>

      {/* 2. 국적 및 가맹업종별 결제 비중 원형 다이어그램 */}
      <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 pb-4 border-b border-dark-750">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-cyan" />
              <span>국적 및 가맹업종별 결제 비중</span>
            </h3>
            <span className="text-xs text-slate-400 font-normal">
              * 10% 이내 항목은 모두 &lsquo;기타&rsquo;로 묶어 표시.
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap bg-dark-850 p-1.5 rounded-xl border border-dark-750">
            {(
              [
                { code: 'ALL', label: '전체 국적' },
                { code: 'CN', label: '중국' },
                { code: 'JP', label: '일본' },
                { code: 'HK', label: '홍콩' },
                { code: 'KR', label: '한국' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.code}
                type="button"
                onClick={() => setSelectedCountry(tab.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCountry === tab.code
                    ? 'bg-brand-cyan text-dark-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.code !== 'ALL' && <CountryFlag code={tab.code} size="xs" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <VerticalDonutCard
            title="전체 국적"
            centerLabel="국적 합계"
            centerValue="153.7억 원"
            centerSub="중국 54.6%"
            slices={MAJOR_NATIONALITY_SLICES}
            selectedId={selectedCountry}
            onSliceSelect={(slice) => {
              if (slice.id && ['ALL', 'CN', 'JP', 'HK', 'KR'].includes(slice.id)) {
                setSelectedCountry(slice.id as 'ALL' | 'CN' | 'JP' | 'HK' | 'KR');
              }
            }}
          />

          <VerticalDonutCard
            title={`${activeData.country} 가맹업종`}
            centerLabel={activeData.country}
            centerValue={`${activeData.middleCategorySlices[0].label} ${activeData.middleCategorySlices[0].pct}%`}
            centerSub={`${activeData.wdTotalEok.toFixed(2)}억 원`}
            slices={activeData.middleCategorySlices}
            onSliceSelect={(slice) => {
              if (slice.isOther) {
                setMinorViewMode('subcat');
              }
            }}
          />

          <div className="flex flex-col h-full space-y-2.5">
            <div className="grid grid-cols-3 gap-1.5 bg-dark-850 p-1 rounded-xl border border-dark-750">
              <button
                type="button"
                onClick={() => setMinorViewMode('subcat')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  minorViewMode === 'subcat'
                    ? 'bg-brand-cyan text-dark-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                세부 업종
              </button>
              <button
                type="button"
                onClick={() => setMinorViewMode('region')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  minorViewMode === 'region'
                    ? 'bg-brand-cyan text-dark-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                소비 상권
              </button>
              <button
                type="button"
                onClick={() => setMinorViewMode('charge')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  minorViewMode === 'charge'
                    ? 'bg-brand-cyan text-dark-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                충전 수단
              </button>
            </div>

            <div className="flex-1">
              <VerticalDonutCard
                title={minorConfig.title}
                centerLabel={minorConfig.centerLabel}
                centerValue={minorConfig.centerValue}
                centerSub={minorConfig.centerSub}
                slices={minorConfig.slices}
                size={172}
                strokeWidth={26}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. 국가별 가맹업종 비교 (중국 - 일본 - 홍콩 - 한국) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-dark-750">
          <Globe className="w-5 h-5 text-brand-cyan" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            중국 · 일본 · 홍콩 · 한국 가맹업종 비중
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['CN', 'JP', 'HK', 'KR'] as const).map((code) => {
            const cData = COUNTRY_HIERARCHY[code];
            return (
              <VerticalDonutCard
                key={code}
                title={cData.country}
                centerLabel={cData.middleCategorySlices[0].label}
                centerValue={`${cData.middleCategorySlices[0].pct}%`}
                centerSub={cData.middleCategorySlices[0].valueText}
                slices={cData.middleCategorySlices}
                size={168}
                strokeWidth={26}
                onSliceSelect={() => setSelectedCountry(code)}
              />
            );
          })}
        </div>
      </div>

      {/* 4. 연령대 · 성별교차 · 프랜차이즈 가맹점 비중 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <VerticalDonutCard
          title="연령대별 결제 비중"
          centerLabel="20대"
          centerValue="67.9%"
          centerSub="119.48억 원"
          slices={AGE_PORTION_SLICES}
          size={185}
          strokeWidth={28}
        />

        <VerticalDonutCard
          title="성별 · 연령 교차 충전 비중"
          centerLabel="20대 여성"
          centerValue="53.5%"
          centerSub="80.06억 원"
          slices={GENDER_AGE_PORTION_SLICES}
          size={185}
          strokeWidth={28}
        />

        <VerticalDonutCard
          title="프랜차이즈 브랜드 비중"
          centerLabel="브랜드 합산"
          centerValue="40.71억 원"
          centerSub="CU 23.3%"
          slices={FRANCHISE_PORTION_SLICES}
          size={185}
          strokeWidth={28}
        />
      </div>

      {/* 하단 공식 출처 (가맹업종 탭 단 1회 텍스트 아웃링크 일원화 - Rule 12, Rule 13 준수) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-750 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-semibold text-slate-300">데이터 출처 :</span>
          <a
            href="https://www.namanecard.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold inline-flex items-center gap-1 transition-colors"
            title="나마네카드(아이오로라) 공식 결제망 거래 데이터"
          >
            <span>아이오로라(i-aurora) 공식 결제망 거래분석 데이터</span>
            <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MerchantShareSubpage;
