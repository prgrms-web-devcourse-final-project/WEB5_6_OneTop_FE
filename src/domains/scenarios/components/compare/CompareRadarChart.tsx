"use client";

import { RadarChartCore } from "@/share/components/RaderChartCore";
import { RadarChartProps } from "../../types";

export const CompareRadarChart = ({ data }: RadarChartProps) => {
  // Recharts 형태로 데이터 변환
  const chartData = data.labels.map((label, index) => ({
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
      <div className="h-[430px] w-full mb-6">
        <RadarChartCore
          data={chartData}
          showIdeal={!!data.datasets[1]}
          showLegend={true}
          currentLabel={data.datasets[0]?.label || "현재"}
          idealLabel={data.datasets[1]?.label || "평행우주"}
        />
      </div>
    </div>
  );
};
