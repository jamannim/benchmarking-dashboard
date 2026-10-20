import type { Plugin } from 'vite';
import { findKnownVerifiedSnsPost } from '../data/snsFeedData.ts';

export interface FetchedSnsFeed {
  title: string;
  description: string;
  uploadDate: string;
  mediaType: string;
  postUrl: string;
  views?: string;
  likes?: string;
  comments?: string;
  hashtags?: string[];
  thumbnailUrl?: string;
  isRealtime: boolean;
}

// 플랫폼 기본 이름 및 봇 차단 페이지 감지 목록
const FORBIDDEN_TITLES = new Set([
  'instagram',
  'instagram photos and videos',
  'watch instagram photos and videos',
  'youtube',
  'facebook',
  'x',
  'twitter',
  'tiktok',
  'login',
  'log in',
  'sign up',
  'naver blog',
  '네이버 블로그',
  '블로그 :: 네이버'
]);

function isInvalidPlatformTitle(title?: string): boolean {
  if (!title) return true;
  const lower = title.trim().toLowerCase();
  if (FORBIDDEN_TITLES.has(lower)) return true;
  if (lower.startsWith('login') || lower.startsWith('sign up')) return true;
  if (lower.includes('photos and videos') && lower.includes('instagram')) return true;
  return false;
}

/**
 * 인스타그램 개별 게시글 및 릴스 실시간 스크래핑 (embed/captioned 공식 활용)
 */
async function fetchInstagramPostOrReel(postUrl: string, brandName: string): Promise<FetchedSnsFeed | null> {
  try {
    const match = postUrl.match(/instagram\.com\/(reel|p)\/([a-zA-Z0-9_-]+)/i);
    if (!match || !match[2]) return null;

    const postType = match[1].toLowerCase();
    const shortcode = match[2];
    const embedUrl = `https://www.instagram.com/${postType}/${shortcode}/embed/captioned/`;

    const res = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8'
      }
    });

    if (!res.ok) return null;
    const html = await res.text();

    // 캡션 추출
    const captionMatch = html.match(/data-log-event="captionProfileClick"[^>]*>[^<]+<\/a>(?:<br\s*\/?>|\s)*([\s\S]*?)<\/div>/i);
    let rawText = '';
    if (captionMatch && captionMatch[1]) {
      rawText = captionMatch[1]
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim();
    }

    // 캡션 첫 줄을 제목으로, 나머지를 설명으로 분리
    let title = '';
    let description = '';

    if (rawText) {
      const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      title = lines[0] || '';
      description = lines.slice(1).join(' ').trim() || title;
    }

    if (!title) {
      title = postType === 'reel' 
        ? `[릴스] ${brandName} 공식 인스타그램 릴스 피드`
        : `[피드] ${brandName} 공식 인스타그램 게시물`;
      description = `${brandName} 공식 인스타그램에서 발행된 최신 미디어 콘텐츠입니다.`;
    }

    // 해시태그 추출
    const hashtags = [...rawText.matchAll(/#([a-zA-Z0-9가-힣_-]+)/g)].map(m => `#${m[1]}`).slice(0, 5);
    if (hashtags.length === 0) hashtags.push(`#${brandName}`);

    return {
      title,
      description,
      uploadDate: '최근 게시',
      mediaType: postType === 'reel' ? 'Reels' : 'Feed',
      postUrl: `https://www.instagram.com/${postType}/${shortcode}/`,
      views: '-',
      likes: '-',
      comments: '-',
      hashtags,
      isRealtime: true
    };
  } catch (err) {
    return null;
  }
}

/**
 * 네이버 블로그 최신 게시글 실시간 스크래핑
 */
