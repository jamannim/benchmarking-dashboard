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

    // 타겟 웹사이트 HTML 크롤링
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

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

    const redirectUrl = upstreamRes.url || targetUrl;
    const html = await upstreamRes.text();

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
  const businessNumber = bnoMatch ? bnoMatch[1] : undefined;

  // 4. 상호(명) / 법인명 파싱
  let companyName;
  const companyMatch = plainText.match(
    /(?:상호(?:명)?|법인명|회사명)\s*[:：]?\s*([가-힣\w\(\)\s]{2,25}?)(?=\s+(?:대표|사업자|통신|주소|전화|개인|고객|이메일|호|©|$|\/|\|))/i
  );
  if (companyMatch) {
    companyName = companyMatch[1].trim();
  } else {
    const juMatch = plainText.match(/(\(주\)[가-힣\w]{2,15}|[가-힣\w]{2,15}\(주\)|주식회사\s*[가-힣\w]{2,15})/);
    if (juMatch) companyName = juMatch[1].trim();
  }

  // 5. 대표자 파싱
  let representative;
  const repMatch = plainText.match(
    /(?:대표자|대표이사|대표)\s*[:：]?\s*([가-힣\w\s,·\/\+]{2,20}?)(?=\s+(?:상호|사업자|통신|주소|전화|개인|고객|이메일|호|©|$|\/|\|))/i
  );
  if (repMatch) {
    representative = repMatch[1].trim().replace(/\s+/g, ' ').replace(/,/g, ' · ');
  }

  // 6. 통신판매업신고 파싱
  const mailOrderMatch = plainText.match(/(?:통신판매업\s*(?:신고)?(?:\s*번호)?)\s*[:：]?\s*([가-힣0-9\-\s]+호)/i);
  const mailOrderReport = mailOrderMatch ? mailOrderMatch[1].trim() : undefined;

  // 7. 서비스명 정제
  let serviceName = rawTitle.split(/[\-\|\,\_·]/)[0].trim();
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
