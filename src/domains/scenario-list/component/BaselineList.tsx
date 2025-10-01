import { Baseline as BaselineType } from "../types";
import Baseline from "./Baseline";
import EmptyState from "./EmptyState";

interface BaselineListProps {
  baselines: BaselineType[];
  className?: string;
}

function BaselineList({ baselines }: BaselineListProps) {
  if (!baselines || baselines.length === 0) {
    return <EmptyState />;
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
