import React from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServicePaidLockOverlayProps {
  children: React.ReactNode;
  onGoToOverview?: () => void;
  title?: string;
  badgeText?: string;
  description?: string;
  requirements?: string[];
  emailSubject?: string;
}

export const ServicePaidLockOverlay: React.FC<ServicePaidLockOverlayProps> = ({
  children,
  onGoToOverview,
  title = '내부데이터 필요 및 유료 서비스 영역',
  badgeText = '유료 엔터프라이즈 플랜 전용',
  description = '본 서비스 탭(매출·수익 집계, 가맹업종 결제 비중, 지역별 ATM 거래량)은 기업 내부 비공개 데이터(POS, PG 정산 원장 등) 연동이 요구되는 영역입니다.',
  requirements = [
    '기업 내부 POS · PG 상세 정산 원장 데이터 연동 필수',
    '실제 가맹업종별 거래액(GMV) 및 수수료 수익률 분해',
    '전국 오프라인 무인 키오스크 · ATM 지역별 거래량 실측',
  ],
  emailSubject = '%5B%EB%B9%84%EC%A6%88%EB%A0%8C%EC%A6%88%5D%20%EC%84%9C%EB%B9%84%EC%8A%A4%20%ED%83%AD%20%EB%82%B4%EB%B6%80%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EC%97%B0%EB%8F%99%20%EB%B0%8F%20%EC%9C%A0%EB%A3%8C%20%ED%94%8C%EB%9E%9C%20%EB%AC%B8%EC%9D%98',
}) => {
  const mailtoHref = `mailto:contact@bizstrategy.ai?subject=${encodeURIComponent(
    decodeURIComponent(emailSubject)
  )}`;

  return (
    <div 
      className="relative min-h-[680px] max-h-[820px] overflow-hidden rounded-2xl border border-purple-500/30 bg-dark-950 font-sans shadow-2xl"
      style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* 1. 배경: 극도로 강한 블러 처리 (거의 안 보이도록 blur-2xl + opacity-15 + 텍스트 선택 금지) */}
      <div 
        className="filter blur-2xl opacity-15 pointer-events-none select-none user-select-none transform scale-[0.98] origin-top"
        aria-hidden="true"
        tabIndex={-1}
      >
        {children}
      </div>

      {/* 2. 전면 오버레이: 유료 엔터프라이즈 플랜 전용 안내 카드 */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-dark-950/75 backdrop-blur-md">
        <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-dark-900/95 border-2 border-purple-500/50 shadow-2xl shadow-purple-950/80 text-center space-y-4 sm:space-y-5 animate-fade-in">
          
          {/* 자물쇠 잠금 아이콘 */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-300 shadow-lg shadow-purple-950/50">
            <Lock className="w-7 h-7 text-purple-400" />
          </div>

          <div className="space-y-2">
            {/* 뱃지 */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>{badgeText}</span>
            </div>

            {/* 메인 타이틀 */}
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {title}
            </h2>

            {/* 설명 문구 */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          </div>

          {/* 잠금 대상 핵심 내부데이터 범위 안내 */}
          <div className="p-3.5 rounded-xl bg-dark-950/90 border border-dark-750 text-left space-y-2 text-xs">
            {requirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                <span>{req}</span>
              </div>
            ))}
          </div>

          {/* 하단 액션 버튼 */}
          <div className="space-y-2 pt-1">
            <a
              href={mailtoHref}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>기업 제휴 및 데이터 연동 문의 (contact@bizstrategy.ai)</span>
            </a>

            {onGoToOverview && (
              <button
                type="button"
                onClick={onGoToOverview}
                className="w-full py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-700 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>공개 실측 데이터(트래픽) 보러가기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-500">
            * 데이터 신뢰성을 위해 비인가 외부 추론을 배제합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicePaidLockOverlay;
