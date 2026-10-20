import React from 'react';
import { BizStrategyLogo } from '../BizStrategyLogo';
import type { PolicyType } from '../landing/PolicyModals';

export interface MainFooterProps {
  onOpenPolicy: (type: PolicyType) => void;
  onNavigateLanding?: () => void;
  onNavigateDashboard?: () => void;
  onNavigateDocs?: () => void;
  onNavigateGuide?: () => void;
  currentView?: 'landing' | 'dashboard' | 'docs' | 'guide';
}

export const MainFooter: React.FC<MainFooterProps> = ({
  onOpenPolicy,
  onNavigateLanding,
  onNavigateDashboard,
  onNavigateDocs,
  onNavigateGuide,
  currentView = 'landing',
}) => {
  return (
    <footer className="bg-dark-950 py-10 border-t border-dark-800 font-sans text-xs text-slate-400 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 1. 상단 브랜드 로고 및 정책 링크 네비게이션 */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-dark-800">
          {onNavigateLanding ? (
            <button
              type="button"
              onClick={onNavigateLanding}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
              title="BIZLENS 홈으로 이동"
            >
              <BizStrategyLogo size="sm" />
              <div className="flex flex-col text-left justify-center">
                <span className="font-black text-white text-base tracking-tight leading-none group-hover:text-cyan-300 transition-colors">
                  BIZLENS
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight leading-none mt-1">
                  Business Analysis Lens
                </span>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <BizStrategyLogo size="sm" />
              <div className="flex flex-col text-left justify-center">
                <span className="font-black text-white text-base tracking-tight leading-none">
                  BIZLENS
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight leading-none mt-1">
                  Business Analysis Lens
                </span>
              </div>
            </div>
          )}

          {/* 주요 메뉴 및 정책 아웃링크 */}
          <nav aria-label="푸터 주요 메뉴 및 정책 네비게이션" className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            {/* 4대 주요 메뉴 (서비스 소개 · 이용방법 · 제품 · 데이터 출처) */}
            {onNavigateLanding && (
              <button
                type="button"
                onClick={onNavigateLanding}
                className={`transition-colors underline underline-offset-2 cursor-pointer ${
                  currentView === 'landing' ? 'text-indigo-400 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="서비스 소개로 이동"
              >
                서비스 소개
              </button>
            )}
            {onNavigateGuide && (
              <button
                type="button"
                onClick={onNavigateGuide}
                className={`transition-colors underline underline-offset-2 cursor-pointer ${
                  currentView === 'guide' ? 'text-cyan-300 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="이용방법으로 이동"
              >
                이용방법
              </button>
            )}
            {onNavigateDashboard && (
              <button
                type="button"
                onClick={onNavigateDashboard}
                className={`transition-colors underline underline-offset-2 cursor-pointer ${
                  currentView === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="제품(대시보드)으로 이동"
              >
                제품
              </button>
            )}
            {onNavigateDocs && (
              <button
                type="button"
                onClick={onNavigateDocs}
                className={`transition-colors underline underline-offset-2 cursor-pointer ${
                  currentView === 'docs' ? 'text-purple-300 font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="데이터 출처로 이동"
              >
                데이터 출처
              </button>
            )}

            <div className="h-3 w-px bg-dark-700 hidden sm:block" />

            <button
              type="button"
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white text-slate-400 transition-colors underline underline-offset-2 cursor-pointer"
            >
              이용약관
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-white text-slate-400 transition-colors underline underline-offset-2 cursor-pointer"
            >
              개인정보처리방침
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicy('disclaimer')}
              className="hover:text-purple-300 text-slate-300 transition-colors underline underline-offset-2 cursor-pointer"
            >
              면책안내
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicy('ci')}
              className="hover:text-cyan-300 text-slate-300 transition-colors underline underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              <span>로고 가이드(CI)</span>
            </button>
          </nav>
        </div>

        {/* 2. 기업 정보 및 카피라이트 */}
        <div className="space-y-2 text-[11px] text-slate-400 leading-relaxed pt-1">
          {/* 사업자 등록 정보 & 주소 */}
          <p className="text-slate-400">
            <span className="text-white font-bold">법인명 :</span> - &nbsp; | &nbsp; <span className="text-white font-bold">대표자 :</span> - &nbsp; | &nbsp; <span className="text-white font-bold">사업자등록번호 :</span> - &nbsp; | &nbsp; <span className="text-white font-bold">주소 :</span> -
          </p>
          {/* 이메일 주소 (가로 한 줄 표시) & 카피라이트 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
            <div className="text-slate-300 flex items-center gap-x-3 whitespace-nowrap overflow-x-auto scrollbar-none py-0.5">
              <span>고객지원 · <a href="mailto:support@bizstrategy.ai" className="hover:text-white underline underline-offset-2">support@bizstrategy.ai</a></span>
              <span className="text-dark-700">|</span>
              <span>기업제휴 · <a href="mailto:contact@bizstrategy.ai" className="hover:text-white underline underline-offset-2">contact@bizstrategy.ai</a></span>
              <span className="text-dark-700">|</span>
              <span>개인정보 문의 · <a href="mailto:privacy@bizstrategy.ai" className="hover:text-white underline underline-offset-2">privacy@bizstrategy.ai</a></span>
            </div>
            <p className="text-slate-500 text-left lg:text-right shrink-0 whitespace-nowrap">
              © 2026 비즈렌즈 (BIZLENS). All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default MainFooter;
