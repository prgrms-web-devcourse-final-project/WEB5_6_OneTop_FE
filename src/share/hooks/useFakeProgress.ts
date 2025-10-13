import { useState, useEffect } from "react";

interface UseFakeProgressOptions {
  isActive: boolean;
  isCompleted?: boolean;
}

export const useFakeProgress = ({
  isActive,
  isCompleted = false,
}: UseFakeProgressOptions) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 완료되면 100%로
    if (isCompleted) {
      setProgress(100);
      return;
    }

    // 비활성화되면 초기화
    if (!isActive) {
      setProgress(0);
      return;
    }

    // 진행률 자동 증가
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        if (prev >= 70) return prev + 0.3;
        if (prev >= 40) return prev + 0.8;
        return prev + 2;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isActive, isCompleted]);

  return progress;
};
