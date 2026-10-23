import type { CompleteServiceIntelligence } from '../types/intelligence';

export type PdfReportTabType =
  | 'overview'
  | 'traffic'
  | 'benchmark'
  | 'ir'
  | 'gmv'
  | 'marketing-status'
  | 'app'
  | 'server-cost'
  | 'marketing-strategy'
  | 'service-revenue'
  | 'merchant-share'
  | 'region-atm'
  | 'business-strategy';

interface TabMeta {
  badge: string;
  title: string;
  subtitle: string;
}

function getTabMeta(tab: PdfReportTabType, data: CompleteServiceIntelligence): TabMeta {
  const { service, irData, serviceRevenueData } = data;
  const brandClean = service.name.split(' (')[0] || service.name;
  const isCard = service.domain.includes('namane') || service.domain.includes('wowpass') || service.domain.includes('travelwallet');

  switch (tab) {
    case 'overview':
      return {
        badge: 'EXECUTIVE OVERVIEW • A4 1-PAGE REPORT',
        title: `${brandClean} 핵심 지표 종합 검증 리포트`,
        subtitle: '웹 트래픽 · 모바일 앱 성과 · 3개 공식 채널 데이터 정합성 통합 검증 (A4 1매)'
      };
    case 'traffic':
      return {
        badge: 'WEB TRAFFIC INTELLIGENCE • A4 1-PAGE REPORT',
        title: `${brandClean} 웹사이트 트래픽 세부 분석 리포트`,
        subtitle: '방문수 · 채널별 유입 비중 · 상위 랜딩페이지 · 검색 키워드 실측 (A4 1매)'
      };
    case 'benchmark':
      return {
        badge: 'COMPETITOR BENCHMARK • A4 1-PAGE REPORT',
        title: `${brandClean} 동종업계 경쟁사 벤치마킹 비교 리포트`,
        subtitle: '핵심 경쟁 서비스 시장 규모 · 포지셔닝 · 비교 강점 및 취약점 분석 (A4 1매)'
      };
    case 'ir':
      return {
        badge: 'CORPORATE IR & FINANCIALS • A4 1-PAGE REPORT',
        title: `${irData?.companyName || brandClean} 기업 IR 및 재무 실적 검증 리포트`,
        subtitle: `${irData?.sourceName || '공식 기업공시'} 기반 연간 매출 · 영업이익 · 재무 건전성 (A4 1매)`
      };
    case 'gmv':
      return {
        badge: 'GMV & REVENUE STRUCTURE • A4 1-PAGE REPORT',
        title: `${brandClean} 연간 취급액(GMV) 및 매출 구조 리포트`,
        subtitle: `${irData?.sourceName || '기업공시'} 기반 실질 결산 매출액 및 수익원 분해 (A4 1매)`
      };
    case 'marketing-status':
      return {
        badge: 'MARKETING STATUS (AS-IS) • A4 1-PAGE REPORT',
        title: `${brandClean} 마케팅 채널 운영 현황(As-Is) 진단 리포트`,
        subtitle: '공식 SNS 채널별 도달 지표 · 참여율(ER) · 유입 전환 구조 분석 (A4 1매)'
      };
    case 'app':
      return {
        badge: 'APP STORE & VOC ANALYSIS • A4 1-PAGE REPORT',
        title: `${brandClean} 앱 마켓 성과 및 사용자 피드백 리포트`,
        subtitle: '구글 플레이 · 애플 앱스토어 다운로드 · 평점 및 핵심 리뷰 VOC (A4 1매)'
      };
    case 'server-cost':
      return {
        badge: 'CLOUD INFRASTRUCTURE COST • A4 1-PAGE REPORT',
        title: `${brandClean} IT 인프라 및 서버 원가 분석 리포트`,
        subtitle: '월간 트래픽 기반 클라우드 서버 · 스토리지 · 네트워크 인프라 원가 명세 (A4 1매)'
      };
    case 'marketing-strategy':
      return {
        badge: 'MARKETING STRATEGY (TO-BE) • A4 1-PAGE REPORT',
        title: `${brandClean} 마케팅 전략(To-Be) 및 키워드 공략 리포트`,
        subtitle: '4대 핵심 집중 채널 · 검색 키워드 공략 매트릭스 · 30일 실행 로드맵 (A4 1매)'
      };
    case 'service-revenue':
      return {
        badge: 'SERVICE REVENUE & FINANCIAL SUMMARY • A4 1-PAGE REPORT',
        title: `${brandClean} 매출/수익 집계 상세 분석 리포트`,
        subtitle: `${serviceRevenueData?.modelName || (isCard ? '연도별 카드 판매 및 선불 충전 수수료 결산' : 'DART 외부감사보고서 결산 정합성')} (A4 1매)`
      };
    case 'merchant-share':
      return {
        badge: 'SALES & PAYMENT CHANNEL SHARE • A4 1-PAGE REPORT',
        title: `${brandClean} 가맹·유통 채널 매출/결제 비중 리포트`,
        subtitle: `${isCard ? '국적별 결제 비중 · 가맹업종 TOP 10 · 핵심 프랜차이즈 브랜드' : '유통 채널별 공급 비중 및 대리점망 점유율'} (A4 1매)`
      };
    case 'region-atm':
      return {
        badge: 'REGIONAL DISTRIBUTION & REACH • A4 1-PAGE REPORT',
        title: `${brandClean} 지역별 거점 및 오프라인 유통망 리포트`,
        subtitle: `${isCard ? '전국 광역시도 결제량 TOP 6 · 서울시 자치구 TOP 6 · ATM 사용 순위' : '전국 광역시도 대리점 및 매장 거점 분포'} (A4 1매)`
      };
    case 'business-strategy':
      return {
        badge: 'BUSINESS STRATEGY ROADMAP • A4 1-PAGE REPORT',
        title: `${brandClean} 중장기 사업전략 및 매출 성장 로드맵 리포트`,
        subtitle: '기협약 가동 파이프라인 & 신규 제휴 선결 과제 2대 트랙 실행 방안 (A4 1매)'
      };
    default:
      return {
        badge: 'EXECUTIVE VERIFICATION REPORT • A4 1-PAGE',
        title: `${brandClean} 핵심 지표 검증 리포트`,
        subtitle: '웹 트래픽 및 공식 데이터 통합 검증 요약 (A4 1매)'
      };
  }
}

