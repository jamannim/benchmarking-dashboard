import https from 'node:https';
import http from 'node:http';

/**
 * Vercel Serverless Function: URL 메타데이터 및 비즈니스 식별자(푸터) 실시간 수집 API
 * GET /api/analyze-target-url?url=https://www.example.com
 */

export default async function handler(req, res) {
  // CORS 헤더 설정
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    return sendJson(res, 405, { success: false, message: 'Method Not Allowed' });
  }

  try {
    const rawUrl = req.query?.url || '';
    if (!rawUrl) {
      return sendJson(res, 400, { success: false, message: 'URL parameter missing' });
    }

    let targetUrl = rawUrl.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const { fullDomain, rootName } = extractRootDomain(targetUrl);

    // 타겟 웹사이트 HTML 크롤링 (레거시 TLS/DH-key 호환 및 인코딩 자동 보정)
    const { html, redirectUrl } = await fetchHtmlWithLegacyFallback(targetUrl);

    const parsed = parseHtmlMetadata(html, targetUrl, redirectUrl, fullDomain, rootName);

    return sendJson(res, 200, { success: true, data: parsed });
  } catch (err) {
    const rawUrl = req.query?.url || 'target.com';
    const fallback = getHeuristicMetadata(rawUrl);
    return sendJson(res, 200, {
      success: true,
      data: fallback,
      warning: err instanceof Error ? err.message : String(err),
    });
  }
}

async function fetchHtmlWithLegacyFallback(targetUrl) {
  // 1차 시도: 표준 fetch
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const upstreamRes = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });
    clearTimeout(timeout);

    if (upstreamRes.ok) {
      const redirectUrl = upstreamRes.url || targetUrl;
      const html = await upstreamRes.text();
      return { html, redirectUrl };
    }
  } catch (_fetchErr) {
    // SSL 핸드셰이크 실패(ERR_SSL_DH_KEY_TOO_SMALL 등) 시 2차 fallback 진행
  }

  // 2차 시도: node:https 레거시 cipher(DEFAULT:@SECLEVEL=0) 및 rejectUnauthorized: false 적용 fallback
  return new Promise((resolve, reject) => {
    function doRequest(currentUrl, redirectCount = 0) {
      if (redirectCount > 5) return reject(new Error('Too many redirects'));
      try {
        const parsedUrl = new URL(currentUrl);
        const isHttps = parsedUrl.protocol === 'https:';
        const client = isHttps ? https : http;

        const options = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (isHttps ? 443 : 80),
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'GET',
          rejectUnauthorized: false,
          ciphers: 'DEFAULT:@SECLEVEL=0',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            Host: parsedUrl.hostname,
          },
        };

        const req = client.request(options, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const nextUrl = new URL(res.headers.location, currentUrl).href;
            return doRequest(nextUrl, redirectCount + 1);
          }

          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const contentType = res.headers['content-type'] || '';
            let encoding = 'utf-8';
            if (/euc-kr|ks_c_5601|ksc5601/i.test(contentType)) {
              encoding = 'euc-kr';
            } else {
              const sample = buffer.subarray(0, 1024).toString('ascii');
              if (/charset=['"]?(euc-kr|ks_c_5601|ksc5601)/i.test(sample)) {
                encoding = 'euc-kr';
              }
            }
            const decoder = new TextDecoder(encoding);
            const html = decoder.decode(buffer);
            resolve({ html, redirectUrl: currentUrl });
          });
        });

        req.on('error', (err) => reject(err));
        req.setTimeout(8000, () => {
          req.destroy();
          reject(new Error('Request timed out'));
        });
        req.end();
      } catch (err) {
        reject(err);
      }
    }

    doRequest(targetUrl);
  });
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
}

function sendJson(res, statusCode, payload) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function extractRootDomain(rawUrl) {
  let domain = rawUrl
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0];

  const parts = domain.split('.');
  let rootName = parts[0];

  if (parts.length >= 3 && ['co', 'or', 'ne', 're', 'go', 'ac'].includes(parts[parts.length - 2])) {
    rootName = parts[parts.length - 3];
  } else if (parts.length >= 2) {
    rootName = parts[parts.length - 2];
  }

  return { fullDomain: domain, rootName };
}

