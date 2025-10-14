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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          내 평행우주 목록
          {data && data.totalElements > 0 && (
            <span className="ml-2">({data.totalElements})</span>
          )}
        </h2>
      </div>

      {/* 시나리오 리스트 */}
      <div className="px-8">
        {data?.items && data.items.length > 0 ? (
          <div className="flex flex-col gap-4">
            {data.items.map((scenario, idx) => (
              <div
                key={scenario.scenarioId}
                className="border-3 border-deep-navy rounded-xl"
              >
                <div className="flex p-8 items-center text-xl">
                  {/* 직업 */}
                  <div className="flex-[3] flex flex-col justify-center px-4">
                    <p className="mb-2">{idx + 1}번째 우주의 나</p>
                    <p className="font-semibold">{scenario.job}</p>
                  </div>

                  {/* 구분선 */}
                  <div className="w-px bg-deep-navy self-stretch mx-2"></div>

                  {/* 점수들 */}
                  <div className="flex-[4] flex justify-center px-6">
                    <div className="flex gap-6 text-center">
                      {Object.entries(scenario.typeScores).map(
                        ([key, value]) => (
                          <div key={key}>
                            <p className="mb-2">{key}</p>
                            <p className="font-semibold">{value}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="w-px bg-deep-navy self-stretch mx-2"></div>

                  <div className="flex-[4] flex justify-center px-6">
                    <div className="flex gap-8 text-center items-center">
                      {/* 총점 */}
                      <div>
                        <p className="mb-2">총점</p>
                        <p className="font-semibold">{scenario.total}</p>
                      </div>

                      {/* 요약 */}
                      <div className="break-words break-all whitespace-normal">
                        <p className="font-medium">
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

      {/* 페이지네이션 */}
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
