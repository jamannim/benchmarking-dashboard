import type { SnsChannelCardData, SnsPostItem } from '../types/intelligence';

export interface SnsFeedResponse {
  success: boolean;
  data?: {
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
    isRealtime?: boolean;
  };
  fallback?: boolean;
}

/**
 * 단일 공식 SNS 채널 URL에 대한 최신글 실시간 조회 API 호출
 */
export async function fetchSnsChannelFeed(
  channelUrl: string, 
  brandName: string
): Promise<SnsPostItem | null> {
  if (!channelUrl || channelUrl === '' || channelUrl === '-') return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const endpoint = `/api/fetch-sns-feed?url=${encodeURIComponent(channelUrl)}&brandName=${encodeURIComponent(brandName)}`;
    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const json: SnsFeedResponse = await res.json();

    if (json.success && json.data) {
      const d = json.data;
      return {
        title: d.title,
        description: d.description,
        uploadDate: d.uploadDate,
        mediaType: d.mediaType,
        postUrl: d.postUrl || channelUrl,
        views: d.views || '-',
        likes: d.likes || '-',
        comments: d.comments || '-',
        hashtags: d.hashtags || [`#${brandName}`],
        isRealtime: d.isRealtime ?? true
      };
    }
  } catch (err) {
    console.warn(`[snsFeedService] Failed to fetch feed for ${channelUrl}:`, err);
  }

  return null;
}

/**
 * 복수 공식 SNS 채널들에 대해 최신글 정보를 실시간 동기화
 */
export async function enrichSnsChannelsWithLatestPosts(
  channels: SnsChannelCardData[],
  brandName: string
): Promise<SnsChannelCardData[]> {
  if (!channels || channels.length === 0) return [];

  const promises = channels.map(async (ch) => {
    // 이미 유효한 실측 포스트 데이터가 완전히 채워져 있고 URL이 구체적인 경우(예: 특정 릴스/영상 URL) 유지
    const hasSpecificPostUrl = ch.latestPost?.postUrl && 
      ch.latestPost.postUrl !== ch.channelUrl && 
      !ch.latestPost.postUrl.endsWith('/');

    if (hasSpecificPostUrl && ch.latestPost.isRealtime) {
      return ch;
    }

    const fetchedPost = await fetchSnsChannelFeed(ch.channelUrl, brandName);
    if (fetchedPost) {
      const views = (fetchedPost.views && fetchedPost.views !== '-' && !fetchedPost.views.includes('실측'))
        ? fetchedPost.views
        : ch.latestPost.views;
      const likes = (fetchedPost.likes && fetchedPost.likes !== '-' && !fetchedPost.likes.includes('실측'))
        ? fetchedPost.likes
        : ch.latestPost.likes;
      const comments = (fetchedPost.comments && fetchedPost.comments !== '-' && !fetchedPost.comments.includes('실측'))
        ? fetchedPost.comments
        : ch.latestPost.comments;

      return {
        ...ch,
        latestPost: {
          ...ch.latestPost,
          ...fetchedPost,
          views,
          likes,
          comments
        }
      };
    }

    return ch;
  });

  return Promise.all(promises);
}
