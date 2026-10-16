import React from 'react';
import { SparklesIcon } from '@animateicons/react/lucide';

interface PartnerItem {
  name: string;
  logo: string;
}

// 파트너사 목록 (중복 제거된 10개 파트너 로고)
const PARTNERS_LIST: PartnerItem[] = [
  { name: '이브자리', logo: '/partners/evezary.png' },
  { name: '주노헤어', logo: '/partners/junohair.png' },
  { name: '동국대학교', logo: '/partners/dongguk.png' },
  { name: '인터밸류', logo: '/partners/intervalue.png' },
  { name: '하이앤드데일리', logo: '/partners/highenddaily.png' },
  { name: 'SLEEP&SLEEP', logo: '/partners/sleepnsleep.png' },
  { name: 'CODISEN', logo: '/partners/codisen.png' },
  { name: 'INNO', logo: '/partners/atrian.png' },
  { name: 'HOME&EVE', logo: '/partners/homeandeve.png' },
  { name: 'Paradies', logo: '/partners/inno.png' },
];

export const PartnersBelt: React.FC = () => {
  // 무한 롤링 벨트를 위해 리스트를 2회 복제
  const rollingPartners = [...PARTNERS_LIST, ...PARTNERS_LIST];

  return (
    <section className="py-8 sm:py-10 bg-dark-950/40 backdrop-blur-sm border-y border-dark-800/80 relative overflow-hidden font-sans">
      {/* 배경 은은한 네온 조명 효과 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-cyan-600/5 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
          <SparklesIcon size={14} className="text-cyan-400" />
          <span>Trust By</span>
        </div>
      </div>

      {/* 무한 롤링 벨트 슬라이더 (좌우 페이드 그라데이션 마스크) */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex items-center gap-4 sm:gap-6 py-2">
          {rollingPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="w-44 sm:w-52 h-16 sm:h-20 rounded-2xl bg-dark-900/80 hover:bg-dark-850 border border-dark-750/70 hover:border-cyan-500/40 transition-all duration-300 shrink-0 group shadow-lg hover:shadow-cyan-950/20 backdrop-blur-sm flex items-center justify-center px-4 py-2"
            >
              {/* 공식 로고 이미지 프레임 (동일 규격 360x100 캔버스 정밀 바운딩) */}
              <div className="w-32 sm:w-40 h-10 sm:h-12 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={`${partner.name} 공식 홈페이지 로고`}
                  width={360}
                  height={100}
                  className="max-w-full max-h-full w-auto h-auto object-contain filter brightness-95 group-hover:brightness-110 group-hover:scale-105 transition-all duration-200"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PartnersBelt;
