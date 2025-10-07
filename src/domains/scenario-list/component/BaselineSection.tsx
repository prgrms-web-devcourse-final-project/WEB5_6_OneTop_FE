"use client";

import { useBaselines } from "../hooks/useBaselines";
import BaselineList from "./BaselineList";
import Pagination from "@/share/components/Pagination";

interface BaselineSectionProps {
  page: number;
  size: number;
}

export default function BaselineSection({ page, size }: BaselineSectionProps) {
  const { query } = useBaselines(page, size);
  const { data, isLoading, error } = query;

  if (isLoading) {
    return <div className="p-4 text-center">불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        오류가 발생했습니다. 다시 시도해주세요.
      </div>
    );
  }

  const baselines = data?.items || [];
  const pageInfo = {
    currentPage: data?.page || page,
    totalPages: data?.totalPages || 1,
  };

  return (
    <>
      <BaselineList baselines={baselines} currentPage={page} pageSize={size} />
      <Pagination
        currentPage={pageInfo.currentPage}
        totalPages={pageInfo.totalPages}
      />
    </>
  );
}
