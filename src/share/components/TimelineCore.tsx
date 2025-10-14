interface TimelineCoreProps {
  years: number[];
  renderContent: (year: number, index: number) => React.ReactNode;
  height?: string;
  layout?: "horizontal" | "vertical";
  className?: string;
}

export const TimelineCore = ({
  years,
  renderContent,
  height = "h-[300px]",
  layout = "horizontal",
  className = "",
}: TimelineCoreProps) => {
  // 모바일 세로 레이아웃
  if (layout === "vertical") {
    return (
      <div className="relative">
        <div className="space-y-8">
          {years.map((year, index) => (
            <div key={`${year}-${index}`} className="relative pl-12">
              {index !== years.length - 1 && (
                <div className="absolute left-[23px] top-12 w-[2px] h-full bg-midnight-blue opacity-30" />
              )}

              <div className="absolute left-4 top-0 w-[15px] h-[15px] bg-white border-4 border-midnight-blue rounded-full z-10" />

              <div className="relative">{renderContent(year, index)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // pc 가로 레이아웃
  return (
    <div className={`relative ${height} md:overflow-x-auto ${className}`}>
      <div className="flex items-center min-w-max -space-x-[28.5px]">
        {years.map((year, index) => (
          <div
            key={`${year}-${index}`}
            className={`relative flex flex-col items-center ${
              index % 2 !== 0 ? "pb-15" : "flex-col-reverse pt-15"
            }`}
          >
            {renderContent(year, index)}

            <div
              className={`relative flex justify-start items-center h-32 ${
                index % 2 !== 0 ? "order-2" : "order-1"
              }`}
            >
              <svg
                className="w-[145px] h-[65px]"
                viewBox="0 0 200 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
              >
                <path
                  d={
                    index % 2 !== 0
                      ? "M10.1,100 A90,90 0 0,1 189.9,100"
                      : "M10.1,0 A90,90 0 0,0 189.9,0"
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-midnight-blue"
                />
              </svg>

              <div
                className={`absolute left-1/2 -translate-x-1/2 transform w-[15px] h-[15px] bg-white border-4 border-midnight-blue rounded-full z-10 ${
                  index % 2 !== 0 ? "bottom-8" : "bottom-[6px]"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
