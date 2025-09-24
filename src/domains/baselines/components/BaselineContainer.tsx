"use client";

import { useState, useEffect } from "react";
import { useBaselineStore } from "@/share/stores/baselineStore";
import { BaselineView } from "./BaselineView";
import { BaselineSetupForm } from "./BaselineSetupForm";

export const BaselineContainer = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { events, getEventByYear } = useBaselineStore();

  const handleNodeClick = (year: number, age: number) => {
    // 빈 노드 클릭 시에는 새로운 임시 년도 생성
    const nodeEvent = getEventByYear(year);
    if (!nodeEvent) {
      // 빈 노드의 경우, 현재 년도 기준으로 새로운 년도 설정
      const currentYear = new Date().getFullYear();
      const lastEventYear =
        events.length > 0
          ? Math.max(...events.map((e) => e.year))
          : currentYear - 1;
      const newYear = Math.max(lastEventYear + 1, currentYear);

      setSelectedYear(newYear);
    } else {
      setSelectedYear(year);
    }
    setIsFormOpen(true);
  };

  const handleAddNode = () => {
    // 새로운 년도 계산 (가장 최근 년도 + 1)
    const currentYear = new Date().getFullYear();
    const lastYear =
      events.length > 0
        ? Math.max(...events.map((e) => e.year))
        : currentYear - 1;

    const newYear = Math.max(lastYear + 1, currentYear);

    setSelectedYear(newYear);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    // selectedYear를 null로 설정하여 완전히 폼을 닫음
    setTimeout(() => {
      setSelectedYear(null);
    }, 100); // 약간의 지연을 두어 UI 전환을 부드럽게 함
  };

  const selectedEvent = selectedYear ? getEventByYear(selectedYear) : null;

  return (
    <div className="min-h-[calc(100vh-140px)]">
      <div className="w-full min-h-[calc(100vh-140px)] flex">
        <BaselineView
          onNodeClick={handleNodeClick}
          onAddNode={handleAddNode}
          selectedYear={selectedYear}
          events={events}
        />

        {/* 폼이 열려있을 때만 폼 표시 */}
        {isFormOpen && selectedYear && (
          <BaselineSetupForm
            isOpen={isFormOpen}
            selectedYear={selectedYear}
            existingEvent={selectedEvent}
            onClose={handleFormClose}
          />
        )}

        {/* 폼이 열려있지 않을 때 콘텐츠 표시 */}
        {!isFormOpen && (
          <div className="flex flex-col flex-1 justify-start pl-[16.15vw] bg-[linear-gradient(246deg,_rgba(217,217,217,0)_41.66%,_rgba(130,79,147,0.15)_98.25%)]">
            <div className="text-white pt-[116px]">
              {events.length > 0 ? (
                <ul className="flex flex-col gap-[170px]">
                  {[0, 1, 2, 3, 4].map((i) => {
                    const event = events[i];
                    if (event) {
                      return (
                        <li key={i} className="flex items-center gap-[6.8vw]">
                          <h4 className="w-[26.6vw] h-21 text-[28px] line-clamp-2">
                            &quot;{event.eventTitle}&quot;
                          </h4>
                          <p className="text-xl line-clamp-2">
                            {event.actualChoice}
                          </p>
                        </li>
                      );
                    } else {
                      return (
                        <li
                          key={i}
                          className="flex items-center gap-[6.8vw] text-gray-400"
                        >
                          <h4 className="w-[26.6vw] h-21 text-[28px]">
                            노드를 클릭해 분기를 입력해 주세요
                          </h4>
                        </li>
                      );
                    }
                  })}
                </ul>
              ) : (
                <div className="absolute letf-[50%] top-[20%]">
                  <h2 className="text-4xl font-semibold mb-8">
                    인생 분기점 기록하기
                  </h2>
                  <p className="text-2xl text-gray-300 mb-12">
                    왼쪽 노드를 클릭해서 당신의 중요한 선택들을 기록해보세요
                  </p>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 max-w-md">
                    <h3 className="text-xl mb-4 text-deep-navy">
                      시작하는 방법
                    </h3>
                    <ol className="text-left text-gray-500 space-y-2">
                      <li>1. 왼쪽 타임라인의 노드를 클릭하세요</li>
                      <li>2. 그 시기의 중요한 선택을 입력하세요</li>
                      <li>3. 실제로 어떤 결정을 했는지 기록하세요</li>
                      <li>4. 저장하면 타임라인에 반영됩니다</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
