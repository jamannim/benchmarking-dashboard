import React, { useState, useRef } from 'react';
import {
  ArrowLeft, Upload, FileText, RotateCcw,
  Copy, Check, ExternalLink,
  MapPin, ShieldCheck, Lock, Trash2
} from 'lucide-react';

interface UploadedFileInfo {
  name: string;
  sizeBytes: number;
  type: string;
  previewUrl?: string;
  uploadedAt: string;
}

interface NaverPlaceDocItem {
  id: string;
  category: string;
  requiredBadge: string;
  title: string;
  accept: string;
  formatLabel: string;
  naverRule: string;
  rejectionWarning: string;
  files: UploadedFileInfo[];
  allowMultiple?: boolean;
}

interface Props {
  serviceName: string;
  onBack: () => void;
}

export const MarketingAutomationSecondPage: React.FC<Props> = ({
  serviceName,
  onBack,
}) => {
  const isNamane = serviceName ? (serviceName.includes('나마네') || serviceName.includes('namane')) : false;

  if (!isNamane) {
    return (
      <div className="space-y-5 animate-fadeIn font-sans">
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-750 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-dark-800 text-slate-200 hover:bg-dark-750 hover:text-white border border-dark-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-brand-purpleLight" />
            마케팅 전략으로 돌아가기
          </button>
          <span className="text-xs text-slate-400 font-mono">
            [미확인: 오프라인 키오스크 및 스마트플레이스 등록 공시 없음]
          </span>
        </div>
        <div className="p-12 text-center rounded-2xl bg-dark-850 border border-dark-750 space-y-3">
          <FileText className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">
            해당 도메인은 오프라인 무인 키오스크 매장을 운영하지 않습니다.
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {serviceName ? `[${serviceName}]` : '해당 도메인'}은 오프라인 무인 단말기 설치 사업자 증빙 및 스마트플레이스 등록 대상이 아니므로 타사 데이터 병합 없이 공란(Null) 처리합니다.
          </p>
        </div>
      </div>
    );
  }

  const [docItems, setDocItems] = useState<NaverPlaceDocItem[]>([
    {
      id: 'biz-license',
      category: '1. 사업자·설치 증빙',
      requiredBadge: '필수',
      title: '사업자등록증 사본 (지점 설치 시 입점·설치계약서 포함)',
      accept: '.pdf,.jpg,.jpeg,.png',
      formatLabel: 'PDF, JPG, PNG',
      naverRule: '사업주 확인 및 설치 소재지 대조용',
      rejectionWarning: '※ 본사 외 지점(역사·편의점)은 설치계약서 동시 첨부 필수',
      files: [],
      allowMultiple: true
    },
    {
      id: 'exterior-photo',
      category: '2. 외관·주변 사진',
      requiredBadge: '심사 1순위',
      title: '키오스크 전면 로고 및 설치 주변 전경 사진',
      accept: '.jpg,.jpeg,.png,.webp',
      formatLabel: 'JPG, PNG (2장+)',
      naverRule: '기기 로고와 주변 배경(역사·매장)이 함께 나온 무보정 실사',
      rejectionWarning: '※ 그래픽 합성·배너·로고 크롭 이미지 100% 반려',
      files: [],
      allowMultiple: true
    },
    {
      id: 'screen-photo',
      category: '3. 화면 작동 사진',
      requiredBadge: '필수',
      title: '키오스크 작동 화면 (포토·선불카드 발급 메뉴 노출)',
      accept: '.jpg,.jpeg,.png,.webp',
      formatLabel: 'JPG, PNG',
      naverRule: '화면이 켜진 상태에서 발급·충전 메뉴가 보이는 근접 실사',
      rejectionWarning: '※ 화면 꺼짐·점검 중 사진 승인 불가',
      files: [],
      allowMultiple: true
    },
    {
      id: 'kiosk-list',
      category: '4. 거점 정보 파일',
      requiredBadge: '선택/일괄용',
      title: '거점 명세서 (주소·출구 위치·운영시간·대표번호)',
      accept: '.xlsx,.xls,.csv,.txt,.pdf,.docx',
      formatLabel: 'XLSX, CSV, PDF',
      naverRule: '도로명 주소, 출구/층수, 운영시간, 고객센터 번호 정리본',
      rejectionWarning: '※ 휴대폰 대신 유선/고객센터 대표번호 입력 권장',
      files: [],
      allowMultiple: false
    }
  ]);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [spotBranchName, setSpotBranchName] = useState('나마네카드 무인발급기 홍대입구역점');
  const [spotAddress, setSpotAddress] = useState('서울 마포구 양화로 188 (홍대입구역 공항철도 개찰구 옆)');
  const [spotDirections, setSpotDirections] = useState('홍대입구역 4번 출구 지하 1층 공항철도 환승통로 세븐일레븐 맞은편');
  const spotHours = '매일 05:30 ~ 24:00';
  const spotPhone = '1588-0000';

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleFileChange = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFileInfos: UploadedFileInfo[] = Array.from(selectedFiles).map((file) => {
      const isImage = file.type.startsWith('image/');
      return {
        name: file.name,
        sizeBytes: file.size,
        type: file.type || 'application/octet-stream',
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
        uploadedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
    });

    setDocItems((prev) =>
      prev.map((item) => {
        if (item.id !== docId) return item;
        return {
          ...item,
          files: item.allowMultiple ? [...item.files, ...newFileInfos] : newFileInfos
        };
      })
    );
    event.target.value = '';
  };

  const handleRemoveFile = (docId: string, fileIndex: number) => {
    setDocItems((prev) =>
      prev.map((item) => {
        if (item.id !== docId) return item;
        const target = item.files[fileIndex];
        if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
        return {
          ...item,
          files: item.files.filter((_, idx) => idx !== fileIndex)
        };
      })
    );
  };

  const handleResetAll = () => {
    docItems.forEach((item) => {
      item.files.forEach((f) => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    });
    setDocItems((prev) => prev.map((item) => ({ ...item, files: [] })));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const uploadedDocCount = docItems.filter((item) => item.files.length > 0).length;

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const naverSubmissionData = {
    placeName: spotBranchName,
    category: '금융,보험 > 무인발급기 / 선불카드발급기',
    address: spotAddress,
    directions: spotDirections,
    businessHours: spotHours,
    phone: spotPhone,
    keywords: '나마네카드, 교통카드발급기, 포토카드제작, 외국인선불카드, 키오스크',
    description: `[${serviceName} 무인 발급·충전 키오스크] 휴대폰 사진으로 나만의 포토 교통·선불카드를 1분 만에 즉석 출력할 수 있으며, 전국 대중교통 및 신용카드 가맹점 결제가 가능합니다.`
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. 상단 헤더 & 주차 상태 (1주차 진행 / 2~4주차 TBD) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-dark-900 via-indigo-950/30 to-dark-900 border border-brand-purple/40 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-dark-700 text-xs font-bold transition-all mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-brand-purpleLight" />
              <span>마케팅 전략(To be) 돌아가기</span>
            </button>
            <h2 className="text-lg sm:text-xl font-black text-white">
              1주차: 네이버 스마트플레이스 등록 (서류 첨부 및 가이드)
            </h2>
          </div>

          <a
            href="https://new.smartplace.naver.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-brand-cyan hover:bg-cyan-300 text-dark-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto shrink-0"
          >
            <span>스마트플레이스 바로가기</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* 주차별 상태 바 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-dark-750">
          <div className="p-2.5 rounded-xl bg-brand-purple/20 border border-brand-purple flex items-center justify-between">
            <span className="text-xs font-bold text-white">1주차: 스마트플레이스</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-cyan text-dark-950">진행</span>
          </div>
          {[
            { week: '2주차', label: '커뮤니티 가이드' },
            { week: '3주차', label: '팬덤 바이럴' },
            { week: '4주차', label: '성과 측정' }
          ].map((item) => (
            <div
              key={item.week}
              className="p-2.5 rounded-xl bg-dark-950/60 border border-dark-800 flex items-center justify-between opacity-60"
            >
              <span className="text-xs font-semibold text-slate-400">{item.week}: {item.label}</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-dark-800 text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                TBD
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1. 내 컴퓨터 필수 서류 등록 (4종) */}
      <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex items-center justify-between pb-2.5 border-b border-dark-750">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-cyan" />
            <span>STEP 1. 필수 서류 및 사진 등록 ({uploadedDocCount} / 4 첨부됨)</span>
          </h3>
          {uploadedDocCount > 0 && (
            <button
              onClick={handleResetAll}
              className="px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 border border-dark-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>초기화</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {docItems.map((doc) => {
            const hasFiles = doc.files.length > 0;
            return (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  hasFiles ? 'bg-dark-850/90 border-brand-emerald/50' : 'bg-dark-950/70 border-dark-750'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-cyan">{doc.category}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                        hasFiles
                          ? 'bg-brand-emerald/20 text-brand-emerald border-brand-emerald/40'
                          : 'bg-brand-purple/20 text-brand-purpleLight border-brand-purple/40'
                      }`}
                    >
                      {hasFiles ? `첨부 완료 (${doc.files.length})` : doc.requiredBadge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{doc.title}</h4>
                  <p className="text-xs text-slate-300">• {doc.naverRule}</p>
                  <p className="text-xs text-purple-300/90">{doc.rejectionWarning}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-dark-800">
                  <input
                    type="file"
                    ref={(el) => {
                      fileInputRefs.current[doc.id] = el;
                    }}
                    accept={doc.accept}
                    multiple={doc.allowMultiple}
                    aria-label={`${doc.title} 서류 파일 첨부`}
                    onChange={(e) => handleFileChange(doc.id, e)}
                    className="hidden"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">{doc.formatLabel}</span>
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[doc.id]?.click()}
                      className="px-3 py-1.5 rounded-lg bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>내 컴퓨터 파일 선택</span>
                    </button>
                  </div>

                  {hasFiles && (
                    <div className="space-y-1.5">
                      {doc.files.map((file, fIdx) => (
                        <div
                          key={`${file.name}-${fIdx}`}
                          className="p-2 rounded-lg bg-dark-900 border border-brand-emerald/30 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {file.previewUrl ? (
                              <img
                                src={file.previewUrl}
                                alt={file.name}
                                className="w-8 h-8 rounded object-cover border border-dark-700 shrink-0"
                              />
                            ) : (
                              <FileText className="w-4 h-4 text-brand-emerald shrink-0" />
                            )}
                            <span className="text-xs font-bold text-white truncate">{file.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono shrink-0">
                              ({formatFileSize(file.sizeBytes)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(doc.id, fIdx)}
                            className="p-1 text-slate-400 hover:text-brand-rose cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 2. 등록 방법 5단계 핵심 요약 */}
      <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-dark-750">
          <ShieldCheck className="w-4 h-4 text-brand-emerald" />
          <span>STEP 2. 스마트플레이스 등록 순서 (5단계)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { step: '1단계', title: '사업자 인증', desc: '신규 등록 클릭 후 사업자등록증 업로드' },
            { step: '2단계', title: '상호·업종 지정', desc: '[나마네카드 무인발급기 OO점] / 업종 [무인발급기]' },
            { step: '3단계', title: '핀 위치·길안내', desc: '출구 위치에 지도 핀 지정 및 층·출구 기재' },
            { step: '4단계', title: '실사 3장 첨부', desc: '전면 로고·주변 전경·작동 화면 원본 등록' },
            { step: '5단계', title: '키워드 5개 제출', desc: '대표 키워드 5개 입력 후 심사 제출 (1~3일)' }
          ].map((g, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-dark-850 border border-dark-750">
              <span className="text-[11px] font-black text-brand-emerald block">{g.step}</span>
              <h4 className="text-xs font-bold text-white mt-0.5">{g.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-snug">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 3. 입력란 원클릭 복사 */}
      <div className="p-5 rounded-2xl bg-dark-900 border border-brand-purple/40 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-dark-750">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-purpleLight" />
            <span>STEP 3. 스마트플레이스 입력값 원클릭 복사</span>
          </h3>
          <span className="text-xs text-slate-400">내용 수정 시 아래 복사값에 즉시 반영</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            value={spotBranchName}
            onChange={(e) => setSpotBranchName(e.target.value)}
            placeholder="상호명"
            aria-label="지점 상호명 입력"
            className="px-3 py-1.5 rounded-lg bg-dark-850 border border-dark-700 text-xs text-white font-bold"
          />
          <input
            type="text"
            value={spotAddress}
            onChange={(e) => setSpotAddress(e.target.value)}
            placeholder="도로명 주소"
            aria-label="지점 도로명 주소 입력"
            className="px-3 py-1.5 rounded-lg bg-dark-850 border border-dark-700 text-xs text-white font-bold"
          />
          <input
            type="text"
            value={spotDirections}
            onChange={(e) => setSpotDirections(e.target.value)}
            placeholder="찾아가는 길"
            aria-label="찾아가는 길 상세 안내 입력"
            className="px-3 py-1.5 rounded-lg bg-dark-850 border border-dark-700 text-xs text-white font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[
            { key: 'name', label: '상호명', value: naverSubmissionData.placeName },
            { key: 'cat', label: '업종 카테고리', value: naverSubmissionData.category },
            { key: 'addr', label: '주소 / 찾아가는 길', value: `${naverSubmissionData.address} (${naverSubmissionData.directions})` },
            { key: 'kw', label: '대표 키워드 5개', value: naverSubmissionData.keywords },
            { key: 'desc', label: '상세 소개글', value: naverSubmissionData.description }
          ].map((field) => (
            <div
              key={field.key}
              className={`p-2.5 rounded-lg bg-dark-950 border border-dark-800 flex items-center justify-between gap-2 ${
                field.key === 'desc' ? 'md:col-span-2' : ''
              }`}
            >
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-brand-cyan block">{field.label}</span>
                <p className="text-xs text-slate-200 truncate">{field.value}</p>
              </div>
              <button
                onClick={() => handleCopyText(field.key, field.value)}
                className="px-2.5 py-1 rounded bg-dark-800 hover:bg-dark-750 text-slate-200 border border-dark-700 text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copiedField === field.key ? (
                  <>
                    <Check className="w-3 h-3 text-brand-emerald" />
                    <span className="text-brand-emerald">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketingAutomationSecondPage;
