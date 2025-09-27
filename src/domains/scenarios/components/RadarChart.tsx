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
import { ChartDataPoint, RadarChartProps } from "../types";

export const RadarChart = ({ data }: RadarChartProps) => {
  // Recharts 형태로 데이터 변환
  const chartData: ChartDataPoint[] = data.labels.map((label, index) => ({
    subject: label,
    current: data.datasets[0]?.data[index] || 0,
    ideal: data.datasets[1]?.data[index] || 0,
    fullMark: 100,
  }));

  return (
    <div className="bg-white p-7 rounded-lg border border-gray-200">
      <div className="flex items-center mb-7">
        <h2 className="text-[22px] font-semibold">레이더 차트</h2>
      </div>

      {/* 차트 영역 */}
      <div className="h-[500px] w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={chartData}
          >
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
              name={data.datasets[0]?.label || "현재"}
              dataKey="current"
              stroke="#e76f51"
              fill="#e76f51"
              fillOpacity={0.6}
              strokeWidth={1}
              strokeOpacity={0.6}
              activeDot={false}
            />
            {/* 평행우주 */}
            {/* {data.datasets[1] && (
              <Radar
                name={data.datasets[1].label}
                dataKey="ideal"
                stroke="#FFC823"
                fill="#FFC823"
                fillOpacity={0.6}
                strokeWidth={1}
                strokeOpacity={0.6}
              />
            )} */}
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
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
