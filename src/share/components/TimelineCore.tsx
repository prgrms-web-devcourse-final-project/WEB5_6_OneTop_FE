interface TimelineCoreProps {
  years: number[];
  renderContent: (year: number, index: number) => React.ReactNode;
  height?: string;
}

export const TimelineCore = ({
  years,
  renderContent,
  height = "h-[250px]",
}: TimelineCoreProps) => {
  return (
    <div className={`relative ${height} overflow-x-auto`}>
      <div className="flex items-center min-w-max -space-x-[28.5px]">
        {years.map((year, index) => (
          <div
            key={`${year}-${index}`}
            className={`relative flex flex-col items-center ${
              index % 2 !== 0 ? "pb-15" : "flex-col-reverse pt-15"
            }`}
          >
            {/* 컨텐츠 */}
            {renderContent(year, index)}

            {/* SVG 반원 */}
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

              {/* 연결점 */}
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
