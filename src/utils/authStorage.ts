import type { UserProfile } from '../types/auth';

const STORAGE_KEY = 'biz_strategy_user_session';
const PASSWORD_KEY = 'biz_strategy_user_pw';

/**
 * 고유 UID 번호 생성 (예: UID-2026-78421)
 */
export function generateUid(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `UID-2026-${randomNum}`;
}

/**
 * 현재 로그인된 사용자 정보 조회
 */
export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

/**
 * 사용자 세션 저장 (가입 또는 로그인 완료 시)
 */
export function saveUserSession(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

/**
 * 사용자 로그아웃 (세션 삭제)
 */
export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * 비밀번호 재설정 시뮬레이션
 */
export function resetPassword(newPassword: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(PASSWORD_KEY, newPassword);
    return true;
  } catch {
    return false;
  }
}
