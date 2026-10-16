export interface TargetService {
  domain: string;
  appPackage?: string;
  name: string;
  category: string;
  url: string;
  inputUrl?: string;
  redirectUrl?: string;
  sourceUrl?: string;
  appStoreUrl?: string;
  iosAppStoreUrl?: string;
  verifiedAt: string;
  hasApp?: boolean;
}

export interface TrafficMetrics {
  totalVisits: number;
  globalRank: number;
  categoryRank: number;
  categoryName: string;
  bounceRate: number;
  pagesPerVisit: number;
  avgDuration: string;
  searchShare: number;
  directShare: number;
  referralShare: number;
  asOfDate?: string;
  mtdDays?: number;
  mtdCumulativeVisits?: number;
  dailyAvgVisits?: number;
}

export interface ReviewItem {
  id: string;
  rating: number;
  sentiment: 'positive' | 'negative';
  author: string;
  category: string;
  date: string;
  content: string;
  summaryPoint: string;
}

export interface AppMetrics {
  downloads: string;
  rating: number;
  reviewCount: string;
  category: string;
  positiveShare?: number;
  negativeShare?: number;
  ratingDistribution?: {
    star5: number;
    star4: number;
    star3: number;
    star2: number;
    star1: number;
  };
  representativeReviews?: {
    positive: ReviewItem[];
    negative: ReviewItem[];
  };
}

export interface CountryShare {
  code: string;
  name: string;
  share: number;
  flag: string;
  chinaShare?: number;
  chinaShareOfEtc?: number;
}

export interface TopPage {
  path: string;
  name: string;
  share: number;
  role: string;
}

export interface ConsistencyAudit {
  score: number;
  grade: 'High' | 'Medium' | 'Low';
  statusText: string;
  summary: string;
  evidenceItems: string[];
}

export interface CompetitorComparison {
  name: string;
  scale: string;
  positioning: string;
  keyStrength: string;
  weakness: string;
  cardBase: string;
}

