import { getBaselineList } from "../api/getBaselineList";
import BaselineList from "./BaselineList";
import Pagination from "@/share/components/Pagination";

interface BaselineSectionProps {
  page: number;
  size: number;
}

export default async function BaselineSection({
  page,
  size,
}: BaselineSectionProps) {
  const data = await getBaselineList(page, size);
  const baselines = data.items || [];
  const pageInfo = {
    currentPage: data.page,
    totalPages: data.totalPages,
  };

  return (
    <>
      <BaselineList baselines={baselines} />
      <Pagination
        currentPage={pageInfo.currentPage}
        totalPages={pageInfo.totalPages}
      />
    </>
  );
}
