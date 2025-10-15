import Link from "next/link";
import { Baseline as BaselineType } from "../types";
import DeleteBaselineButton from "./DeleteBaselineButton";

interface BaseLineItemProps {
  baseline: BaselineType;
  currentPage: number;
  pageSize: number;
}

function Baseline({ baseline, currentPage, pageSize }: BaseLineItemProps) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-5 md:gap-6">
      {/* 상단 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
        <h3 className="text-lg sm:text-xl font-medium text-gray-800 break-words">
          {baseline.title}
        </h3>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href={`/multiverse/${baseline.baselineId}`}
            className="flex h-9 px-4 sm:px-5 py-3 justify-center items-center gap-2.5 flex-shrink-0 rounded-md bg-deep-navy text-white text-sm sm:text-base hover:bg-opacity-90 transition whitespace-nowrap"
          >
            평행우주 조회
          </Link>
          <DeleteBaselineButton
            baselineId={baseline.baselineId}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* 하단 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div className="flex flex-wrap gap-2">
          {baseline.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs sm:text-sm bg-dusty-blue text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-sm sm:text-base text-gray-300 whitespace-nowrap">
          {new Date(baseline.createdDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default Baseline;
