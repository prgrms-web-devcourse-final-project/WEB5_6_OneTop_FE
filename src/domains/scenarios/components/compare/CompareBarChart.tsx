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
  LabelList,
} from "recharts";
import { IndicatorComparison } from "../../types";

interface CompareBarChartProps {
  indicators: IndicatorComparison[];
}

export const CompareBarChart = ({ indicators }: CompareBarChartProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["경제", "건강", "관계", "직업", "행복"];
  const currentIndicator = indicators[activeTab];

  // Recharts용 데이터 변환
  const chartData = [
    {
      name: "현재",
      value: currentIndicator.baseScore,
      fill: "#9CA3AF",
    },
    {
      name: "평행우주",
      value: currentIndicator.compareScore,
      fill: "#1E3A5F",
    },
  ];

  return (
    <div className="bg-white p-7 rounded-lg border border-gray-200">
      <div className="flex items-center mb-7">
        <h3 className="text-[22px] font-semibold">레이더 차트</h3>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-2 mb-7 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === index
                ? "text-midnight-blue"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-midnight-blue"></div>
            )}
          </button>
        ))}
      </div>

      {/* 막대 그래프 */}
      <div className="h-[300px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 14, fill: "#374151" }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={{ stroke: "#E5E7EB" }}
              label={{
                value: "점수",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12, fill: "#6B7280" },
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={80}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 14, fontWeight: 600, fill: "#374151" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI 분석 */}
      <div className="bg-gray-50 p-5 rounded-lg">
        <h4 className="text-base font-semibold text-gray-800 mb-2">AI 분석</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          {currentIndicator.analysis}
        </p>
      </div>
    </div>
  );
};
