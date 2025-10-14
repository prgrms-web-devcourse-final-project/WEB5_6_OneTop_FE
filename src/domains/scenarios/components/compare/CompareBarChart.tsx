"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { PiWarningCircleFill } from "react-icons/pi";
import { Tooltip } from "@/share/components/Tooltip";
import { IndicatorComparison } from "../../types";

interface CompareBarChartProps {
  indicators: IndicatorComparison[];
}

export const CompareBarChart = ({ indicators }: CompareBarChartProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["경제", "건강", "관계", "직업", "행복"];
  const yAxisLabels = [
    "평균연봉 ",
    "스트레스",
    "사회적 네트워크",
    "성취도",
    "만족도",
  ];

  const currentIndicator = indicators.find(
    (ind) => ind.type === tabs[activeTab]
  );

  if (!currentIndicator) {
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

  // Recharts용 데이터 변환
  const chartData = [
    {
      name: "현재",
      value: currentIndicator.baseScore,
      fill: "#BDC4D4",
    },
    {
      name: "평행우주",
      value: currentIndicator.compareScore,
      fill: "#1C2E4A",
    },
  ];

  return (
    <div className="bg-white p-5 md:p-7 rounded-lg border border-gray-200">
      {/* 탭 메뉴 */}
      <div className="flex items-center justify-evenly gap-2 mb-8 bg-gray-50 rounded-full">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`flex-1 h-[50px] text-base md:text-lg rounded-full transition-all ${
              activeTab === index
                ? "bg-deep-navy text-white"
                : "bg-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 막대 그래프 */}
      <div className="h-[280px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 14, fill: "#374151" }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 14, fill: "#6B7280" }}
              axisLine={{ stroke: "#E5E7EB" }}
              label={{
                value: yAxisLabels[activeTab],
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 14, fill: "#6B7280" },
              }}
            />
            <RechartsTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              labelStyle={{ fontWeight: 600, marginBottom: "4px" }}
              formatter={(value: number) => [`${value}`]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI 분석 */}
      <div className="bg-gray-50 p-4 md:p-5 rounded-lg">
        <h4 className="flex items-center gap-1 text-lg font-medium mb-2">
          AI 분석
          <Tooltip
            contents="- 개인의 특별한 상황은 반영되지 않을 수 있습니다.
                      - 예상치 못한 외부 변수가 결과를 바꿀 수 있습니다.
                      - 확률적 예측이므로 100% 정확하지 않습니다."
            className="w-[300px] ml-2 shadow-xl"
          >
            <PiWarningCircleFill size={24} />
          </Tooltip>
        </h4>
        <p className="text-gray-800 text-base break-keep">
          {" "}
          {currentIndicator.analysis}
        </p>
      </div>
    </div>
  );
};
