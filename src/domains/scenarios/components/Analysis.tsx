import { PiWarningCircleFill } from "react-icons/pi";
import { FaLightbulb } from "react-icons/fa";
import { Tooltip } from "@/share/components/Tooltip";
import { AnalysisProps } from "../types";

export const Analysis = ({ data }: AnalysisProps) => {
  return (
    <div className="bg-white p-5 md:p-7 rounded-lg border border-gray-200">
      <div className="flex items-center mb-7">
        <h3 className="flex items-center gap-1 text-[22px] font-semibold">
          AI 분석
          <Tooltip
            contents="- 개인의 특별한 상황은 반영되지 않을 수 있습니다.
                      - 예상치 못한 외부 변수가 결과를 바꿀 수 있습니다.
                      - 확률적 예측이므로 100% 정확하지 않습니다."
            className="w-[300px] ml-2 shadow-xl"
          >
            <PiWarningCircleFill size={24} />
          </Tooltip>
        </h3>
      </div>

      <ul className="flex flex-col gap-4 mb-5">
        <li className="flex flex-col gap-1">
          <span className="relative inline-block pl-[10px] text-base font-medium before:absolute before:content-[''] before:inline-block before:w-[5px] before:h-[5px] before:bg-gray-800 before:left-0 before:top-[9px] before:rounded-full">
            경제
          </span>
          <p className="text-gray-800 text-base">{data.economy}</p>
        </li>
        <li className="flex flex-col gap-1">
          <span className="relative inline-block pl-[10px] text-base font-medium before:absolute before:content-[''] before:inline-block before:w-[5px] before:h-[5px] before:bg-gray-800 before:left-0 before:top-[9px] before:rounded-full">
            건강
          </span>
          <p className="text-gray-800 text-base">{data.health}</p>
        </li>
        <li className="flex flex-col gap-1">
          <span className="relative inline-block pl-[10px] text-base font-medium before:absolute before:content-[''] before:inline-block before:w-[5px] before:h-[5px] before:bg-gray-800 before:left-0 before:top-[9px] before:rounded-full">
            관계
          </span>
          <p className="text-gray-800 text-base">{data.relationships}</p>
        </li>
        <li className="flex flex-col gap-1">
          <span className="relative inline-block pl-[10px] text-base font-medium before:absolute before:content-[''] before:inline-block before:w-[5px] before:h-[5px] before:bg-gray-800 before:left-0 before:top-[9px] before:rounded-full">
            직업
          </span>
          <p className="text-gray-800 text-base">{data.jobs}</p>
        </li>
        <li className="flex flex-col gap-1">
          <span className="relative inline-block pl-[10px] text-base font-medium before:absolute before:content-[''] before:inline-block before:w-[5px] before:h-[5px] before:bg-gray-800 before:left-0 before:top-[9px] before:rounded-full">
            행복
          </span>
          <p className="text-gray-800 text-base">{data.happiness}</p>
        </li>
      </ul>
    </div>
  );
};