export interface BenchmarkingItem {
  id: number;
  title: string;
  category: string;
  impact: 'Critical' | 'High' | 'Medium';
  effort: 'Low' | 'Medium' | 'High';
  description: string;
  actionPlan: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MonthlyTrafficRecord {
  period: string; // e.g. "2026-08"
  year: number;
  month: number;
  visits: number;
  bounceRate: number;
  pagesPerVisit: number;
  searchShare: number;
  topCountry: string;
  topCountryShare: number;
  note?: string;
  mtdDays?: number;
  mtdCumulativeVisits?: number;
  periodRange?: string;
}

export interface SearchKeywordItem {
  rank: number;
  keyword: string;
  portal: string;
  share: number;
  estimatedVisits: number;
  intent: string;
  country?: string;
}

export interface SearchPortalShare {
  name: string;
  share: number;
  icon?: string;
}

export interface CountrySearchIntelligence {
  countryCode: string;
  countryName: string;
  flag: string;
  shareOfSearch: number;
  mainPortals: SearchPortalShare[];
  keywords: SearchKeywordItem[];
}

export interface ServerCostItem {
  category: string;
  provider: string;
  spec: string;
  monthlyCostWon: number;
  share: number;
}

export interface CostSavingRecommendation {
  id: number;
  title: string;
  targetArea: string;
  currentCostWon: number;
  expectedCostWon: number;
  monthlySavingsWon: number;
  savingsRate: number;
  difficulty: 'Low' | 'Medium' | 'High';
  effortDays: string;
  description: string;
  actionSteps: string[];
  tradeoffs: string;
}

export interface ServerCostIntelligence {
  inferredProvider: string;
  ipAddress: string;
  cdnProvider: string;
  webServer: string;
  currentMonthlyTotalWon: number;
  annualTotalWon: number;
  potentialMonthlySavingsWon: number;
  potentialAnnualSavingsWon: number;
  costBreakdown: ServerCostItem[];
  recommendations: CostSavingRecommendation[];
}

export interface MarketingPillar {
  id: string;
  title: string;
  targetPortal: string;
  budget: string;
  timeline: string;
  goal: string;
  iconName?: string;
  accentColor: string;
  badgeColor: string;
  keyPoint: string;
  coreActions: string[];
}

export interface MarketingKeywordStrategy {
  rank: number;
  keyword: string;
  portal: string;
  country: string;
  channel: string;
  action: string;
  impact: string;
}

export interface MarketingRoadmapWeek {
  week: string;
  title: string;
  budget: string;
  actions: string[];
}

export interface MarketingStrategyIntelligence {
  summaryGoal?: string;
  pillars: MarketingPillar[];
  keywordMatrix: MarketingKeywordStrategy[];
  roadmap: MarketingRoadmapWeek[];
}

export interface ChannelMetricItem {
  id: 'web' | 'android' | 'ios';
  name: string;
  type: 'Web' | 'Google Play' | 'App Store';
  url: string;
  primaryMetric: string;
  primaryValue: string;
  subMetric: string;
  subValue: string;
  rating?: number;
  reviews?: string;
  badge: string;
}

export interface OmnichannelAggregate {
  webUrl: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  monthlyWebVisits?: string;
  totalInstalls: string;
  totalMonthlyReach?: string;
  blendedRating: number;
  totalReviews: string;
  channels: ChannelMetricItem[];
}

export interface DataConflictRecord {
  corporateId: string;
  metricName: string;
  targetPeriod: string;
  statementType: '연결' | '별도' | '확인 불가';
  existingValue: string | number | null;
  newValue: string | number | null;
  reason: string;
  resolution: 'preserved_existing' | 'verified_override' | 'flagged';
  timestamp: string;
}

export interface FinancialYearRecord {
  year: number;
  periodLabel?: string;
  corporateId?: string;
  statementType?: '연결' | '별도' | '확인 불가';
  currencyUnit?: string;
  sourceUrl?: string;
  docTitle?: string;
  extractionBasis?: string;
  conflictNotice?: string;
  revenueWon: number | null;
  revenueText: string;
  operatingProfitWon: number | null;
  operatingProfitText: string;
  netProfitWon: number | null;
  netProfitText: string;
  // 버닝레이트 & 재무현황 런웨이 공식 필드
  employeeCount?: number;
  avgSalaryManwon?: number;
  avgSalaryText?: string;
  overheadMultiplier?: number;
  burnRateWon?: number;
  burnRateText?: string;
  investmentWon?: number | null;
  investmentText?: string;
  remainingBalanceWon?: number;
  remainingBalanceText?: string;
  grossCashWon?: number;
  grossCashText?: string;
  sgiDeductionWon?: number;
  sgiDeductionText?: string;
  cumulativeCashWon?: number;
  cumulativeCashText?: string;
  statusNote?: string;
  // 상시근로자 추적 메타데이터
  employeeTracking?: EmployeeTrackingRecord;
}

export type EmployeeSourceType = 'NPS' | 'NICE' | 'KODATA' | 'SARAMIN' | 'NONE';
export type EmployeeMeasureType = '국민연금 가입자 수' | '고용보험 피보험자 수' | '기업정보 DB 종업원 수' | 'N/A';
export type EmployeeDataStatus = 'VERIFIED' | 'ESTIMATED' | 'UNKNOWN' | 'STALE' | 'MATCH_REVIEW_REQUIRED';
export type EmployeeErrorCode = 'AUTH_FAILED' | 'NOT_FOUND' | 'RATE_LIMIT' | 'NETWORK_ERROR' | 'ZERO_EMPLOYEES' | null;

export interface EmployeeTrackingRecord {
  employee_count: number | null;
  employee_source: EmployeeSourceType;
  employee_reference_date: string; // YYYY.MM 또는 YYYYMM
  employee_measure_type: EmployeeMeasureType;
  employee_data_status: EmployeeDataStatus;
  employee_match_confidence: number; // 0.0 ~ 1.0
  employee_last_checked_at: string; // ISO 8601
  employee_source_record_id?: string;
  employee_error_code?: EmployeeErrorCode;
  workplace_name?: string;
  workplace_address?: string;
}

export interface InvestmentRoundItem {
  id: number;
  period: string;
  round: string;
  confirmedAmount: string;
  partnerName: string;
  partnerDomain?: string;
  partnerKey?: string;
  status: 'confirmed' | 'undisclosed' | 'target';
  description?: string;
  employeeCountAtTime?: number;
  burnRateAtTime?: string;
  sourceUrl?: string;
  sourceName?: string;
  docTitle?: string;
  corporateId?: string;
}

export interface ShareholderItem {
  id: number;
  name: string;
  role: string;
  shareRatio: number;
  shareText: string;
  companyName: string;
  companyDomain?: string;
  companyKey?: string;
  secondaryKey?: string;
  secondaryDomain?: string;
  partnerLogos?: string[];
  note?: string;
}

export interface FranchiseDisclosureInfo {
  brandName: string;
  headquarters: string;
  businessNumber: string;
  representative: string;
  ftcDisclosureUrl: string; // https://franchise.ftc.go.kr/index.do
  myFranchiseUrl: string; // https://myfranchise.kr/
  franchiseStoreCount?: number;
  initialInvestmentCostText?: string;
  industryCategory?: string;
  slogan?: string;
  registrationStatus: '등록완료' | '정보공개서 열람가능' | '심사중' | '미등록';
  registrationNo?: string;
}

export interface CorporateIrIntelligence {
  companyName: string;
  businessNumber?: string;
  companyAddress?: string;
  representative?: string;
  sourceName: string;
  sourceUrl: string;
  isDartAudited?: boolean;
  disclosureType?: 'dart' | 'startup_db' | 'franchise_ftc' | 'unconfirmed';
  sourceBadge?: string;
  financialHistory: FinancialYearRecord[];
  investments: InvestmentRoundItem[];
  shareholders?: ShareholderItem[];
  valuationGoal?: string;
  highlightNote?: string;
  burnRateFormulaNote?: string;
  conflictHistory?: DataConflictRecord[];
  employeeTracking?: EmployeeTrackingRecord;
  franchiseInfo?: FranchiseDisclosureInfo;
}

export interface AppScreenDwellItem {
  rank: number;
  screenName: string;
  screenRoute: string;
  category: string;
  avgDwellTime: string;
  avgDwellSeconds: number;
  dwellShare: number;
  sessionReachRate: number;
  monthlyScreenSessions: number;
  monthlyPageViews?: number;
  exitRate: number;
  coreAction: string;
}

export interface MobileAppTrafficIntelligence {
  appName: string;
  packageId: string;
  iosAppId: string;
  mau: number;
  dau: number;
  stickiness: number;
  monthlySessions: number;
  sessionsPerUser: number;
  avgSessionDuration: string;
  avgSessionSeconds: number;
  iosShare: number;
  androidShare: number;
  webVsAppMultiple: string;
  trackingMethodology: string;
  screenDwellList: AppScreenDwellItem[];
  countries?: CountryShare[];
}

export interface PartnerAgency {
  brandKey: string;
  name: string;
}

export interface ServiceRevenueRecord {
  id: string;
  year: number;
  yearMonth: string;
  category: '일반' | 'IP' | '제휴' | '핵심BM' | '제품매출' | '상품매출';
  title: string;
  subTitle: string;
  partners: PartnerAgency[];
  salesVolume: number; // 판매/이용 건수 (건 또는 장)
  cardSalesKrW: number; // 메인 결제/거래액 (억원)
  rechargeFeeKrW: number; // 수수료/플랫폼 수익 (억원)
  totalRevenueKrW: number; // 총 매출/수익 (억원)
  sourceUrl?: string;
}

export interface ServiceRevenueIntelligence {
  modelName: string;
  coreBmDescription: string;
  records: ServiceRevenueRecord[];
}

export interface ContractedStrategyItem {
  id: string;
  partnerName: string;
  category: string;
  revenueEngine: string; // ① 판매 / ② 결제 / ③ 충전 또는 플랫폼 엔진
  engineNumber: string;
  currentBase: string; // 현재 협약 기반
  actionPlan: string; // 즉시 실행 고도화안
  estimatedCost: string; // 예상 투입 예산
  costDetail: string; // 비용 세부 내역
  expectedImpact: string; // 기대 성과 및 회수
  readiness: 'immediate' | 'short-term';
}

export interface PendingStrategyItem {
  id: string;
  targetName: string;
  category: string;
  revenueEngine: string; // ① 판매 / ② 결제 / ③ 충전 또는 신규 파이프라인
  engineNumber: string;
  prerequisiteTask: string; // 필수 선행 과제 (제휴 조건)
  proposedSolution: string; // 제휴 제안 내용
  expectedImpact: string; // 제휴 성사 시 기대 성과
  partnershipStatus: 'pending'; // 선행 필요
}

export interface BusinessStrategyIntelligence {
  summary: string;
  summaryBudget?: string;
  contractedStrategies: ContractedStrategyItem[];
  pendingStrategies?: PendingStrategyItem[];
}

export interface ProposalGuide {
  subject: string;
  proposalDraft: string;
}

export interface SalesPartnerItem {
  id: string;
  category: 'existing' | 'prospective';
  name: string;
  englishName: string;
  logo?: string;
  industry: string;
  proposalEmail: string;
  strategyType: 'enhancement' | 'derivative' | 'prospective';
  strategyTypeLabel: string;
  challenge: string;
  solution: string;
  expectedImpact: string;
  targetAudience: string;
  proposalGuide: ProposalGuide;
}

export interface SalesStrategyIntelligence {
  summary: string;
  partners: SalesPartnerItem[];
}

export interface SnsPostItem {
  title: string;
  description: string;
  uploadDate: string;
  mediaType: string;
  postUrl: string;
  views: string;
  likes: string;
  comments: string;
  hashtags: string[];
  isRealtime?: boolean;
}

export interface SnsChannelCardData {
  id: string;
  brandKey: string;
  name: string;
  handle: string;
  channelUrl: string;
  categoryBadge: string;
  target: string;
  engagementRate: string;
  formulaDetail: string;
  latestPost: SnsPostItem;
}

export interface MarketingStatusIntelligence {
  snsChannels: SnsChannelCardData[];
}

export interface CompleteServiceIntelligence {
  service: TargetService;
  traffic: TrafficMetrics;
  app: AppMetrics;
  countries: CountryShare[];
  topPages: TopPage[];
  consistency: ConsistencyAudit;
  competitors: CompetitorComparison[];
  benchmarking: BenchmarkingItem[];
  monthlyHistory?: MonthlyTrafficRecord[];
  serverCost?: ServerCostIntelligence;
  topSearchKeywords?: SearchKeywordItem[];
  countrySearchAnalysis?: CountrySearchIntelligence[];
  marketingStrategy?: MarketingStrategyIntelligence;
  omnichannel?: OmnichannelAggregate;
  irData?: CorporateIrIntelligence;
  mobileAppTraffic?: MobileAppTrafficIntelligence;
  serviceRevenueData?: ServiceRevenueIntelligence;
  businessStrategyData?: BusinessStrategyIntelligence;
  salesStrategyData?: SalesStrategyIntelligence;
  marketingStatusData?: MarketingStatusIntelligence;
}


