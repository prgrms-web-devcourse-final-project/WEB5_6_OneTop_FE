export interface AnalysisData {
  economy: string;
  health: string;
  relationships: string;
  jobs: string;
  happiness: string;
  aiInsight: string;
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
}

export interface RadarData {
  labels: string[];
  datasets: Dataset[];
}

export interface TimelineItem {
  year: number;
  title: string;
}

export interface ScenarioData {
  analysis: AnalysisData;
  radarData: RadarData;
  events: TimelineItem[];
  imageUrl?: string;
  job?: string;
  description?: string;
}

export interface AnalysisProps {
  data: {
    economy: string;
    health: string;
    relationships: string;
    jobs: string;
    happiness: string;
  };
}

export interface RadarChartProps {
  data: RadarData;
  aiInsight: string;
}

export interface ChartDataPoint {
  subject: string;
  current: number;
  ideal: number;
  fullMark: number;
}

export interface TimelineProps {
  data: TimelineItem[];
}

export interface CompareTimelineProps {
  data: CompareTimelineItem[];
}

// DecisionLine 생성 요청
export interface CreateDecisionLineRequest {
  userId: number;
  baseLineId: number;
  pivotOrd?: number; // 피벗 순번 (0부터)
  pivotAge?: number; // 피벗 나이
  selectedAltIndex: number; // 0 또는 1
  category?: string;
  situation?: string;
  options?: string[];
  selectedIndex?: number;
  description?: string;
}

// DecisionLine 응답
export interface DecisionLineResponse {
  decisionLineId: number;
  status: string;
}

// Scenario 생성 요청
export interface CreateScenarioRequest {
  decisionLineId: number;
}

// Scenario 생성 응답
export interface CreateScenarioResponse {
  scenarioId: number;
  status: string;
  message: string;
}

// Scenario 상태 응답
export interface ScenarioStatusResponse {
  scenarioId: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  message: string;
}

// Scenario 정보 응답
export interface ScenarioInfoResponse {
  scenarioId: number;
  status: string;
  job: string;
  total: number;
  summary: string;
  description: string;
  img: string;
  createdDate: string;
  indicators: Array<{
    type: string;
    point: number;
    analysis: string;
  }>;
}

// Timeline 응답
export interface TimelineResponse {
  scenarioId: number;
  events: Array<{
    year: number;
    title: string;
  }>;
}

export interface IndicatorComparison {
  type: string;
  baseScore: number;
  compareScore: number;
  analysis: string;
}

export interface ScenarioCompareResponse {
  baseScenarioId: number;
  compareScenarioId: number;
  overallAnalysis: string;
  indicators: IndicatorComparison[];
}

export interface CompareTimelineItem {
  year: number;
  title: string;
  type: "base" | "compare";
}
