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
  age: number;
  title: string;
  description: string;
  scenario: string;
}

export interface ScenarioData {
  analysis: AnalysisData;
  radarData: RadarData;
  timeline: TimelineItem[];
}

export interface AnalysisProps {
  data: {
    economy: string;
    health: string;
    relationships: string;
    jobs: string;
    happiness: string;
    aiInsight: string;
  };
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
}

export interface RadarChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface RadarChartProps {
  data: RadarChartData;
}

export interface ChartDataPoint {
  subject: string;
  current: number;
  ideal: number;
  fullMark: number;
}

export interface TimelineProps {
  data: Array<{
    year: number;
    age: number;
    title: string;
    description: string;
    scenario: string;
    className?: string;
  }>;
}
