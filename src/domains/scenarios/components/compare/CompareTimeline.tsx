"use client";
import { TimelineCore } from "@/share/components/TimelineCore";
import { CompareTimelineProps } from "../../types";
import { useMobileDetection } from "@/share/hooks/useMobileDetection";

export const CompareTimeline = ({ data }: CompareTimelineProps) => {
  const isMobile = useMobileDetection(768);

  const groupedByYear = data.reduce((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = { base: [], compare: [] };
    }
    if (item.type === "base") {
      acc[item.year].base.push(item);
    } else {
      acc[item.year].compare.push(item);
    }
    return acc;
  }, {} as Record<number, { base: { year: number; title: string }[]; compare: { year: number; title: string }[] }>);

  const years = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => a - b);

  // 모바일용 세로 레이아웃
  const renderMobileContent = (year: number, index: number) => {
    const yearData = groupedByYear[year];
    const hasBase = yearData?.base.length > 0;
    const hasCompare = yearData?.compare.length > 0;

    return (
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 text-right pr-3">
          {hasBase ? (
            <div className="space-y-1">
              {yearData.base.map((item, idx) => (
                <p
                  key={`base-${idx}`}
                  className="text-sm font-medium text-gray-800 break-keep"
                >
                  {item.title}
                </p>
              ))}
            </div>
          ) : (
            <div className="h-4"></div>
          )}
        </div>

        <div className="relative flex flex-col items-center shrink-0">
          {index !== 0 && <div className="w-[2px] h-8 bg-gray-300"></div>}

          <div className="relative flex items-center">
            {hasBase && (
              <>
                <div className="w-6 h-[2px] bg-gray-300 mr-1"></div>
                <div className="w-[10px] h-[10px] bg-ivory border-2 border-ivory rounded-full mr-1"></div>
              </>
            )}

            <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-midnight-blue text-base font-semibold bg-white shadow-sm z-10">
              {year}
            </div>

            {hasCompare && (
              <>
                <div className="w-[10px] h-[10px] bg-midnight-blue border-2 border-midnight-blue rounded-full ml-1"></div>
                <div className="w-6 h-[2px] bg-gray-300 ml-1"></div>
              </>
            )}
          </div>

          {index !== years.length - 1 && (
            <div className="w-[2px] h-8 bg-gray-300"></div>
          )}
        </div>

        <div className="flex-1 text-left pl-3">
          {hasCompare ? (
            <div className="space-y-1">
              {yearData.compare.map((item, idx) => (
                <p
                  key={`compare-${idx}`}
                  className="text-sm font-medium text-gray-800 break-keep"
                >
                  {item.title}
                </p>
              ))}
            </div>
          ) : (
            <div className="h-4"></div>
          )}
        </div>
      </div>
    );
  };

  // PC용 가로 레이아웃
  const renderDesktopContent = (year: number, index: number) => {
    const yearData = groupedByYear[year];
    const hasBase = yearData?.base.length > 0;
    const hasCompare = yearData?.compare.length > 0;

    return (
      <div
        className={`absolute flex flex-col items-center z-10 ${
          index % 2 !== 0 ? "-top-[10px]" : "top-19"
        }`}
      >
        {hasCompare && (
          <div className="flex items-end justify-center absolute -top-20 w-[135px] h-18">
            {yearData.compare.map((item, idx) => (
              <p
                key={`compare-${idx}`}
                className="text-base font-semibold text-gray-800 text-center break-keep line-clamp-3"
              >
                {item.title}
              </p>
            ))}
          </div>
        )}

        {hasCompare && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 transform w-[15px] h-[15px] bg-white border-4 border-ivory rounded-full z-10 ${
              index % 2 !== 0 ? "top-[15px]" : "top-[14px]"
            }`}
          ></div>
        )}

        {hasCompare && <div className="w-[1px] h-5 bg-gray-300"></div>}

        <div className="flex items-center justify-center w-20 h-20 rounded-full border border-midnight-blue text-xl font-semibold bg-white">
          {year}
        </div>

        {hasBase && <div className="w-[1px] h-5 bg-gray-300 mt-1"></div>}

        {hasBase && (
          <div className="flex items-start justify-center mt-1 w-[135px]">
            {yearData.base.map((item, idx) => (
              <p
                key={`base-${idx}`}
                className="text-base font-semibold text-gray-800 text-center break-keep line-clamp-3"
              >
                {item.title}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative max-w-[1440px] m-auto bg-white p-5 md:p-7 pb-10 md:pb-[50px] rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-lg md:text-[22px] font-semibold">타임라인</h3>
      </div>

      {isMobile && (
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-ivory rounded-full"></div>
            <span className="text-xs font-semibold text-gray-600">현재</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-midnight-blue rounded-full"></div>
            <span className="text-xs font-semibold text-midnight-blue">
              평행우주
            </span>
          </div>
        </div>
      )}

      {!isMobile && (
        <div className="absolute right-7 bottom-7 flex flex-col justify-center gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-midnight-blue rounded-full"></div>
            <span className="text-sm text-gray-800">평행우주</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-ivory rounded-full"></div>
            <span className="text-sm text-gray-800">현재</span>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="space-y-6">
          {years.map((year, index) => (
            <div key={`mobile-${year}`} className="relative">
              {renderMobileContent(year, index)}
            </div>
          ))}
        </div>
      ) : (
        <TimelineCore
          years={years}
          renderContent={renderDesktopContent}
          layout="horizontal"
          height="h-[400px]"
          className="md:pt-[90px] md:mb-[30px]"
        />
      )}
    </div>
  );
};