async function fetchNaverBlogPost(channelUrl: string, brandName: string): Promise<FetchedSnsFeed | null> {
  try {
    // 1. 특정 글 번호(logNo)가 포함된 개별 포스트 URL인 경우
    const postMatch = channelUrl.match(/blog\.naver\.com\/([^/?#]+)\/(\d+)/i);
    if (postMatch && postMatch[1] && postMatch[2]) {
      const blogId = postMatch[1];
      const logNo = postMatch[2];
      const directUrl = `https://blog.naver.com/${blogId}/${logNo}`;

      // OpenGraph 태그 직접 조회
      const res = await fetch(directUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (res.ok) {
        const html = await res.text();
        const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
        const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
        if (ogTitle && !isInvalidPlatformTitle(ogTitle[1])) {
          return {
            title: ogTitle[1].trim(),
            description: ogDesc ? ogDesc[1].trim() : `${brandName} 공식 블로그 포스트입니다.`,
            uploadDate: '공식 포스트',
            mediaType: 'Blog',
            postUrl: directUrl,
            views: '-',
            likes: '-',
            comments: '-',
            hashtags: [`#${brandName}`, '#공식블로그'],
            isRealtime: true
          };
        }
      }
    }

    // 2. 블로그 채널 메인 URL인 경우 (PostTitleListAsync 비동기 목록 조회)
    const match = channelUrl.match(/blog\.naver\.com\/([^/?#]+)/i);
    if (!match || !match[1]) return null;
    const blogId = match[1];

    const apiUrl = `https://blog.naver.com/PostTitleListAsync.naver?blogId=${blogId}&currentPage=1&countPerPage=3`;
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': `https://blog.naver.com/${blogId}`
      }
    });

    if (!res.ok) return null;
    const text = await res.text();

    const postListMatch = text.match(/"postList":\s*(\[[^\]]*\])/);
    if (!postListMatch) return null;

    const posts = JSON.parse(postListMatch[1]);
    if (!Array.isArray(posts) || posts.length === 0) return null;

    const latest = posts[0];
    const rawTitle = latest.title || '';
    const decodedTitle = decodeURIComponent(rawTitle.replace(/\+/g, ' '));
    const logNo = latest.logNo || '';
    const addDate = latest.addDate || '최근 등록';
    const postUrl = logNo ? `https://blog.naver.com/${blogId}/${logNo}` : channelUrl;

    return {
      title: decodedTitle || `[공식] ${brandName} 네이버 블로그 최신 소식`,
      description: `${brandName} 공식 네이버 블로그의 최신 포스트입니다. 상세 소식과 공지사항을 확인하세요.`,
      uploadDate: addDate,
      mediaType: 'Blog',
      postUrl,
      views: '-',
      likes: '-',
      comments: latest.commentCount ? `${latest.commentCount}개` : '-',
      hashtags: [`#${brandName}`, '#공식블로그', '#네이버블로그'],
      isRealtime: true
    };
  } catch (err) {
    return null;
  }
}

/**
 * 유튜브 채널 또는 개별 영상 실시간 스크래핑 (oEmbed 공식 연동)
 */
async function fetchYouTubeVideo(channelOrVideoUrl: string, brandName: string): Promise<FetchedSnsFeed | null> {
  try {
    let postUrl = channelOrVideoUrl;

    // 1. 개별 비디오 URL인 경우 (watch?v=, youtu.be/, /shorts/)
    const videoIdMatch = channelOrVideoUrl.match(/(?:watch\?v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      postUrl = `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
    } else {
      // 2. 채널 메인인 경우 최신 비디오 ID 스크래핑
      const res = await fetch(channelOrVideoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'ko-KR,ko;q=0.9'
        }
      });
      if (!res.ok) return null;
      const html = await res.text();

      const channelVideoMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (!channelVideoMatch || !channelVideoMatch[1]) return null;
      postUrl = `https://www.youtube.com/watch?v=${channelVideoMatch[1]}`;
    }

    // oEmbed로 실제 제목 및 썸네일 수집
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(postUrl)}&format=json`;
    const oembedRes = await fetch(oembedUrl);
    if (!oembedRes.ok) return null;
    const oembed = (await oembedRes.json()) as { title?: string; author_name?: string; thumbnail_url?: string };

    return {
      title: oembed.title || `[공식] ${brandName} 유튜브 최신 영상`,
      description: `${oembed.author_name || brandName} 공식 유튜브 채널의 최신 업로드 영상입니다.`,
      uploadDate: '최근 업로드',
      mediaType: 'Video',
      postUrl,
      views: '-',
      likes: '-',
      comments: '-',
      hashtags: [`#${brandName}`, '#유튜브', '#공식영상'],
      thumbnailUrl: oembed.thumbnail_url,
      isRealtime: true
    };
  } catch (err) {
    return null;
  }
}

/**
 * 일반 SNS 웹페이지 OpenGraph 태그 실시간 스크래핑
 */
async function fetchGenericOpenGraph(channelUrl: string, brandName: string): Promise<FetchedSnsFeed | null> {
  try {
    const res = await fetch(channelUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<title>([^<]+)<\/title>/i);
    const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);

    let cleanTitle = ogTitle ? ogTitle[1].trim() : '';
    let cleanDesc = ogDesc ? ogDesc[1].trim() : '';

    // 플랫폼 고유명사나 로그인 차단 타이틀 필터링
    const isInvalidTitle = isInvalidPlatformTitle(cleanTitle);

    let mediaType = 'Feed';
    if (channelUrl.includes('instagram.com')) mediaType = 'Reels';
    else if (channelUrl.includes('tiktok.com')) mediaType = 'Shorts';
    else if (channelUrl.includes('twitter.com') || channelUrl.includes('x.com')) mediaType = 'Post';
    else if (channelUrl.includes('facebook.com')) mediaType = 'Post';

    // 인스타그램 프로필에서 핸들 추출 (@handle)
    const instaMatch = channelUrl.match(/instagram\.com\/([^/?#]+)/i);
    const handle = (instaMatch && instaMatch[1] && instaMatch[1] !== 'p' && instaMatch[1] !== 'reel')
      ? `@${instaMatch[1]}`
      : `@${brandName}`;

    if (isInvalidTitle) {
      cleanTitle = channelUrl.includes('instagram') 
        ? `[공식 채널] ${handle} 인스타그램 최신 피드`
        : `[공식] ${brandName} SNS 공식 채널`;
      cleanDesc = `${handle} 공식 계정에서 발행된 최신 피드와 릴스 소식을 실시간으로 확인하실 수 있습니다.`;
    }

    return {
      title: cleanTitle,
      description: cleanDesc,
      uploadDate: '최근 게시',
      mediaType,
      postUrl: channelUrl,
      views: '-',
      likes: '-',
      comments: '-',
      hashtags: [`#${brandName}`],
      thumbnailUrl: ogImage ? ogImage[1] : undefined,
      // 플랫폼명이 걸러졌다면 개별 글이 아닌 채널 수준이므로 isRealtime을 false로 정직하게 설정
      isRealtime: !isInvalidTitle
    };
  } catch (err) {
    return null;
  }
}

/**
 * Vite 서버 플러그인: SNS 최신글 실시간 수집 및 반환
 */
export function snsFeedServerPlugin(): Plugin {
  return {
    name: 'sns-feed-server-plugin',
    configureServer(server) {
      server.middlewares.use('/api/fetch-sns-feed', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost:5173'}`);
          const channelUrl = urlObj.searchParams.get('url');
          const brandName = urlObj.searchParams.get('brandName') || '공식 브랜드';

          if (!channelUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: 'URL parameter missing' }));
            return;
          }

          const trimmedUrl = channelUrl.trim();

          // 1. 사전 검증된 피드 캐시 확인 (Rule 13, Rule 14 준수)
          const verified = findKnownVerifiedSnsPost(trimmedUrl);
          if (verified) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: true, data: verified }));
            return;
          }

          // 2. 인스타그램 개별 릴스 또는 게시물 URL인 경우 (/reel/ 또는 /p/)
          if (trimmedUrl.includes('instagram.com/reel/') || trimmedUrl.includes('instagram.com/p/')) {
            const instaPost = await fetchInstagramPostOrReel(trimmedUrl, brandName);
            if (instaPost) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ success: true, data: instaPost }));
              return;
            }
          }

          // 3. 네이버 블로그 실시간 최신글 수집
          if (trimmedUrl.includes('blog.naver.com')) {
            const blogFeed = await fetchNaverBlogPost(trimmedUrl, brandName);
            if (blogFeed) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ success: true, data: blogFeed }));
              return;
            }
          }

          // 4. 유튜브 채널 또는 영상 실시간 최신 동영상 수집
          if (trimmedUrl.includes('youtube.com') || trimmedUrl.includes('youtu.be')) {
            const ytFeed = await fetchYouTubeVideo(trimmedUrl, brandName);
            if (ytFeed) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ success: true, data: ytFeed }));
              return;
            }
          }

          // 5. 일반 웹/SNS OpenGraph 메타데이터 수집
          const ogFeed = await fetchGenericOpenGraph(trimmedUrl, brandName);
          if (ogFeed) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: true, data: ogFeed }));
            return;
          }

          // 6. 폴백: 기본 채널 안내 객체 반환
          const fallbackFeed: FetchedSnsFeed = {
            title: `[공식 채널] ${brandName} 소셜 미디어`,
            description: `${brandName} 공식 채널에서 발행된 최신 공지사항과 활동 소식을 확인하실 수 있습니다.`,
            uploadDate: '공식 채널',
            mediaType: trimmedUrl.includes('youtube') ? 'Video' : trimmedUrl.includes('blog') ? 'Blog' : 'Feed',
            postUrl: trimmedUrl,
            views: '-',
            likes: '-',
            comments: '-',
            hashtags: [`#${brandName}`],
            isRealtime: false
          };

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ success: true, data: fallbackFeed, fallback: true }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ success: false, error: err?.message || 'Internal server error' }));
        }
      });
    }
  };
}
