"use client";

import { LifeEvent } from "../types";
import { IoCloseOutline } from "react-icons/io5";
import { PiPlus } from "react-icons/pi";

interface Props {
  year: number;
  age: number;
  isSelected: boolean;
  hasEvent: boolean;
  event?: LifeEvent | null;
  onClick: () => void;
  onDelete?: () => void;
  showConnector?: boolean;
  isTemp?: boolean; // 임시 노드 여부
  innerRef?: React.Ref<HTMLDivElement>;
}

export const BaselineNode = ({
  year,
  age,
  isSelected,
  hasEvent,
  event,
  onClick,
  onDelete,
  showConnector = true,
  isTemp = false,
  innerRef,
}: Props) => {
  const displayYear =
    hasEvent && event?.year
      ? `${event.year}`
      : year > 0
      ? `${year}`
      : "년도 입력";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className="relative -right-10" data-node>
      <div
        className={`flex items-center justify-end gap-5 h-[162px] ${
          showConnector
            ? "before:absolute before:content-[''] before:inline-block before:w-[6px] before:h-[160px] before:bg-white before:right-[37px] before:-top-[138px] before:rounded-full"
            : "before:absolute before:content-[''] before:inline-block before:w-[6px] before:h-[160px] before:bg-white before:right-[37px] before:-top-[138px] before:rounded-full after:absolute after:content-[''] after:inline-block after:w-[6px] after:h-[350px] after:bg-white after:right-[37px] after:top-[142px] after:rounded-full"
        }`}
      >
        {/* 연도와 이벤트 제목 표시 */}
        <div className="flex flex-col items-end gap-3">
          {/* 연도 표시 */}
          <div
            className={`text-[28px] font-semibold ${
              hasEvent ? "text-white" : "text-gray-400"
            }`}
          >
            {hasEvent && event?.year
              ? `${event.year}`
              : isTemp
              ? "년도 입력"
              : "년도 입력"}
          </div>

          {/* 이벤트 제목 또는 기본 안내 텍스트 */}
          <div className="relative text-[24px] max-w-[210px] text-right line-clamp-1">
            {event?.eventTitle ? (
              <span className="text-white">{event.eventTitle}</span>
            ) : (
              <span className="text-gray-400 text-sm">
                {isTemp
                  ? "노드를 클릭해 분기점을 입력해 주세요"
                  : "노드를 클릭해 분기점을 입력해 주세요"}
              </span>
            )}
          </div>

          {/* 이벤트 세부 정보 */}
          {event && hasEvent && (
            <div className="text-right max-w-[300px]">
              <div className="inline-block bg-dusty-blue text-white text-sm px-2 py-1 mb-2 rounded">
                {event.category}
              </div>
              <div className="text-gray-300 text-base line-clamp-1">
                {event.actualChoice}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex items-center" ref={innerRef}>
          {/* 임시 노드(빈 노드)에만 삭제 버튼 표시 */}
          {isTemp && onDelete && (
            <button
              onClick={handleDelete}
              className="absolute -top-2 -right-2 w-5 h-5 bg-[#E76F51] text-white rounded-full flex items-center justify-center text-xs"
              title="노드 삭제"
            >
              <IoCloseOutline size={14} />
            </button>
          )}

          {/* 노드 버튼 */}
          <button
            type="button"
            onClick={onClick}
            className={`relative flex items-center justify-center w-20 h-20 rounded-full text-xl hover:bg-dusty-blue hover:text-white transition-colors z-10 before:absolute before:content-[''] before:inline-block before:w-[6px] before:h-[6px] before:bg-gray-50 before:left-[50%] before:-translate-x-[50%] before:-top-3 before:rounded-full after:absolute after:content-[''] after:inline-block after:w-[6px] after:h-[6px] after:bg-gray-50 after:left-[50%] after:-translate-x-[50%] after:-bottom-4 after:rounded-full ${
              isSelected
                ? "bg-dusty-blue text-white"
                : hasEvent
                ? "bg-[#B8A082] text-white"
                : "bg-white text-gray-400"
            }`}
          >
            {hasEvent && event ? age : <PiPlus size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};
