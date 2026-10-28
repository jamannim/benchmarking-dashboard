import { useEffect, useRef } from 'react';

export interface VersionMeta {
  version: string;
  buildTime: number;
  builtAt: string;
}

/**
 * useAutoUpdateChecker
 * 백그라운드에서 주기적(90초) 및 탭 포커스 시점에 서버의 최신 빌드 버전을 모니터링하여,
 * 새 배포가 확인되면 오래된 브라우저 캐시를 일괄 소거하고 최신 페이지로 즉시 튕겨서 리셋(Auto-Reload)합니다.
 */
export function useAutoUpdateChecker(enabled: boolean = true) {
  const isCheckingRef = useRef(false);

  useEffect(() => {
    // 개발 모드이거나 비활성화된 경우 모니터링 건너뜀
    if (!enabled || import.meta.env.DEV) {
      return;
    }

    const currentBuildTime = typeof __APP_BUILD_TIME__ !== 'undefined' ? parseInt(String(__APP_BUILD_TIME__), 10) : 0;
    if (!currentBuildTime) {
      return;
    }

    const checkLatestVersion = async () => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      try {
        const response = await fetch(`/version.json?_t=${Date.now()}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        if (!response.ok) {
          isCheckingRef.current = false;
          return;
        }

        const data: VersionMeta = await response.json();
        const serverBuildTime = data?.buildTime;

        // 서버의 빌드 타임이 클라이언트의 현재 실행 빌드 타임보다 새로운 경우 리셋 트리거
        if (serverBuildTime && serverBuildTime > currentBuildTime) {
          const lockKey = 'bizlens_last_version_reset';
          const lastReset = sessionStorage.getItem(lockKey);
          const now = Date.now();

          // 15초 이내 중복 리로드 방지 (무한 루프 방어)
          if (lastReset && now - parseInt(lastReset, 10) < 15000) {
            isCheckingRef.current = false;
            return;
          }
          sessionStorage.setItem(lockKey, now.toString());

          console.info(`[AutoUpdate] 새 배포 버전 감지 (서버: ${serverBuildTime} > 현재: ${currentBuildTime}) -> 캐시 소거 및 최신 페이지 리셋`);

          // 오래된 대시보드 로컬 캐시 제거
          try {
            localStorage.removeItem('benchmark_cache');
          } catch {
            // ignore
          }

          // 최신 URL 파라미터로 브라우저 캐시 바이패스 후 즉시 리셋
          const nextUrl = new URL(window.location.href);
          nextUrl.searchParams.set('v', String(serverBuildTime));
          window.location.replace(nextUrl.toString());
          return;
        }
      } catch (err) {
        // 네트워크 단절이나 일시적 오류 시 무시
        console.debug('[AutoUpdate] 버전 체크 오류 (재시도 예정):', err);
      } finally {
        isCheckingRef.current = false;
      }
    };

    // 1. 초기 로드 3초 후 1차 체크 (화면 렌더링 방해 방지)
    const initialTimer = setTimeout(() => {
      checkLatestVersion();
    }, 3000);

    // 2. 90초마다 주기적 백그라운드 체크
    const intervalTimer = setInterval(() => {
      checkLatestVersion();
    }, 90000);

    // 3. 브라우저 탭으로 복귀(Focus)하거나 가시성이 활성화될 때 즉시 체크
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkLatestVersion();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkLatestVersion);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkLatestVersion);
    };
  }, [enabled]);
}
