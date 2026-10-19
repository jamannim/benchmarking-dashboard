import React, { useState } from 'react';
import { 
  XIcon, 
  MailIcon, 
  KeyIcon, 
  CopyIcon, 
  CheckIcon, 
  LogOutIcon, 
  Building2Icon, 
  BriefcaseIcon, 
  ShieldCheckIcon, 
  CircleAlertIcon 
} from '@animateicons/react/lucide';
import type { UserProfile } from '../../types/auth';
import { resetPassword } from '../../utils/authStorage';
import { supabase } from '../../lib/supabase';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
}) => {
  const [copied, setCopied] = useState(false);

  // 비밀번호 재설정 폼 상태
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !user) return null;

  // UID 복사 핸들러
  const handleCopyUid = () => {
    if (user.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 비밀번호 재설정 핸들러
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (!newPw || newPw.length < 6) {
      setPwError('새 비밀번호를 6자리 이상 입력해 주세요.');
      return;
    }

    if (newPw !== confirmPw) {
      setPwError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPw,
      });

      if (error) {
        setPwError(`비밀번호 변경 실패: ${error.message}`);
      } else {
        resetPassword(newPw);
        setPwSuccess('비밀번호가 성공적으로 재설정되었습니다.');
        setNewPw('');
        setConfirmPw('');
      }
    } catch {
      setPwError('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-dark-900 border border-dark-750 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 닫기 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
        >
          <XIcon size={20} />
        </button>

        {/* 헤더 */}
        <div className="flex items-center gap-3 pb-4 border-b border-dark-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md font-black text-lg">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 id="user-profile-title" className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>내 계정 정보</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                인증회원
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              비즈렌즈 (BIZLENS) 기업 전용 회원
            </p>
          </div>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="py-4 overflow-y-auto space-y-4 pr-1">
          {/* 1. 기본 정보 카드 (UID, 이메일, 회사) */}
          <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 space-y-2.5">
            {/* UID 번호 (복사 지원) */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">고유 UID 번호</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                  {user.uid}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUid}
                  className="px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors border border-dark-700"
                  title="UID 복사"
                >
                  {copied ? (
                    <>
                      <CheckIcon size={12} className="text-brand-cyan" />
                      <span className="text-brand-cyan">복사됨</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon size={12} />
                      <span>복사</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 회사 이메일 */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-dark-850">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MailIcon size={14} className="text-slate-500" />
                <span>회사 이메일</span>
              </span>
              <span className="text-white font-medium">{user.email}</span>
            </div>

            {/* 회사명 */}
            {user.companyName && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Building2Icon size={14} className="text-slate-500" />
                  <span>회사명</span>
                </span>
                <span className="text-slate-200">{user.companyName}</span>
              </div>
            )}

            {/* 직무 */}
            {user.role && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <BriefcaseIcon size={14} className="text-slate-500" />
                  <span>담당 직무</span>
                </span>
                <span className="text-slate-300">{user.role}</span>
              </div>
            )}
          </div>

          {/* 2. 비밀번호 재설정 섹션 */}
          <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 space-y-3">
            <div className="flex items-center gap-2">
              <KeyIcon size={16} className="text-purple-400" />
              <h3 className="text-xs font-bold text-white">비밀번호 재설정</h3>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-2.5">
              <div className="space-y-1">
                <label htmlFor="user-new-pw" className="block text-[11px] text-slate-300 font-bold">
                  새 비밀번호 <span className="text-purple-400 font-bold">*</span>
                </label>
                <input
                  id="user-new-pw"
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="새 비밀번호 입력 (6자리 이상)"
                  aria-label="새 비밀번호 입력"
                  className="w-full px-3 py-1.5 bg-dark-900 border border-dark-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="user-confirm-pw" className="block text-[11px] text-slate-300 font-bold">
                  새 비밀번호 확인 <span className="text-purple-400 font-bold">*</span>
                </label>
                <input
                  id="user-confirm-pw"
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                  aria-label="새 비밀번호 확인 입력"
                  className="w-full px-3 py-1.5 bg-dark-900 border border-dark-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              {pwError && (
                <p className="text-[11px] text-purple-300 flex items-center gap-1">
                  <CircleAlertIcon size={12} />
                  <span>{pwError}</span>
                </p>
              )}

              {pwSuccess && (
                <p className="text-[11px] text-brand-cyan flex items-center gap-1">
                  <CheckIcon size={12} />
                  <span>{pwSuccess}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2 rounded-lg bg-dark-800 hover:bg-purple-600/30 text-purple-200 text-xs font-bold transition-colors border border-purple-500/30 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? '비밀번호 변경 중...' : '비밀번호 변경하기'}
              </button>
            </form>
          </div>
        </div>

        {/* 하단 로그아웃 버튼 */}
        <div className="pt-3 border-t border-dark-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheckIcon size={14} className="text-slate-400" />
            <span>기업 데이터 세션 암호화 보관</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 text-xs font-bold border border-purple-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOutIcon size={14} />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
};
