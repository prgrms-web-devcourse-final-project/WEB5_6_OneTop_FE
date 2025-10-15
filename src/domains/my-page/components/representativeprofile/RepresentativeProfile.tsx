"use client";

import { useState } from "react";
import Link from "next/link";
import RepresentativeProfileModal from "./RepresentativeProfileModal";
import { useRepresentativeProfile } from "../../hooks/useRepresentativeProfile";
import { RadarChartCore } from "@/share/components/RaderChartCore";
import Loading from "@/share/components/Loading";
import { showErrorToast } from "@/share/components/ErrorToast";

export default function RepresentativeProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(
    null
  );

  const { query, mutation } = useRepresentativeProfile();
  const { data: profile, isLoading, error } = query;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    showErrorToast(error);
  }

  const handleSubmit = (scenarioId: number) => {
    mutation.mutate(scenarioId, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  const handleOpenModal = () => {
    setSelectedScenarioId(profile?.representativeScenarioId ?? null);
    setIsModalOpen(true);
  };

  const radarData =
    profile?.representativeScenarioId && profile.sceneTypePoints
      ? Object.entries(profile.sceneTypePoints).map(([key, value]) => ({
          subject: key,
          current: value ?? 0,
          fullMark: 100,
        }))
      : null;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-6 gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-semibold">대표 프로필</h2>
        <button
          onClick={handleOpenModal}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm sm:text-base"
        >
          변경하기
        </button>
      </div>

      <div className="px-4 sm:px-8">
        {profile?.representativeScenarioId ? (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-[3]">
              <h3 className="text-lg sm:text-xl font-semibold">
                {profile.nickname}
              </h3>
              <p className="mt-1 text-sm sm:text-base">
                {profile.representativeScenarioId}번째 우주의 나
              </p>
              <p className="mt-2 text-sm sm:text-base">{profile.description}</p>
            </div>

            <div className="flex-1 flex flex-col gap-3 sm:gap-4">
              <div className="h-32 sm:h-40">
                <RadarChartCore data={radarData!} showLegend={false} />
              </div>
              <Link
                href={`/scenarios?scenarioId=${profile.representativeScenarioId}`}
                className="px-3 py-2 sm:px-3 sm:py-3 bg-deep-navy text-white rounded-lg transition text-center text-sm sm:text-base"
              >
                결과 페이지 직접 보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-48 sm:h-60 flex items-center justify-center text-gray-600 text-sm sm:text-base">
            대표 프로필을 설정해주세요.
          </div>
        )}
      </div>

      <RepresentativeProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedScenarioId={selectedScenarioId}
        setSelectedScenarioId={setSelectedScenarioId}
        onSubmit={handleSubmit}
        mutation={mutation}
      />
    </div>
  );
}
