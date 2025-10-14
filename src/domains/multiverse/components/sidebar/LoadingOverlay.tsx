import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/space_developer.json";

interface LoadingOverlayProps {
  isPending: boolean;
}

const LoadingOverlay = ({ isPending }: LoadingOverlayProps) => {
  if (!isPending) return null;

  return (
    <div className="fixed top-15 inset-x-0 bottom-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-40">
      <div className="bg-slate-800/90 p-8 rounded-2xl text-center max-w-md shadow-2xl">
        <div className="w-48 h-48 mx-auto mb-4">
          <Lottie animationData={animationData} loop />
        </div>
        <h3 className="text-white text-2xl font-bold mb-3">
          AI가 시나리오를 분석하고 있습니다
        </h3>
        <p className="text-slate-400 text-sm mb-6">잠시만 기다려주세요</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
