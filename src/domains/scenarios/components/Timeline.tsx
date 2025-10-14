"use client";
import { TimelineCore } from "@/share/components/TimelineCore";
import { TimelineProps } from "../types";
import { useMobileDetection } from "@/share/hooks/useMobileDetection";

export const Timeline = ({ data }: TimelineProps) => {
  const isMobile = useMobileDetection(768);

  const years = data.map((item) => item.year);

  // 모바일용 세로 레이아웃
  const renderMobileContent = (year: number, index: number) => {
    const item = data.find((d) => d.year === year);
    if (!item) return null;

    return (
      <div className="flex items-center gap-4 w-full">
        <div className="relative flex flex-col items-center shrink-0">
          <div className="relative flex items-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full border border-midnight-blue text-base font-semibold bg-white z-10">
              {year}
            </div>

            <div className="relative w-[15px] h-[15px] bg-midnight-blue rounded-full -ml-2 z-10 after:absolute after:left-1 after:top-1 after:content-[''] after:block after:w-[7px] after:h-[7px] after:bg-white after:rounded-full"></div>
            <div className="w-6 h-[1px] bg-gray-300"></div>
          </div>
        </div>

        <div className="flex-1 text-left">
          <div className="space-y-1">
            <h4 className="text-base font-medium text-gray-800 break-keep">
              {item.title}
            </h4>
          </div>
        </div>
      </div>
    );
  };

  // PC용 가로 레이아웃
  const renderHorizontalContent = (year: number, index: number) => {
    const item = data.find((d) => d.year === year);
    if (!item) return null;

    return (
      <div
        className={`absolute flex flex-col items-center z-10 ${
          index % 2 !== 0 ? "top-[10px]" : "top-[95px]"
        }`}
      >
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
    <div className="max-w-[1440px] m-auto bg-white p-5 md:p-7 pb-10 md:pb-[50px] rounded-lg border border-gray-200">
      <div className="flex items-center mb-7">
        <h3 className="text-[22px] font-semibold">타임라인</h3>
      </div>

      {isMobile ? (
        <div className="relative space-y-6 before:content-[''] before:block before:absolute before:left-[40px] before:w-1 before:h-full before:bg-deep-navy">
          {years.map((year, index) => (
            <div key={`mobile-${year}`} className="relative">
              {renderMobileContent(year, index)}
            </div>
          ))}
        </div>
      ) : (
        <TimelineCore
          years={years}
          renderContent={renderHorizontalContent}
          layout="horizontal"
          height="h-[300px]"
        />
      )}
    </div>
  );
};
