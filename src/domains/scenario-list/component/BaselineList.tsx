import EmptyState from "@/share/components/EmptyState";
import { Baseline as BaselineType } from "../types";
import Baseline from "./Baseline";

interface BaselineListProps {
  baselines: BaselineType[];
  currentPage: number;
  pageSize: number;
  className?: string;
}

function BaselineList({ baselines, currentPage, pageSize }: BaselineListProps) {
  if (!baselines || baselines.length === 0) {
    // 데이터 없을 때
    if (currentPage === 1) {
      return (
        <EmptyState
          title="생성된 인생 기록이 없습니다."
          description="먼저 베이스라인에서 인생 분기점을 입력해주세요."
          linkText="베이스라인 입력하러 가기"
          linkHref="/baselines"
          showBackground={false}
        />
      );
    }

    // 2페이지 이상이나 삭제해서 생긴 빈 페이지
    return (
      <EmptyState
        title="빈 페이지입니다."
        description="베이스라인이 삭제되었습니다."
        linkText="첫 페이지로 돌아가기"
        linkHref="/scenario-list?page=1"
        showBackground={false}
      />
    );
  }

  return (
    <ul className="flex flex-col w-full gap-5 max-w-[1440px] m-auto pt-10 pb-10">
      {baselines.map((baseline) => (
        <Baseline
          key={baseline.baselineId}
          baseline={baseline}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      ))}
    </ul>
  );
}
export default BaselineList;
