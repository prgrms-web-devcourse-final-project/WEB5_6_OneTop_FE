"use client";
import Link from "next/link";
import React from "react";
import { IoClose } from "react-icons/io5";

interface EndingBaseNodeViewProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const EndingBaseNodeView = ({
  isOpen,
  onClose,
  isMobile,
}: EndingBaseNodeViewProps) => {
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
        <div className="h-full flex flex-col items-center justify-center gap-6 text-center">
          <p className="text-slate-300">다른 인생을 기록하시고 싶으신가요?</p>

          <Link
            href="/baselines"
            className="w-full max-w-xs p-3 bg-deep-navy rounded-lg text-sm font-medium transition-colors text-center block"
          >
            다른 인생 기록 생성
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EndingBaseNodeView;
