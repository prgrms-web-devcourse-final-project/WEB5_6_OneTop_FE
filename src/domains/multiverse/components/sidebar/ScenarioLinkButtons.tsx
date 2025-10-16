"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getScenarioByDecisionLine } from "../../api/tree";
import { showErrorToast } from "@/share/components/ErrorToast";

interface ScenarioLinkButtonsProps {
  decisionLineId: number;
}

const ScenarioLinkButtons = ({ decisionLineId }: ScenarioLinkButtonsProps) => {
  const router = useRouter();
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const handleViewScenario = async () => {
    setIsLoadingScenario(true);

    try {
      const data = await getScenarioByDecisionLine(decisionLineId);

      if (!data.scenarioId) {
        throw new Error("시나리오 ID를 받아올 수 없습니다.");
      }

      router.push(`/scenarios?scenarioId=${data.scenarioId}`);
    } catch (error) {
      showErrorToast("조회에 실패했습니다. 다시 시도해주세요");
    } finally {
      setIsLoadingScenario(false);
    }
  };

  const handleViewAnalysis = async () => {
    setIsLoadingAnalysis(true);

    try {
      const data = await getScenarioByDecisionLine(decisionLineId);

      if (!data.scenarioId || !data.baseScenarioId) {
        throw new Error("시나리오 ID를 받아올 수 없습니다.");
      }

      router.push(
        `/scenarios/compare?baseId=${data.baseScenarioId}&compareId=${data.scenarioId}`
      );
    } catch (error) {
      showErrorToast("조회에 실패했습니다. 다시 시도해주세요");
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // 버튼 중 하나라도 로딩이면 둘 다 disabled
  const isDisabled = isLoadingScenario || isLoadingAnalysis;

  return (
    <div className="mt-6 flex flex-col gap-3">
      <button
        onClick={handleViewScenario}
        disabled={isDisabled}
        className="w-full p-3 bg-deep-navy rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoadingScenario ? "로딩 중..." : "시나리오 조회"}
      </button>
      <button
        onClick={handleViewAnalysis}
        disabled={isDisabled}
        className="w-full p-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoadingAnalysis ? "로딩 중..." : "현재와 비교 분석하기"}
      </button>
    </div>
  );
};

export default ScenarioLinkButtons;
