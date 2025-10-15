"use client";

import { RadarChartCore } from "@/share/components/RaderChartCore";
import { FaLightbulb } from "react-icons/fa";
import { RadarChartProps } from "../types";

export const RadarChart = ({ data, aiInsight }: RadarChartProps) => {
  // Recharts 형태로 데이터 변환
  const chartData = data.labels.map((label, index) => ({
    subject: label,
    current: data.datasets[0]?.data[index] || 0,
    ideal: data.datasets[1]?.data[index] || 0,
    fullMark: 100,
  }));

  return (
    <div className="relative bg-white p-5 md:p-7 rounded-lg border border-gray-200">
      <div className="flex items-center mb-7">
        <h2 className="text-[22px] font-semibold">레이더 차트</h2>
      </div>

      {/* 차트 영역 */}
      <div className="h-[350px] sm:h-[430px] w-full mb-25 md:mb-20">
        <RadarChartCore
          data={chartData}
          showIdeal={!!data.datasets[1]}
          showLegend={false}
          currentLabel={data.datasets[0]?.label || "현재"}
          idealLabel={data.datasets[1]?.label || "평행우주"}
        />
        {/* AI 종합 분석 */}
        <div className="absolute bottom-5 md:bottom-7 w-[calc(100%-40px)] md:w-[calc(100%-56px)] mt-5 bg-gray-50 p-4 md:p-5 rounded-lg">
          <h4 className="flex items-center gap-1 text-lg font-medium mb-2">
            <FaLightbulb size={20} color="#FFC823" />
            AI 종합 분석
          </h4>
          <p className="text-gray-800 text-base break-keep">{aiInsight}</p>
        </div>
      </div>
    </div>
  );
};
