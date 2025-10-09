"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import { Tooltip } from "@/share/components/Tooltip";
import { CompareBarChart } from "./CompareBarChart";
import { CompareTimeline } from "./CompareTimeline";
import { PiWarningCircleFill } from "react-icons/pi";
import {
  CompareTimelineItem,
  RadarData,
  ScenarioCompareResponse,
  TimelineResponse,
} from "../../types";
import { CompareRadarChart } from "./CompareRadarChart";
import { clientCompareApi } from "../../api/clientCompareApi";

export const ScenarioCompareContainer = () => {
  const searchParams = useSearchParams();
  const baseIdParam = searchParams.get("baseId");
  const compareIdParam = searchParams.get("compareId");

  const baseId = baseIdParam ? parseInt(baseIdParam, 10) : null;
  const compareId = compareIdParam ? parseInt(compareIdParam, 10) : null;

  const { data: user, isLoading: isAuthLoading } = useAuthUser();
  const [compareData, setCompareData] =
    useState<ScenarioCompareResponse | null>(null);
  const [timelineData, setTimelineData] = useState<CompareTimelineItem[]>([]);
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

      const data: ScenarioCompareResponse =
        await clientCompareApi.compareScenarios(base, compare);

      const [baseTimeline, compareTimeline]: [
        TimelineResponse,
        TimelineResponse
      ] = await Promise.all([
        clientCompareApi.getScenarioTimeline(base),
        clientCompareApi.getScenarioTimeline(compare),
      ]);

      const combinedTimeline: CompareTimelineItem[] = [
        ...baseTimeline.events.map((event) => ({
          year: event.year,
          title: event.title,
          type: "base" as const,
        })),
        ...compareTimeline.events.map((event) => ({
          year: event.year,
          title: event.title,
          type: "compare" as const,
        })),
      ];

      setCompareData(data);
      setTimelineData(combinedTimeline);
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
    // indicators를 기반으로 radarData 생성
    const radarData: RadarData = {
      labels: compareData.indicators.map((ind) => ind.type),
      datasets: [
        {
          label: "현재",
          data: compareData.indicators.map((ind) => ind.baseScore),
          backgroundColor: "rgba(189, 196, 212, 0.2)",
          borderColor: "#BDC4D4",
        },
        {
          label: "평행우주",
          data: compareData.indicators.map((ind) => ind.compareScore),
          backgroundColor: "rgba(28, 46, 74, 0.2)",
          borderColor: "#1C2E4A",
        },
      ],
    };

    return (
      <div className="min-h-screen">
        {/* 메인 콘텐츠 */}
        <div className="max-w-[1440px] m-auto px-7 my-15">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-7">
            <CompareBarChart indicators={compareData.indicators} />
            <CompareRadarChart data={radarData} />
          </div>
        </div>

        <div className="bg-gray-50 py-15">
          <div className="max-w-[1440px] m-auto">
            {/* 타임라인 */}
            <CompareTimeline data={timelineData} />

            {/* AI 종합 분석 */}
            <div className="border-l-[5px] border-ivory mt-10">
              <div className="py-2 pl-5">
                <div className="flex items-center mb-3">
                  <h4 className="flex items-center gap-1 text-xl font-semibold">
                    AI 종합 분석
                    <Tooltip
                      contents="- 개인의 특별한 상황은 반영되지 않을 수 있습니다.
                            - 예상치 못한 외부 변수가 결과를 바꿀 수 있습니다.
                            - 확률적 예측이므로 100% 정확하지 않습니다."
                      className="w-[300px] ml-2 shadow-xl"
                    >
                      <PiWarningCircleFill size={24} />
                    </Tooltip>
                  </h4>
                </div>

                <p className="text-gray-800 text-base leading-relaxed break-keep">
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
