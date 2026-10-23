import React, { useState } from 'react';
import {
  XIcon,
  MailIcon,
  CircleAlertIcon,
  ArrowRightIcon,
  SparklesIcon,
  EyeIcon,
  EyeOffIcon
} from '@animateicons/react/lucide';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { validateCompanyEmail } from '../../utils/emailValidation';
import { saveUserSession, resetPassword } from '../../utils/authStorage';
import type { UserProfile } from '../../types/auth';
import { supabase } from '../../lib/supabase';
import { sendVerificationEmail, verifyAuthCode } from '../../services/emailAuthService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  onOpenSignup: () => void;
}

type ModalMode = 'login' | 'forgot_password';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenSignup,
}) => {
  const [mode, setMode] = useState<ModalMode>('login');
  
  // 로그인 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 재설정(찾기) 상태
  const [resetEmail, setResetEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  if (!isOpen) return null;

  // 1. 일반 로그인 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    // 이메일 유효성 검사
    const validation = validateCompanyEmail(email);
    if (!validation.isValid) {
      setError(validation.errorMessage || '올바른 회사 이메일을 입력해 주세요.');
      return;
    }

    if (!password || password.length < 6) {
      setError('비밀번호를 6자리 이상 입력해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 일치하지 않습니다. 비밀번호를 모르실 경우 [비밀번호 찾기]를 이용해 주세요.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('이메일 인증이 완료되지 않았습니다.');
        } else {
          setError(signInError.message);
        }
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        const u = data.user;
        const userProfile: UserProfile = {
          uid: `UID-${u.id.slice(0, 8).toUpperCase()}`,
          id: u.id,
          email: u.email || normalizedEmail,
          companyName: (u.user_metadata?.company_name as string) || normalizedEmail.split('@')[1].split('.')[0].toUpperCase(),
          role: (u.user_metadata?.role as string) || '사업전략 / 기획',
          interest: (u.user_metadata?.interest as string) || '경쟁사 지표 벤치마킹',
          phoneNumber: (u.user_metadata?.phone_number as string) || (u.phone as string) || undefined,
          createdAt: u.created_at || new Date().toISOString(),
        };

        saveUserSession(userProfile);
        onSuccess(userProfile);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 비밀번호 찾기 모드 전환
  const handleOpenForgotPassword = () => {
    setError(null);
    setResetError(null);
    setResetSuccess(null);
    setResetEmail(email.trim() || '');
    setAuthCode('');
    setIsCodeSent(false);
    setIsCodeVerified(false);
    setMode('forgot_password');
  };

  // 3. 비밀번호 재설정 - 6자리 인증번호 전송
  const handleSendResetCode = async () => {
    setResetError(null);
    setResetSuccess(null);

    const validation = validateCompanyEmail(resetEmail);
    if (!validation.isValid) {
      setResetError(validation.errorMessage || '올바른 회사 이메일을 입력해 주세요.');
      return;
    }

    setIsSendingCode(true);
    try {
      const res = await sendVerificationEmail(resetEmail.trim().toLowerCase());
      setIsSendingCode(false);

      if (res.success) {
        setIsCodeSent(true);
        setResetSuccess('6자리 인증번호가 발송되었습니다. 아래 입력창에 입력해 주세요.');
      } else {
        setResetError(res.message || '인증번호 발송에 실패했습니다.');
      }
    } catch (err: unknown) {
      setIsSendingCode(false);
      const msg = err instanceof Error ? err.message : '인증번호 발송 중 오류가 발생했습니다.';
      setResetError(msg);
    }
  };

  // 4. 비밀번호 재설정 - 인증번호 확인
  const handleVerifyResetCode = async () => {
    setResetError(null);
    const clean = authCode.replace(/[^0-9]/g, '');
    if (clean.length !== 6) {
      setResetError('6자리 인증번호를 정확히 입력해 주세요.');
      return;
    }

    setIsVerifyingCode(true);
    try {
      const res = await verifyAuthCode(resetEmail.trim().toLowerCase(), clean);
      setIsVerifyingCode(false);

      if (res.success) {
        setIsCodeVerified(true);
        setResetSuccess('이메일 인증이 완료되었습니다! 새 비밀번호를 설정해 주세요.');
      } else {
        setResetError(res.message || '인증번호가 일치하지 않습니다.');
      }
    } catch (err: unknown) {
      setIsVerifyingCode(false);
      const msg = err instanceof Error ? err.message : '인증번호 확인 중 오류가 발생했습니다.';
      setResetError(msg);
    }
  };

  // 5. 비밀번호 재설정 완료 및 즉시 로그인
  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!isCodeVerified) {
      setResetError('먼저 이메일 6자리 인증을 완료해 주세요.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setResetError('새 비밀번호를 6자리 이상 입력해 주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('새 비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    setIsSubmittingReset(true);
    const normalizedEmail = resetEmail.trim().toLowerCase();

    try {
      // 1) Supabase 비밀번호 업데이트 시도 (또는 가입 복구)
      try {
        await supabase.auth.updateUser({ password: newPassword });
      } catch {
        // ignore if session not active
      }

      // 2) 로컬 비밀번호 저장
      resetPassword(newPassword);

      // 3) 사용자 프로필 생성 및 즉시 자동 로그인
      const domainName = normalizedEmail.split('@')[1] ? normalizedEmail.split('@')[1].split('.')[0].toUpperCase() : 'BIZLENS';
      const userProfile: UserProfile = {
        uid: `UID-${Math.floor(10000 + Math.random() * 90000)}`,
        email: normalizedEmail,
        companyName: domainName,
        role: '사업전략 / 기획',
        interest: '경쟁사 지표 벤치마킹',
        createdAt: new Date().toISOString(),
      };

      saveUserSession(userProfile);
      onSuccess(userProfile);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '비밀번호 재설정 중 오류가 발생했습니다.';
      setResetError(msg);
    } finally {
      setIsSubmittingReset(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-dark-900 border border-dark-750 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 닫기 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors cursor-pointer"
        >
          <XIcon size={20} />
        </button>

        {/* ======================= 모드 1: 일반 로그인 ======================= */}
        {mode === 'login' ? (
          <>
            <div className="space-y-1 mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
                <SparklesIcon size={12} className="text-purple-400" />
                <span>기업 회원 로그인</span>
              </div>
              <h2 id="login-modal-title" className="text-xl font-black text-white">
                비즈렌즈 (BIZLENS) 로그인
              </h2>
              <p className="text-xs text-slate-400">
                등록된 업무용 이메일 계정으로 로그인하세요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* 이메일 */}
              <div className="space-y-1">
                <label htmlFor="login-email" className="block text-xs font-bold text-slate-200">
                  회사 이메일 <span className="text-purple-400 font-bold">*</span>
                </label>
                <div className="relative">
                  <MailIcon size={16} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                      if (infoMessage) setInfoMessage(null);
                    }}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-xs font-bold text-slate-200">
                    비밀번호 <span className="text-purple-400 font-bold ml-0.5">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleOpenForgotPassword}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer"
                  >
                    비밀번호 찾기
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                      if (infoMessage) setInfoMessage(null);
                    }}
                    placeholder="비밀번호 6자리 이상 입력"
                    className="w-full pl-3.5 pr-10 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPassword ? (
                      <EyeIcon size={16} className="text-purple-400" />
                    ) : (
                      <EyeOffIcon size={16} className="text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/40 text-[11px] text-purple-200 flex items-start gap-1.5">
                  <CircleAlertIcon size={14} className="shrink-0 mt-0.5 text-purple-400" />
                  <span>{error}</span>
                </div>
              )}

              {infoMessage && (
                <p className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium pt-0.5">
                  <span>{infoMessage}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 mt-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <span>로그인 중...</span> : (
                  <>
                    <span>로그인하기</span>
                    <ArrowRightIcon size={16} />
                  </>
                )}
              </button>
            </form>

            {/* 하단 회원가입 전환 링크 */}
            <div className="mt-5 pt-4 border-t border-dark-800 text-center text-xs text-slate-400">
              아직 계정이 없으신가요?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSignup();
                }}
                className="text-purple-400 hover:text-purple-300 font-bold hover:underline ml-1 cursor-pointer"
              >
                회원가입하기
              </button>
            </div>
          </>
        ) : (
          /* ======================= 모드 2: 비밀번호 재설정 ======================= */
          <>
            <div className="space-y-1 mb-4">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white font-semibold mb-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>로그인으로 돌아가기</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">비밀번호 재설정</h2>
                  <p className="text-[11px] text-slate-400">
                    이메일 인증을 통해 새 비밀번호를 즉시 설정합니다.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCompleteReset} className="space-y-3">
              {/* 1. 이메일 입력 및 인증번호 발송 */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">
                  회사 이메일 <span className="text-purple-400 font-bold">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    disabled={isCodeVerified}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="가입했던 회사 이메일 입력"
                    className="flex-1 px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={handleSendResetCode}
                    disabled={isSendingCode || isCodeVerified || !resetEmail}
                    className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-purple-300 border border-purple-500/40 text-xs font-bold whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {isSendingCode ? '발송 중...' : (isCodeSent ? '재발송' : '인증번호 발송')}
                  </button>
                </div>
              </div>

              {/* 2. 6자리 인증번호 입력창 (발송 후 노출) */}
              {isCodeSent && (
                <div className="p-3 rounded-xl bg-dark-950 border border-dark-750 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">
                      6자리 인증번호 입력 <span className="text-purple-400">*</span>
                    </span>
                    {isCodeVerified && (
                      <span className="text-[11px] text-brand-cyan font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        인증 완료
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={authCode}
                      disabled={isCodeVerified}
                      onChange={(e) => setAuthCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="메일로 수신된 6자리 번호 (예: 220378)"
                      className="flex-1 px-3 py-2 bg-dark-900 border border-dark-700 rounded-xl text-xs text-white font-mono tracking-widest placeholder-slate-600 focus:outline-none focus:border-purple-500 disabled:opacity-60"
                    />
                    {!isCodeVerified && (
                      <button
                        type="button"
                        onClick={handleVerifyResetCode}
                        disabled={isVerifyingCode || authCode.length !== 6}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        {isVerifyingCode ? '확인 중...' : '인증 확인'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 3. 새 비밀번호 설정 (인증 완료 시 활성화) */}
              {isCodeVerified && (
                <div className="space-y-2.5 pt-1 animate-fade-in">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-200">
                      새 비밀번호 <span className="text-purple-400 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새 비밀번호 6자리 이상 입력"
                        className="w-full pl-3.5 pr-10 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeIcon size={16} className="text-purple-400" /> : <EyeOffIcon size={16} className="text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-200">
                      새 비밀번호 확인 <span className="text-purple-400 font-bold">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="새 비밀번호 다시 입력"
                      className="w-full px-3.5 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* 상태 피드백 */}
              {resetError && (
                <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/40 text-[11px] text-purple-200 flex items-start gap-1.5">
                  <CircleAlertIcon size={14} className="shrink-0 mt-0.5 text-purple-400" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[11px] text-emerald-200 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              {/* 제출 버튼 */}
              {isCodeVerified ? (
                <button
                  type="submit"
                  disabled={isSubmittingReset || !newPassword || !confirmPassword}
                  className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReset ? '비밀번호 재설정 중...' : '새 비밀번호로 재설정하고 로그인하기'}
                </button>
              ) : (
                <p className="text-[11px] text-slate-500 text-center pt-1">
                  이메일 인증을 완료하시면 새 비밀번호 설정창이 열립니다.
                </p>
              )}
            </form>
          </>
        )}

      </div>
    </div>
  );
};
