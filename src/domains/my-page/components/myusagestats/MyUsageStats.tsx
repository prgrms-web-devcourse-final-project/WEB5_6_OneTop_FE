"use client";

import Loading from "@/share/components/Loading";
import { useUsageStats } from "../../hooks/useUsageStats";
import { showErrorToast } from "@/share/components/ErrorToast";

export default function MyUsageStats() {
  const { data, isLoading, error } = useUsageStats();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    showErrorToast("데이터를 불러오지 못했습니다. 다시 시도해주세요.");
  }

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">사용 통계</h2>

      <div className="bg-ivory rounded-xl shadow p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <h3 className="text-lg sm:text-lg font-semibold sm:self-center px-0 sm:px-10">
          내 통계
        </h3>
        <div className="hidden sm:block w-px bg-gray-500 self-stretch"></div>
        <div className="flex-1 w-full">
          <div className="flex flex-row flex-wrap gap-4 sm:grid sm:grid-cols-5 sm:gap-4 justify-center">
            {/* 평행우주 생성 */}
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold">
                {data?.scenarioCount}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                평행우주
              </p>
            </div>

            {/* 총점합 */}
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold">
                {data?.totalPoints || "-"}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                총점합
              </p>
            </div>

            {/* 게시글 수 */}
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold">{data?.postCount}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                게시글 수
              </p>
            </div>

            {/* 댓글 수 */}
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold">
                {data?.commentCount}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                댓글 수
              </p>
            </div>

            {/* MBTI */}
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold">
                {data?.mbti || "-"}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                MBTI
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
