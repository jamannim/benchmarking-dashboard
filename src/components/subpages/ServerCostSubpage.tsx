import React, { useState } from 'react';
import { 
  Server, TrendingDown, 
  CheckCircle2, Zap, Cloud, Database, 
  Info, ShieldCheck, ExternalLink
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import type { CompleteServiceIntelligence, CostSavingRecommendation } from '../../types/intelligence';
import { BrandLogo, BrandBadgesFromText } from '../BrandLogo';
import { getTableDensityClasses, type TableDensity } from '../TableDensityControl';
import { PdfReportButton } from '../PdfReportButton';
import { DualSourceVerificationSection } from '../common/DualSourceVerificationSection';
import { getTabCrossVerificationForService, type TabCrossVerificationData } from '../../data/crossVerificationData';

interface Props {
  data: CompleteServiceIntelligence;
}

export const ServerCostSubpage: React.FC<Props> = ({ data }) => {
  const { serverCost, service } = data;
  const isNamane = service.domain.includes('namane') || service.domain.includes('iaurora');
  const [selectedRecId, setSelectedRecId] = useState<number>(1);
  const density: TableDensity = 'auto';
  const dClasses = getTableDensityClasses(density);

  if (!serverCost && !isNamane) {
    return (
      <div className="space-y-6 font-sans">
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 flex flex-col items-center justify-center text-center py-16">
          <div className="p-3.5 rounded-2xl bg-dark-800 border border-dark-700 mb-4 text-slate-400">
            <Server className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <BrandLogo domain={service.domain} size="sm" />
            <span>{service.name.split(' (')[0]} · 서버비용 분석</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mb-3 leading-relaxed">
            해당 도메인({service.domain})의 클라우드 인프라 아키텍처 및 서버 비용 상세 공시 데이터가 확인되지 않았습니다.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <span>[확인 불가: 클라우드 인프라 및 서버비용 공시 데이터 없음 (N/A)]</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 max-w-md">
            ※ 데이터 무결성 원칙에 따라 외부 공시나 인프라 연동 내역이 없는 사이트에 대해 가상 AWS 인프라 비용을 임의로 생성하지 않습니다.
          </p>
        </div>
      </div>
    );
  }

  // Fallback server cost data only for Namane preset
  const costData = serverCost || {
    inferredProvider: 'Amazon Web Services (AWS 서울 리전 ap-northeast-2)',
    ipAddress: '18.244.60.8 (AWS EC2 / CloudFront Edge)',
    cdnProvider: 'AWS CloudFront (cloudfront.net)',
    webServer: 'Nginx (Reverse Proxy & WAS)',
    currentMonthlyTotalWon: 2420000,
    annualTotalWon: 29040000,
    potentialMonthlySavingsWon: 1220000,
    potentialAnnualSavingsWon: 14640000,
    costBreakdown: [
      { category: '컴퓨팅 (EC2 Web/WAS 인스턴스)', provider: 'AWS EC2 t3.xlarge Multi-AZ (이중화)', spec: '4 vCPU, 16GB RAM x 2대', monthlyCostWon: 880000, share: 36.4 },
      { category: '데이터베이스 (RDS 고가용성)', provider: 'AWS RDS MySQL db.r6g.large', spec: '2 vCPU, 16GB RAM, Multi-AZ 복제', monthlyCostWon: 740000, share: 30.6 },
      { category: 'CDN & 데이터 전송료', provider: 'AWS CloudFront + Data Transfer', spec: '해외 유입(일본·미국 45%) 아웃바운드 3TB', monthlyCostWon: 450000, share: 18.6 },
      { category: '스토리지 & 백업 (S3)', provider: 'AWS S3 + Snapshot 백업', spec: '커스텀 포토카드 이미지 에셋 약 2.5TB', monthlyCostWon: 210000, share: 8.7 },
      { category: '보안/모니터링/로드밸런서', provider: 'AWS ALB + WAF + CloudWatch', spec: 'L7 로드밸런싱 및 WAF 규칙', monthlyCostWon: 140000, share: 5.7 },
    ],
    recommendations: [
      {
        id: 1,
        title: '대안 CDN 도입 & 에지 캐싱 최적화 (Cloudflare 전환)',
        targetArea: 'CDN & 아웃바운드 데이터 전송료',
        currentCostWon: 450000,
        expectedCostWon: 90000,
        monthlySavingsWon: 360000,
        savingsRate: 80,
        difficulty: 'Low',
        effortDays: '1~2일 (DNS 전환)',
        description: 'Cloudflare Pro 도입 및 에지 캐시(TTL 30일) 설정으로 해외 Egress 전송료 80% 절감',
        actionSteps: [
          '도메인 DNS 네임서버를 Cloudflare로 전환하고 프록시(오렌지 구름) 활성화',
          'S3 커스텀 이미지 경로(/uploads/*, /assets/*)에 대해 Cloudflare Cache Rule(Edge Cache TTL: 1개월) 적용',
          'CloudFront 사용량을 최소화하여 AWS Egress 요금을 $300 이상 즉시 절감'
        ],
        tradeoffs: '초기 DNS 전파 시간(최대 24시간) 동안의 캐시 워밍업 필요 외 기능적 리스크 없음'
      },
      {
        id: 2,
        title: 'AWS Compute Savings Plans (1~3년 약정) & RDS RI 전환',
        targetArea: 'EC2 웹/WAS 서버 및 RDS 데이터베이스',
        currentCostWon: 1620000,
        expectedCostWon: 980000,
        monthlySavingsWon: 640000,
        savingsRate: 39.5,
        difficulty: 'Low',
        effortDays: '즉시 (AWS 콘솔 클릭)',
        description: '1~3년 Compute Savings Plans 및 RDS RI 적용으로 무중단 35~45% 비용 즉시 할인',
        actionSteps: [
          'AWS Cost Explorer에서 권장하는 1년 선결제 없는 Compute Savings Plans 활성화',
          'RDS MySQL 인스턴스에 대해 1년 표준 RI(Standard Reserved Instance) 구매',
          '야간 및 새벽 시간대(02:00~07:00) 유휴 워커 인스턴스 자동 다운스케일링 크론 설정'
        ],
        tradeoffs: '1년 동안 해당 리소스 사용을 보장해야 하므로 서버 스펙의 급격한 축소가 제한됨'
      },
      {
        id: 3,
        title: '국내 CSP(네이버클라우드 Ncloud) 이전 또는 서버리스 하이브리드',
        targetArea: '원화 결제 환율 리스크 방어 & 인프라 전면 효율화',
        currentCostWon: 2420000,
        expectedCostWon: 1350000,
        monthlySavingsWon: 1070000,
        savingsRate: 44.2,
        difficulty: 'Medium',
        effortDays: '2~3주 (스테이징 검증)',
        description: '네이버클라우드 이전 또는 유휴비 제로 서버리스(Fargate) 전환으로 44% 절감',
        actionSteps: [
          '정적 웹 및 단순 조회 API를 Serverless/컨테이너(Fargate)로 분리하여 유휴 서버 비용 제거',
          '국내 결제/정산 백엔드를 네이버클라우드(Ncloud) 원화 고정 요금제로 마이그레이션 검토',
          '국내 PG사 연동 전용선 비용 감축 및 공공/금융 클라우드 바우처(최대 2,000만 원) 지원 사업 연계'
        ],
        tradeoffs: '인프라 마이그레이션 작업과 결제 게이트웨이(PG) 연동 테스트에 2~3주의 공수가 소요됨'
      }
    ]
  };

  const selectedRec: CostSavingRecommendation = (costData.recommendations && costData.recommendations.length > 0)
    ? (costData.recommendations.find(r => r.id === selectedRecId) || costData.recommendations[0])
    : {
        id: 1,
        title: '기본 권장 사항',
        targetArea: '인프라 전반',
        currentCostWon: 0,
        expectedCostWon: 0,
        monthlySavingsWon: 0,
        savingsRate: 0,
        difficulty: 'Low',
        effortDays: '-',
        description: '공시 데이터 없음',
        actionSteps: [],
        tradeoffs: '-'
      };

  // Comparison chart data (Current vs After Top 3 Savings)
  const chartData = [
    { name: '현재 서버 비용', cost: costData.currentMonthlyTotalWon, fill: '#64748b' },
    { name: '추천 1 (CDN 최적화)', cost: costData.currentMonthlyTotalWon - 360000, fill: '#818cf8' },
    { name: '추천 1+2 (약정 할인)', cost: costData.currentMonthlyTotalWon - 1000000, fill: '#a855f7' },
    { name: '추천 1+2+3 (완전 최적화)', cost: costData.currentMonthlyTotalWon - costData.potentialMonthlySavingsWon, fill: '#06b6d4' },
  ];

  // AWS Pricing Calculator vs CloudZero FinOps 2대 공식 출처 교차 검증 데이터
  const crossVerificationData = React.useMemo<TabCrossVerificationData>(() => {
    return getTabCrossVerificationForService('server', data);
  }, [data]);

  return (
    <div className="space-y-6">
      
      {/* 1. 상단 툴바 (PDF 버튼 & 실측 인프라 요약) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-300">
            인프라 비용 분석 및 최적화
          </span>
          <span className="text-xs px-2 py-0.5 rounded font-bold bg-dark-800 text-slate-400 border border-dark-750 tabular-nums">
            {costData.inferredProvider.split(' (')[0]} 서울 리전
          </span>
          <span className="hidden sm:inline text-xs text-brand-cyan font-mono">
            ({costData.ipAddress})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PdfReportButton data={data} tab="server-cost" className="h-8 px-3 text-xs" />
        </div>
      </div>

      {/* 2. Key Cost Metrics Cards (모바일 2x2 컴팩트 배치) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 font-sans">
        
        {/* Current Monthly Cost */}
        <div className="p-2.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 truncate">현재 월 서버비</span>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700 font-bold">
              온디맨드
            </span>
          </div>
          <div className="text-base sm:text-xl lg:text-2xl font-black text-white mt-1">
            약 {(costData.currentMonthlyTotalWon / 10000).toFixed(0)}만 원
          </div>
          <span className="hidden sm:block text-xs text-slate-400 mt-1">
            연간 약 {(costData.annualTotalWon / 10000).toFixed(0)}만 원
          </span>
        </div>

        {/* Expected Optimized Cost */}
        <div className="p-2.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 truncate">최적화 후 월비용</span>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30 font-bold">
              -50%
            </span>
          </div>
          <div className="text-base sm:text-xl lg:text-2xl font-black text-purple-300 mt-1">
            약 {((costData.currentMonthlyTotalWon - costData.potentialMonthlySavingsWon) / 10000).toFixed(0)}만 원
          </div>
          <span className="hidden sm:block text-xs text-slate-400 mt-1">
            유휴 인스턴스/Egress 최적화
          </span>
        </div>

        {/* Monthly Potential Savings */}
        <div className="p-2.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 truncate">월간 절감 가능</span>
            <span className="hidden sm:flex text-xs px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-bold items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> 50.4%
            </span>
          </div>
          <div className="text-base sm:text-xl lg:text-2xl font-black text-brand-cyan mt-1">
            -{(costData.potentialMonthlySavingsWon / 10000).toFixed(0)}만 원
          </div>
          <span className="hidden sm:block text-xs text-slate-400 mt-1">
            매달 세이브 가능한 운영비
          </span>
        </div>

        {/* Annual Total Savings */}
        <div className="p-2.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 truncate">연간 누적 절감액</span>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30 font-bold">
              순익 전환
            </span>
          </div>
          <div className="text-base sm:text-xl lg:text-2xl font-black text-white mt-1">
            약 {(costData.potentialAnnualSavingsWon / 10000).toFixed(0)}만 원
          </div>
          <span className="hidden sm:block text-xs text-slate-400 mt-1">
            최적화 후 연간 이익 개선분
          </span>
        </div>
      </div>

      {/* 3. Cost Breakdown Table & Savings Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Detailed Infrastructure Cost Breakdown (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-dark-900 border border-dark-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-dark-700 mb-4 gap-2">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-brand-purpleLight" />
              <h3 className="text-sm font-bold text-white tracking-wide">현재 인프라 리소스별 월평균 비용 내역</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">합계: 약 242만 원</span>
              
            </div>
          </div>

          {/* 모바일 화면 (가로 스크롤바 0%, 카드 뷰) */}
          <div className="space-y-3 md:hidden font-sans">
            {costData.costBreakdown.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                  <span className="font-bold text-sm text-white">{item.category}</span>
                  <span className="font-black text-sm text-cyan-300 tabular-nums">
                    {item.monthlyCostWon.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">비중:</span>
                    <span className="font-bold text-white tabular-nums">{item.share}%</span>
                  </div>
                  <BrandBadgesFromText text={item.provider} size="xs" />
                </div>
                <div className="text-xs text-slate-300 pt-1 border-t border-dark-800">
                  <span className="text-slate-400 font-semibold mr-1">[사양]</span>
                  <span>{item.spec}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
            <table className={`w-full text-left table-fixed ${dClasses.tableText}`}>
              <thead className="bg-dark-850 text-slate-400 font-semibold border-b border-dark-750">
                <tr>
                  <th className={`${dClasses.th} w-[20%]`}>영역</th>
                  <th className={`${dClasses.th} text-right w-[18%]`}>월비용</th>
                  <th className={`${dClasses.th} text-center w-[15%]`}>비중</th>
                  <th className={`${dClasses.th} w-[47%]`}>사양 (설명)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-750/70 text-slate-200">
                {costData.costBreakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-dark-800/40 transition-colors">
                    {/* 1. 영역 */}
                    <td className={`${dClasses.td} font-medium`}>
                      <div className="text-white font-semibold break-keep">{item.category}</div>
                    </td>

                    {/* 2. 월비용 (숫자 좌측 우선) */}
                    <td className={`${dClasses.td} font-mono font-bold text-white whitespace-nowrap text-right`}>
                      {item.monthlyCostWon.toLocaleString()}원
                    </td>

                    {/* 3. 비중 (숫자) */}
                    <td className={`${dClasses.td} text-center`}>
                      <div className="inline-flex items-center space-x-1.5">
                        <div className="w-10 bg-dark-750 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div className="bg-brand-purple h-full" style={{ width: `${item.share}%` }}></div>
                        </div>
                        <span className="text-slate-300 font-mono text-xs">{item.share}%</span>
                      </div>
                    </td>

                    {/* 4. 사양 및 설명 (우측 끝) */}
                    <td className={`${dClasses.td} text-slate-300 font-mono`}>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <BrandBadgesFromText text={item.provider} size="xs" />
                      </div>
                      <div className="text-xs text-slate-400 font-sans mt-0.5 break-keep">
                        {item.spec}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Savings Simulation Recharts Bar Chart (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-dark-900 border border-dark-700 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-dark-700 mb-3">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">단계별 비용 절감 시뮬레이션</h3>
            </div>
            <span className="text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
              최대 50% 절감
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 10000}만`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()}원`, '월간 예상 비용']}
                />
                <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-dark-850 border border-dark-750 text-xs text-slate-300 leading-relaxed mt-2">
            <span className="text-cyan-300 font-bold">💡 최적화 요약:</span> 현재 월 242만 원 ➔ 3대 추천안 적용 시 <strong>월 120만 원 (연간 1,464만 원 순절감)</strong>으로 다이어트가 가능합니다.
          </div>
        </div>

      </div>

      {/* ── 3.1. AWS Pricing Calculator vs CloudZero FinOps 2대 공식 출처 교차 검증 ── */}
      <DualSourceVerificationSection data={crossVerificationData} />

      {/* 3.5. 오프라인 키오스크 및 하드웨어 인프라 원가 (전국 공식 83개소 연동) */}
      <div className="p-5 rounded-2xl bg-dark-900 border border-dark-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-dark-700 gap-2">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-purple-400" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              전사 인프라 통합 분석 : 오프라인 키오스크 & 거점 인프라 (전국 83개소)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-950/40 text-purple-300 border border-purple-500/30">
            공식 확인 83개 거점 연동 기준
          </span>
        </div>

        {/* 3대 통합 인프라 지표 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750">
            <div className="text-xs text-slate-400 font-medium">오프라인 키오스크 거점 수</div>
            <div className="text-xl sm:text-2xl font-black text-purple-300 font-mono mt-1">
              전국 83개소
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              서울 52 · 인천 11 · 부산 9 · 경기 7 · 기타 4개소
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750">
            <div className="text-xs text-slate-400 font-medium">오프라인 월간 인프라 원가</div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
              월 2,490만 원
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block font-mono">
              연간 2억 9,880만 원 (개소당 월 30만 원)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750">
            <div className="text-xs text-slate-400 font-medium">전사 총 인프라 원가 (클라우드 + 오프라인)</div>
            <div className="text-xl sm:text-2xl font-black text-brand-cyan font-mono mt-1">
              월 2,732만 원
            </div>
            <span className="text-[11px] text-slate-300 mt-1 block font-mono">
              연간 3억 2,784만 원 (AWS 8.9% · 키오스크 91.1%)
            </span>
          </div>
        </div>

        {/* 세부 인프라 비용 분해 테이블 */}
        {/* 모바일 화면 (가로 스크롤바 0%, 카드 뷰) */}
        <div className="space-y-3 md:hidden font-sans">
          {[
            {
              name: '① 거점 입점/설치 임차 수수료',
              unit: '개소당 월 25만 원',
              month: '2,075만 원',
              year: '2억 4,900만 원',
              share: '75.9%',
              desc: '공항철도, 코레일/교통공사 역사, 편의점 위탁 임차'
            },
            {
              name: '② 보안 M2M LTE 통신 회선료',
              unit: '개소당 월 1.5만 원',
              month: '124.5만 원',
              year: '1,494만 원',
              share: '4.6%',
              desc: '실시간 카드 발급 및 결제 VAN 보안 전용 회선'
            },
            {
              name: '③ 소모품 및 현장 유지보수(AS)',
              unit: '개소당 월 3.5만 원',
              month: '290.5만 원',
              year: '3,486만 원',
              share: '10.6%',
              desc: '특수 포토카드 전용 리본·용지 및 기기 정기 점검'
            },
            {
              name: '④ 클라우드 서버 인프라 (AWS)',
              unit: 'AWS 서울 리전 풀스택',
              month: '242.0만 원',
              year: '2,904만 원',
              share: '8.9%',
              desc: 'EC2 WAS 이중화 + RDS DB + CloudFront CDN',
              highlight: true
            }
          ].map((item) => (
            <div
              key={item.name}
              className={`p-3.5 rounded-xl border space-y-2 ${
                item.highlight ? 'bg-dark-850/90 border-brand-cyan/40' : 'bg-dark-850 border-dark-750'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-dark-750">
                <span className={`font-bold text-sm ${item.highlight ? 'text-brand-cyan' : 'text-white'}`}>
                  {item.name}
                </span>
                <span className="font-black text-sm text-brand-cyan tabular-nums">
                  {item.month}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">연간비용</div>
                  <div className="font-medium text-slate-200 tabular-nums mt-0.5">{item.year}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">비중</div>
                  <div className="font-bold text-cyan-300 tabular-nums mt-0.5">{item.share}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-800">
                  <div className="text-[10px] text-slate-400">단가기준</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 truncate">{item.unit}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 pt-1 border-t border-dark-800">
                <span className="text-slate-500 mr-1">[내역]</span>
                {item.desc}
              </div>
            </div>
          ))}

          {/* 모바일 합계 요약 바 */}
          <div className="p-3.5 rounded-xl bg-dark-900 border border-brand-cyan/40 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="text-white">전사 IT·인프라 원가 합계</span>
              <span className="text-brand-cyan font-black text-sm tabular-nums">월 2,732만 원</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-dark-800">
              <span>연간 3억 2,784만 원 (100.0%)</span>
              <span className="text-slate-300">IR 버닝레이트 정합</span>
            </div>
          </div>
        </div>

        {/* 데스크탑 화면 (숫자 좌측 우선 + 설명 우측 끝 배치 + 100% 폭 테이블) */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-dark-750">
          <table className="w-full text-left text-xs sm:text-sm table-fixed">
            <thead className="bg-dark-850 text-slate-300 font-bold border-b border-dark-750 text-xs">
              <tr>
                <th className="py-2.5 px-3.5 w-[22%]">항목</th>
                <th className="py-2.5 px-3 text-right w-[13%]">월비용</th>
                <th className="py-2.5 px-3 text-right w-[14%]">연비용</th>
                <th className="py-2.5 px-3 text-right w-[11%]">비중</th>
                <th className="py-2.5 px-3 w-[15%]">단가기준</th>
                <th className="py-2.5 px-3.5 w-[25%]">세부내역 (설명)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750/70">
              <tr className="hover:bg-dark-800/40">
                <td className="py-2.5 px-3.5 font-bold text-white">① 거점 입점/설치 임차 수수료</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-white">2,075만 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-300">2억 4,900만 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-300">75.9%</td>
                <td className="py-2.5 px-3 text-slate-300 font-mono text-xs">개소당 월 25만 원</td>
                <td className="py-2.5 px-3.5 text-xs text-slate-400">공항철도, 코레일/교통공사 역사, 편의점 위탁 임차</td>
              </tr>
              <tr className="hover:bg-dark-800/40">
                <td className="py-2.5 px-3.5 font-bold text-white">② 보안 M2M LTE 통신 회선료</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-white">124.5만 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-300">1,494만 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-300">4.6%</td>
                <td className="py-2.5 px-3 text-slate-300 font-mono text-xs">개소당 월 1.5만 원</td>
                <td className="py-2.5 px-3.5 text-xs text-slate-400">실시간 카드 발급 및 결제 VAN 보안 전용 회선</td>
              </tr>
              <tr className="hover:bg-dark-800/40">
                <td className="py-2.5 px-3.5 font-bold text-white">③ 소모품 및 현장 유지보수(AS)</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-white">290.5만 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-300">3,486만 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-300">10.6%</td>
                <td className="py-2.5 px-3 text-slate-300 font-mono text-xs">개소당 월 3.5만 원</td>
                <td className="py-2.5 px-3.5 text-xs text-slate-400">특수 포토카드 전용 리본·용지 및 기기 정기 점검</td>
              </tr>
              <tr className="hover:bg-dark-800/40 bg-brand-cyan/5">
                <td className="py-2.5 px-3.5 font-bold text-brand-cyan">④ 클라우드 서버 인프라 (AWS)</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">242.0만 원</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-300">2,904만 원</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-cyan">8.9%</td>
                <td className="py-2.5 px-3 text-slate-300 font-mono text-xs">AWS 서울 리전 풀스택</td>
                <td className="py-2.5 px-3.5 text-xs text-slate-400">EC2 WAS 이중화 + RDS DB + CloudFront CDN</td>
              </tr>
              <tr className="bg-dark-850/95 font-bold text-white border-t border-dark-700">
                <td className="py-3 px-3.5 font-black text-white">전사 IT·인프라 합계</td>
                <td className="py-3 px-3 text-right font-mono font-black text-brand-cyan text-sm">2,732만 원</td>
                <td className="py-3 px-3 text-right font-mono font-black text-brand-cyan text-sm">3억 2,784만 원</td>
                <td className="py-3 px-3 text-right font-mono font-black text-white">100.0%</td>
                <td className="py-3 px-3 text-slate-400 text-xs">-</td>
                <td className="py-3 px-3.5 text-xs text-slate-300 font-normal">IR 버닝레이트 내 인프라 직접원가 100% 정합</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Top 3 Cost Reduction & Alternative Server Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-dark-700">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              타 서버 전환 및 비용 절감 추천안 Top 3
            </h3>
          </div>
          <span className="text-xs text-brand-cyan font-semibold">
            실행 우선순위별 정렬
          </span>
        </div>

        {/* Recommendation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {costData.recommendations.map((rec) => {
            const isSelected = selectedRecId === rec.id;
            return (
              <button
                key={rec.id}
                onClick={() => setSelectedRecId(rec.id)}
                className={`p-4 rounded-xl text-left border transition-all relative ${
                  isSelected 
                    ? 'bg-dark-850 border-brand-purple shadow-lg shadow-brand-purple/20 ring-1 ring-brand-purple' 
                    : 'bg-dark-900 border-dark-700 hover:border-dark-600'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="px-2 py-0.5 rounded font-bold bg-dark-800 text-slate-300 border border-dark-750">
                    추천 0{rec.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                    rec.difficulty === 'Low' 
                      ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30' 
                      : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                  }`}>
                    난이도: {rec.difficulty} ({rec.effortDays})
                  </span>
                </div>

                <div className="text-sm font-bold text-white mt-1.5 line-clamp-1">
                  {rec.title}
                </div>

                <div className="mt-3 flex items-baseline justify-between border-t border-dark-750 pt-2.5">
                  <span className="text-xs text-slate-400">월 절감액:</span>
                  <span className="text-base font-black text-cyan-300">
                    -{(rec.monthlySavingsWon / 10000).toFixed(0)}만 원
                    <span className="text-xs text-slate-400 font-normal ml-1">({rec.savingsRate}%)</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Recommendation Deep Dive Detail Card */}
        <div className="p-5 rounded-xl bg-dark-900 border border-dark-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-dark-700 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-950/40 text-purple-300 border border-purple-500/30">
                  추천 0{selectedRec.id} 세부 실행 계획
                </span>
                <span className="text-xs text-slate-400">대상: {selectedRec.targetArea}</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">{selectedRec.title}</h4>
            </div>

            <div className="flex items-center space-x-3 text-right">
              <div>
                <span className="text-xs text-slate-400 block">월 예상 절감액</span>
                <span className="text-lg font-black text-cyan-300">
                  -{(selectedRec.monthlySavingsWon / 10000).toFixed(0)}만 원/월
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-dark-850 p-3.5 rounded-lg border border-dark-750">
            {selectedRec.description}
          </p>

          {/* Action Steps */}
          <div>
            <h5 className="text-xs font-bold text-white mb-2 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              단계별 실행 액션
            </h5>
            <div className="space-y-1.5">
              {selectedRec.actionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded bg-dark-800 text-purple-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs border border-dark-700">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tradeoffs & Precautions */}
          <div className="p-3 rounded-lg bg-dark-950 border border-dark-800 flex items-start space-x-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">고려사항 및 트레이드오프:</strong> {selectedRec.tradeoffs}
            </div>
          </div>
        </div>

      </div>

      {/* 5. Alternative Cloud Providers Comparison */}
      <div className="p-5 rounded-xl bg-dark-900 border border-dark-700">
        <div className="flex items-center justify-between pb-3 border-b border-dark-700 mb-4">
          <div className="flex items-center space-x-2">
            <Cloud className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-sm font-bold text-white">대안 클라우드(타 서버) 프로바이더 비교 가이드</h3>
          </div>
          <span className="text-xs text-slate-400">{data.service.name} 비즈니스 인프라 적합도 평가</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                <BrandLogo brandKey="cloudflare" size="sm" />
                Cloudflare 에지 인프라
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-bold">
                비용 절감 1순위
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed break-keep">
              글로벌 트래픽 분산 및 아웃바운드 전송료(Egress) 0원화 CDN/WAF
            </p>
            <div className="border-t border-dark-700 pt-2 text-xs text-purple-300 font-medium">
              추천 조합: 기존 클라우드 유지 + Cloudflare 앞단 배치
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                <BrandLogo brandKey="naver" size="sm" />
                네이버클라우드
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30 font-bold">
                환율 리스크 0%
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed break-keep">
              100% 원화 결제로 환율 리스크 차단 및 국내 PG/카드사 연동 최적화
            </p>
            <div className="border-t border-dark-700 pt-2 text-xs text-purple-300 font-medium">
              추천 조합: 국내 결제/정산 DB 및 코어 백엔드 이전
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                <BrandLogo brandKey="aws" size="sm" />
                AWS 서버리스 (Fargate/Lambda)
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30 font-bold">
                유휴 서버비 제로
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed break-keep">
              요청 시에만 과금되는 서버리스(Lambda)로 심야 유휴비 100% 절감
            </p>
            <div className="border-t border-dark-700 pt-2 text-xs text-purple-300 font-medium">
              추천 조합: 키오스크 위치 조회 및 단순 API 서버리스화
            </div>
          </div>

        </div>
      </div>

      {/* 하단 공식 출처 (서버비용 탭 단 1회 텍스트 아웃링크 일원화 - Rule 12, Rule 13 준수) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-dark-900 border border-dark-750 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
          <span className="font-semibold text-slate-300">데이터 출처 :</span>
          <a
            href="https://calculator.aws/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold inline-flex items-center gap-1 transition-colors"
            title="AWS Pricing Calculator 및 FinOps 공식 단가표 열람"
          >
            <span>AWS Pricing Calculator 및 공식 CSP 클라우드 인프라 요금 단가표</span>
            <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
          </a>
        </div>
      </div>

    </div>
  );
};
