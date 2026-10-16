import React from 'react';
import {
  XIcon,
  ShieldIcon,
  FileTextIcon,
  CircleAlertIcon,
  SparklesIcon,
  DownloadIcon
} from '@animateicons/react/lucide';

export type PolicyType = 'privacy' | 'terms' | 'disclaimer' | 'ci';

interface PolicyModalProps {
  isOpen: boolean;
  type: PolicyType | null;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const renderModalContent = () => {
    switch (type) {
      case 'privacy':
        return (
          <>
            <div className="p-3 rounded-lg bg-dark-850 border border-dark-750 text-slate-300">
              <strong>비즈렌즈 (BIZLENS)</strong>(이하 &apos;서비스&apos;)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 관련 고충을 신속하게 처리하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </div>

            {/* 필수 고지 사항 안내 배지 */}
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-medium flex items-center justify-between">
              <span>* 「개인정보 보호법」에 따른 필수 기재 및 고지 사항은 붉은색으로 명시됩니다.</span>
              <span className="text-rose-400 font-bold">[법정 필수 고지 준수]</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-rose-500 font-black">[필수 고지]</span>
                <span>1. 수집하는 개인정보 항목 및 수집 방법</span>
              </h3>
              <p>
                - <strong className="text-rose-400">[필수 항목]</strong>: 회사 업무용 이메일 주소, 접속 비밀번호 (계정 식별 및 보안 인증)<br />
                - <span className="text-slate-400">[선택 항목]</span>: 회사명, 담당자 직무/역할, 주요 벤치마킹 관심사<br />
                - <span className="text-slate-400">[자동 생성/수집]</span>: 고유 회원 UID(UID-2026-XXXXX), 서비스 이용 로그, 접속 IP, 쿠키
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-rose-500 font-black">[필수 고지]</span>
                <span>2. 개인정보의 수집 및 이용 목적</span>
              </h3>
              <p>
                - <strong className="text-rose-400">[필수 목적]</strong>: 비즈렌즈 (BIZLENS) 회원 식별, 부정 이용 방지 및 계정 보안 관리<br />
                - <strong className="text-rose-400">[필수 목적]</strong>: 기업 경쟁사 벤치마킹 데이터 대시보드 리포트 생성 및 통계 제공<br />
                - <span className="text-slate-400">[선택 목적]</span>: 기업 고객 1:1 전략 제휴 문의 및 고객 지원 대응
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-rose-500 font-black">[필수 고지]</span>
                <span>3. 개인정보의 보유 및 이용 기간</span>
              </h3>
              <p>
                - <strong className="text-rose-400">[원칙] 회원 탈퇴 요청 시 또는 수집 목적 달성 시 지체 없이 파기합니다.</strong><br />
                - 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령에 의하여 보존할 필요가 있는 경우 해당 법정 기간 동안 안전하게 보관 후 파기합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-rose-500 font-black">[필수 고지]</span>
                <span>4. 동의 거부 권리 및 불이익 고지</span>
              </h3>
              <p className="text-rose-300/90 bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/20">
                정보주체는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 단, <strong className="text-rose-400">[필수 항목]</strong>(회사 이메일, 비밀번호) 수집에 동의하지 않으실 경우 비즈렌즈 (BIZLENS) 서비스 이용 및 계정 생성이 제한됩니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-rose-500 font-black">[법적 필수 노출]</span>
                <span>5. 개인정보 보호책임자 및 고객 문의처</span>
              </h3>
              <div className="p-3 rounded-lg bg-dark-950 border border-dark-800 space-y-1 text-[11px]">
                <p><strong className="text-rose-400">[필수 노출] 서비스명:</strong> 비즈렌즈 (BIZLENS)</p>
                <p><strong className="text-rose-400">[필수 노출] 개인정보 보호책임자:</strong> 정보보호총괄 CPO (privacy@bizstrategy.ai)</p>
                <p><strong className="text-rose-400">[필수 노출] 고객 문의 / 제휴:</strong> support@bizstrategy.ai / contact@bizstrategy.ai</p>
                <p><strong className="text-rose-400">[필수 노출] 운영 및 서비스 부서:</strong> 비즈렌즈 (BIZLENS) 운영팀</p>
              </div>
            </div>
          </>
        );

      case 'terms':
        return (
          <>
            <div className="p-3 rounded-lg bg-dark-850 border border-dark-750 text-slate-300">
              본 약관은 <strong>비즈렌즈 (BIZLENS)</strong> 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </div>

            {/* 필수 준수 사항 배지 */}
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-medium flex items-center justify-between">
              <span>* 서비스 이용 시 회원이 준수해야 할 필수 규정 및 법적 고지 항목은 붉은색으로 명시됩니다.</span>
              <span className="text-rose-400 font-bold">[필수 이용 규정]</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-rose-500 font-black">[필수 규정]</span>
                <span>제1조 (업무용 계정 한정 가입 정책)</span>
              </h3>
              <p>
                본 서비스는 기업 대표, 사업전략 및 신사업 담당자를 위한 전문 분석 도구로서, <strong className="text-rose-400">회사가 소유하거나 관리하는 업무용 이메일 도메인 계정에 한하여 가입 및 열람 권한이 부여됩니다.</strong> 일반 개인 무료 메일(Gmail, Naver 등)은 가입이 자동 제한됩니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-rose-500 font-black">[필수 고지]</span>
                <span>제2조 (데이터 이용 및 면책 안내)</span>
              </h3>
              <p>
                본 서비스의 분석·벤치마킹 결과는 사업전략 수립을 위한 참고 자료이며, 데이터의 한계가 있을 수 있습니다. <strong className="text-rose-400">최종 의사결정은 이용자의 책임하에 이루어져야 합니다.</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-rose-500 font-black">[필수 준수]</span>
                <span>제3조 (지적재산권 및 크롤링·재판매 금지)</span>
              </h3>
              <p>
                서비스 내 모든 시각화 차트, 벤치마킹 지표 계산 모델, UI 구성 및 AI 분석 리포트의 저작권은 <strong className="text-white">비즈렌즈 (BIZLENS)</strong>에 있습니다. <strong className="text-rose-400">사전 서면 승인 없는 비인가 데이터 크롤링, 스크래핑, 상업적 재판매 및 무단 배포는 엄격히 금지됩니다.</strong>
              </p>
            </div>
          </>
        );

      case 'disclaimer':
        return (
          <>
            {/* 핵심 고지 배너 */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                <CircleAlertIcon size={16} className="text-amber-400" />
                <span>데이터 이용 및 면책 안내</span>
              </div>
              <p className="leading-relaxed text-slate-200">
                본 서비스의 분석·벤치마킹 결과는 사업전략 수립을 위한 참고 자료이며, 데이터의 한계가 있을 수 있습니다. <strong className="text-amber-300 font-bold">최종 의사결정은 이용자의 책임하에 이루어져야 합니다.</strong>
              </p>
            </div>

            <div className="p-3 rounded-lg bg-dark-850 border border-dark-750 text-slate-300">
              <strong>비즈렌즈 (BIZLENS)</strong>(이하 &apos;서비스&apos;)에서 제공하는 모든 트래픽, 재무 공시, 마케팅 지표, 인프라 비용 추정치 및 AI 분석 보고서는 공공 및 외부 오픈 소스를 기반으로 가공된 비즈니스 벤치마킹 분석 정보입니다.
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-amber-400 font-black">[면책 규정]</span>
                <span>제1조 (분석 데이터의 성격 및 목적)</span>
              </h3>
              <p>
                1. 본 서비스에서 제공하는 웹·모바일 트래픽, 공시 재무 실적, 점유율 및 키워드 데이터는 공공기관(DART 금융감독원 등) 및 외부 데이터 분석 기관(시밀러웹 등)의 원천 데이터를 기반으로 가공·시각화한 정보입니다.<br />
                2. 제공되는 분석 정보는 기업의 전략적 참고 자료로만 활용되어야 하며, 특정 투자, 인수합병, 자금 조달에 관한 법률적·재무적 보증을 구성하지 않습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-amber-400 font-black">[면책 규정]</span>
                <span>제2조 (원천 데이터의 한계 및 최신성)</span>
              </h3>
              <p>
                1. 외부 데이터 제공처의 공시 주기, 샘플링 방식 및 집계 알고리즘에 따라 실제 라이브 수치와 시차 또는 오차가 발생할 수 있습니다.<br />
                2. 회사는 원천 데이터 제공기관의 시스템 장애, 공시 지연 또는 변경으로 인한 데이터 오차에 대해 완전무결성을 보증하지 않습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-amber-400 font-black">[면책 규정]</span>
                <span>제3조 (최종 의사결정 책임의 귀속)</span>
              </h3>
              <p>
                1. 이용자가 본 서비스의 데이터를 신뢰하여 내린 투자, 경영 전략 수립, 마케팅 집행, 파트너십 체결 등 일체의 상업적·법적 판단의 최종 결과 및 책임은 전적으로 이용자 본인에게 귀속됩니다.<br />
                2. 회사는 이용자의 사업적 판단이나 의사결정에 따른 기대 수익 미달, 영업상 손실 또는 간접 손해에 대해 법률이 허용하는 최대한의 범위 내에서 책임을 부담하지 않습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="text-amber-400 font-black">[문의처]</span>
                <span>제4조 (데이터 정합성 제보 및 문의)</span>
              </h3>
              <div className="p-3 rounded-lg bg-dark-950 border border-dark-800 space-y-1 text-[11px]">
                <p><strong className="text-slate-300">데이터 정합성 검증 및 제보:</strong> support@bizstrategy.ai</p>
                <p><strong className="text-slate-300">기업 분석 및 B2B 제휴:</strong> contact@bizstrategy.ai</p>
              </div>
            </div>
          </>
        );

      case 'ci':
        return (
          <div className="space-y-6">
            {/* 상단 소개 카드 */}
            <div className="p-4 rounded-xl bg-dark-950 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <strong className="text-sm text-white font-black tracking-tight">BIZ LENS Brand Identity (BI SYSTEM)</strong>
                </div>
                <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Official CI v2026
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                비즈렌즈(BIZLENS)는 데이터 분석의 정밀한 시선(Lens)과 비즈니스 성장의 무한한 도약(Biz)을 상징하는 기하학적 모노그램(E·B)과 조리개 렌즈 심볼로 구성되어 있습니다.
              </p>
            </div>

            {/* 공식 BI SYSTEM & GUIDE 시트 이미지 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <SparklesIcon size={16} className="text-cyan-400" />
                  <span>브랜드 가이드 시트 (Grid & Construction)</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">고해상도 원본 규격</span>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden border border-dark-750 bg-[#0A0E1A] shadow-2xl group">
                <img
                  src="/logos/bizlens_ci_guide.png"
                  alt="비즈렌즈 공식 BI SYSTEM & 브랜드 가이드 시트"
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                />
              </div>
            </div>

            {/* 공식 로고 에셋 원클릭 다운로드 */}
            <div className="p-4 rounded-xl bg-dark-950 border border-dark-800 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <DownloadIcon size={16} className="text-purple-400" />
                <span>공식 브랜드 로고 파일 다운로드</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <a
                  href="/logos/bizlens_logo.png"
                  download="BIZLENS_Main_Logo.png"
                  className="p-3 rounded-xl bg-dark-900 hover:bg-dark-850 border border-dark-750 hover:border-cyan-500/50 text-center transition-all group flex flex-col items-center gap-1.5"
                >
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">메인 시그니처 로고</span>
                  <span className="text-[10px] text-slate-400 font-mono">PNG · 심볼+워드마크</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 mt-1">
                    <DownloadIcon size={12} />
                    <span>다운로드</span>
                  </span>
                </a>

                <a
                  href="/logos/bizlens_symbol.png"
                  download="BIZLENS_Symbol_Mark.png"
                  className="p-3 rounded-xl bg-dark-900 hover:bg-dark-850 border border-dark-750 hover:border-emerald-500/50 text-center transition-all group flex flex-col items-center gap-1.5"
                >
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">시그니처 심볼마크</span>
                  <span className="text-[10px] text-slate-400 font-mono">PNG · EB 모노그램</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-1">
                    <DownloadIcon size={12} />
                    <span>다운로드</span>
                  </span>
                </a>

                <a
                  href="/logos/bizlens_ci_guide.png"
                  download="BIZLENS_Brand_Guide_Sheet.png"
                  className="p-3 rounded-xl bg-dark-900 hover:bg-dark-850 border border-dark-750 hover:border-purple-500/50 text-center transition-all group flex flex-col items-center gap-1.5"
                >
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">CI 가이드 전체 시트</span>
                  <span className="text-[10px] text-slate-400 font-mono">PNG · 1024x571 풀규격</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-400 mt-1">
                    <DownloadIcon size={12} />
                    <span>다운로드</span>
                  </span>
                </a>
              </div>
            </div>

            {/* 공식 컬러 팔레트 (Color Palette) */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-white">공식 지정 컬러 시스템 (Color Palette)</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 space-y-1.5">
                  <div className="w-full h-8 rounded-lg bg-[#0A0E1A] border border-dark-700 shadow-inner" />
                  <div className="font-bold text-white text-[11px]">Deep Space Navy</div>
                  <div className="text-[10px] font-mono text-cyan-300">#0A0E1A</div>
                </div>

                <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 space-y-1.5">
                  <div className="w-full h-8 rounded-lg bg-[#00F0FF] shadow-lg shadow-cyan-500/20" />
                  <div className="font-bold text-white text-[11px]">Data Intelligence Cyan</div>
                  <div className="text-[10px] font-mono text-cyan-300">#00F0FF</div>
                </div>

                <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 space-y-1.5">
                  <div className="w-full h-8 rounded-lg bg-[#5BFFB4] shadow-lg shadow-emerald-500/20" />
                  <div className="font-bold text-white text-[11px]">Growth Neon Mint</div>
                  <div className="text-[10px] font-mono text-emerald-300">#5BFFB4</div>
                </div>

                <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 space-y-1.5">
                  <div className="w-full h-8 rounded-lg bg-[#FFFFFF] shadow-lg shadow-white/20" />
                  <div className="font-bold text-white text-[11px]">Pure Clarity White</div>
                  <div className="text-[10px] font-mono text-slate-300">#FFFFFF</div>
                </div>
              </div>
            </div>

            {/* 사용 규정 안내 */}
            <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 text-[11px] text-slate-400 space-y-1">
              <p className="text-slate-300 font-bold">⚠️ 로고 사용 시 준수 사항</p>
              <p>• 심볼마크와 워드마크의 비례를 임의로 왜곡하거나 회전, 색상 변경하여 사용할 수 없습니다.</p>
              <p>• 로고 주변에는 가독성 확보를 위해 최소 그리드 X 단위의 여백(Clear Space)을 유지해야 합니다.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${type === 'ci' ? 'max-w-3xl' : 'max-w-2xl'} bg-dark-900 border border-dark-750 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-4 border-b border-dark-750">
          <div className="flex items-center gap-2">
            {type === 'privacy' && <ShieldIcon size={20} className="text-purple-400" />}
            {type === 'terms' && <FileTextIcon size={20} className="text-cyan-400" />}
            {type === 'disclaimer' && <CircleAlertIcon size={20} className="text-amber-400" />}
            {type === 'ci' && <SparklesIcon size={20} className="text-cyan-400" />}
            <h2 id="policy-modal-title" className="text-base font-bold text-white">
              {type === 'terms' && '이용약관'}
              {type === 'privacy' && '개인정보처리방침'}
              {type === 'disclaimer' && '데이터 이용 및 면책조항'}
              {type === 'ci' && '비즈렌즈 (BIZLENS) 브랜드 CI / 로고 가이드'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* 본문 */}
        <div className="py-4 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans pr-1">
          {renderModalContent()}
        </div>

        {/* 닫기 버튼 */}
        <div className="pt-4 border-t border-dark-750 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
