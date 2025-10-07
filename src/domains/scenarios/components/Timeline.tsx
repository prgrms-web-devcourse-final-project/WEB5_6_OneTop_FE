import { TimelineCore } from "@/share/components/TimelineCore";
import { TimelineProps } from "../types";

export const Timeline = ({ data }: TimelineProps) => {
  const years = data.map((item) => item.year);

  const renderContent = (year: number, index: number) => {
    const item = data.find((d) => d.year === year);
    if (!item) return null;

    return (
      <div
        className={`absolute flex flex-col items-center z-10 ${
          index % 2 !== 0 ? "top-[10px]" : "top-[95px]"
        }`}
      >
        {/* 연도 원형 */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full border border-midnight-blue text-xl font-semibold bg-white">
          {item.year}
        </div>

        <h4 className="relative w-[95%] text-base font-semibold text-gray-800 mt-7 text-center before:absolute before:content-[''] before:block before:w-[1px] before:h-5 before:bg-gray-300 before:left-1/2 before:-translate-x-1/2 before:transform before:-top-6">
          <p className="break-keep line-clamp-3">{item.title}</p>
        </h4>
      </div>
    );
  };

  return (
    <div className="max-w-[1440px] m-auto bg-white p-7 pb-[50px] rounded-lg border border-gray-200">
      <div className="flex items-center mb-7">
        <h3 className="text-[22px] font-semibold">타임라인</h3>
      </div>

      <TimelineCore years={years} renderContent={renderContent} />
    </div>
  );
};
