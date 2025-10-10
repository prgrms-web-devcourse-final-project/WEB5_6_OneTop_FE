"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import { Tooltip } from "@/share/components/Tooltip";
import { CompareBarChart } from "./CompareBarChart";
import { CompareTimeline } from "./CompareTimeline";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaLightbulb } from "react-icons/fa";
import { CompareTimelineItem, ScenarioCompareResponse } from "../../types";
import { CompareRadarChart } from "./CompareRadarChart";
// import { clientCompareApi } from "../api/clientCompareApi";

// 임시로 더미 데이터 사용 -> 백엔드 더미 데이터 준비시 연동
const mockCompareData: ScenarioCompareResponse = {
  baseScenarioId: 1001,
  compareScenarioId: 1002,
  overallAnalysis:
    "평행우주에서는 창업을 선택하여 더 높은 경제적 성과와 성취감을 얻었지만, 초기 불안정성과 스트레스가 증가했습니다. 전반적으로 위험을 감수한 만큼 더 큰 보상을 얻은 결과를 보여줍니다.",
  indicators: [
    {
      type: "경제",
      baseScore: 65,
      compareScore: 85,
      analysis:
        "창업 성공으로 인한 수익 증가와 자산 형성으로 경제 지표가 크게 향상되었습니다. 안정적인 회사 생활보다 20점 높은 점수를 기록했습니다.",
    },
    {
      type: "건강",
      baseScore: 75,
      compareScore: 60,
      analysis:
        "창업 초기 과도한 업무 스트레스와 불규칙한 생활 패턴으로 인해 건강 지표가 감소했습니다. 규칙적인 회사 생활에 비해 15점 낮습니다.",
    },
    {
      type: "관계",
      baseScore: 70,
      compareScore: 65,
      analysis:
        "사업에 집중하느라 가족 및 친구들과의 시간이 줄어들어 관계 지표가 소폭 감소했습니다. 하지만 새로운 비즈니스 네트워크가 형성되었습니다.",
    },
    {
      type: "직업",
      baseScore: 60,
      compareScore: 90,
      analysis:
        "자신의 사업을 운영하면서 높은 성취감과 자율성을 얻었습니다. 직업 만족도가 크게 향상되어 30점 상승했습니다.",
    },
    {
      type: "행복",
      baseScore: 70,
      compareScore: 78,
      analysis:
        "경제적 성공과 직업 만족도 상승으로 전반적인 행복 지수가 증가했습니다. 스트레스에도 불구하고 8점 향상되었습니다.",
    },
  ],
};

// 레이더 차트
export const mockRadarData = {
  labels: ["경제", "건강", "관계", "직업", "행복"],
  datasets: [
    {
      label: "현재",
      data: [65, 75, 70, 60, 70],
      backgroundColor: "rgba(231, 111, 81, 0.2)",
      borderColor: "#e76f51",
    },
    {
      label: "평행우주",
      data: [85, 60, 65, 90, 78],
      backgroundColor: "rgba(255, 200, 35, 0.2)",
      borderColor: "#FFC823",
    },
  ],
};

// 타임라인용
export const mockTimelineData: CompareTimelineItem[] = [
  { year: 2018, title: "대학 졸업", type: "base" },
  { year: 2018, title: "대학 졸업", type: "compare" },

  { year: 2020, title: "스타트업 취업", type: "base" },
  { year: 2020, title: "창업 준비", type: "compare" },

  { year: 2022, title: "팀장 승진", type: "base" },
  { year: 2022, title: "스타트업 창업", type: "compare" },

  { year: 2023, title: "결혼", type: "base" },
  { year: 2023, title: "시리즈 A 투자 유치", type: "compare" },

  { year: 2025, title: "첫 아이 출산", type: "base" },
  { year: 2025, title: "해외 진출", type: "compare" },
];

export const ScenarioCompareContainer = () => {
  const searchParams = useSearchParams();
  const baseIdParam = searchParams.get("baseId");
  const compareIdParam = searchParams.get("compareId");

  const baseId = baseIdParam ? parseInt(baseIdParam, 10) : null;
  const compareId = compareIdParam ? parseInt(compareIdParam, 10) : null;

  const { data: user, isLoading: isAuthLoading } = useAuthUser();
  const [compareData, setCompareData] =
    useState<ScenarioCompareResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!baseId || !compareId) return;

    fetchCompareData(baseId, compareId);
  }, [baseId, compareId]);

  const fetchCompareData = async (base: number, compare: number) => {
    try {
      setIsLoading(true);
      setError(null);

      // 백엔드 API가 준비되면 아래 주석 해제
      // const data = await clientScenariosApi.compareScenarios(base, compare);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = mockCompareData;

      setCompareData(data);
    } catch (err) {
      console.error("비교 데이터 조회 실패:", err);
      setError("비교 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 로딩 중
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <div className="text-gray-700 text-xl">인증 확인 중...</div>
        </div>
      </div>
    );
  }

  // ID가 없는 경우
  if (!baseId || !compareId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            비교할 시나리오를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">올바른 시나리오 ID가 필요합니다.</p>
          <button
            onClick={() => (window.location.href = "/baselines")}
            className="w-full bg-deep-navy text-white px-6 py-3 rounded-lg"
          >
            시나리오 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 데이터 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <div className="text-gray-700 text-xl">
            비교 분석 결과를 불러오는 중...
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
              onClick={() =>
                baseId && compareId && fetchCompareData(baseId, compareId)
              }
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

  // 데이터 표시
  if (compareData) {
    return (
      <div className="min-h-screen">
        {/* 메인 콘텐츠 */}
        <div className="max-w-[1440px] m-auto px-7 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-7">
            <CompareBarChart indicators={compareData.indicators} />
            <CompareRadarChart data={mockRadarData} />
          </div>

          {/* 타임라인 */}
          <CompareTimeline data={mockTimelineData} />

          {/* AI 종합 분석 */}
          <div className="bg-white p-7 rounded-lg border border-gray-200 mb-7">
            <div className="flex items-center mb-5">
              <h3 className="flex items-center gap-1 text-[22px] font-semibold">
                AI 종합 분석
                <Tooltip
                  contents="- 개인의 특별한 상황은 반영되지 않을 수 있습니다.
                            - 예상치 못한 외부 변수가 결과를 바꿀 수 있습니다.
                            - 확률적 예측이므로 100% 정확하지 않습니다."
                  className="w-[300px] ml-2 shadow-xl"
                >
                  <PiWarningCircleFill size={24} />
                </Tooltip>
              </h3>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="flex items-start gap-2">
                <FaLightbulb
                  size={20}
                  color="#FFC823"
                  className="mt-0.5 flex-shrink-0"
                />
                <p className="text-gray-800 text-base leading-relaxed">
                  {compareData.overallAnalysis}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
