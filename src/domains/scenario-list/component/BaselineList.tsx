import EmptyState from "@/share/components/EmptyState";
import { Baseline as BaselineType } from "../types";
import Baseline from "./Baseline";

interface BaselineListProps {
  baselines: BaselineType[];
  className?: string;
}

function BaselineList({ baselines }: BaselineListProps) {
  if (!baselines || baselines.length === 0) {
    <EmptyState
      title="생성된 인생 기록이 없습니다."
      description="먼저 베이스라인에서 인생 분기점을 입력해주세요."
      linkText="베이스라인 입력하러 가기"
      linkHref="/baselines"
      showBackground={true}
    />;
  }

  return (
    <ul className="flex flex-col w-full space-y-5 max-w-[1440px] m-auto pt-20 pb-10">
      {baselines.map((baseline) => (
        <Baseline key={baseline.baselineId} baseline={baseline} />
      ))}
    </ul>
  );
}
export default BaselineList;
