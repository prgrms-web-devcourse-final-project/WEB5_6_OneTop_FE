"use client";

import { useEffect, useRef, useState } from "react";

import { Tooltip } from "@/share/components/Tooltip";
import { useMobileDetection } from "@/share/hooks/useMobileDetection";
import { BaselineNode } from "./BaselineNode";
import { LifeEvent } from "../types";
import { PiPlus } from "react-icons/pi";

type ExtendedEvent = LifeEvent & { isTemp?: boolean };

type NodeItem = {
  id: string;
  year: number | null;
  age: number | null;
  hasEvent: boolean;
  index: number;
  isTemp: boolean;
  event?: ExtendedEvent | null;
};

interface Props {
  onNodeClick: (year: number, age: number, isEmpty?: boolean) => void;
  onAddNode: () => void;
  onDeleteTempNode: (year: number) => void;
  selectedYear: number | null;
  events: ExtendedEvent[];
  tempNodes: Array<{ year: number; age: number }>;
  footerHeight?: number;
  isGuest: boolean;
  canAddMore: boolean;
  maxNodes: number;
  emptyNodesCount: number;
}

export const BaselineView = ({
  onNodeClick,
  onAddNode,
  onDeleteTempNode,
  selectedYear,
  events,
  tempNodes,
  footerHeight = 80,
  isGuest,
  canAddMore,
  maxNodes,
}: Props) => {
  // 실제 이벤트만 필터링
  const realEvents = events.filter((event) => !event.isTemp);
  const totalRealNodes = realEvents.length;
  const totalTempNodes = tempNodes.length;

  // 실제 이벤트 노드
  const eventNodes: NodeItem[] = realEvents
    .sort((a, b) => a.year - b.year)
    .map((event, index) => ({
      id: `event-${event.year}-${index}`,
      year: event.year,
      age: event.age,
      hasEvent: true,
      index: index,
      isTemp: false,
      event: event,
    }));

  // 임시 노드
  const tempNodeItems: NodeItem[] = tempNodes
    .sort((a, b) => a.year - b.year)
    .map((temp, index) => ({
      id: `temp-${temp.year}-${index}`,
      year: temp.year,
      age: temp.age,
      hasEvent: false,
      index: eventNodes.length + index,
      isTemp: true,
      event: null,
    }));

  // 기본 빈 노드: 3개만 표시
  const baseNodeCount = 3;
  const currentFilledNodes = totalRealNodes + totalTempNodes;
  const emptyNodesCount = Math.max(0, baseNodeCount - currentFilledNodes);

  const emptyNodes: NodeItem[] = Array.from(
    { length: emptyNodesCount },
    (_, index) => ({
      id: `empty-${index}`,
      year: null,
      age: null,
      hasEvent: false,
      index: eventNodes.length + tempNodeItems.length + index,
      isTemp: false,
      event: null,
    })
  );

  // 전체 노드 = 실제 이벤트 + 임시 노드 + 빈 노드
  const allNodes = [...eventNodes, ...tempNodeItems, ...emptyNodes];

  const selectedRef = useRef<HTMLDivElement | null>(null);
  const lastNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedRef.current) {
      const rect = selectedRef.current.getBoundingClientRect();
      const offsetTop = window.scrollY + rect.top - 162;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  }, [selectedYear]);

  const [bottomPosition, setBottomPosition] = useState(30);
  const isMobile = useMobileDetection(768);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (distanceFromBottom <= footerHeight) {
        const adjustment =
          ((footerHeight - distanceFromBottom) / footerHeight) * 70;
        setBottomPosition(30 + adjustment);
      } else {
        setBottomPosition(30);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [footerHeight]);

  return (
    <div className="relative w-[21.5vw] py-[60px] bg-[#292929]">
      <div className="flex flex-col gap-[120px]">
        {allNodes.map((node, idx) => {
          const isSelected = node.year !== null && selectedYear === node.year;
          const isLastNode = idx === allNodes.length - 1;

          return (
            <BaselineNode
              key={node.id}
              year={node.year ?? 0}
              age={node.age ?? 0}
              isSelected={isSelected}
              hasEvent={node.hasEvent}
              event={node.event}
              onClick={() => {
                if (node.year !== null && node.age !== null) {
                  onNodeClick(node.year, node.age, !node.hasEvent);
                } else {
                  onNodeClick(0, 0, true);
                }
              }}
              onDelete={
                node.isTemp ? () => onDeleteTempNode(node.year!) : undefined
              }
              showConnector={!isLastNode}
              isTemp={node.isTemp}
              innerRef={
                isSelected ? selectedRef : isLastNode ? lastNodeRef : undefined
              }
            />
          );
        })}
      </div>

      {/* 추가 버튼 */}
      <div
        className={`fixed left-8 z-50 ${
          isMobile ? "left-4" : "left-8"
        } transition-all duration-300`}
        style={{ bottom: `${bottomPosition}px` }}
      >
        <button
          onClick={onAddNode}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 bg-gray-400 text-white hover:scale-105"
        >
          <Tooltip
            contents={
              isGuest
                ? "게스트는 분기점 추가가 불가능합니다. 로그인하면 최대 10개까지 작성할 수 있습니다."
                : !canAddMore
                ? `최대 ${maxNodes}개까지만 작성 가능합니다`
                : `새 분기점을 추가합니다 (최대 ${maxNodes}개)`
            }
            className="w-[220px] ml-2 text-center"
          >
            <PiPlus size={24} />
          </Tooltip>
        </button>
      </div>
    </div>
  );
};
