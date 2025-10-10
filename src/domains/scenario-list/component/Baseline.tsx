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
    <div className="border border-gray-100 rounded-lg p-8 flex flex-col gap-6">
      {/* 상단 */}
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-medium text-gray-800">{baseline.title}</h3>
        <div className="flex gap-2">
          <Link
            href={`/multiverse/${baseline.baselineId}`}
            className="flex h-9 px-5 py-3 justify-center items-center gap-2.5 flex-shrink-0 rounded-md bg-deep-navy text-white hover:bg-opacity-90 transition"
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
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {baseline.tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm bg-dusty-blue text-white px-4 py-2 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-base text-gray-300">{baseline.createdDate}</span>
      </div>
    </div>
  );
}

export default Baseline;
