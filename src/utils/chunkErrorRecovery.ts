/**
 * chunkErrorRecovery.ts
 * 배포 후 구버전 번들 로드 실패(ChunkLoadError / Failed to fetch dynamically imported module) 감지 시
 * 브라우저 캐시를 즉시 파기하고 최신 페이지로 자동 새로고침(리셋)하는 인터셉터
 */

export function initChunkErrorRecovery(): void {
  if (typeof window === 'undefined') return;

  const isChunkError = (message: string): boolean => {
    if (!message) return false;
    const msg = message.toLowerCase();
    return (
      msg.includes('failed to fetch dynamically imported module') ||
      msg.includes('loading chunk') ||
      msg.includes('importing a module script failed') ||
      msg.includes('error loading dynamically imported module') ||
      msg.includes('unable to preload css')
    );
  };

  const triggerSafeRecovery = (reason: string) => {
    try {
      const lockKey = 'bizlens_chunk_recovery_time';
      const lastAttempt = sessionStorage.getItem(lockKey);
      const now = Date.now();

      // 10초 이내 반복 리로드 방지 (무한 루프 방어)
      if (lastAttempt && now - parseInt(lastAttempt, 10) < 10000) {
        console.warn('[ChunkRecovery] 짧은 시간 내 재시도가 감지되어 자동 갱신을 멈춥니다.');
        return;
      }
      sessionStorage.setItem(lockKey, now.toString());

      console.warn(`[ChunkRecovery] 구버전 자산 로드 실패 감지 (${reason}) -> 캐시 소거 및 최신 버전 즉시 리셋`);

      // 오래된 브라우저 로컬 데이터 캐시 소거
      localStorage.removeItem('benchmark_cache');

      // 캐시 무효화 쿼리를 붙여 최신 번들로 즉시 이동
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('v_recovery', now.toString());
      window.location.replace(currentUrl.toString());
    } catch (err) {
      console.error('[ChunkRecovery] 복구 리셋 실패:', err);
    }
  };

  // 일반 스크립트 실행 오류 리스너
  window.addEventListener('error', (event: ErrorEvent) => {
    const errorMsg = event.message || event.error?.message || '';
    if (isChunkError(errorMsg)) {
      triggerSafeRecovery(errorMsg);
    }
  });

  // 동적 import() 프로미스 거부 리스너
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const errorMsg = event.reason?.message || String(event.reason || '');
    if (isChunkError(errorMsg)) {
      triggerSafeRecovery(errorMsg);
    }
  });
}
