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

// 백엔드 연동 전까지 MOCK_MODE 사용
const MOCK_MODE = true;

// 목 데이터 (백엔드 응답 형식에 맞춤)
const mockScenarioData: ScenarioData = {
  analysis: {
    economy:
      "안정적인 직장으로 꾸준한 수입을 확보하며, 재테크를 통해 자산을 형성하고 있습니다.",
    health:
      "규칙적인 운동과 건강한 식습관을 유지하며, 정기적인 건강검진으로 건강을 관리하고 있습니다.",
    relationships:
      "가족 및 친구들과 좋은 관계를 유지하며, 균형 잡힌 사회생활을 하고 있습니다.",
    jobs: "전문성을 인정받는 커리어를 쌓아가고 있으며, 지속적인 성장 기회를 얻고 있습니다.",
    happiness:
      "전반적으로 만족스러운 삶의 질을 유지하며, 일과 삶의 균형을 잘 맞추고 있습니다.",
    aiInsight:
      "당신은 신중하고 체계적인 선택으로 안정적인 인생을 살아가고 있습니다. 교육과 직업 선택에서 보수적이면서도 확실한 길을 선택하는 경향이 있으며, 이는 장기적으로 안정적인 기반을 마련하는 데 도움이 됩니다. 경제적 안정과 건강, 그리고 좋은 인간관계를 바탕으로 행복한 삶을 영위하고 있습니다. 다만, 때로는 새로운 기회에 도전하는 것도 고려해볼 만합니다.",
  },
  radarData: {
    labels: ["경제", "건강", "관계", "직업", "행복"],
    datasets: [
      {
        label: "현재",
        data: [85, 75, 80, 90, 85],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  },
  events: [
    { year: 2020, title: "대학 진학" },
    { year: 2022, title: "인턴십 경험" },
    { year: 2024, title: "졸업 및 취업" },
    { year: 2026, title: "첫 승진" },
    { year: 2030, title: "커리어 전환점" },
  ],
};

export const ScenarioContainer = () => {
  const searchParams = useSearchParams();
  const scenarioIdParam = searchParams.get("scenarioId");
  const scenarioId = scenarioIdParam ? parseInt(scenarioIdParam, 10) : null;

  const { data: user, isLoading: isAuthLoading } = useAuthUser();

  // MOCK_MODE일 때는 폴링 비활성화
  const {
    status,
    isPolling,
    error: pollingError,
  } = useScenarioPolling(MOCK_MODE ? null : scenarioId);

  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // MOCK_MODE와 실제 API 모드 분기
  useEffect(() => {
    if (!scenarioId) return;

    if (MOCK_MODE) {
      // 목 데이터 로딩
      console.log("MOCK_MODE: 목 데이터 로딩 중...");
      setDataLoading(true);

      setTimeout(() => {
        setScenarioData(mockScenarioData);
        setDataLoading(false);
        console.log("MOCK_MODE: 목 데이터 로딩 완료");
      }, 2000);
    } else {
      // 실제 API: 시나리오 완료 시 데이터 조회
      if (status === "COMPLETED") {
        fetchScenarioData(scenarioId);
      } else if (status === "FAILED") {
        setError("AI 분석에 실패했습니다.");
      }
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
            onClick={() => (window.location.href = "/baselines")}
            className="w-full bg-deep-navy text-white px-6 py-3 rounded-lg"
          >
            베이스라인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // AI 분석 중 (폴링) - 실제 API 모드에서만
  if (!MOCK_MODE && isPolling && status !== "COMPLETED") {
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

  // 에러 상태 - 실제 API 모드에서만
  if (!MOCK_MODE && (error || pollingError || status === "FAILED")) {
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
              베이스라인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우 - 실제 API 모드에서만
  if (!MOCK_MODE && !scenarioData && status === "COMPLETED") {
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
            onClick={() => (window.location.href = "/baselines")}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            베이스라인으로 돌아가기
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
