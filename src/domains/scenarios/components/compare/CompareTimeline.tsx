import { TimelineCore } from "@/share/components/TimelineCore";
import { CompareTimelineProps } from "../../types";

export const CompareTimeline = ({ data }: CompareTimelineProps) => {
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

  const renderContent = (year: number, index: number) => {
    const yearData = groupedByYear[year];
    const hasBase = yearData?.base.length > 0;
    const hasCompare = yearData?.compare.length > 0;

    return (
      <div
        className={`absolute flex flex-col items-center z-10 ${
          index % 2 !== 0 ? "-top-[10px]" : "top-19"
        }`}
      >
        {/* 평행우주 (위쪽) */}
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

        {/* 연결점 (평행우주가 있을 때) */}
        {hasCompare && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 transform w-[15px] h-[15px] bg-white border-4 border-ivory rounded-full z-10 ${
              index % 2 !== 0 ? "top-[15px]" : "top-[14px]"
            }`}
          ></div>
        )}

        {/* 연결선 (평행우주가 있을 때) */}
        {hasCompare && <div className="w-[1px] h-5 bg-gray-300"></div>}

        {/* 연도 원형 */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full border border-midnight-blue text-xl font-semibold bg-white">
          {year}
        </div>

        {/* 연결선 (현재가 있을 때) */}
        {hasBase && <div className="w-[1px] h-5 bg-gray-300 mt-1"></div>}

        {/* 현재 (아래) */}
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
    <div className="relative max-w-[1440px] m-auto bg-white p-7 pb-[50px] rounded-lg border border-gray-200">
      <div className="flex items-center pb-25">
        <h3 className="text-[22px] font-semibold">타임라인</h3>
      </div>

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

      <TimelineCore
        years={years}
        renderContent={renderContent}
        height="h-[300px]"
      />
    </div>
  );
};
