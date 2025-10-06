"use client";

import { useState } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import Modal from "@/share/components/Modal";
import Pagination from "@/share/components/Pagination";
import EmptyState from "@/share/components/EmptyState";
import { useMyScenarios } from "../../hooks/useMyscenarios";

interface RepresentativeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedScenarioId: number | null;
  setSelectedScenarioId: (id: number) => void;
  onSubmit: (scenarioId: number) => void;
  mutation: UseMutationResult<unknown, Error, number, unknown>;
}

export default function RepresentativeProfileModal({
  isOpen,
  onClose,
  selectedScenarioId,
  setSelectedScenarioId,
  onSubmit,
  mutation,
}: RepresentativeProfileModalProps) {
  const [page, setPage] = useState(1);

  const { data: scenarios } = useMyScenarios(page, 5, isOpen);

  const handleSelect = () => {
    if (selectedScenarioId) {
      onSubmit(selectedScenarioId);
    }
  };

  const hasScenarios = scenarios && scenarios.items.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="대표 시나리오 선택"
      actions={
        hasScenarios
          ? [
              { label: "취소", onClick: onClose, variant: "outline" },
              {
                label: mutation.isPending ? "저장중..." : "선택",
                onClick: handleSelect,
                variant: "primary",
                disabled: mutation.isPending || !selectedScenarioId,
              },
            ]
          : [{ label: "닫기", onClick: onClose, variant: "outline" }]
      }
    >
      {hasScenarios ? (
        <>
          <div className="flex flex-col gap-2">
            {scenarios.items.map((scenario) => (
              <div
                key={scenario.scenarioId}
                onClick={() => setSelectedScenarioId(scenario.scenarioId)}
                className={`p-3 border rounded-lg cursor-pointer transition ${
                  selectedScenarioId === scenario.scenarioId
                    ? "border-gray-800 bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold">{scenario.job}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {scenario.summary}
                    </p>
                  </div>
                  <p className="font-bold ml-4">총점: {scenario.total}</p>
                </div>
              </div>
            ))}
          </div>

          {scenarios.totalPages > 1 && (
            <Pagination
              mode="state"
              currentPage={page}
              totalPages={scenarios.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <EmptyState
          title="생성된 시나리오가 없습니다"
          description="시나리오를 먼저 생성해주세요"
          linkText="시나리오 생성하기"
          linkHref="/scenario/new"
        />
      )}
    </Modal>
  );
}
