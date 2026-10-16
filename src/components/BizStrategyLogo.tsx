import React, { useState } from 'react';

interface BizStrategyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-5 h-5',
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const ROUNDED_MAP = {
  xs: 'rounded-md',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
};

export const BizStrategyLogo: React.FC<BizStrategyLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const roundedClass = ROUNDED_MAP[size] || ROUNDED_MAP.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* 로고 심볼 이미지 / 벡터 */}
      <div
        className={`relative ${sizeClass} ${roundedClass} overflow-hidden shadow-lg shadow-cyan-950/40 border border-cyan-400/40 bg-dark-950 shrink-0 flex items-center justify-center group`}
      >
        {!imgError ? (
          <img
            src="/logos/bizlens_symbol.png"
            alt="비즈렌즈 (BIZLENS) 공식 CI 심볼마크"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-0.5 transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          /* 고품질 SVG 벡터 폴백 (새로운 EB + 렌즈 조리개 테마) */
          <div className="w-full h-full bg-[#0A0E1A] flex items-center justify-center p-1 text-cyan-400">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
              <rect width="40" height="40" rx="8" fill="#0A0E1A" />
              {/* 조리개 원형 렌즈 */}
              <circle cx="26" cy="18" r="9" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="26" cy="18" r="5" stroke="#5BFFB4" strokeWidth="1.5" />
              {/* EB 모노그램 */}
              <path d="M10 10H20V16H14V22H19V27H14V30H24" stroke="#5BFFB4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* 텍스트 표기 옵션 (BIZLENS 아래에 Business Analysis Lens 배치) */}
      {showText && (
        <div className="flex flex-col text-left justify-center">
          <span className="font-black text-white tracking-tight leading-none text-base sm:text-lg">
            BIZLENS
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-tight leading-none mt-1">
            Business Analysis Lens
          </span>
        </div>
      )}
    </div>
  );
};

export default BizStrategyLogo;
