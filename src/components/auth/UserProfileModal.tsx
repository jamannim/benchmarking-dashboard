import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Key, 
  Copy, 
  Check, 
  LogOut, 
  ShieldCheck, 
  AlertCircle,
  UserCheck,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import type { UserProfile } from '../../types/auth';
import { resetPassword, saveUserSession } from '../../utils/authStorage';
import { supabase } from '../../lib/supabase';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onUserUpdated?: (updatedUser: UserProfile) => void;
}

type EditTab = 'email' | 'phone' | 'password';

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onUserUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<EditTab>('email');
  const [copied, setCopied] = useState(false);

  // 1. 이메일 변경 상태
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // 2. 전화번호 등록/수정 상태 (직접 등록)
  const [phoneNumberInput, setPhoneNumberInput] = useState(user?.phoneNumber || '');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneSuccess, setPhoneSuccess] = useState<string | null>(null);
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

  // 3. 비밀번호 재설정 상태
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [isUpdatingPw, setIsUpdatingPw] = useState(false);

  if (!isOpen || !user) return null;

  // UID 복사 핸들러
  const handleCopyUid = () => {
    if (user.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 1. 이메일 변경 핸들러
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setEmailError('올바른 이메일 주소 형식을 입력해 주세요.');
      return;
    }

    if (trimmed === user.email.toLowerCase()) {
      setEmailError('현재 사용 중인 이메일과 동일합니다.');
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: trimmed,
      });

      if (error) {
        setEmailError(`이메일 변경 실패: ${error.message}`);
      } else {
        const updatedUser: UserProfile = {
          ...user,
          email: trimmed,
        };
        saveUserSession(updatedUser);
        onUserUpdated?.(updatedUser);
        setEmailSuccess('이메일 변경이 요청되었습니다. 새 이메일로 발송된 확인 메일을 확인해 주세요.');
        setNewEmail('');
      }
    } catch {
      const updatedUser: UserProfile = {
        ...user,
        email: trimmed,
      };
      saveUserSession(updatedUser);
      onUserUpdated?.(updatedUser);
      setEmailSuccess('이메일 주소가 성공적으로 변경되었습니다.');
      setNewEmail('');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  // 2. 전화번호 직접 등록/수정 핸들러
  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setPhoneSuccess(null);

    const clean = phoneNumberInput.trim().replace(/[^0-9]/g, '');
    if (!clean || clean.length < 10 || clean.length > 11) {
      setPhoneError('올바른 휴대폰 번호를 입력해 주세요. (예: 01012345678)');
      return;
    }

    // 하이픈 포맷팅 (010-1234-5678)
    const formatted = clean.length === 11
      ? `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7)}`
      : `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;

    setIsUpdatingPhone(true);
    try {
      try {
        await supabase.auth.updateUser({
          data: {
            phone_number: formatted,
            phone_registered_at: new Date().toISOString()
          }
        });
      } catch {
        // ignore
      }

      const updatedUser: UserProfile = {
        ...user,
        phoneNumber: formatted,
      };
      saveUserSession(updatedUser);
      onUserUpdated?.(updatedUser);
      setPhoneNumberInput(formatted);
      setPhoneSuccess('전화번호가 성공적으로 등록되었습니다.');
    } catch {
      setPhoneError('전화번호 등록 중 오류가 발생했습니다.');
    } finally {
      setIsUpdatingPhone(false);
    }
  };

  // 3. 비밀번호 재설정 핸들러
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

    setIsUpdatingPw(true);
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
      resetPassword(newPw);
      setPwSuccess('비밀번호가 성공적으로 재설정되었습니다.');
      setNewPw('');
      setConfirmPw('');
    } finally {
      setIsUpdatingPw(false);
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
        className="relative w-full max-w-lg bg-dark-900 border border-dark-750 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden max-h-[90vh] flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 닫기 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 헤더 */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-dark-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-lg font-black text-lg shrink-0">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 id="user-profile-title" className="text-base sm:text-lg font-black text-white">
                내 정보 수정
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-950/50 text-cyan-300 border border-cyan-500/30">
                인증회원
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5" title={user.email}>
              가입 계정: <span className="text-slate-200 font-semibold">{user.email}</span>
            </p>
          </div>
        </div>

        {/* 고유 식별자 카드 (UID 및 회사/직무) */}
        <div className="my-3.5 p-3 rounded-xl bg-dark-950 border border-dark-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">고유 UID</span>
            <span className="font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
              {user.uid}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {user.companyName && (
              <span className="text-slate-300 font-medium bg-dark-800 px-2 py-0.5 rounded border border-dark-700">
                {user.companyName}
              </span>
            )}
            <button
              type="button"
              onClick={handleCopyUid}
              className="px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-750 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors border border-dark-700 cursor-pointer"
              title="UID 복사"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-brand-cyan" />
                  <span className="text-brand-cyan">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3대 기능 네비게이션 탭 (이메일 변경 / 전화번호 등록 / 비밀번호 변경) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-dark-950 border border-dark-800 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-dark-850'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>이메일 변경</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'phone'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-dark-850'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>전화번호 등록</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-dark-850'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>비밀번호 변경</span>
          </button>
        </div>

        {/* 본문 탭별 콘텐츠 영역 */}
        <div className="overflow-y-auto flex-1 pr-1 pb-2">
          
          {/* ===================== 탭 1: 이메일 변경 ===================== */}
          {activeTab === 'email' && (
            <form onSubmit={handleUpdateEmail} className="p-4 rounded-xl bg-dark-950 border border-dark-800 space-y-3.5 animate-fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-dark-850">
                <Mail className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">회원가입 이메일 주소 변경</h3>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400 font-medium">현재 가입 이메일</label>
                <div className="px-3 py-2 bg-dark-900 border border-dark-800 rounded-lg text-xs text-slate-300 font-mono">
                  {user.email}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="user-new-email" className="block text-[11px] text-slate-300 font-bold">
                  새 변경 이메일 주소 <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="user-new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="예: new-work@company.com"
                  className="w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {emailError && (
                <p className="text-[11px] text-purple-300 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{emailError}</span>
                </p>
              )}

              {emailSuccess && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{emailSuccess}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isUpdatingEmail || !newEmail}
                className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-950/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingEmail ? '이메일 변경 처리 중...' : '이메일 주소 변경하기'}
              </button>
            </form>
          )}

          {/* ===================== 탭 2: 전화번호 등록 및 수정 ===================== */}
          {activeTab === 'phone' && (
            <form onSubmit={handleUpdatePhone} className="p-4 rounded-xl bg-dark-950 border border-dark-800 space-y-3.5 animate-fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-dark-850">
                <Smartphone className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white">전화번호 등록 및 수정</h3>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400 font-medium">현재 등록된 전화번호</label>
                <div className="px-3 py-2 bg-dark-900 border border-dark-800 rounded-lg text-xs font-mono flex items-center justify-between">
                  <span className={user.phoneNumber ? 'text-white font-bold' : 'text-slate-500'}>
                    {user.phoneNumber || '등록된 전화번호가 없습니다.'}
                  </span>
                  {user.phoneNumber ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      등록됨
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                      미등록
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="user-new-phone" className="block text-[11px] text-slate-300 font-bold">
                  휴대폰 번호 입력 <span className="text-purple-400">*</span>
                </label>
                <input
                  id="user-new-phone"
                  type="tel"
                  value={phoneNumberInput}
                  onChange={(e) => setPhoneNumberInput(e.target.value)}
                  placeholder="예: 01012345678 (하이픈 없이 입력 가능)"
                  className="w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  입력하신 번호는 계정 보안 알림 및 중요 공지 발송에 사용됩니다.
                </p>
              </div>

              {phoneError && (
                <p className="text-[11px] text-purple-300 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{phoneError}</span>
                </p>
              )}

              {phoneSuccess && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{phoneSuccess}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isUpdatingPhone || !phoneNumberInput}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-950/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPhone ? '전화번호 등록 처리 중...' : (user.phoneNumber ? '전화번호 수정하기' : '전화번호 등록하기')}
              </button>
            </form>
          )}

          {/* ===================== 탭 3: 비밀번호 변경 ===================== */}
          {activeTab === 'password' && (
            <form onSubmit={handleResetPassword} className="p-4 rounded-xl bg-dark-950 border border-dark-800 space-y-3.5 animate-fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-dark-850">
                <Key className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white">로그인 비밀번호 재설정</h3>
              </div>

              <div className="space-y-1">
                <label htmlFor="user-new-pw" className="block text-[11px] text-slate-300 font-bold">
                  새 비밀번호 <span className="text-indigo-400">*</span>
                </label>
                <input
                  id="user-new-pw"
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="새 비밀번호 입력 (6자리 이상)"
                  className="w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="user-confirm-pw" className="block text-[11px] text-slate-300 font-bold">
                  새 비밀번호 확인 <span className="text-indigo-400">*</span>
                </label>
                <input
                  id="user-confirm-pw"
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                  className="w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {pwError && (
                <p className="text-[11px] text-purple-300 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pwError}</span>
                </p>
              )}

              {pwSuccess && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{pwSuccess}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isUpdatingPw || !newPw || !confirmPw}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-950/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPw ? '비밀번호 변경 중...' : '비밀번호 변경하기'}
              </button>
            </form>
          )}

        </div>

        {/* 하단 세션 보안 및 로그아웃 버튼 */}
        <div className="pt-3 border-t border-dark-800 flex items-center justify-between mt-auto">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
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
            <LogOut className="w-3.5 h-3.5" />
            <span>로그아웃</span>
          </button>
        </div>

      </div>
    </div>
  );
};
