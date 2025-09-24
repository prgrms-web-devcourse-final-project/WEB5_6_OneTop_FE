"use client";

import { LifeEvent } from "@/share/stores/baselineStore";
import { BaselineNode } from "./BaselineNode";
import { GoPlusCircle } from "react-icons/go";

interface Props {
  onNodeClick: (year: number, age: number) => void;
  onAddNode: () => void;
  selectedYear: number | null;
  events: LifeEvent[];
}

export const BaselineView = ({
  onNodeClick,
  onAddNode,
  selectedYear,
  events,
}: Props) => {
  const maxNodes = 10;
  const canAddMore = events.length < maxNodes;

  // 이벤트가 있는 노드들
  const eventNodes = events.map((event) => ({
    year: event.year,
    age: event.age,
    hasEvent: true,
  }));

  // 빈 노드들 (임시 자리)
  const emptyNodesCount = Math.max(0, 5 - events.length);
  const emptyNodes = Array.from({ length: emptyNodesCount }, (_, index) => ({
    year: null, // 년도 없음
    age: null, // 나이 없음
    hasEvent: false,
  }));

  const allNodes = [
    ...eventNodes.sort((a, b) => a.year - b.year),
    ...emptyNodes,
  ].slice(0, maxNodes);

  return (
    <div className="relative w-[21.5vw] py-[100px] bg-black">
      <div className="flex flex-col gap-[138px]">
        {allNodes.map((node, index) => {
          const isSelected = node.hasEvent && selectedYear === node.year; // 이벤트 있는 노드만 선택 가능

          return (
            <BaselineNode
              key={
                node.hasEvent && node.year
                  ? `event-${node.year}`
                  : `empty-${index}`
              }
              year={node.year ?? 0} // number는 유지하되, isSelected는 hasEvent 있을 때만 true
              age={node.age ?? 0}
              isSelected={isSelected}
              hasEvent={node.hasEvent}
              event={
                node.hasEvent ? events.find((e) => e.year === node.year) : null
              }
              onClick={() =>
                onNodeClick(
                  node.year ?? new Date().getFullYear(),
                  node.age ?? 0
                )
              }
              showConnector={index < allNodes.length - 1}
            />
          );
        })}
      </div>

      {/* 플로팅 추가 버튼 */}
      {canAddMore && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={onAddNode}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
            title="새 분기점 추가"
          >
            <GoPlusCircle size={24} />
          </button>
          <div className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full border border-gray-600">
            {events.length}/10
          </div>
        </div>
      )}
    </div>
  );
};
