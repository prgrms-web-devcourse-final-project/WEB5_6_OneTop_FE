"use client";

import Loading from "@/share/components/Loading";
import { useBaselines } from "../hooks/useBaselines";
import BaselineList from "./BaselineList";
import Pagination from "@/share/components/Pagination";
import { showErrorToast } from "@/share/components/ErrorToast";

interface BaselineSectionProps {
  page: number;
  size: number;
}

export default function BaselineSection({ page, size }: BaselineSectionProps) {
  const { query } = useBaselines(page, size);
  const { data, isLoading, error } = query;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    showErrorToast(error);
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
