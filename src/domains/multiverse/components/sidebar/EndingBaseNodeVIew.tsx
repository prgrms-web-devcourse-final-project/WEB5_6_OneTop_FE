"use client";

import Link from "next/link";
import React from "react";
import { IoClose } from "react-icons/io5";

interface EndingBaseNodeViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const EndingBaseNodeView = ({ isOpen, onClose }: EndingBaseNodeViewProps) => {
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
  );
};

export default EndingBaseNodeView;
