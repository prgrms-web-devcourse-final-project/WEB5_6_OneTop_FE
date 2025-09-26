import { Tooltip } from "@/share/components/Tooltip";
import tw from "@/share/utils/tw";
import { useState } from "react";
import { PiWarningCircleFill } from "react-icons/pi";

interface CustomProgressProps {
  initialProgress: number;
  className?: string;
  title?: string;
  description?: string | string[];
  max?: number;
  min?: number;
  onChange?: (value: number) => void;
}

function CustomProgress({
  initialProgress,
  className,
  title,
  description,
  max = 10,
  min = 0,
  onChange,
}: CustomProgressProps) {
  const [progress, setProgress] = useState(initialProgress);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  return (
    <div className={tw(`w-full flex flex-col`, className)}>
      {/* 상단 영역 */}
      <div className="w-full flex justify-between items-center text-white mb-4">
        <div className="flex items-center gap-2">
          {title && <div className="text-lg">{title}</div>}
          {/* description이 있으면 툴팁 표출 */}
          {description && (
            <Tooltip
              contents={
                Array.isArray(description)
                  ? description.join("\n")
                  : description
              }
            >
              <PiWarningCircleFill size={24} />
            </Tooltip>
          )}
        </div>

        <div>{progress}</div>
      </div>

      {/* Progress 영역 */}
      <div>
        <input
          type="range"
          min={min}
          max={max}
          value={progress}
          onChange={handleProgressChange}
          className="w-full"
        />
      </div>

      <div className="text-gray-500 flex justify-between">
        <div>{min}</div>
        <div>{max}</div>
      </div>
    </div>
  );
}
export default CustomProgress;
