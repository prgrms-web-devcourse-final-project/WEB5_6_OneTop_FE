import { TimelineProps } from "../../../domains/scenarios/types";

export const Timeline = ({ data }: TimelineProps) => {
  return (
    <div className="max-w-[1440px] m-auto bg-white p-7 pb-[50px] rounded-lg border border-gray-200">
      <div className="flex items-center mb-7">
        <h3 className="text-[22px] font-semibold">타임라인</h3>
      </div>

      <div className="relative h-[230px]">
        {/* 타임라인 아이템 */}
        <div className="flex items-center min-w-max -space-x-7">
          {data.map((item, index) => (
            <div
              key={`${item.year}-${index}`}
              className={`relative flex flex-col items-center ${
                index % 2 !== 0 ? "pb-15" : "flex-col-reverse pt-15"
              }`}
            >
              {/* 짝수/홀수에 따른 컨텐츠 배치 */}
              <div
                className={`absolute flex flex-col items-center z-10 ${
                  index % 2 !== 0 ? "top-[10px]" : "-bottom-[40px]"
                }`}
              >
                {/* 연도 원형 */}
                <div className="flex items-center justify-center w-20 h-20 rounded-full border border-midnight-blue text-xl font-semibold bg-white">
                  {item.year}
                </div>

                <h4 className="relative text-base font-semibold text-gray-800 mt-7 text-center before:absolute before:content-[''] before:block before:w-[1px] before:h-5 before:bg-gray-300 before:left-1/2 before:-translate-x-1/2 before:transform before:-top-6">
                  {item.title}
                </h4>
              </div>

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
    </div>
  );
};
