"use client";

import { useState } from "react";
import Link from "next/link";
import RepresentativeProfileModal from "./RepresentativeProfileModal";
import { useRepresentativeProfile } from "../../hooks/useRepresentativeProfile";
import { RadarChartCore } from "@/share/components/RaderChartCore";

export default function RepresentativeProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(
    null
  );

  const { query, mutation } = useRepresentativeProfile();
  const profile = query.data;

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">대표 프로필</h2>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          변경하기
        </button>
      </div>

      <div className="px-8">
        {profile?.representativeScenarioId ? (
          <div className="flex gap-6">
            <div className="flex-[3]">
              <h3 className="text-xl font-semibold">{profile.nickname}</h3>
              <p className="mt-1">
                {profile.representativeScenarioId}번째 우주의 나
              </p>
              <p className="mt-2">{profile.description}</p>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="h-40">
                <RadarChartCore data={radarData!} showLegend={false} />
              </div>
              <Link
                href={`/scenario/${profile.representativeScenarioId}`}
                className="px-3 py-3 bg-deep-navy text-white rounded-lg transition text-center"
              >
                결과 페이지 직접 보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-60 flex items-center justify-center text-gray-600">
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
