"use client";

import { useEffect, useState } from "react";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import { useSearchParams } from "next/navigation";
import { Analysis } from "./Analysis";
import { RadarChart } from "./RadarChart";
import { Timeline } from "./Timeline";
import { useScenarioPolling } from "../hooks/useScenarioPolling";
import { clientScenariosApi } from "../api/clientScenariosApi";
import { ScenarioData } from "../types";

export const ScenarioContainer = () => {
  const searchParams = useSearchParams();
  const scenarioIdParam = searchParams.get("scenarioId");
  const scenarioId = scenarioIdParam ? parseInt(scenarioIdParam, 10) : null;

  const { data: user, isLoading: isAuthLoading } = useAuthUser();

  const {
    status,
    isPolling,
    error: pollingError,
  } = useScenarioPolling(scenarioId);

  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 시나리오 완료 시 데이터 조회
  useEffect(() => {
    if (!scenarioId) return;

    if (status === "COMPLETED") {
      fetchScenarioData(scenarioId);
    } else if (status === "FAILED") {
      setError("AI 분석에 실패했습니다.");
    }
  }, [scenarioId, status]);

  const fetchScenarioData = async (id: number): Promise<void> => {
    try {
      setDataLoading(true);
      setError(null);
      const data = await clientScenariosApi.getScenarioData(id);
      setScenarioData(data);
    } catch (err) {
      console.error("시나리오 데이터 조회 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setDataLoading(false);
    }
  };

  // 인증 로딩 중
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">인증 확인 중...</div>
        </div>
      </div>
    );
  }

  // scenarioId가 없는 경우
  if (!scenarioId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            시나리오를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">올바른 시나리오 ID가 필요합니다.</p>
          <button
            onClick={() => (window.location.href = "/scenario-list")}
            className="w-full bg-deep-navy text-white px-6 py-3 rounded-lg"
          >
            시나리오 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // AI 분석 중
  if (isPolling && status !== "COMPLETED") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="text-2xl font-semibold text-gray-700 mb-4">
              AI가 당신의 인생을 분석하고 있습니다
            </div>
            <div className="text-gray-500 mb-6">
              {status === "PROCESSING"
                ? "분석 중..."
                : status === "PENDING"
                ? "대기 중..."
                : "준비 중..."}
            </div>
            <div className="flex justify-center items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 데이터 로딩 중
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <div className="text-gray-700 text-xl">결과를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || pollingError || status === "FAILED") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {status === "FAILED"
              ? "AI 분석에 실패했습니다"
              : "데이터를 불러올 수 없습니다"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || pollingError?.message || "오류가 발생했습니다."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => scenarioId && fetchScenarioData(scenarioId)}
              className="w-full bg-deep-navy text-white px-6 py-3 rounded-lg"
            >
              다시 시도
            </button>
            <button
              onClick={() => (window.location.href = "/baselines")}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              시나리오 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!scenarioData && status === "COMPLETED") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            분석 결과를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            시나리오 분석이 완료되지 않았거나 데이터가 없습니다.
          </p>
          <button
            onClick={() => (window.location.href = "/scenario-list")}
            className="w-full bg-deep-navy text-white px-6 py-3 rounded-lg"
          >
            시나리오 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (scenarioData) {
    return (
      <div className="h-full">
        <div className="max-w-[1440px] m-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 my-15">
            <Analysis data={scenarioData.analysis} />
            <RadarChart data={scenarioData.radarData} />
          </div>
        </div>
        <div className="bg-gray-50 py-15">
          <Timeline data={scenarioData.events} />
        </div>
      </div>
    );
  }

  return null;
};
