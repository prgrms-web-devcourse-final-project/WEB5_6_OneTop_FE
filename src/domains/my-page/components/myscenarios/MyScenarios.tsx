"use client";

import { useSearchParams } from "next/navigation";
import Pagination from "@/share/components/Pagination";
import EmptyState from "@/share/components/EmptyState";
import { useMyScenarios } from "../../hooks/useMyscenarios";
import Loading from "@/share/components/Loading";
import { showErrorToast } from "@/share/components/ErrorToast";

export default function MyScenarios() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("scenarioPage")) || 1;

  const { data, isLoading, error } = useMyScenarios(page);
  if (isLoading) {
    return <Loading text="작성글을 불러오는 중..." />;
  }

  if (error) {
    showErrorToast(error);
  }
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-semibold flex items-center">
          내 평행우주 목록
          {data && data.totalElements > 0 && (
            <span className="ml-2">({data.totalElements})</span>
          )}
        </h2>
      </div>

      {/* 시나리오 리스트 */}
      <div className="px-4 sm:px-8">
        {data?.items && data.items.length > 0 ? (
          <div className="flex flex-col gap-3 sm:gap-4">
            {data.items.map((scenario, idx) => (
              <div
                key={scenario.scenarioId}
                className="border-3 border-deep-navy rounded-xl"
              >
                <div className="flex flex-col sm:flex-row p-4 sm:p-8 items-center text-base sm:text-xl gap-3 sm:gap-0">
                  {/* 직업 */}
                  <div className="flex-[3] flex flex-col justify-center px-2 sm:px-4 text-center sm:text-left">
                    <p className="mb-1 sm:mb-2 text-sm sm:text-base">
                      {idx + 1}번째 우주의 나
                    </p>
                    <p className="font-semibold text-sm sm:text-base">
                      {scenario.job}
                    </p>
                  </div>

                  {/* 구분선 (데스크탑) */}
                  <div className="hidden sm:block w-px bg-deep-navy self-stretch mx-2"></div>

                  {/* 점수 + 총점 + 요약 */}
                  <div className="flex-[8] flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full">
                    <div className="flex flex-wrap lg:flex-row justify-center gap-4 lg:gap-8 text-center w-full">
                      {Object.entries(scenario.typeScores).map(
                        ([key, value]) => (
                          <div key={key}>
                            <p className="mb-1 sm:mb-2 text-sm sm:text-base">
                              {key}
                            </p>
                            <p className="font-semibold text-sm sm:text-base">
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    {/* 중간 구분선 (데스크탑) */}
                    <div className="hidden lg:block w-px bg-deep-navy self-stretch mx-2"></div>

                    {/* 총점 + 요약 */}
                    <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 items-center text-center lg:text-left">
                      <div>
                        <p className="mb-1 sm:mb-2 text-sm sm:text-base">
                          총점
                        </p>
                        <p className="font-semibold text-sm sm:text-base">
                          {scenario.total}
                        </p>
                      </div>

                      <div className="break-words break-all whitespace-normal">
                        <p className="font-medium text-sm sm:text-base">
                          &ldquo;{scenario.summary}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="아직 생성된 평행우주가 없습니다"
            description="새로운 시나리오를 만들어보세요."
            linkText="시나리오 만들기"
            linkHref="/scenario-list"
          />
        )}
      </div>

      {data && data.items.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          pageParamName="scenarioPage"
          scrollToId="scenarios"
        />
      )}
    </div>
  );
}
