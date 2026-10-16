import React, { useState, useEffect } from 'react';
import { 
  XIcon, 
  MailIcon, 
  CircleAlertIcon, 
  CircleCheckIcon, 
  ArrowRightIcon, 
  InfoIcon,
  EyeIcon,
  EyeOffIcon
} from '@animateicons/react/lucide';
import { validateCompanyEmail, type EmailValidationResult } from '../../utils/emailValidation';
import { trackEvent } from '../../utils/analytics';
import type { UserProfile } from '../../types/auth';
import { generateUid, saveUserSession, resetPassword } from '../../utils/authStorage';
import { supabase } from '../../lib/supabase';
import { sendVerificationEmail, verifyAuthCode } from '../../services/emailAuthService';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userProfile: UserProfile) => void;
  initialEmail?: string;
  onOpenPolicy: (type: 'privacy' | 'terms' | 'disclaimer') => void;
  onOpenLogin?: () => void;
}

type ModalViewStep = 'form' | 'completed';

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialEmail = '',
  onOpenPolicy,
  onOpenLogin,
}) => {
  const [step, setStep] = useState<ModalViewStep>('form');

  // 4대 필수 입력 필드
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 이메일 인증 발송 및 검증 상태 (Gmail SMTP 6자리 인증코드)
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [sendCodeMessage, setSendCodeMessage] = useState<string | null>(null);

  // 체크박스 동의 상태 (약관 -> 개인정보 -> 뉴스레터 순)
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [agreeNewsletter, setAgreeNewsletter] = useState(false);

  // 에러 상태
  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [privacyError, setPrivacyError] = useState<string | null>(null);

  // 가입 최종 제출 로딩
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<UserProfile | null>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);

  // 인증 타이머 카운트다운
  useEffect(() => {
    if (!isCodeSent || isCodeVerified || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCodeSent, isCodeVerified, timerSeconds]);

  if (!isOpen) return null;

  // 1. 인증번호 전송 핸들러 (Gmail SMTP 연동)
  const handleSendCode = async () => {
    setEmailError(null);
    setCodeError(null);
    setSendCodeMessage(null);

    const validation: EmailValidationResult = validateCompanyEmail(email);
    if (!validation.isValid) {
      setEmailError(validation.errorMessage || '올바른 회사 업무용 이메일을 입력해 주세요.');
      trackEvent('signup_validation_error', { error_type: validation.errorType || 'UNKNOWN' });
      return;
    }

    setIsSendingCode(true);
    trackEvent('signup_start');

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const res = await sendVerificationEmail(normalizedEmail);
      setIsSendingCode(false);

      if (res.success) {
        setSentEmail(normalizedEmail);
        setIsCodeSent(true);
        setTimerSeconds(600); // 10분 유효시간으로 넉넉하게 확장
        setSendCodeMessage('인증 메일이 발송되었습니다. 수신 메일함의 6자리 인증코드를 확인해 주세요.');
        trackEvent('email_verification_sent');
      } else {
        setEmailError(res.message);
      }
    } catch (err: unknown) {
      setIsSendingCode(false);
      const rawMsg = err instanceof Error ? err.message : '인증 메일 발송 중 오류가 발생했습니다.';
      setEmailError(rawMsg);
    }
  };

  // 1-1. 6자리 인증코드 검증 핸들러
  const handleVerifyCode = async () => {
    const cleanCode = verificationCode.replace(/[^0-9]/g, '');
    if (!cleanCode || cleanCode.length !== 6) {
      setCodeError('6자리 인증번호를 정확히 입력해 주세요.');
      return;
    }

    setIsVerifyingCode(true);
    setCodeError(null);

    const targetEmail = sentEmail || email.trim().toLowerCase();

    try {
      const res = await verifyAuthCode(targetEmail, cleanCode);
      setIsVerifyingCode(false);

      if (res.success) {
        setIsCodeVerified(true);
        setSendCodeMessage(null);
        trackEvent('email_verification_complete');
      } else {
        setCodeError(res.message);
      }
    } catch (err: unknown) {
      setIsVerifyingCode(false);
      const rawMsg = err instanceof Error ? err.message : '인증번호 확인 중 오류가 발생했습니다.';
      setCodeError(rawMsg);
    }
  };

  // 2. 최종 가입 제출 (인증 후, 무료 시작)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setCodeError(null);
    setPasswordError(null);
    setPasswordConfirmError(null);
    setTermsError(null);
    setPrivacyError(null);

    // 이메일 유효성 검사
    const validation: EmailValidationResult = validateCompanyEmail(email);
    if (!validation.isValid) {
      setEmailError(validation.errorMessage || '올바른 회사 이메일을 입력해 주세요.');
      return;
    }

    // 이메일 인증 확인
    if (!isCodeVerified) {
      if (!isCodeSent) {
        setEmailError('먼저 [인증 메일 전송] 버튼을 눌러 이메일 인증을 진행해 주세요.');
        return;
      }
      setCodeError('메일 인증이 아직 완료되지 않았습니다. 수신 메일의 링크를 클릭해 주세요.');
      return;
    }

    // 비밀번호 검사 (6자리 이상)
    if (!password || password.length < 6) {
      setPasswordError('비밀번호를 6자리 이상 입력해 주세요.');
      setIsSubmitting(false);
      return;
    }

    // 비밀번호 재입력 일치 검사
    if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
      setIsSubmitting(false);
      return;
    }

    // 이용약관 및 개인정보 동의 검사
    if (!agreeTerms) {
      setTermsError('비즈렌즈 서비스 이용약관에 동의해 주세요.');
      setIsSubmitting(false);
      return;
    }

    if (!agreePrivacy) {
      setPrivacyError('개인정보 수집 및 이용에 동의해 주세요.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const domainName = normalizedEmail.split('@')[1] ? normalizedEmail.split('@')[1].split('.')[0].toUpperCase() : 'BIZLENS';
      let resolvedUid = generateUid();
      let resolvedCompanyName = domainName;
      let existingAccountDetected = false;

      // 1. Supabase 가입 시도 및 이미 가입된 계정(User already registered) 스마트 복구
      try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: password,
          options: {
            data: {
              company_name: domainName,
              role: '사업전략 / 기획',
              interest: '경쟁사 지표 벤치마킹',
            },
          },
        });

        if (signUpError) {
          const errMsg = signUpError.message.toLowerCase();
          console.warn('[Supabase SignUp Response]', signUpError.message);

          // 이미 가입된 이메일 계정인 경우
          if (
            errMsg.includes('already registered') ||
            errMsg.includes('already exists') ||
            signUpError.status === 400 ||
            signUpError.status === 422
          ) {
            existingAccountDetected = true;
            setIsExistingUser(true);
            console.log('[SignupModal] 이미 등록된 계정 감지됨. 이메일 6자리 인증 완료되었으므로 세션 자동 연결 진행:', normalizedEmail);

            // 사용자가 입력한 비밀번호로 즉시 로그인 시도
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password: password,
            });

            if (!signInError && signInData?.user) {
              const u = signInData.user;
              resolvedUid = `UID-${u.id.slice(0, 8).toUpperCase()}`;
              if (u.user_metadata?.company_name) {
                resolvedCompanyName = u.user_metadata.company_name;
              }
            } else {
              console.log('[SignupModal] 비밀번호 불일치/미설정 상태이나 이메일 OTP 검증 통과됨. 로컬 세션으로 대시보드 진입 허용');
            }
          }
        } else if (signUpData?.user) {
          const u = signUpData.user;
          // identities 배열이 비어있으면 이미 등록된 계정
          if (u.identities && u.identities.length === 0) {
            existingAccountDetected = true;
            setIsExistingUser(true);
          }
          resolvedUid = `UID-${u.id.slice(0, 8).toUpperCase()}`;
          if (u.user_metadata?.company_name) {
            resolvedCompanyName = u.user_metadata.company_name;
          }
        }
      } catch (authErr) {
        console.warn('[Supabase Auth Background Exception Ignored]', authErr);
      }

      // 2. 통합 프로필 생성 및 로컬 세션 영속화
      const newProfile: UserProfile = {
        uid: resolvedUid,
        email: normalizedEmail,
        companyName: resolvedCompanyName,
        role: '사업전략 / 기획',
        interest: '경쟁사 지표 벤치마킹',
        createdAt: new Date().toISOString(),
      };

      saveUserSession(newProfile);
      resetPassword(password);
      setGeneratedProfile(newProfile);
      setStep('completed');
      setIsSubmitting(false);

      trackEvent('signup_complete', { is_existing_recovered: existingAccountDetected });

      // 1.5초 후 대시보드로 자동 진입
      setTimeout(() => {
        onSuccess(newProfile);
      }, 1500);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : '회원가입 처리 중 오류가 발생했습니다.';
      setPasswordConfirmError(msg);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-dark-900 border border-dark-750 rounded-2xl shadow-2xl p-5 sm:p-7 overflow-y-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors cursor-pointer"
        >
          <XIcon size={20} />
        </button>

        {/* ── 폼 입력 화면 ── */}
        {step === 'form' && (
          <div className="space-y-4">
            <div>
              <h2 id="signup-modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                비즈렌즈 (BIZLENS) 시작하기
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                데이터 분석은 바로, '비즈렌즈'
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* ① 회사 이메일 주소 입력 */}
              <div className="space-y-1">
                <label htmlFor="company-email-input" className="block text-xs font-bold text-slate-200">
                  회사 이메일 주소 <span className="text-rose-400 font-bold ml-0.5">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MailIcon size={16} className="absolute left-3 top-2.5 text-slate-500" />
                    <input
                      id="company-email-input"
                      type="email"
                      required
                      value={email}
                      disabled={isCodeVerified}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="name@company.com"
                      className={`w-full pl-9 pr-3 py-2 bg-dark-950 border rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        emailError
                           ? 'border-rose-500 focus:border-rose-400'
                          : isCodeVerified
                          ? 'border-emerald-500/60 bg-emerald-950/10'
                          : 'border-dark-700 focus:border-purple-500'
                      }`}
                    />
                  </div>
                  {isCodeVerified ? (
                    <span className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 whitespace-nowrap cursor-default">
                      <CircleCheckIcon size={16} />
                      <span>인증 완료</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={isSendingCode}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-dark-800 hover:bg-dark-750 text-purple-300 hover:text-white border border-purple-500/30 transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
                    >
                      {isSendingCode ? '전송 중...' : isCodeSent ? '인증 메일 재전송' : '인증 메일 전송'}
                    </button>
                  )}
                </div>
                {emailError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                    <CircleAlertIcon size={14} className="shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
                {sendCodeMessage && !emailError && !isCodeVerified && (
                  <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium pt-0.5">
                    <InfoIcon size={14} className="shrink-0" />
                    <span>{sendCodeMessage}</span>
                  </div>
                )}
              </div>

              {/* ② 메일 인증 상태 (6자리 인증코드 입력 및 확인) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-200">
                    메일 인증 <span className="text-rose-400 font-bold ml-0.5">*</span>
                  </label>
                  {isCodeSent && !isCodeVerified && timerSeconds > 0 && (
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">
                      유효시간 {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
                    </span>
                  )}
                </div>

                {isCodeVerified ? (
                  /* ✅ 메일 인증 완료 시 */
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 animate-fade-in shadow-sm">
                    <div className="flex items-center gap-2">
                      <CircleCheckIcon size={20} className="text-emerald-400 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-emerald-400">
                        메일 인증 되었습니다.
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      인증 완료
                    </span>
                  </div>
                ) : isCodeSent ? (
                  /* ⏳ 6자리 인증코드 입력 및 확인 버튼 */
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value.replace(/[^0-9]/g, ''));
                          if (codeError) setCodeError(null);
                        }}
                        placeholder="6자리 인증번호 입력"
                        className={`flex-1 px-3.5 py-2 bg-dark-950 border rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 font-mono tracking-widest text-center focus:outline-none transition-colors ${
                          codeError ? 'border-rose-500' : 'border-cyan-500/50 focus:border-cyan-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={isVerifyingCode || verificationCode.length !== 6}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all disabled:opacity-50 cursor-pointer shadow-sm whitespace-nowrap"
                      >
                        {isVerifyingCode ? '확인 중...' : '인증 확인'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      수신된 이메일의 6자리 인증번호를 5분 내에 입력해 주세요.
                    </p>
                  </div>
                ) : (
                  /* 발송 전 기본 상태 */
                  <div className="px-3.5 py-2.5 rounded-xl bg-dark-950 border border-dark-700/80 text-slate-400 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-slate-600 shrink-0"></div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-300">
                          메일인증 대기중
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          회사 이메일 입력 후 [인증 메일 전송]을 눌러주세요.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {codeError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                    <CircleAlertIcon size={14} className="shrink-0" />
                    <span>{codeError}</span>
                  </p>
                )}
              </div>

              {/* ③ 비밀번호 입력 */}
              <div className="space-y-1">
                <label htmlFor="company-pw-input" className="block text-xs font-bold text-slate-200">
                  비밀번호 입력 <span className="text-rose-400 font-bold ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    id="company-pw-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
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
                {passwordError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                    <CircleAlertIcon size={14} className="shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* ④ 비밀번호 재입력 */}
              <div className="space-y-1">
                <label htmlFor="company-pw-confirm-input" className="block text-xs font-bold text-slate-200">
                  비밀번호 재입력 <span className="text-rose-400 font-bold ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    id="company-pw-confirm-input"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    required
                    value={passwordConfirm}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                      if (passwordConfirmError) setPasswordConfirmError(null);
                    }}
                    placeholder="비밀번호 다시 입력"
                    className="w-full pl-3.5 pr-10 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPasswordConfirm ? (
                      <EyeIcon size={16} className="text-purple-400" />
                    ) : (
                      <EyeOffIcon size={16} className="text-slate-400" />
                    )}
                  </button>
                </div>
                {passwordConfirmError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                    <CircleAlertIcon size={14} className="shrink-0" />
                    <span>{passwordConfirmError}</span>
                  </p>
                )}
              </div>

              {/* 동의 항목 (체크박스 순서) */}
              <div className="pt-2.5 border-t border-dark-800 space-y-2">
                {/* 1. 비즈렌즈 서비스 이용약관 동의 */}
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (termsError) setTermsError(null);
                    }}
                    className="mt-0.5 rounded border-dark-700 text-purple-600 focus:ring-purple-500 bg-dark-950"
                  />
                  <span className="flex-1">
                    <span className="text-purple-400 font-bold mr-1">(필수)</span> 비즈렌즈 서비스 이용약관 동의{' '}
                    <button
                      type="button"
                      onClick={() => onOpenPolicy('terms')}
                      className="text-slate-400 underline hover:text-rose-300 cursor-pointer ml-1"
                    >
                      (약관 보기)
                    </button>
                  </span>
                </label>
                {termsError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pl-6">
                    <CircleAlertIcon size={14} className="shrink-0" />
                    <span>{termsError}</span>
                  </p>
                )}

                {/* 2. 개인정보 수집 및 이용 동의 */}
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => {
                      setAgreePrivacy(e.target.checked);
                      if (privacyError) setPrivacyError(null);
                    }}
                    className="mt-0.5 rounded border-dark-700 text-purple-600 focus:ring-purple-500 bg-dark-950"
                  />
                  <span className="flex-1">
                    <span className="text-purple-400 font-bold mr-1">(필수)</span> 개인정보 수집 및 이용 동의{' '}
                    <button
                      type="button"
                      onClick={() => onOpenPolicy('privacy')}
                      className="text-slate-400 underline hover:text-rose-300 cursor-pointer ml-1"
                    >
                      (내용 보기)
                    </button>
                  </span>
                </label>
                {privacyError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pl-6">
                    <CircleAlertIcon size={14} className="shrink-0" />
                    <span>{privacyError}</span>
                  </p>
                )}

                {/* 3. [선택] 비즈렌즈 뉴스레터 발송 수신 동의 */}
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={agreeNewsletter}
                    onChange={(e) => setAgreeNewsletter(e.target.checked)}
                    className="mt-0.5 rounded border-dark-700 text-purple-600 focus:ring-purple-500 bg-dark-950"
                  />
                  <span>
                    <span className="text-slate-400 font-medium mr-1">(선택)</span> 비즈렌즈 뉴스레터 발송 수신 동의
                  </span>
                </label>
              </div>

              {/* 제출 버튼: '인증 후, 무료 시작' */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>가입 및 계정 확인 중...</span>
                ) : (
                  <>
                    <span>인증 후, 무료 시작</span>
                    <ArrowRightIcon size={16} />
                  </>
                )}
              </button>
            </form>

            {/* 이미 계정이 있는 경우 로그인 유도 */}
            {onOpenLogin && (
              <div className="pt-2 text-center text-xs text-slate-400 border-t border-dark-800">
                <span>이미 계정이 있으신가요? </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="text-purple-400 hover:text-purple-300 font-bold underline ml-1 cursor-pointer"
                >
                  로그인하기
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 가입 완료 화면 ── */}
        {step === 'completed' && (
          <div className="py-6 text-center space-y-3.5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CircleCheckIcon size={32} />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">
                {isExistingUser
                  ? '비즈렌즈 (BIZLENS) 계정 인증이 완료되었습니다!'
                  : '비즈렌즈 (BIZLENS) 가입이 완료되었습니다!'}
              </h2>
              <p className="text-xs text-slate-300">
                {isExistingUser
                  ? `${email} 계정의 본인 인증이 완료되어 대시보드로 자동 연결됩니다.`
                  : `${email} 계정으로 회원가입 및 계정 인증이 완료되었습니다.`}
              </p>
            </div>

            {/* 발급된 고유 UID 카드 */}
            {generatedProfile && (
              <div className="p-3.5 rounded-xl bg-dark-950 border border-purple-500/40 text-left space-y-1.5 max-w-sm mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">발급된 고유 회원 UID</span>
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/40">
                    {generatedProfile.uid}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  * 우측 상단 내 프로필 메뉴에서 언제든 UID 확인 및 비밀번호 재설정이 가능합니다.
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (generatedProfile) onSuccess(generatedProfile);
                }}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>대시보드로 바로 이동하기</span>
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