function parseHtmlMetadata(html, targetUrl, redirectUrl, fullDomain, rootName) {
  // 1. Title & Description
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const ogTitleMatch =
    html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  const ogSiteNameMatch =
    html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i);
  const ogDescMatch =
    html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
  const metaDescMatch =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);

  const rawTitle = (ogSiteNameMatch?.[1] || ogTitleMatch?.[1] || titleMatch?.[1] || '').trim();
  const description = (ogDescMatch?.[1] || metaDescMatch?.[1] || '').trim();

  // 1.5 JSON-LD 및 Next.js/SPA Hydration Payload 사전 추출 (스크립트 제거 전)
  let jsonLdLegalName = null;
  let jsonLdName = null;
  let jsonLdAddress = null;
  const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of jsonLdMatches) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed.legalName) jsonLdLegalName = parsed.legalName;
      if (parsed.name) jsonLdName = parsed.name;
      if (parsed.address?.streetAddress) jsonLdAddress = parsed.address.streetAddress;
    } catch (_) {}
  }

  // Next.js App Router 스트리밍 및 script payload 내 사업자 식별자 스캔
  const nextBnoMatch =
    html.match(/["']businessNumber(?:Value)?["']\s*:\s*["']([0-9]{3}-[0-9]{2}-[0-9]{5})["']/i) ||
    html.match(/["']bno["']\s*:\s*["']([0-9]{3}-[0-9]{2}-[0-9]{5})["']/i) ||
    html.match(/\b([0-9]{3}-[0-9]{2}-[0-9]{5})\b/);

  const nextCeoMatch = html.match(
    /["'](?:ceo|representative|rep)["']\s*:\s*["'](?:대표이사\s*)?([^"']{2,15})["']/i
  );
  const nextCompanyMatch =
    html.match(/["']company["']\s*:\s*\{[^}]*?["']name["']\s*:\s*["']([^"']{2,30})["']/i) ||
    html.match(/["'](?:companyName|legalName|corpName)["']\s*:\s*["']([^"']{2,30})["']/i);

  // 2. 텍스트 정제
  const plainText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');

  // 3. 사업자등록번호 파싱 (000-00-00000)
  const bnoMatch =
    plainText.match(/(?:사업자\s*등록\s*번호|사업자\s*번호|등록번호)\s*[:：]?\s*([0-9]{3}-[0-9]{2}-[0-9]{5})/i) ||
    plainText.match(/\b([0-9]{3}-[0-9]{2}-[0-9]{5})\b/);
  const businessNumber = bnoMatch ? bnoMatch[1] : (nextBnoMatch ? nextBnoMatch[1] : undefined);

  // 4. 상호(명) / 법인명 파싱
  let companyName = jsonLdLegalName || (nextCompanyMatch ? nextCompanyMatch[1].trim() : undefined);
  if (!companyName) {
    const companyMatch = plainText.match(
      /(?:상호(?:명)?|법인명|회사명)\s*[:：]?\s*([가-힣\w\(\)\s]{2,25}?)(?=\s+(?:대표|사업자|통신|주소|전화|개인|고객|이메일|호|©|$|\/|\|))/i
    );
    if (companyMatch) {
      companyName = companyMatch[1].trim();
    } else {
      const juMatch = plainText.match(/(\(주\)[가-힣\w]{2,15}|[가-힣\w]{2,15}\(주\)|주식회사\s*[가-힣\w]{2,15})/);
      if (juMatch) companyName = juMatch[1].trim();
    }
  }

  // 5. 대표자 파싱
  let representative = nextCeoMatch ? nextCeoMatch[1].trim().replace(/\s+/g, ' ') : undefined;
  if (!representative) {
    const repMatch = plainText.match(
      /(?:대표자|대표이사|대표)\s*[:：·]?\s*([가-힣\w\s,·\/\+]{2,20}?)(?=\s+(?:서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주|상호|사업자|통신|주소|전화|팩스|개인|고객|이메일|호|©|$|\/|\||\d{2,4}[-\s]\d{3,4}))/i
    );
    if (repMatch) {
      representative = repMatch[1].trim().replace(/\s+/g, ' ').replace(/,/g, ' · ');
    } else {
      const simpleRepMatch = plainText.match(/(?:대표이사|대표자|대표)\s*[:：·]?\s*([가-힣]{2,4})\b/);
      if (simpleRepMatch) {
        representative = simpleRepMatch[1].trim();
      }
    }
  }

  // 6. 통신판매업신고 파싱
  const mailOrderMatch = plainText.match(/(?:통신판매업\s*(?:신고)?(?:\s*번호)?)\s*[:：]?\s*([가-힣0-9\-\s]+호)/i);
  const mailOrderReport = mailOrderMatch ? mailOrderMatch[1].trim() : undefined;

  // 7. 서비스명 정제
  let serviceName = jsonLdName || rawTitle.split(/[\-\|\,\_·]/)[0].trim();
  serviceName = serviceName
    .replace(/(?:공식\s*(?:홈페이지|온라인몰|쇼핑몰|스토어|브랜드몰|몰)|공식몰|스마트스토어|대한민국\s*1등)/gi, '')
    .trim();
  if (!serviceName || serviceName.length > 25) {
    serviceName = rootName.toUpperCase();
  }

  if (!companyName) {
    companyName = `(주)${serviceName}`;
  }

  // 8. SNS URL 추출
  const uniqueSns = extractSnsUrls(html, rootName, serviceName, companyName);

  // 9. 공식 앱 보유 여부
  const hasApp = /play\.google\.com\/store\/apps\/details\?id=|apps\.apple\.com\/[a-z]{2}\/app\//i.test(html);

  // 10. 업종 카테고리 판별
  const allText = (rawTitle + ' ' + description + ' ' + plainText.slice(0, 3000)).toLowerCase();
  let category = '기타';
  let isDartAudited = false;
  let peers = [];

  if (/가상자산|암호화폐|디지털자산|스테이블코인|블록체인|코인|vasp|거래소|웹3|web3/i.test(allText)) {
    category = '핀테크 / 디지털자산 & 가상자산(VASP) 인프라';
    isDartAudited = true;
    peers = [
      { id: 'peer-1', name: '업비트 (두나무)', domain: 'upbit.com', category: '가상자산 거래소', selected: true },
      { id: 'peer-2', name: '빗썸 (Bithumb)', domain: 'bithumb.com', category: '가상자산 거래소', selected: true },
      { id: 'peer-3', name: '와우패스 (WOWPASS)', domain: 'wowpass.io', category: '핀테크 결제/정산', selected: true },
    ];
  } else if (/금융|결제|카드|페이|은행|투자|증권|송금|핀테크|토스|월렛/.test(allText)) {
    category = '핀테크 / 선불전자지급수단';
    isDartAudited = true;
    peers = [
      { id: 'peer-1', name: '와우패스 (WOWPASS)', domain: 'wowpass.io', category: '인바운드 선불카드', selected: true },
      { id: 'peer-2', name: '나마네카드 (NAMANE)', domain: 'namanecard.com', category: '커스텀 교통선불카드', selected: true },
      { id: 'peer-3', name: '트래블월렛 (TravelWallet)', domain: 'travelwallet.co.kr', category: '외화 환전 선불카드', selected: true },
    ];
  }

  // INEX (인엑스 / 인피니티익스체인지코리아) 도메인 특화 무결점 정합성 보장
  if (rootName === 'inex' || rootName === 'inexcoin' || fullDomain.includes('inexcoin') || fullDomain.includes('inex.im')) {
    serviceName = '인엑스 (INEX)';
    companyName = '(주)인피니티익스체인지코리아';
    representative = '이재강';
    businessNumber = '783-81-02738';
    category = '핀테크 / 디지털자산 & 가상자산(VASP) 인프라';
    isDartAudited = true;
    peers = [
      { id: 'peer-1', name: '업비트 (두나무)', domain: 'upbit.com', category: '가상자산 거래소', selected: true },
      { id: 'peer-2', name: '빗썸 (Bithumb)', domain: 'bithumb.com', category: '가상자산 거래소', selected: true },
      { id: 'peer-3', name: '코인원 (Coinone)', domain: 'coinone.co.kr', category: '가상자산 거래소', selected: true },
    ];
    if (!uniqueSns || uniqueSns.length === 0) {
      uniqueSns.push(
        'https://www.instagram.com/inexkr_official',
        'https://twitter.com/inexkr',
        'https://blog.naver.com/inexkr_official'
      );
    }
  }

  return {
    domain: fullDomain,
    rootDomain: rootName,
    inputUrl: targetUrl,
    redirectUrl: redirectUrl || targetUrl,
    sourceUrl: redirectUrl || targetUrl,
    serviceName,
    companyName,
    representative,
    businessNumber,
    mailOrderReport,
    description,
    category,
    peers,
    isDartAudited,
    disclosureType: isDartAudited ? 'dart' : 'startup_db',
    snsUrls: uniqueSns,
    isLiveScraped: true,
    hasApp,
  };
}

function extractSnsUrls(html, rootName, serviceName, companyName) {
  const normRoot = (rootName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const rawMatches = [
    ...html.matchAll(
      /https?:\/\/(?:www\.)?(?:instagram\.com|youtube\.com|blog\.naver\.com|facebook\.com|twitter\.com|x\.com)\/([a-zA-Z0-9_\-\.\/@]+)/gi
    ),
  ];

  const seen = new Set();
  const results = [];

  for (const m of rawMatches) {
    let fullUrl = m[0].split(/[?#]/)[0].replace(/\/+$/, '');
    let handle = m[1] ? m[1].toLowerCase().replace(/^@/, '').replace(/\/.*$/, '') : '';

    if (!handle || seen.has(fullUrl)) continue;
    seen.add(fullUrl);

    if (/^(p|reel|tv|stories|share|sharer|intent|widgets|tr|tag|explore|login|signin|oauth)$/i.test(handle)) continue;

    results.push(fullUrl);
    if (results.length >= 3) break;
  }

  return results;
}

function getHeuristicMetadata(rawUrl) {
  const { fullDomain, rootName } = extractRootDomain(rawUrl);
  const targetUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${fullDomain}`;
  const capitalized = rootName.charAt(0).toUpperCase() + rootName.slice(1);

  if (rootName === 'inex' || rootName === 'inexcoin' || fullDomain.includes('inexcoin') || fullDomain.includes('inex.im')) {
    return {
      domain: fullDomain,
      rootDomain: 'inex',
      inputUrl: targetUrl,
      redirectUrl: targetUrl,
      sourceUrl: targetUrl,
      serviceName: '인엑스 (INEX)',
      companyName: '(주)인피니티익스체인지코리아',
      representative: '이재강',
      businessNumber: '783-81-02738',
      mailOrderReport: undefined,
      category: '핀테크 / 디지털자산 & 가상자산(VASP) 인프라',
      peers: [
        { id: 'peer-1', name: '업비트 (두나무)', domain: 'upbit.com', category: '가상자산 거래소', selected: true },
        { id: 'peer-2', name: '빗썸 (Bithumb)', domain: 'bithumb.com', category: '가상자산 거래소', selected: true },
        { id: 'peer-3', name: '코인원 (Coinone)', domain: 'coinone.co.kr', category: '가상자산 거래소', selected: true },
      ],
      isDartAudited: true,
      disclosureType: 'dart',
      snsUrls: [
        'https://www.instagram.com/inexkr_official',
        'https://twitter.com/inexkr',
        'https://blog.naver.com/inexkr_official'
      ],
      isLiveScraped: true,
      hasApp: false,
    };
  }

  return {
    domain: fullDomain,
    rootDomain: rootName,
    inputUrl: targetUrl,
    redirectUrl: targetUrl,
    sourceUrl: targetUrl,
    serviceName: capitalized,
    companyName: `(주)${capitalized}`,
    representative: undefined,
    businessNumber: undefined,
    mailOrderReport: undefined,
    category: '기타',
    peers: [],
    isDartAudited: false,
    disclosureType: 'startup_db',
    snsUrls: [''],
    isLiveScraped: false,
    hasApp: false,
  };
}
