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
          index % 2 !== 0 ? "top-[10px]" : "top-[95px]"
        }`}
      >
        {/* 평행우주 (위쪽) */}
        {hasCompare && (
          <div className="mb-4 w-[140px]">
            {yearData.compare.map((item, idx) => (
              <div
                key={`compare-${idx}`}
                className="flex items-start gap-1 mb-2 justify-center"
              >
                <div className="w-2 h-2 bg-midnight-blue rounded-full mt-1.5 flex-shrink-0"></div>
                <p className="text-sm text-gray-800 break-keep line-clamp-2 text-left">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 연결선 (평행우주가 있을 때) */}
        {hasCompare && <div className="w-[1px] h-5 bg-gray-300 mb-2"></div>}

        {/* 연도 원형 */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full border border-midnight-blue text-xl font-semibold bg-white">
          {year}
        </div>

        {/* 연결선 (현재가 있을 때) */}
        {hasBase && <div className="w-[1px] h-5 bg-gray-300 mt-2"></div>}

        {/* 현재 (아래) */}
        {hasBase && (
          <div className="mt-4 w-[140px]">
            {yearData.base.map((item, idx) => (
              <div
                key={`base-${idx}`}
                className="flex items-start gap-1 mb-2 justify-center"
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <p className="text-sm text-gray-800 break-keep line-clamp-2 text-left">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1440px] m-auto bg-white p-7 pb-[50px] rounded-lg border border-gray-200">
      <div className="flex items-center mb-7">
        <h3 className="text-[22px] font-semibold">타임라인</h3>
      </div>

      <div className="flex justify-center gap-6 mb-7">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-midnight-blue rounded-full"></div>
          <span className="text-sm text-gray-600">평행우주</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-600">현재</span>
        </div>
      </div>

      <TimelineCore
        years={years}
        renderContent={renderContent}
        height="h-[350px]"
      />
    </div>
  );
};
