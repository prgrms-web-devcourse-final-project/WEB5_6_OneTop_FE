"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import {
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
} from "react-icons/tb";

interface BaseNodeHeaderViewProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const BaseNodeHeaderView = ({
  isOpen,
  onClose,
  isMobile,
}: BaseNodeHeaderViewProps) => {
  return (
    <div
      key={isOpen ? "modal-open" : "modal-closed"}
      className={`
        fixed bg-midnight-blue text-white z-10 transition-transform duration-300
        ${
          isMobile
            ? `left-0 bottom-0 w-full h-[50vh] rounded-t-2xl ${
                isOpen ? "translate-y-0" : "translate-y-full"
              }`
            : `left-0 top-15 h-[calc(100vh-64px)] w-100 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
        }
      `}
    >
      <div className="relative">
        <div className="h-12 flex items-center justify-end px-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div
        className="px-8 pb-8 h-[calc(100%-3rem)] overflow-y-auto custom-scrollbar"
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex flex-col gap-6">
          {/* 제목 */}
          <h2 className="text-white text-xl font-bold">시나리오 기록 사용법</h2>

          {/* 단계 안내 */}
          <div className="flex flex-col gap-4">
            <p className="flex items-center gap-2">
              <TbCircleNumber1 className="w-4 h-4 sm:w-5 sm:h-5" /> 노드를
              클릭해보세요.
            </p>
            <p className="flex items-center gap-2">
              <TbCircleNumber2 className="w-4 h-4 sm:w-5 sm:h-5" /> 선택지를
              입력하면 다음 노드가 생성됩니다.
            </p>
            <p className="flex items-center gap-2">
              <TbCircleNumber3 className="w-4 h-4 sm:w-5 sm:h-5" /> 마지막
              선택지까지 입력하면 시나리오가 생성됩니다.
            </p>
          </div>

          {/* 추가 정보 */}
          <div className="bg-slate-700/50 rounded-lg p-4 text-sm text-slate-300 space-y-2">
            <p>• AI가 선택 상황을 안내하고, 추천 답변도 활용할 수 있습니다.</p>
            <p>
              • 새로 생성된 노드에서도 추가 시나리오를 만들어볼 수 있습니다.
            </p>
            <p>• 시나리오 생성 후에는 AI가 분석한 결과를 확인할 수 있습니다.</p>
            <p>• 생성된 시나리오와 현재 인생을 비교해보세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseNodeHeaderView;
