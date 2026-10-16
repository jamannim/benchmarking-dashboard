import React, { useState } from 'react';

export interface BrandInfo {
  key: string;
  name: string;
  domain: string;
  bgFallback: string;
  char: string;
}

export const BRAND_REGISTRY: Record<string, BrandInfo> = {
  google: { key: 'google', name: 'Google', domain: 'google.com', bgFallback: 'bg-red-500/20 text-red-400 border-red-500/30', char: 'G' },
  naver: { key: 'naver', name: 'Naver', domain: 'naver.com', bgFallback: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', char: 'N' },
  yahoo: { key: 'yahoo', name: 'Yahoo', domain: 'yahoo.co.jp', bgFallback: 'bg-purple-500/20 text-purple-400 border-purple-500/30', char: 'Y!' },
  bing: { key: 'bing', name: 'Bing', domain: 'bing.com', bgFallback: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', char: 'b' },
  baidu: { key: 'baidu', name: 'Baidu', domain: 'baidu.com', bgFallback: 'bg-blue-600/20 text-blue-400 border-blue-600/30', char: '度' },
  youtube: { key: 'youtube', name: 'YouTube', domain: 'youtube.com', bgFallback: 'bg-red-600/20 text-red-400 border-red-600/30', char: '▶' },
  instagram: { key: 'instagram', name: 'Instagram', domain: 'instagram.com', bgFallback: 'bg-pink-500/20 text-pink-400 border-pink-500/30', char: 'IG' },
  tiktok: { key: 'tiktok', name: 'TikTok', domain: 'tiktok.com', bgFallback: 'bg-slate-700 text-cyan-400 border-cyan-500/30', char: 'TT' },
  dcard: { key: 'dcard', name: 'Dcard', domain: 'dcard.tw', bgFallback: 'bg-blue-600/20 text-blue-400 border-blue-600/30', char: 'D' },
  xiaohongshu: { key: 'xiaohongshu', name: 'Xiaohongshu', domain: 'xiaohongshu.com', bgFallback: 'bg-red-500/20 text-red-400 border-red-500/30', char: 'RED' },
  wikipedia: { key: 'wikipedia', name: 'Wikipedia', domain: 'wikipedia.org', bgFallback: 'bg-slate-700 text-slate-200 border-slate-600', char: 'W' },
  daum: { key: 'daum', name: 'Daum', domain: 'daum.net', bgFallback: 'bg-amber-500/20 text-amber-400 border-amber-500/30', char: 'D' },
  aws: { key: 'aws', name: 'AWS', domain: 'aws.amazon.com', bgFallback: 'bg-amber-500/20 text-amber-400 border-amber-500/30', char: 'AWS' },
  cloudflare: { key: 'cloudflare', name: 'Cloudflare', domain: 'cloudflare.com', bgFallback: 'bg-orange-500/20 text-orange-400 border-orange-500/30', char: 'CF' },
  nginx: { key: 'nginx', name: 'Nginx', domain: 'nginx.org', bgFallback: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30', char: 'NG' },
  mysql: { key: 'mysql', name: 'MySQL', domain: 'mysql.com', bgFallback: 'bg-blue-500/20 text-blue-400 border-blue-500/30', char: 'SQL' },
  namane: { key: 'namane', name: 'NAMANE', domain: 'namanecard.com', bgFallback: 'bg-purple-600/20 text-purple-400 border-purple-600/30', char: 'N' },
  wowpass: { key: 'wowpass', name: 'WOWPASS', domain: 'wowpass.io', bgFallback: 'bg-orange-500/20 text-orange-400 border-orange-500/30', char: 'W' },
  travelwallet: { key: 'travelwallet', name: 'TravelWallet', domain: 'travelwallet.co.kr', bgFallback: 'bg-blue-500/20 text-blue-400 border-blue-500/30', char: 'TW' },
  apple: { key: 'apple', name: 'Apple', domain: 'apple.com', bgFallback: 'bg-slate-700 text-white border-slate-600', char: '' },
  ibk: { key: 'ibk', name: 'IBK기업은행', domain: 'ibk.co.kr', bgFallback: 'bg-blue-600/20 text-blue-400 border-blue-600/30', char: 'IBK' },
  yuanta: { key: 'yuanta', name: '유안타증권', domain: 'yuantakorea.com', bgFallback: 'bg-amber-600/20 text-amber-400 border-amber-600/30', char: '유안타' },
  nice: { key: 'nice', name: 'NICE평가정보', domain: 'niceinfo.co.kr', bgFallback: 'bg-blue-500/20 text-blue-400 border-blue-500/30', char: 'NICE' },
  saramin: { key: 'saramin', name: '사람인', domain: 'saramin.co.kr', bgFallback: 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30', char: '사람인' },
  dart: { key: 'dart', name: 'DART 전자공시', domain: 'dart.fss.or.kr', bgFallback: 'bg-blue-600/20 text-blue-400 border-blue-600/30', char: 'DART' },
  fss: { key: 'fss', name: '금융감독원', domain: 'fss.or.kr', bgFallback: 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30', char: 'FSS' },
  dealsite: { key: 'dealsite', name: '딜사이트', domain: 'dealsite.co.kr', bgFallback: 'bg-red-600/20 text-red-400 border-red-600/30', char: 'DEAL' },
  iaurora: { key: 'iaurora', name: '주식회사 아이오로라', domain: 'namanecard.com', bgFallback: 'bg-purple-600/20 text-purple-300 border-purple-600/30', char: 'iA' },
  alipay: { key: 'alipay', name: 'Alipay+', domain: 'alipay.com', bgFallback: 'bg-blue-600/20 text-blue-400 border-blue-600/30', char: '支' },
  nh: { key: 'nh', name: 'NH투자증권', domain: 'nhqv.com', bgFallback: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30', char: 'NH' },
  ygplus: { key: 'ygplus', name: 'YG PLUS', domain: 'ygplus.com', bgFallback: 'bg-zinc-800 text-amber-400 border-zinc-700', char: 'YG+' },
  kiwoom: { key: 'kiwoom', name: '키움인베스트먼트', domain: 'kiwoominvestment.com', bgFallback: 'bg-rose-600/20 text-rose-400 border-rose-600/30', char: '키움' },
  nicetcm: { key: 'nicetcm', name: '나이스정보통신', domain: 'nicepay.co.kr', bgFallback: 'bg-blue-600/20 text-blue-400 border-blue-600/30', char: 'NICE' },
  cubeent: { key: 'cubeent', name: '큐브엔터테인먼트', domain: 'cubeent.co.kr', bgFallback: 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30', char: 'CUBE' },
  otherworld: { key: 'otherworld', name: '아더월드', domain: 'otherworld.network', bgFallback: 'bg-purple-600/20 text-purple-300 border-purple-600/30', char: 'OW' },
  hybe: { key: 'hybe', name: 'HYBE', domain: 'hybecorp.com', bgFallback: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', char: 'HYBE' },
  sm: { key: 'sm', name: 'SM엔터테인먼트', domain: 'smentertainment.com', bgFallback: 'bg-pink-500/20 text-pink-300 border-pink-500/30', char: 'SM' },
  weverse: { key: 'weverse', name: 'Weverse', domain: 'weverse.io', bgFallback: 'bg-teal-500/20 text-teal-300 border-teal-500/30', char: 'WV' },
  cjenm: { key: 'cjenm', name: 'CJ ENM (WAKEONE)', domain: 'cjenm.com', bgFallback: 'bg-orange-500/20 text-orange-300 border-orange-500/30', char: 'CJ' },
  linefriends: { key: 'linefriends', name: 'IPX (LINE FRIENDS)', domain: 'linefriends.com', bgFallback: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', char: 'LF' },
  innoforest: { key: 'innoforest', name: '혁신의숲', domain: 'innoforest.co.kr', bgFallback: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30', char: '숲' },
  mss: { key: 'mss', name: '중소벤처기업부', domain: 'mss.go.kr', bgFallback: 'bg-blue-600/20 text-blue-300 border-blue-500/30', char: '중기부' },
  thevc: { key: 'thevc', name: 'THE VC', domain: 'thevc.kr', bgFallback: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30', char: 'VC' },
  similarweb: { key: 'similarweb', name: '시밀러웹', domain: 'similarweb.com', bgFallback: 'bg-sky-600/20 text-sky-400 border-sky-600/30', char: 'SW' },
  playstore: { key: 'playstore', name: 'Google Play', domain: 'play.google.com', bgFallback: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', char: 'GP' },
  appstore: { key: 'appstore', name: 'App Store', domain: 'apple.com', bgFallback: 'bg-blue-500/20 text-blue-400 border-blue-500/30', char: '' },
  korail: { key: 'korail', name: '코레일', domain: 'korail.com', bgFallback: 'bg-blue-600/20 text-blue-400 border-blue-600/30', char: '코레일' },
  cloudzero: { key: 'cloudzero', name: 'CloudZero', domain: 'cloudzero.com', bgFallback: 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30', char: 'CZ' },
};

interface BrandLogoProps {
  brandKey?: string;
  domain?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  brandKey, 
  domain, 
  size = 'sm', 
  className = '' 
}) => {
  const [error, setError] = useState(false);

  // Find info
  let info: BrandInfo | undefined;
  if (brandKey && BRAND_REGISTRY[brandKey.toLowerCase()]) {
    info = BRAND_REGISTRY[brandKey.toLowerCase()];
  } else if (domain) {
    const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
    const matchedKey = Object.keys(BRAND_REGISTRY).find(k => cleanDomain.includes(k));
    if (matchedKey) {
      info = BRAND_REGISTRY[matchedKey];
    } else {
      info = {
        key: cleanDomain,
        name: cleanDomain,
        domain: cleanDomain,
        bgFallback: 'bg-slate-700 text-slate-300 border-slate-600',
        char: cleanDomain.charAt(0).toUpperCase()
      };
    }
  }

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }[size];

  const fontSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }[size];

  if (!info) return null;

  if (error) {
    return (
      <span 
        title={info.name}
        className={`inline-flex items-center justify-center font-bold rounded-lg border ${sizeClasses} ${fontSizes} shrink-0 ${info.bgFallback} ${className}`}
      >
        {info.char}
      </span>
    );
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${info.domain}&sz=128`}
      alt={info.name}
      title={info.name}
      loading="lazy"
      onError={() => setError(true)}
      className={`${sizeClasses} rounded-lg object-contain shrink-0 bg-dark-800 p-1 border border-dark-700 shadow-sm ${className}`}
    />
  );
};

/**
 * Helper to find all brand logos contained within a text string
 * (e.g. "Google (85%) / Naver (15%)" -> [GoogleLogo, NaverLogo])
 */
export const BrandBadgesFromText: React.FC<{ 
  text: string; 
  size?: 'xs' | 'sm';
  showText?: boolean;
  className?: string;
}> = ({ text, size = 'xs', showText = true, className = '' }) => {
  const lower = text.toLowerCase();
  
  // Find all keys matching the string
  const matchedKeys: string[] = [];
  
  // Priority order matching with patterns (English & Korean)
  const checkOrder: { key: string; patterns: string[] }[] = [
    { key: 'google', patterns: ['google', '구글'] },
    { key: 'naver', patterns: ['naver', '네이버', 'ncloud'] },
    { key: 'daum', patterns: ['daum', '다음'] },
    { key: 'yahoo', patterns: ['yahoo', '야후'] },
    { key: 'bing', patterns: ['bing', '빙'] },
    { key: 'baidu', patterns: ['baidu', '바이두'] },
    { key: 'youtube', patterns: ['youtube', '유튜브'] },
    { key: 'instagram', patterns: ['instagram', '인스타'] },
    { key: 'tiktok', patterns: ['tiktok', '틱톡'] },
    { key: 'dcard', patterns: ['dcard'] },
    { key: 'xiaohongshu', patterns: ['xiaohongshu', '샤오홍슈', 'rednote'] },
    { key: 'wikipedia', patterns: ['wikipedia', '위키'] },
    { key: 'cloudflare', patterns: ['cloudflare', '클라우드플레어'] },
    { key: 'aws', patterns: ['aws', 'amazon', '아마존'] },
    { key: 'nginx', patterns: ['nginx', '엔진엑스'] },
    { key: 'mysql', patterns: ['mysql'] },
    { key: 'namane', patterns: ['namane', '나마네'] },
    { key: 'wowpass', patterns: ['wowpass', '와우패스'] },
    { key: 'travelwallet', patterns: ['travelwallet', '트래블월렛'] },
    { key: 'ibk', patterns: ['ibk', '기업은행'] },
    { key: 'yuanta', patterns: ['yuanta', '유안타', '유안타증권'] },
    { key: 'nice', patterns: ['nice', '나이스', 'nice평가정보'] },
    { key: 'saramin', patterns: ['saramin', '사람인'] },
    { key: 'dart', patterns: ['dart', '전자공시'] },
    { key: 'innoforest', patterns: ['innoforest', '혁신의숲'] },
    { key: 'mss', patterns: ['중기부', '중소벤처기업부', '중소기업청'] },
    { key: 'thevc', patterns: ['thevc', 'the vc', '더브이씨'] },
    { key: 'fss', patterns: ['fss', '금융감독원', '금감원'] },
    { key: 'dealsite', patterns: ['dealsite', '딜사이트'] },
    { key: 'ygplus', patterns: ['ygplus', 'yg플러스', '와이지'] },
    { key: 'kiwoom', patterns: ['kiwoom', '키움', '키움인베스트먼트'] },
    { key: 'nicetcm', patterns: ['나이스정보통신', 'nice정보통신'] },
    { key: 'cubeent', patterns: ['cubeent', '큐브', '큐브엔터', 'cube'] },
    { key: 'otherworld', patterns: ['otherworld', '아더월드'] },
  ];

  for (const item of checkOrder) {
    if (item.patterns.some(p => lower.includes(p))) {
      if (!matchedKeys.includes(item.key)) {
        matchedKeys.push(item.key);
      }
    }
  }

  return (
    <div className={`inline-flex items-center space-x-1.5 ${className}`}>
      {matchedKeys.map(k => (
        <BrandLogo key={k} brandKey={k} size={size} />
      ))}
      {showText && <span className="truncate">{text}</span>}
    </div>
  );
};
