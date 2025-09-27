import { Tooltip } from "@/share/components/Tooltip";
import tw from "@/share/utils/tw";
import { useState } from "react";
import { PiWarningCircleFill } from "react-icons/pi";

interface CustomProgressProps {
  progress: number;
  className?: string;
  title?: string;
  hint?: string | string[];
  max?: number;
  min?: number;
  onChange?: (value: number) => void;
}

function CustomProgress({
  progress,
  className,
  title,
  hint,
  max = 10,
  min = 0,
  onChange,
}: CustomProgressProps) {

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(Number(e.target.value));
    }
  };

  return (
    <div className={tw(`w-full flex flex-col`, className)}>
      {/* 상단 영역 */}
      <div className="w-full flex justify-between items-center text-white mb-4">
        <div className="flex items-center gap-2">
          {title && <div className="text-lg">{title}</div>}
          {/* description이 있으면 툴팁 표출 */}
          {hint && (
            <Tooltip
              contents={
                Array.isArray(hint)
                  ? <ul>{hint.map((item) => <li key={item}>{item}</li>)}</ul>
                  : hint
              }
              className="max-w-80 p-8"
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
