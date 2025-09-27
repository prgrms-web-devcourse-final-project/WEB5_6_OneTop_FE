"use client";

import { useAuth } from "@/share/hooks/useAuth";
import { useEffect, useState } from "react";
import { Analysis } from "../../../app/components/scenarios/Analysis";
import { RadarChart } from "./RadarChart";
import { Timeline } from "../../../app/components/scenarios/Timeline";
import { ScenarioData } from "../types";

// 목업 데이터
const mockScenarioData: ScenarioData = {
  analysis: {
    economy: "신중하고 계획적인 분석형 성격",
    health: "체계적이고 계획적으로 접근",
    relationships: "과도한 완벽주의 성향",
    jobs: "전문 분야에서의 깊이 있는 발전 가능성",
    happiness: "완벽주의로 인한 스트레스",
    aiInsight:
      "당신은 신중하고 체계적인 접근을 통해 안정적인 성장을 추구하는 성향을 보입니다. 교육과 직업 선택에서 보수적이면서도 확실한 길을 선택하는 경향이 있으며, 이는 장기적으로 안정적인 기반을 마련하는 데 도움이 됩니다. 다만, 때로는 새로운 기회를 놓칠 수 있으니 적절한 위험 감수도 필요합니다.",
  },
  radarData: {
    labels: ["경제", "건강", "관계", "직업", "행복"],
    datasets: [
      {
        label: "현재",
        data: [60, 90, 50, 40, 70],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
      // {
      //   label: "평행우주",
      //   data: [80, 80, 70, 60, 80],
      //   backgroundColor: "rgba(255, 99, 132, 0.2)",
      //   borderColor: "rgba(255, 99, 132, 1)",
      // },
    ],
  },
  timeline: [
    {
      year: 2018,
      age: 18,
      title: "대학 진학",
      description: "이과 선택으로 공학 계열 진학",
      scenario: "스타트업 창업 준비",
    },
    {
      year: 2020,
      age: 20,
      title: "전공 선택",
      description: "컴퓨터 공학 전공 확정",
      scenario: "해외 유학 준비",
    },
    {
      year: 2022,
      age: 22,
      title: "인턴십 경험",
      description: "대기업 인턴 참여",
      scenario: "대학원 진학",
    },
    {
      year: 2025,
      age: 25,
      title: "첫 직장",
      description: "안정적인 대기업 취업",
      scenario: "창업 도전",
    },
    {
      year: 2030,
      age: 30,
      title: "커리어 전환점",
      description: "팀리더로 승진",
      scenario: "프리랜서 전환",
    },
  ],
};

export const ScenarioContainer = () => {
  const { user, isLoading } = useAuth();
  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      fetchScenarioData();
    }
  }, [user, isLoading]);

  const fetchScenarioData = async (): Promise<void> => {
    try {
      setDataLoading(true);
      setError(null);

      // API가 준비되면 주석 해제
      // const response = await api.get("/scenarios/analysis");
      // setScenarioData(response.data);

      // 목업 데이터로 테스트 (2초 지연으로 로딩 시뮬레이션) 로딩 임시 추후 페이지 작업 따로 필요
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setScenarioData(mockScenarioData);
    } catch (error: unknown) {
      console.error("시나리오 데이터 조회 실패:", error);

      // 에러 타입 가드
      if (error && typeof error === "object" && "response" in error) {
        const httpError = error as { response?: { status?: number } };
        const status = httpError.response?.status;

        if (status === 404) {
          setError("베이스라인 데이터를 먼저 입력해주세요.");
        } else if (status === 401) {
          setError("인증이 필요합니다.");
        } else {
          setError("데이터를 불러오는 중 오류가 발생했습니다.");
        }
      } else {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setDataLoading(false);
    }
  };

  const handleRetry = (): void => {
    fetchScenarioData();
  };

  const navigateToBaselines = (): void => {
    window.location.href = "/baselines";
  };

  // 인증 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">인증 확인 중...</div>
        </div>
      </div>
    );
  }

  // 임시 데이터 로딩 중, 추후 로딩 페이지 작업 따로 필요
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="text-2xl font-semibold text-gray-700 mb-4">
              AI가 당신의 인생을 분석하고 있습니다
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

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            데이터를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={navigateToBaselines}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              베이스라인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!scenarioData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            분석할 데이터가 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            먼저 베이스라인에서 인생 분기점을 입력해주세요.
          </p>
          <button
            onClick={navigateToBaselines}
            className="w-full bg-deep-navy text-white px-6 py-3 rounded-lg"
          >
            베이스라인 입력하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="max-w-[1440px] m-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 my-15">
          <Analysis data={scenarioData.analysis} />
          <RadarChart data={scenarioData.radarData} />
        </div>
      </div>
      <div className="bg-gray-50 py-15">
        <Timeline data={scenarioData.timeline} />
      </div>
    </div>
  );
};
