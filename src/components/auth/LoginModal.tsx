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
import { validateCompanyEmail } from '../../utils/emailValidation';
import { saveUserSession } from '../../utils/authStorage';
import type { UserProfile } from '../../types/auth';
import { supabase } from '../../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  onOpenSignup: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenSignup,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 일치하지 않습니다.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('이메일 인증이 완료되지 않았습니다. 메일함의 인증 링크 또는 코드를 확인해 주세요.');
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
          email: u.email || email.trim().toLowerCase(),
          companyName: (u.user_metadata?.company_name as string) || email.split('@')[1].split('.')[0].toUpperCase(),
          role: (u.user_metadata?.role as string) || '사업전략 / 기획',
          interest: (u.user_metadata?.interest as string) || '경쟁사 지표 벤치마킹',
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

  const handleForgotPassword = async () => {
    setError(null);
    setInfoMessage(null);
    if (!email.trim()) {
      setError('비밀번호를 재설정할 회사 이메일을 먼저 입력해 주세요.');
      return;
    }
    const validation = validateCompanyEmail(email);
    if (!validation.isValid) {
      setError(validation.errorMessage || '올바른 회사 이메일을 입력해 주세요.');
      return;
    }

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      });
      if (resetErr) {
        setError(`재설정 메일 발송 실패: ${resetErr.message}`);
      } else {
        setInfoMessage('비밀번호 재설정 메일이 전송되었습니다. 메일함을 확인해 주세요.');
      }
    } catch {
      setError('비밀번호 재설정 요청 중 오류가 발생했습니다.');
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
        className="relative w-full max-w-md bg-dark-900 border border-dark-750 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden flex flex-col"
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
                onClick={handleForgotPassword}
                className="text-[11px] text-purple-400 hover:underline cursor-pointer"
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
            <p className="text-[11px] text-purple-300 flex items-center gap-1 font-medium pt-0.5">
              <CircleAlertIcon size={14} className="shrink-0" />
              <span>{error}</span>
            </p>
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

        <div className="pt-4 mt-4 border-t border-dark-800 text-center text-xs text-slate-400">
          <span>아직 계정이 없으신가요? </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSignup();
            }}
            className="text-purple-400 hover:text-purple-300 font-bold underline underline-offset-2 ml-1 cursor-pointer"
          >
            회원가입하기
          </button>
        </div>
      </div>
    </div>
  );
};
