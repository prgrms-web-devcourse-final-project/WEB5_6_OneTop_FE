"use client";

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface ChartDataPoint {
  subject: string;
  current: number;
  ideal?: number;
  fullMark: number;
}

export interface RadarChartCoreProps {
  data: ChartDataPoint[];
  showIdeal?: boolean;
  showLegend?: boolean;
  currentLabel?: string;
  idealLabel?: string;
}

export const RadarChartCore = ({
  data,
  showIdeal = false,
  showLegend = true,
  currentLabel = "현재",
  idealLabel = "평행우주",
}: RadarChartCoreProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 14, fill: "#303030" }}
          tickCount={5}
          className="text-sm font-medium"
        />
        <PolarRadiusAxis
          angle={2}
          domain={[0, 10]}
          tick={{ fontSize: 10, fill: "#9CA3AF" }}
        />
        {/* 현재 */}
        <Radar
          name={currentLabel}
          dataKey="current"
          stroke="#e76f51"
          fill="#e76f51"
          fillOpacity={0.6}
          strokeWidth={1}
          strokeOpacity={0.6}
          activeDot={false}
        />
        {/* 평행우주 */}
        {showIdeal && (
          <Radar
            name={idealLabel}
            dataKey="ideal"
            stroke="#FFC823"
            fill="#FFC823"
            fillOpacity={0.6}
            strokeWidth={1}
            strokeOpacity={0.6}
          />
        )}
        {showLegend && (
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
            iconType="circle"
            iconSize={8}
            align="center"
            verticalAlign="bottom"
            layout="vertical"
          />
        )}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};
