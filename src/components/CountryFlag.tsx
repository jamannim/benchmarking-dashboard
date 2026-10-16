import React from 'react';
import { Globe } from 'lucide-react';

interface CountryFlagProps {
  code?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-4 h-3 rounded-[2px]',
  sm: 'w-4.5 h-3.5 rounded-[2px]',
  md: 'w-5 h-3.5 rounded-[3px]',
};

/**
 * Windows 등 모든 OS 브라우저에서 이모지 국기(JP, US, KR 등 영문 코드 대체 현상) 없이
 * 선명한 벡터(SVG) 국기 아이콘을 렌더링하는 공통 컴포넌트입니다.
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  name = '',
  size = 'sm',
  className = '',
}) => {
  const c = (code || '').toUpperCase().trim();
  const n = name.trim();
  const sizeClass = SIZE_MAP[size];

  // 0. 기타 글로벌 (ETC) 명시 처리
  if (c === 'ETC') {
    return (
      <Globe
        className={`w-3.5 h-3.5 text-brand-cyan shrink-0 inline-block ${className}`}
        aria-label="기타 글로벌"
      />
    );
  }

  // 1. 일본 (JP)
  if (c === 'JP' || n.includes('일본') || n.includes('Japan')) {
    return (
      <svg
        className={`${sizeClass} shadow-sm border border-white/20 shrink-0 inline-block ${className}`}
        viewBox="0 0 30 20"
        aria-label="일본 국기"
      >
        <rect width="30" height="20" fill="#ffffff" />
        <circle cx="15" cy="10" r="6" fill="#bc002d" />
      </svg>
    );
  }

  // 2. 미국 (US)
  if (c === 'US' || n.includes('미국') || n.includes('USA')) {
    return (
      <svg
        className={`${sizeClass} shadow-sm border border-white/20 shrink-0 inline-block ${className}`}
        viewBox="0 0 30 20"
        aria-label="미국 국기"
      >
        <rect width="30" height="20" fill="#ffffff" />
        <rect y="0" width="30" height="2.85" fill="#b22234" />
        <rect y="5.7" width="30" height="2.85" fill="#b22234" />
        <rect y="11.4" width="30" height="2.85" fill="#b22234" />
        <rect y="17.1" width="30" height="2.9" fill="#b22234" />
        <rect width="13" height="11.4" fill="#3c3b6e" />
        <circle cx="3.2" cy="2.8" r="0.9" fill="#ffffff" />
        <circle cx="6.5" cy="2.8" r="0.9" fill="#ffffff" />
        <circle cx="9.8" cy="2.8" r="0.9" fill="#ffffff" />
        <circle cx="4.8" cy="5.7" r="0.9" fill="#ffffff" />
        <circle cx="8.1" cy="5.7" r="0.9" fill="#ffffff" />
        <circle cx="3.2" cy="8.6" r="0.9" fill="#ffffff" />
        <circle cx="6.5" cy="8.6" r="0.9" fill="#ffffff" />
        <circle cx="9.8" cy="8.6" r="0.9" fill="#ffffff" />
      </svg>
    );
  }

  // 3. 대한민국 (KR)
  if (c === 'KR' || n.includes('대한민국') || n.includes('한국') || n.includes('국내')) {
    return (
      <svg
        className={`${sizeClass} shadow-sm border border-white/20 shrink-0 inline-block ${className}`}
        viewBox="0 0 30 20"
        aria-label="대한민국 국기"
      >
        <rect width="30" height="20" fill="#ffffff" />
        {/* 태극 문양 */}
        <circle cx="15" cy="10" r="5" fill="#cd2e3a" />
        <path d="M 10,10 A 5,5 0 0,0 20,10 A 2.5,2.5 0 0,0 15,10 A 2.5,2.5 0 0,1 10,10 Z" fill="#0047a0" />
        {/* 건곤감리 4괘 */}
        <g stroke="#000000" strokeWidth="1.1" strokeLinecap="round">
          <line x1="6.5" y1="4.5" x2="9" y2="7" />
          <line x1="5.3" y1="5.7" x2="7.8" y2="8.2" />
          <line x1="21" y1="4.5" x2="23.5" y2="7" />
          <line x1="22.2" y1="5.7" x2="24.7" y2="8.2" />
          <line x1="6.5" y1="15.5" x2="9" y2="13" />
          <line x1="21" y1="15.5" x2="23.5" y2="13" />
        </g>
      </svg>
    );
  }

  // 4. 대만 (TW)
  if (c === 'TW' || n.includes('대만') || n.includes('Taiwan')) {
    return (
      <svg
        className={`${sizeClass} shadow-sm border border-white/20 shrink-0 inline-block ${className}`}
        viewBox="0 0 30 20"
        aria-label="대만 국기"
      >
        <rect width="30" height="20" fill="#fe0000" />
        <rect width="15" height="10" fill="#000095" />
        <circle cx="7.5" cy="5" r="2.8" fill="#ffffff" />
      </svg>
    );
  }

  // 5. 태국 (TH)
  if (c === 'TH' || n.includes('태국') || n.includes('Thailand')) {
    return (
      <svg
        className={`${sizeClass} shadow-sm border border-white/20 shrink-0 inline-block ${className}`}
        viewBox="0 0 30 20"
        aria-label="태국 국기"
      >
        <rect width="30" height="20" fill="#a51931" />
        <rect y="3.33" width="30" height="13.34" fill="#f4f5f8" />
        <rect y="6.66" width="30" height="6.68" fill="#2d2a4a" />
      </svg>
    );
  }

  // 6. 중국 (CN)
  if (c === 'CN' || n.includes('중국') || n.includes('China')) {
    return (
      <svg
        className={`${sizeClass} shadow-sm border border-white/20 shrink-0 inline-block ${className}`}
        viewBox="0 0 30 20"
        aria-label="중국 국기"
      >
        <rect width="30" height="20" fill="#de2910" />
        <circle cx="6" cy="6" r="2.3" fill="#ffde00" />
        <circle cx="11" cy="2.8" r="0.8" fill="#ffde00" />
        <circle cx="12.5" cy="5" r="0.8" fill="#ffde00" />
        <circle cx="12.2" cy="7.6" r="0.8" fill="#ffde00" />
        <circle cx="10.5" cy="9.5" r="0.8" fill="#ffde00" />
      </svg>
    );
  }

  // 7. 홍콩 (HK)
  if (c === 'HK' || n.includes('홍콩') || n.includes('Hong Kong')) {
    return (
      <svg
        className={`${sizeClass} shadow-sm border border-white/20 shrink-0 inline-block ${className}`}
        viewBox="0 0 30 20"
        aria-label="홍콩 국기"
      >
        <rect width="30" height="20" fill="#de2910" />
        <circle cx="15" cy="10" r="4.2" fill="#ffffff" />
        <circle cx="15" cy="10" r="2" fill="#de2910" />
      </svg>
    );
  }

  // 8. 싱가포르 (SG)
  if (c === 'SG' || n.includes('싱가포르')) {
    return (
      <svg
        className={`${sizeClass} shadow-sm border border-white/20 shrink-0 inline-block ${className}`}
        viewBox="0 0 30 20"
        aria-label="싱가포르 국기"
      >
        <rect width="30" height="10" fill="#ef3340" />
        <rect y="10" width="30" height="10" fill="#ffffff" />
        <circle cx="6.5" cy="5" r="3" fill="#ffffff" />
        <circle cx="7.7" cy="5" r="2.5" fill="#ef3340" />
      </svg>
    );
  }

  // 9. 베트남 (VN)
  if (c === 'VN' || n.includes('베트남')) {
    return (
      <svg
        className={`${sizeClass} shadow-sm border border-white/20 shrink-0 inline-block ${className}`}
        viewBox="0 0 30 20"
        aria-label="베트남 국기"
      >
        <rect width="30" height="20" fill="#da251d" />
        <polygon
          points="15,4.5 16.5,8.8 21,8.8 17.4,11.4 18.8,15.7 15,13 11.2,15.7 12.6,11.4 9,8.8 13.5,8.8"
          fill="#ffff00"
        />
      </svg>
    );
  }

  // 기본값 (글로벌 등)
  return (
    <Globe
      className={`w-3.5 h-3.5 text-brand-cyan shrink-0 inline-block ${className}`}
      aria-label="글로벌"
    />
  );
};