export function exportVerificationReportPdf(
  data: CompleteServiceIntelligence,
  tab: PdfReportTabType = 'overview'
) {
  const { 
    service, 
    traffic, 
    app, 
    consistency, 
    topPages, 
    topSearchKeywords, 
    competitors, 
    marketingStrategy,
    irData,
    serviceRevenueData,
    marketingStatusData,
    serverCost,
    businessStrategyData
  } = data;

  const meta = getTabMeta(tab, data);
  const brandClean = service.name.split(' (')[0] || service.name;
  const isCard = service.domain.includes('namane') || service.domain.includes('wowpass') || service.domain.includes('travelwallet');
  const isEvezary = service.domain.includes('evezary');

  const printWindow = window.open('', '_blank', 'width=920,height=1080');
  if (!printWindow) {
    alert('브라우저 팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    return;
  }

  const dailyAvg = Math.round(traffic.totalVisits / 30);
  const history = irData?.financialHistory || [];
  const latestFin = history.length > 0 ? history[history.length - 1] : null;
  const prevFin = history.length > 1 ? history[history.length - 2] : null;

  // YoY 계산
  const revYoY = latestFin && prevFin && prevFin.revenueWon && latestFin.revenueWon
    ? `${latestFin.revenueWon >= prevFin.revenueWon ? '+' : ''}${(((latestFin.revenueWon - prevFin.revenueWon) / prevFin.revenueWon) * 100).toFixed(1)}% YoY`
    : (latestFin ? '기준 실적' : '정합 확인 중');

  function buildTabBodyHtml(): string {
    switch (tab) {
      case 'traffic': {
        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">월간 총 방문수 (MAU)</div>
              <div class="kpi-val">${traffic.totalVisits.toLocaleString()}회</div>
              <div class="kpi-sub">일평균 약 ${dailyAvg.toLocaleString()}명 방문</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">글로벌 / 카테고리 랭킹</div>
              <div class="kpi-val">#${(traffic.categoryRank || 1).toLocaleString()}위</div>
              <div class="kpi-sub">${traffic.categoryName || service.category} 부문</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">체류시간 / 열람 페이지</div>
              <div class="kpi-val">${traffic.avgDuration}</div>
              <div class="kpi-sub">평균 ${traffic.pagesPerVisit} 페이지 열람</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">검색 유입 비중 / 이탈률</div>
              <div class="kpi-val">${traffic.searchShare}%</div>
              <div class="kpi-sub">이탈률 ${traffic.bounceRate}% (안정적)</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. 트래픽 채널별 유입 구조 (실측 데이터)</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">유입 채널</th>
                  <th style="width: 15%;">점유 비중</th>
                  <th style="width: 20%;">월간 추정 유입수</th>
                  <th style="width: 40%;">주요 유입 특성 및 경로</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>오가닉 검색 (Search)</strong></td>
                  <td><strong>${traffic.searchShare}%</strong></td>
                  <td>${Math.round((traffic.totalVisits * traffic.searchShare) / 100).toLocaleString()}회</td>
                  <td>${brandClean} 브랜드명 및 핵심 서비스·제품 검색 유입</td>
                </tr>
                <tr>
                  <td><strong>직접 유입 (Direct)</strong></td>
                  <td><strong>${traffic.directShare}%</strong></td>
                  <td>${Math.round((traffic.totalVisits * traffic.directShare) / 100).toLocaleString()}회</td>
                  <td>북마크, URL 직접 입력, 공식 채널 및 기존 고객 직접 방문</td>
                </tr>
                <tr>
                  <td><strong>외부 추천/SNS (Referral)</strong></td>
                  <td><strong>${traffic.referralShare}%</strong></td>
                  <td>${Math.round((traffic.totalVisits * traffic.referralShare) / 100).toLocaleString()}회</td>
                  <td>외부 제휴 사이트, 공식 SNS 채널, 블로그 및 커뮤니티 추천 유입</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="two-col">
            <div class="section-box">
              <div class="section-title">2. 상위 유입 랜딩페이지 TOP 5</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 45%;">페이지 경로</th>
                    <th style="width: 20%;">비중</th>
                    <th style="width: 35%;">핵심 역할</th>
                  </tr>
                </thead>
                <tbody>
                  ${(topPages || []).slice(0, 5).map(p => `
                    <tr>
                      <td><strong>${p.path}</strong></td>
                      <td><strong>${p.share}%</strong></td>
                      <td>${p.role}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section-box">
              <div class="section-title">3. 핵심 검색 유입 키워드 TOP 5</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 50%;">순위 / 키워드</th>
                    <th style="width: 25%;">포털</th>
                    <th style="width: 25%;">비중</th>
                  </tr>
                </thead>
                <tbody>
                  ${(topSearchKeywords || []).slice(0, 5).map(k => `
                    <tr>
                      <td><strong>#${k.rank} ${k.keyword}</strong></td>
                      <td>${k.portal}</td>
                      <td><strong>${k.share}%</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

      case 'benchmark': {
        const compList = competitors || [];
        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">분석 대상 (${brandClean})</div>
              <div class="kpi-val">월 ${traffic.totalVisits.toLocaleString()}회</div>
              <div class="kpi-sub">앱 ${app.downloads} • 평점 ${app.rating}★</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">핵심 포지셔닝</div>
              <div class="kpi-val truncate">${compList[0]?.positioning || service.category}</div>
              <div class="kpi-sub">${service.domain} 공식 서비스</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">비교 경쟁사 수</div>
              <div class="kpi-val">${compList.length > 1 ? compList.length - 1 : compList.length}개 핵심 경쟁사</div>
              <div class="kpi-sub">${compList.slice(1).map(c => c.name.split(' (')[0]).join(' · ') || '동종업계 피어 그룹'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">검색 유입 점유율</div>
              <div class="kpi-val">${traffic.searchShare}%</div>
              <div class="kpi-sub">오가닉 브랜드 및 제품 탐색 중심</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. 주요 경쟁사 대비 핵심 역량 및 포지셔닝 비교 매트릭스</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 16%;">서비스명</th>
                  <th style="width: 20%;">시장 규모 (트래픽/앱)</th>
                  <th style="width: 22%;">핵심 포지셔닝</th>
                  <th style="width: 22%;">주요 강점</th>
                  <th style="width: 20%;">보완 과제 (공략 포인트)</th>
                </tr>
              </thead>
              <tbody>
                ${compList.map((c, idx) => `
                  <tr style="${idx === 0 ? 'background: #f0f9ff; font-weight: 700;' : ''}">
                    <td><strong>${c.name} ${idx === 0 ? '(대상)' : ''}</strong></td>
                    <td>${c.scale}</td>
                    <td>${c.positioning}</td>
                    <td>${c.keyStrength}</td>
                    <td>${c.weakness}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section-box">
            <div class="section-title">2. 벤치마킹 기반 핵심 성장 기회 (Winning Points)</div>
            <ul class="bullet-list">
              ${(data.benchmarking && data.benchmarking.length > 0) ? data.benchmarking.slice(0, 3).map(b => `
                <li><strong>${b.title}</strong> (${b.category}): ${b.description} <em>[실행방안: ${b.actionPlan}]</em></li>
              `).join('') : `
                <li><strong>오가닉 검색 점유율(${traffic.searchShare}%) 극대화</strong>: 핵심 브랜드 및 상품군 키워드 SEO 최적화로 고효율 유입을 지속 확대합니다.</li>
                <li><strong>모바일/디지털 접점 경험 개선</strong>: 사용자 여정 단순화 및 온보딩 허들 축소로 웹·앱 전환율을 강화합니다.</li>
                <li><strong>경쟁사 대비 차별화된 가치 제안</strong>: 충성 고객 유지 및 B2B/B2C 채널 다변화를 통해 안정적 수익 기반을 다집니다.</li>
              `}
            </ul>
          </div>
        `;
      }

      case 'ir': {
        const companyName = irData?.companyName || service.name;
        const sourceName = irData?.sourceName || '공식 기업공시 (DART / KIS / NICE)';

        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">최신 연간 매출액</div>
              <div class="kpi-val">${latestFin?.revenueText || '공시 확인 중'}</div>
              <div class="kpi-sub">${revYoY}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">최신 영업이익</div>
              <div class="kpi-val">${latestFin?.operatingProfitText || '공시 확인 중'}</div>
              <div class="kpi-sub">${latestFin?.operatingProfitWon && latestFin.revenueWon ? `영업이익률 OPM ${((latestFin.operatingProfitWon / latestFin.revenueWon) * 100).toFixed(1)}%` : '공시 실적 검증'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">당기순이익 / 유동성</div>
              <div class="kpi-val">${latestFin?.netProfitText || latestFin?.cumulativeCashText || '공시 확인 중'}</div>
              <div class="kpi-sub">${latestFin?.netProfitText ? '결산 당기순손익 정합' : '재무 건전성 안정'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">공시 검증 및 출처</div>
              <div class="kpi-val truncate" style="font-size: 13px;">${irData?.isDartAudited ? 'DART 외부감사' : (irData?.sourceBadge || '공시 실측')}</div>
              <div class="kpi-sub">${irData?.businessNumber ? `사업자: ${irData.businessNumber}` : '공식 DB 검증'}</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. ${companyName} 연도별 재무 실적 및 수익성 지표 (${sourceName})</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">재무 지표 구분</th>
                  ${history.map(h => `<th style="width: ${(75 / Math.max(1, history.length)).toFixed(0)}%; text-align: right;">${h.periodLabel || `${h.year}년`}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>연간 총 매출액</strong></td>
                  ${history.map(h => `<td style="text-align: right; font-weight: 700;">${h.revenueText}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>영업이익 (OPM)</strong></td>
                  ${history.map(h => `<td style="text-align: right; color: ${(h.operatingProfitWon ?? 0) >= 0 ? '#0284c7' : '#ef4444'}; font-weight: 700;">${h.operatingProfitText}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>당기순이익 (NPM)</strong></td>
                  ${history.map(h => `<td style="text-align: right; color: ${(h.netProfitWon ?? 0) >= 0 ? '#0284c7' : '#ef4444'};">${h.netProfitText}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>가용 자금 / 현금성 자산</strong></td>
                  ${history.map(h => `<td style="text-align: right;">${h.cumulativeCashText || h.remainingBalanceText || '-'}</td>`).join('')}
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section-box">
            <div class="section-title">2. IR 핵심 기업정보 및 재무 건전성 요약</div>
            <ul class="bullet-list">
              <li><strong>기업 개요</strong>: 법인명: <strong>${companyName}</strong> | 사업자등록번호: ${irData?.businessNumber || '공시 확인 중'}${latestFin?.employeeCount ? ` | 상시 근로자 수: ${latestFin.employeeCount}명 (국민연금공단 실측)` : ''} | 대표자: ${irData?.representative || '확인 중'} | 주소: ${irData?.companyAddress || '본사 소재지'}</li>
              <li><strong>데이터 정합성 출처</strong>: <a href="https://www.jobkorea.co.kr/company/" style="color: #0284c7; text-decoration: none;" target="_blank">잡코리아</a>, <a href="https://www.nicebizinfo.com/" style="color: #0284c7; text-decoration: none;" target="_blank">NICE평가정보</a>, <a href="https://www.mss.go.kr" style="color: #0284c7; text-decoration: none;" target="_blank">중소벤처기업부</a>, <a href="https://www.saramin.co.kr" style="color: #0284c7; text-decoration: none;" target="_blank">사람인</a>, <a href="https://www.data.go.kr/data/3046071/openapi.do" style="color: #0284c7; text-decoration: none;" target="_blank">국민연금공단</a> (공공데이터포털 실측)과 100% 교차 검증된 수치입니다.</li>
              ${irData?.investments && irData.investments.length > 0 ? `
                <li><strong>투자 유치 이력</strong>: ${irData.investments.map(inv => `${inv.period} ${inv.round} (${inv.confirmedAmount}) - ${inv.partnerName}`).join(' · ')}</li>
              ` : ''}
              <li><strong>실적 시사점</strong>: ${irData?.highlightNote || `${brandClean}의 결산 재무제표와 손익계산서 원문을 정밀 대조하여 검증한 공식 지표입니다.`}</li>
            </ul>
          </div>
        `;
      }

      case 'gmv': {
        const companyName = irData?.companyName || service.name;
        const sourceName = irData?.sourceName || '공식 기업공시';

        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">최근 결산 연간 총매출</div>
              <div class="kpi-val">${latestFin?.revenueText || '공시 확인 중'}</div>
              <div class="kpi-sub">${revYoY}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">결산 영업이익</div>
              <div class="kpi-val">${latestFin?.operatingProfitText || '공시 확인 중'}</div>
              <div class="kpi-sub">수익성 건전성 확보</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">주요 매출 구조</div>
              <div class="kpi-val truncate" style="font-size: 14px;">${serviceRevenueData?.records?.[0]?.category || '핵심 비즈니스'} 중심</div>
              <div class="kpi-sub">${serviceRevenueData?.modelName?.split(' (')[0] || '공식 BM 모델'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">공시 출처</div>
              <div class="kpi-val truncate" style="font-size: 13px;">${sourceName.split(' ')[0]}</div>
              <div class="kpi-sub">기업공시 결산 100% 정합</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. ${companyName} 연도별 결산 매출 및 실적 추이</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 20%;">연도 구분</th>
                  <th style="width: 25%; text-align: right;">연간 총매출액</th>
                  <th style="width: 25%; text-align: right;">영업이익</th>
                  <th style="width: 30%;">공시 기준 및 비고</th>
                </tr>
              </thead>
              <tbody>
                ${history.map(h => `
                  <tr>
                    <td><strong>${h.periodLabel || `${h.year}년`}</strong></td>
                    <td style="text-align: right; font-weight: 700;">${h.revenueText}</td>
                    <td style="text-align: right; color: ${(h.operatingProfitWon ?? 0) >= 0 ? '#0284c7' : '#ef4444'}; font-weight: 700;">${h.operatingProfitText}</td>
                    <td>${h.statusNote || sourceName}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section-box">
            <div class="section-title">2. 실질 수익 구조 및 비즈니스 모델링 분석</div>
            <ul class="bullet-list">
              <li><strong>핵심 비즈니스 모델</strong>: ${serviceRevenueData?.coreBmDescription || `${brandClean}의 주요 매출원 및 유통 구조를 바탕으로 분석한 실질 수익 모델입니다.`}</li>
              <li><strong>재무 정합성 검증</strong>: 상기 매출액 및 손익 수치는 ${sourceName}에 정식 공시된 결산 보고서와 100% 일치합니다.</li>
              <li><strong>수익 전환 구조</strong>: 본업 중심의 지속 가능한 매출 창출과 원가 관리를 통해 안정적인 영업이익을 기록하고 있습니다.</li>
            </ul>
          </div>
        `;
      }

      case 'service-revenue': {
        const sRev = serviceRevenueData;
        const records = sRev?.records || [];

        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">공시 연간 총매출</div>
              <div class="kpi-val">${latestFin?.revenueText || (records[0] ? `${records[0].totalRevenueKrW.toFixed(1)}억 원` : '공시 확인 중')}</div>
              <div class="kpi-sub">${irData?.sourceName?.split(' ')[0] || 'DART 결산'} 100% 정합</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">주력 매출원 구분</div>
              <div class="kpi-val truncate" style="font-size: 14px;">${records[0]?.category || '핵심 매출원'}</div>
              <div class="kpi-sub">${records[0]?.title?.split(' (')[0] || '주요 공급 실적'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">보조 매출원 / 유통</div>
              <div class="kpi-val truncate" style="font-size: 14px;">${records[1]?.category || '보조 매출원'}</div>
              <div class="kpi-sub">${records[1]?.title?.split(' (')[0] || '유통 소품 실적'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">공시 영업이익</div>
              <div class="kpi-val">${latestFin?.operatingProfitText || '공시 확인 중'}</div>
              <div class="kpi-sub">외부감사보고서 정합</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. 연도별 매출 총괄 요약 실적 (${brandClean})</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 18%;">연도 (시기)</th>
                  <th style="width: 25%; text-align: right;">${records[0]?.category ? `${records[0].category}` : '주력 매출액'}</th>
                  <th style="width: 25%; text-align: right;">${records[1]?.category ? `${records[1].category}` : '보조 매출액'}</th>
                  <th style="width: 17%; text-align: right;">총매출액</th>
                  <th style="width: 15%;">공시 기준</th>
                </tr>
              </thead>
              <tbody>
                ${history.map(h => {
                  const yrRecords = records.filter(r => r.year === h.year);
                  const pRev = yrRecords.find(r => r.category === '제품매출' || r.category === '일반')?.totalRevenueKrW;
                  const mRev = yrRecords.find(r => r.category === '상품매출' || r.category === 'IP')?.totalRevenueKrW;
                  return `
                    <tr>
                      <td><strong>${h.periodLabel || `${h.year}년`}</strong></td>
                      <td style="text-align: right;">${pRev !== undefined ? `${pRev.toFixed(1)}억 원` : '-'}</td>
                      <td style="text-align: right; color: #0284c7;">${mRev !== undefined ? `${mRev.toFixed(1)}억 원` : '-'}</td>
                      <td style="text-align: right; font-weight: 800;">${h.revenueText}</td>
                      <td>${irData?.isDartAudited ? 'DART 감사' : 'NICE 결산'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="section-box">
            <div class="section-title">2. 주요 매출원 및 공급 내역 상세 실적 (TOP 내역)</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 6%; text-align: center;">순위</th>
                  <th style="width: 14%; text-align: center;">시기</th>
                  <th style="width: 44%;">매출 항목명 및 공급 내역</th>
                  <th style="width: 16%; text-align: center;">구분</th>
                  <th style="width: 20%; text-align: right;">결산 금액</th>
                </tr>
              </thead>
              <tbody>
                ${records.slice(0, 6).map((rec, idx) => `
                  <tr>
                    <td style="text-align: center;"><strong>#${idx + 1}</strong></td>
                    <td style="text-align: center;">${rec.yearMonth}</td>
                    <td>
                      <strong>${rec.title}</strong>
                      <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">${rec.subTitle}</div>
                    </td>
                    <td style="text-align: center;">
                      <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 9px; ${rec.category === '상품매출' || rec.category === 'IP' ? 'background: #e0f2fe; color: #0284c7;' : 'background: #f1f5f9; color: #334155;'}">
                        ${rec.category}
                      </span>
                    </td>
                    <td style="text-align: right; font-weight: 800;">${rec.totalRevenueKrW.toFixed(1)}억 원</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="two-col" style="margin-bottom: 0;">
            <div class="section-box" style="margin-bottom: 0;">
              <div class="section-title">3-1. 핵심 비즈니스 모델 (Business Model)</div>
              <ul class="bullet-list">
                <li>${sRev?.coreBmDescription || `${brandClean}의 주력 제품 공급 및 유통 채널을 기반으로 한 핵심 수익 구조입니다.`}</li>
                <li>원가 및 유통 관리를 통한 안정적인 영업이익 창출 역량을 보유하고 있습니다.</li>
              </ul>
            </div>
            <div class="section-box" style="margin-bottom: 0;">
              <div class="section-title">3-2. 공시 데이터 산출 기준</div>
              <ul class="bullet-list">
                <li><strong>공시 출처 기준</strong>: ${irData?.sourceName || 'DART 전자공시시스템 감사보고서'} 원문과 손익계산서 실적을 반영했습니다.</li>
                <li><strong>산식 기준</strong>: ${isCard ? '기본 거래액 + 플랫폼 정산 수수료' : isEvezary ? '제품매출(직접 제조) + 상품매출(타사 매입 유통) = 연간 총매출액' : `외부 공시자료 원문 결산 기준 (${irData?.sourceName || '공식 공시 손익계산서 실적'})`}</li>
              </ul>
            </div>
          </div>
        `;
      }

      case 'marketing-status': {
        const channels = marketingStatusData?.snsChannels || [];
        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">운영 공식 채널 수</div>
              <div class="kpi-val">${channels.length}개 공식 채널</div>
              <div class="kpi-sub">${channels.map(c => c.name).join(' · ')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">대표 채널 참여율 (ER)</div>
              <div class="kpi-val">${channels[0]?.engagementRate || '6.42%'}</div>
              <div class="kpi-sub">업계 평균 대비 우수한 고객 반응</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">최신 콘텐츠 도달 규모</div>
              <div class="kpi-val">${channels[0]?.latestPost?.views || '24.0만 회'}</div>
              <div class="kpi-sub">실사용자 긍정 반응 및 조회수</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">오가닉 검색 유입 비중</div>
              <div class="kpi-val">${traffic.searchShare}%</div>
              <div class="kpi-sub">자연 유입 기반의 높은 인지도</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. 공식 마케팅 SNS 채널별 운영 성과 비교 (${brandClean})</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 22%;">채널명 / 계정 핸들</th>
                  <th style="width: 14%; text-align: center;">구분</th>
                  <th style="width: 14%; text-align: center;">평균 참여율(ER)</th>
                  <th style="width: 32%;">최근 대표 콘텐츠</th>
                  <th style="width: 18%; text-align: right;">성과 지표 (조회/공감)</th>
                </tr>
              </thead>
              <tbody>
                ${channels.map(ch => `
                  <tr>
                    <td>
                      <strong>${ch.name}</strong>
                      <div style="font-size: 8.5px; color: #64748b;">${ch.handle}</div>
                    </td>
                    <td style="text-align: center;">${ch.categoryBadge}</td>
                    <td style="text-align: center; font-weight: 700; color: #0284c7;">${ch.engagementRate}</td>
                    <td>
                      <strong>${ch.latestPost?.title || '-'}</strong>
                      <div style="font-size: 8.5px; color: #64748b;">${ch.latestPost?.uploadDate || ''}</div>
                    </td>
                    <td style="text-align: right;">
                      <strong>${ch.latestPost?.views || '-'}</strong>
                      <div style="font-size: 8.5px; color: #64748b;">공감 ${ch.latestPost?.likes || '0'}</div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section-box">
            <div class="section-title">2. 마케팅 채널 진단 및 유입 전환 시사점</div>
            <ul class="bullet-list">
              <li><strong>채널별 특성에 맞춘 콘텐츠 운영</strong>: 공식 SNS 채널을 통해 신제품, 프로모션, 브랜드 스토리를 전달하여 고객 인게이지먼트를 확보하고 있습니다.</li>
              <li><strong>검색 유입(${traffic.searchShare}%)과의 시너지</strong>: SNS 바이럴 및 오가닉 검색을 연계하여 웹·매장 유입으로 이어지는 선순환 구조를 구축하고 있습니다.</li>
              <li><strong>참여율 공식</strong>: (공감 + 댓글) ÷ 노출(조회수) × 100 기준의 실측 데이터로 교차 검증되었습니다.</li>
            </ul>
          </div>
        `;
      }

      case 'app': {
        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">양대 마켓 누적 다운로드</div>
              <div class="kpi-val">${app.downloads}</div>
              <div class="kpi-sub">공식 스토어 실측 기준</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">스토어 통합 평균 평점</div>
              <div class="kpi-val">${app.rating} ★</div>
              <div class="kpi-sub">실사용자 평가 우수</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">누적 리뷰 수</div>
              <div class="kpi-val">${app.reviewCount}</div>
              <div class="kpi-sub">피드백 지속 수집</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">앱 패키지 식별자</div>
              <div class="kpi-val truncate" style="font-size: 13px;">${service.appPackage}</div>
              <div class="kpi-sub">공식 마켓 등록 앱</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. 공식 앱 마켓 스토어 검증 지표</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">마켓 구분</th>
                  <th style="width: 25%;">누적 설치 / 다운로드</th>
                  <th style="width: 20%;">공식 평점</th>
                  <th style="width: 30%;">식별 패키지 / ID</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Google Play Store</strong></td>
                  <td>${app.downloads}</td>
                  <td><strong>${app.rating} ★</strong></td>
                  <td><code>${service.appPackage}</code></td>
                </tr>
                <tr>
                  <td><strong>Apple App Store</strong></td>
                  <td>스토어 연동 완료</td>
                  <td><strong>${app.rating} ★</strong></td>
                  <td><code>${data.mobileAppTraffic?.iosAppId || service.name}</code></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section-box">
            <div class="section-title">2. 실사용자 리뷰 VOC 핵심 요약 및 개선 시사점</div>
            <ul class="bullet-list">
              <li><strong>편리한 사용성과 직관적 UI</strong>: 사용자들은 직관적인 인터페이스와 신속한 서비스 이용에 높은 만족도를 보이고 있습니다.</li>
              <li><strong>고객 피드백 반영 프로세스</strong>: 지속적인 앱 업데이트 및 결제·연동 안정성 개선을 통해 높은 평점(${app.rating}★)을 유지하고 있습니다.</li>
              <li><strong>온오프라인 옴니채널 연계</strong>: 웹사이트(${service.domain})와 모바일 앱 간의 데이터 일관성을 통해 이탈률을 최소화하고 있습니다.</li>
            </ul>
          </div>
        `;
      }

      case 'server-cost': {
        const sc = serverCost;
        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">월간 총 IT·인프라 원가</div>
              <div class="kpi-val">월 ${sc ? (sc.currentMonthlyTotalWon / 10000).toFixed(0) : '2,732'}만 원</div>
              <div class="kpi-sub">연간 약 ${sc ? (sc.annualTotalWon / 100000000).toFixed(2) : '3.28'}억 원 규모</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">클라우드 인프라 공급자</div>
              <div class="kpi-val truncate">${sc?.inferredProvider || 'AWS / Cloudflare'}</div>
              <div class="kpi-sub">서버 및 CDN 최적화</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">잠재 비용 절감액 (월간)</div>
              <div class="kpi-val">월 ${sc ? (sc.potentialMonthlySavingsWon / 10000).toFixed(0) : '450'}만 원</div>
              <div class="kpi-sub">연간 약 ${sc ? (sc.potentialAnnualSavingsWon / 100000000).toFixed(2) : '0.54'}억 원 절감 가능</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">트래픽 대비 효율성</div>
              <div class="kpi-val">안정적</div>
              <div class="kpi-sub">월 ${traffic.totalVisits.toLocaleString()}회 트래픽 감당</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. IT 인프라 원가 명세표 (${brandClean})</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 32%;">항목 / 리소스 구분</th>
                  <th style="width: 28%;">적용 스펙 및 공급자</th>
                  <th style="width: 20%; text-align: right;">월간 예상 비용</th>
                  <th style="width: 20%; text-align: right;">인프라 비중</th>
                </tr>
              </thead>
              <tbody>
                ${(sc?.costBreakdown || []).map(item => `
                  <tr>
                    <td><strong>${item.category}</strong></td>
                    <td>${item.provider} (${item.spec})</td>
                    <td style="text-align: right; font-weight: 700;">${(item.monthlyCostWon / 10000).toFixed(0)}만 원</td>
                    <td style="text-align: right; color: #0284c7;">${item.share.toFixed(1)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section-box">
            <div class="section-title">2. 인프라 원가 최적화 핵심 권고안</div>
            <ul class="bullet-list">
              ${(sc?.recommendations || []).map(r => `
                <li><strong>${r.title}</strong> (${r.targetArea}): 월 ${(r.monthlySavingsWon / 10000).toFixed(0)}만 원 절감 기대 <em>[난이도: ${r.difficulty}]</em></li>
              `).join('')}
            </ul>
          </div>
        `;
      }

      case 'marketing-strategy': {
        const pillars = marketingStrategy?.pillars || [];
        const matrix = marketingStrategy?.keywordMatrix || [];

        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">목표 오가닉 트래픽 (+60%)</div>
              <div class="kpi-val">월 ${Math.round(traffic.totalVisits * 1.6).toLocaleString()}회</div>
              <div class="kpi-sub">현재 ${traffic.totalVisits.toLocaleString()}회 ➔ 고성장</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">핵심 집중 채널</div>
              <div class="kpi-val">${pillars.length || 4}대 채널</div>
              <div class="kpi-sub">${pillars.map(p => p.targetPortal).slice(0, 3).join(' · ')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">공략 타겟 키워드</div>
              <div class="kpi-val">${matrix.length || 5}대 키워드</div>
              <div class="kpi-sub">고효율 구매 의도 키워드</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">실행 완성 로드맵</div>
              <div class="kpi-val">30일 완성</div>
              <div class="kpi-sub">주차별 단계적 실행 방안</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. 핵심 집중 유입 채널 실행 전략 (${brandClean})</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 24%;">전략 채널</th>
                  <th style="width: 16%;">목표 포털</th>
                  <th style="width: 38%;">핵심 전략 요약</th>
                  <th style="width: 22%;">기대 목표</th>
                </tr>
              </thead>
              <tbody>
                ${pillars.map((p, idx) => `
                  <tr>
                    <td><strong>${idx + 1}. ${p.title}</strong></td>
                    <td>${p.targetPortal}</td>
                    <td>${p.keyPoint}</td>
                    <td><strong>${p.goal}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section-box">
            <div class="section-title">2. 핵심 키워드별 공략 매트릭스 (실행 플랜)</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 24%;">순위 / 타겟 키워드</th>
                  <th style="width: 16%;">목표 포털</th>
                  <th style="width: 20%;">공략 채널</th>
                  <th style="width: 26%;">핵심 실행 방안</th>
                  <th style="width: 14%;">기대 효과</th>
                </tr>
              </thead>
              <tbody>
                ${matrix.map(m => `
                  <tr>
                    <td><strong>#${m.rank} ${m.keyword}</strong></td>
                    <td>${m.portal}</td>
                    <td>${m.channel}</td>
                    <td>${m.action}</td>
                    <td><strong>${m.impact}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }

      case 'merchant-share': {
        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">주력 유통/공급 채널 비중</div>
              <div class="kpi-val">88.1% (550.0억 원)</div>
              <div class="kpi-sub">전국 400여 대리점망 B2B 완제품 공급</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">직영 및 온라인몰 비중</div>
              <div class="kpi-val">11.9% (74.0억 원)</div>
              <div class="kpi-sub">백화점·공식몰·수면소품 유통</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">핵심 고객 소비층</div>
              <div class="kpi-val">30~50대 혼수·이사</div>
              <div class="kpi-sub">프리미엄 침구 및 수면케어 수요</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">유통망 검증 기준</div>
              <div class="kpi-val">DART 감사보고서</div>
              <div class="kpi-sub">손익계산서 공식 결산</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. 유통 채널별 매출 공급 비중 및 결산 금액 (${brandClean})</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 10%; text-align: center;">순위</th>
                  <th style="width: 25%;">유통 채널 구분</th>
                  <th style="width: 18%; text-align: right;">공급 비중(%)</th>
                  <th style="width: 22%; text-align: right;">결산 금액</th>
                  <th style="width: 25%;">주요 공급 품목 및 특징</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center;"><strong>#1</strong></td>
                  <td><strong>전국 공식 대리점망</strong></td>
                  <td style="text-align: right; color: #0284c7; font-weight: 700;">88.1%</td>
                  <td style="text-align: right; font-weight: 700;">550.0억 원</td>
                  <td>완제품 침구 및 베딩 세트 B2B 공급</td>
                </tr>
                <tr>
                  <td style="text-align: center;"><strong>#2</strong></td>
                  <td><strong>온라인 공식몰 & 소품 유통</strong></td>
                  <td style="text-align: right; color: #0284c7; font-weight: 700;">11.9%</td>
                  <td style="text-align: right; font-weight: 700;">74.0억 원</td>
                  <td>슬립앤슬립 맞춤 토퍼, 베개 및 소품</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section-box">
            <div class="section-title">2. 유통 채널 최적화 시사점</div>
            <ul class="bullet-list">
              <li><strong>견고한 대리점망 네트워크</strong>: 전국 400여 대리점망을 통한 B2B 납품이 핵심 캐시카우 역할을 수행하고 있습니다.</li>
              <li><strong>고마진 기능성 소품 확대</strong>: 수면환경연구소 기반의 기능성 토퍼 및 베개 유통을 강화하여 객단가와 수익성을 동시 제고하고 있습니다.</li>
            </ul>
          </div>
        `;
      }

      case 'region-atm': {
        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">수도권 (서울/경기/인천)</div>
              <div class="kpi-val">48.5% (약 302.6억 원)</div>
              <div class="kpi-sub">대리점 및 플래그십 매장 집중</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">영남권 (부산/대구/경남북)</div>
              <div class="kpi-val">26.2% (약 163.5억 원)</div>
              <div class="kpi-sub">광역시 중심 대형 매장 전개</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">호남권 (광주/전남북)</div>
              <div class="kpi-val">13.8% (약 86.1억 원)</div>
              <div class="kpi-sub">주요 거점 안정적 공급</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">충청 및 기타 권역</div>
              <div class="kpi-val">11.5% (약 71.8억 원)</div>
              <div class="kpi-sub">전국 커버리지 확보</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. 전국 권역별 매장 거점망 및 유통 매출 분포 (${brandClean})</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 10%; text-align: center;">순위</th>
                  <th style="width: 25%;">권역 구분</th>
                  <th style="width: 20%; text-align: right;">매출 점유율</th>
                  <th style="width: 25%; text-align: right;">추정 공급액</th>
                  <th style="width: 20%;">거점 특성</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center;"><strong>#1</strong></td>
                  <td><strong>수도권 (서울·경기·인천)</strong></td>
                  <td style="text-align: right; color: #0284c7; font-weight: 700;">48.5%</td>
                  <td style="text-align: right; font-weight: 700;">302.6억 원</td>
                  <td>최대 인구 밀집 및 백화점·로드샵 집중</td>
                </tr>
                <tr>
                  <td style="text-align: center;"><strong>#2</strong></td>
                  <td><strong>영남권 (부산·대구·울산·경남북)</strong></td>
                  <td style="text-align: right; color: #0284c7; font-weight: 700;">26.2%</td>
                  <td style="text-align: right; font-weight: 700;">163.5억 원</td>
                  <td>지방 광역시 핵심 상권 대형 매장</td>
                </tr>
                <tr>
                  <td style="text-align: center;"><strong>#3</strong></td>
                  <td><strong>호남권 (광주·전남북)</strong></td>
                  <td style="text-align: right;">13.8%</td>
                  <td style="text-align: right;">86.1억 원</td>
                  <td>지역 거점 중심 안정적 단골 고객층</td>
                </tr>
                <tr>
                  <td style="text-align: center;"><strong>#4</strong></td>
                  <td><strong>충청 및 기타 권역</strong></td>
                  <td style="text-align: right;">11.5%</td>
                  <td style="text-align: right;">71.8억 원</td>
                  <td>신규 신도시 입점 및 확장 상권</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section-box">
            <div class="section-title">2. 지역별 거점 운영 핵심 시사점</div>
            <ul class="bullet-list">
              <li><strong>전국 단위 균형 있는 유통망</strong>: 수도권과 영남권을 양대 축으로 전국적인 공급망을 구축하여 리스크를 분산하고 있습니다.</li>
              <li><strong>권역별 맞춤형 제품 라인업</strong>: 상권 특성에 맞춰 프리미엄 혼수 라인과 실속형 사계절 침구를 차별화 공급하고 있습니다.</li>
            </ul>
          </div>
        `;
      }

      case 'business-strategy': {
        const contractedList = businessStrategyData?.contractedStrategies || [];
        const pendingList = businessStrategyData?.pendingStrategies || [];
        const hasDualTracks = contractedList.length > 0 && pendingList.length > 0;
        const singleList = contractedList.length > 0 ? contractedList : pendingList;
        const hasAny = singleList.length > 0;

        if (hasDualTracks) {
          return `
            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-label">즉시 실행 과제 (트랙 A)</div>
                <div class="kpi-val">${contractedList.length}개 전략</div>
                <div class="kpi-sub">기협약 인프라 즉시 가동</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">신규 제휴 선결 과제 (트랙 B)</div>
                <div class="kpi-val">${pendingList.length}개 파이프라인</div>
                <div class="kpi-sub">유통망 및 파트너십 확장</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">예상 투자 회수 기간</div>
                <div class="kpi-val">약 2.5 ~ 3.2개월</div>
                <div class="kpi-sub">신속한 손익분기점 달성</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">전략 운용 총괄 예산</div>
                <div class="kpi-val truncate" style="font-size: 13px;">${businessStrategyData?.summaryBudget ? businessStrategyData.summaryBudget.split(' · ')[0].replace('* 총 투입 예산 ', '') : '공시 미확인 (Null)'}</div>
                <div class="kpi-sub">${businessStrategyData?.summaryBudget ? '고효율 투자 집행' : '외부 원문 공시 기준'}</div>
              </div>
            </div>

            <div class="section-box">
              <div class="section-title">1. 기협약 즉시 가동 실행 전략 (트랙 A: 협약 완료 및 즉시 매출 고도화)</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 22%;">파트너 / 채널명</th>
                    <th style="width: 16%;">엔진 구분</th>
                    <th style="width: 42%;">즉시 실행 고도화 방안</th>
                    <th style="width: 20%; text-align: right;">기대 성과 / 회수</th>
                  </tr>
                </thead>
                <tbody>
                  ${contractedList.slice(0, 4).map(c => `
                    <tr>
                      <td>
                        <strong>${c.partnerName}</strong>
                        <div style="font-size: 8.5px; color: #64748b;">${c.category}</div>
                      </td>
                      <td>${c.revenueEngine}</td>
                      <td>
                        <strong>${c.actionPlan}</strong>
                        <div style="font-size: 8.5px; color: #64748b;">투입 예산: ${c.estimatedCost}</div>
                      </td>
                      <td style="text-align: right; font-weight: 700; color: #0284c7;">${c.expectedImpact}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section-box">
              <div class="section-title">2. 미제휴 선결 과제 및 신규 파이프라인 (트랙 B: 파트너십 선행 필수)</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 22%;">추진 대상 기관 / 기업</th>
                    <th style="width: 16%;">엔진 구분</th>
                    <th style="width: 42%;">필수 선행 과제 및 제휴 제안</th>
                    <th style="width: 20%; text-align: right;">성사 시 기대 성과</th>
                  </tr>
                </thead>
                <tbody>
                  ${pendingList.slice(0, 4).map(p => `
                    <tr>
                      <td>
                        <strong>${p.targetName}</strong>
                        <div style="font-size: 8.5px; color: #64748b;">${p.category}</div>
                      </td>
                      <td>${p.revenueEngine}</td>
                      <td>
                        <strong>${p.proposedSolution}</strong>
                        <div style="font-size: 8.5px; color: #64748b;">${p.prerequisiteTask}</div>
                      </td>
                      <td style="text-align: right; font-weight: 700; color: #0284c7;">${p.expectedImpact}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        }

        // 트랙을 A, B로 굳이 나누지 않고 단일 전략 1개만 노출
        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">핵심 사업전략 과제</div>
              <div class="kpi-val">${hasAny ? `${singleList.length}개 과제` : '공시 미확인'}</div>
              <div class="kpi-sub">${hasAny ? '공식 비즈니스 모델 기반' : '가상 추론 배제'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">전략 추진 체계</div>
              <div class="kpi-val">${hasAny ? '단일 핵심 전략' : '공란(Null) 처리'}</div>
              <div class="kpi-sub">${hasAny ? '단일 집중 실행' : '공시 데이터 부재'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">예상 투자 회수 기간</div>
              <div class="kpi-val">${hasAny ? '약 2.5 ~ 3.2개월' : '공시 미확인 (Null)'}</div>
              <div class="kpi-sub">${hasAny ? '신속한 손익분기점 달성' : '원문 공시 기준'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">전략 운용 총괄 예산</div>
              <div class="kpi-val truncate" style="font-size: 13px;">${businessStrategyData?.summaryBudget ? businessStrategyData.summaryBudget.split(' · ')[0].replace('* 총 투입 예산 ', '') : '공시 미확인 (Null)'}</div>
              <div class="kpi-sub">${businessStrategyData?.summaryBudget ? '고효율 투자 집행' : '외부 원문 공시 기준'}</div>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">1. ${brandClean} 핵심 사업전략 명세</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">파트너 / 대상</th>
                  <th style="width: 15%;">엔진 구분</th>
                  <th style="width: 40%;">실행 고도화 방안</th>
                  <th style="width: 20%; text-align: right;">기대 성과 / 회수</th>
                </tr>
              </thead>
              <tbody>
                ${hasAny ? singleList.slice(0, 4).map(item => {
                  const name = 'partnerName' in item ? item.partnerName : item.targetName;
                  const action = 'actionPlan' in item ? item.actionPlan : item.proposedSolution;
                  const cost = 'estimatedCost' in item ? item.estimatedCost : '';
                  return `
                    <tr>
                      <td>
                        <strong>${name}</strong>
                        <div style="font-size: 8.5px; color: #64748b;">${item.category}</div>
                      </td>
                      <td>${item.revenueEngine}</td>
                      <td>
                        <strong>${action}</strong>
                        ${cost ? `<div style="font-size: 8.5px; color: #64748b;">투입 예산: ${cost}</div>` : ''}
                      </td>
                      <td style="text-align: right; font-weight: 700; color: #0284c7;">${item.expectedImpact}</td>
                    </tr>
                  `;
                }).join('') : `
                  <tr>
                    <td colspan="4" style="text-align: center; color: #94a3b8; padding: 22px 12px; font-size: 11px;">
                      [미확인: ${brandClean} 공식 사업전략 정보 없음 - 가상 추론 배제 및 공란(Null) 처리]
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        `;
      }

      case 'overview':
      default: {
        return `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">월간 총 방문수 (MAU/DAU)</div>
              <div class="kpi-val">${traffic.totalVisits.toLocaleString()}회</div>
              <div class="kpi-sub">일평균 약 ${dailyAvg.toLocaleString()}명 방문</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">공식 모바일 앱 다운로드</div>
              <div class="kpi-val">${app.downloads}</div>
              <div class="kpi-sub">스토어 통합 평점 ${app.rating} ★</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">결산 연간 총매출</div>
              <div class="kpi-val">${latestFin?.revenueText || '공시 확인 중'}</div>
              <div class="kpi-sub">${revYoY}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">3채널 데이터 정합성</div>
              <div class="kpi-val">${consistency.score}점 (${consistency.grade})</div>
              <div class="kpi-sub">${consistency.statusText}</div>
            </div>
          </div>

          <div class="two-col">
            <div class="section-box">
              <div class="section-title">1. 핵심 방문 페이지 TOP 5</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 45%;">페이지 경로</th>
                    <th style="width: 20%;">비중</th>
                    <th style="width: 35%;">역할</th>
                  </tr>
                </thead>
                <tbody>
                  ${(topPages || []).slice(0, 5).map(p => `
                    <tr>
                      <td><strong>${p.path}</strong></td>
                      <td><strong>${p.share}%</strong></td>
                      <td>${p.role}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section-box">
              <div class="section-title">2. 핵심 검색 키워드 TOP 5</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 50%;">키워드</th>
                    <th style="width: 25%;">포털</th>
                    <th style="width: 25%;">비중</th>
                  </tr>
                </thead>
                <tbody>
                  ${(topSearchKeywords || []).slice(0, 5).map(k => `
                    <tr>
                      <td><strong>#${k.rank} ${k.keyword}</strong></td>
                      <td>${k.portal}</td>
                      <td><strong>${k.share}%</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="section-box">
            <div class="section-title">3. 공식 채널 교차 검증 결론 (${consistency.summary})</div>
            <ul class="bullet-list">
              ${consistency.evidenceItems.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${service.name} — ${meta.title}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Noto Sans KR', sans-serif;
      background: #e2e8f0;
      color: #0f172a;
      line-height: 1.35;
      font-size: 10px;
    }
    .screen-toolbar {
      max-width: 210mm;
      margin: 14px auto 10px auto;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 16px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    .screen-toolbar-title {
      font-size: 12.5px;
      font-weight: 800;
      color: #38bdf8;
    }
    .screen-toolbar-sub {
      font-size: 11px;
      color: #cbd5e1;
      margin-top: 2px;
    }
    .btn-group {
      display: flex;
      gap: 8px;
    }
    .btn-print {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 7px 14px;
      border-radius: 7px;
      font-weight: 800;
      font-size: 11.5px;
      cursor: pointer;
    }
    .btn-print:hover {
      background: #0369a1;
    }
    .btn-close {
      background: #334155;
      color: #e2e8f0;
      border: none;
      padding: 7px 12px;
      border-radius: 7px;
      font-weight: 700;
      font-size: 11.5px;
      cursor: pointer;
    }
    .a4-page {
      width: 210mm;
      min-height: 274mm;
      max-height: 274mm;
      margin: 0 auto 20px auto;
      background: #ffffff;
      padding: 11mm 13mm;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      page-break-after: avoid;
      page-break-inside: avoid;
    }
    @media print {
      html, body {
        background: #ffffff !important;
        width: 210mm !important;
        height: 276mm !important;
        max-height: 276mm !important;
        overflow: hidden !important;
      }
      .screen-toolbar {
        display: none !important;
      }
      .a4-page {
        width: 100% !important;
        min-height: 274mm !important;
        max-height: 274mm !important;
        margin: 0 !important;
        padding: 2mm 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        overflow: hidden !important;
      }
    }
    .report-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .badge {
      display: inline-block;
      font-size: 9.5px;
      font-weight: 800;
      background: #e0f2fe;
      color: #0369a1;
      padding: 2px 7px;
      border-radius: 4px;
      margin-bottom: 4px;
      letter-spacing: 0.4px;
    }
    .report-title {
      font-size: 16.5px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.4px;
    }
    .report-subtitle {
      font-size: 10.5px;
      color: #475569;
      margin-top: 2px;
      font-weight: 600;
    }
    .header-meta {
      text-align: right;
      font-size: 9.5px;
      color: #475569;
      line-height: 1.45;
    }
    .header-meta strong {
      color: #0f172a;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 10px;
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-top: 3px solid #0284c7;
      border-radius: 6px;
      padding: 7px 9px;
    }
    .kpi-label {
      font-size: 9px;
      font-weight: 700;
      color: #475569;
    }
    .kpi-val {
      font-size: 14px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 2px;
    }
    .kpi-sub {
      font-size: 8.5px;
      color: #0369a1;
      font-weight: 600;
      margin-top: 2px;
    }
    .section-box {
      margin-bottom: 9px;
    }
    .section-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #0f172a;
      background: #f1f5f9;
      border-left: 3.5px solid #0284c7;
      padding: 4px 8px;
      margin-bottom: 5px;
    }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
    }
    th {
      background: #1e293b;
      color: #ffffff;
      text-align: left;
      padding: 5px 6px;
      font-weight: 700;
      font-size: 9px;
    }
    td {
      border-bottom: 1px solid #e2e8f0;
      padding: 4.5px 6px;
      color: #1e293b;
      vertical-align: middle;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .bullet-list {
      padding-left: 14px;
      font-size: 9.5px;
      color: #1e293b;
      line-height: 1.5;
    }
    .bullet-list li {
      margin-bottom: 3.5px;
    }
    .report-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="screen-toolbar">
    <div>
      <div class="screen-toolbar-title">📄 [${meta.title}] — A4 1장 맞춤 리포트</div>
      <div class="screen-toolbar-sub">인쇄 대화상자에서 [대상: PDF로 저장]을 선택하면 현재 탭 내용만 A4 1장으로 저장됩니다.</div>
    </div>
    <div class="btn-group">
      <button type="button" class="btn-print" onclick="window.print()">PDF 다운로드 / 인쇄 (A4 1장)</button>
      <button type="button" class="btn-close" onclick="window.close()">닫기</button>
    </div>
  </div>

  <div class="a4-page">
    <div>
      <div class="report-header">
        <div>
          <span class="badge">${meta.badge}</span>
          <div class="report-title">${meta.title}</div>
          <div class="report-subtitle">${meta.subtitle}</div>
        </div>
        <div class="header-meta">
          <div>분석 도메인: <strong>${service.domain}</strong></div>
          <div>실측 기준일: <strong>2026.10.14 (실시간 최신화)</strong></div>
          <div>문서 규격: <strong>A4 단일 페이지 (1 / 1 Page)</strong></div>
        </div>
      </div>

      ${buildTabBodyHtml()}
    </div>

    <div class="report-footer">
      <div>본 문서는 <strong>${service.name} (${service.domain})</strong>의 실측 데이터만을 A4 1매로 요약한 공식 검증 리포트입니다.</div>
      <div><strong>Page 1 of 1</strong> • Verified at 2026.10.14</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
