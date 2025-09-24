"use client";

import { LifeEvent } from "@/share/stores/baselineStore";

interface Props {
  year: number;
  age: number;
  isSelected: boolean;
  hasEvent: boolean;
  event?: LifeEvent | null; // ← null 허용
  onClick: () => void;
  showConnector?: boolean;
}

export const BaselineNode = ({
  year,
  age,
  isSelected,
  hasEvent,
  event,
  onClick,
  showConnector = true,
}: Props) => {
  // 렌더링할 표시값 (event 없으면 "년도 입력")
  const displayYear = hasEvent && event?.year ? `${event.year}` : "년도 입력";

  return (
    <div className="relative -right-10">
      <div className="flex items-center justify-end gap-7">
        {/* 연도와 이벤트 제목 표시 */}
        <div className="flex flex-col items-end">
          {/* 연도 표시 */}
          <div className="text-[28px] text-white font-semibold mb-1">
            {displayYear}
          </div>

          {/* 이벤트 제목 또는 기본 안내 텍스트 */}
          <div
            className={`relative text-[24px] font-semibold text-white max-w-[200px] text-right ${
              showConnector
                ? "before:absolute before:content-[''] before:inline-block before:w-[6px] before:h-[90px] before:bg-white before:-right-[71px] before:-top-[40px] before:rounded-full"
                : ""
            }`}
          >
            {event?.eventTitle ? (
              event.eventTitle
            ) : (
              <span className="text-gray-400 text-sm">
                노드를 클릭해 분기점을 입력해 주세요
              </span>
            )}
          </div>

          {/* 이벤트 세부 정보 */}
          {event && (
            <div className="ml-6 max-w-[300px]">
              <div className="text-gray-300 text-sm mb-2">
                {event.actualChoice}
              </div>
              <div className="inline-block bg-dusty-blue text-white text-xs px-2 py-1 rounded">
                {event.category}
              </div>
              {event.context && (
                <div className="text-gray-400 text-xs mt-1 line-clamp-2">
                  {event.context}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 노드 버튼 */}
        <button
          type="button"
          onClick={onClick}
          className={`relative w-20 h-20 rounded-full text-xl hover:bg-dusty-blue hover:text-white transition-colors z-10 ${
            showConnector
              ? "before:absolute before:content-[''] before:inline-block before:w-[6px] before:h-[6px] before:bg-gray-50 before:left-[50%] before:-translate-x-[50%] before:-top-3 before:rounded-full after:absolute after:content-[''] after:inline-block after:w-[6px] after:h-[6px] after:bg-gray-50 after:left-[50%] after:-translate-x-[50%] after:-bottom-4 after:rounded-full"
              : ""
          } ${
            isSelected
              ? "bg-dusty-blue text-white"
              : hasEvent
              ? "bg-[#B8A082] text-white"
              : "bg-white text-gray-400"
          }`}
        >
          {hasEvent && event ? age : "+"}
        </button>
      </div>
    </div>
  );
};
