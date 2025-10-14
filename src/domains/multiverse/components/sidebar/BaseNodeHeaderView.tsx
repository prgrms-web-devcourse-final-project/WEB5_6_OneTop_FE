"use client";

import React from "react";
import { IoClose } from "react-icons/io5";

interface BaseNodeHeaderViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const BaseNodeHeaderView = ({ isOpen, onClose }: BaseNodeHeaderViewProps) => {
  return (
    <div
      className={`fixed left-0 top-15 h-[calc(100vh-64px)] w-100 bg-midnight-blue text-white z-10 transition-transform duration-300 overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition-colors"
      >
        <IoClose className="w-6 h-6" />
      </button>

      <div className="h-full flex flex-col items-center justify-center gap-10 px-6 max-w-md mx-auto">
        {/* 제목 */}
        <h2 className="text-white text-xl font-bold text-left w-full">
          시나리오 기록 사용법
        </h2>

        {/* 단계 안내 */}
        <div className="w-full text-left flex flex-col gap-4">
          <p className="text-white">1️⃣ 노드를 클릭해보세요.</p>
          <p className="text-white">
            2️⃣ 선택지를 입력하면 다음 노드가 생성됩니다.
          </p>
          <p className="text-white">
            3️⃣ 마지막 선택지까지 입력하면 시나리오가 생성됩니다.
          </p>
        </div>

        {/* 추가 정보 */}
        <div className="bg-slate-700/50 rounded-lg p-4 text-sm text-slate-300 w-full space-y-2">
          <p>• AI가 선택 상황을 안내하고, 추천 답변도 활용할 수 있습니다.</p>
          <p>• 새로 생성된 노드에서도 추가 시나리오를 만들어볼 수 있습니다.</p>
          <p>• 시나리오 생성 후에는 AI가 분석한 결과를 확인할 수 있습니다.</p>
          <p>• 생성된 시나리오와 현재 인생을 비교해보세요.</p>
        </div>
      </div>
    </div>
  );
};

export default BaseNodeHeaderView;
