import React from "react";

interface LoadingProgressProps {
  progress: number;
}

const LoadingProgress = ({ progress }: LoadingProgressProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h3 className="text-4xl text-white tracking-wider">평행우주 탐색 중</h3>

        {/* Progress Bar */}
        <div className="w-80 mx-auto space-y-3">
          <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-blue-400 transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${progress}%`,
                boxShadow:
                  progress > 0 ? "0 0 20px rgba(96, 165, 250, 0.5)" : "none",
              }}
            />
          </div>
          <div className="text-sm text-gray-300 font-medium">
            {Math.round(progress)}%
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
        <div className="mt-12 text-base text-gray-400 opacity-60">
          마우스를 움직이면서 잠시만 기다려주세요
        </div>
      </div>
    </div>
  );
};

export default LoadingProgress;
