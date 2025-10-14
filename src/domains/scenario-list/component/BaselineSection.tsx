"use client";

import Loading from "@/share/components/Loading";
import { useBaselines } from "../hooks/useBaselines";
import BaselineList from "./BaselineList";
import Pagination from "@/share/components/Pagination";
import { showErrorToast } from "@/share/components/ErrorToast";
import Link from "next/link";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";

interface BaselineSectionProps {
  page: number;
  size: number;
}

export default function BaselineSection({ page, size }: BaselineSectionProps) {
  const { query } = useBaselines(page, size);
  const { data: baselineData, isLoading, error } = query;
  const { data: authData } = useAuthUser();

  const user = authData?.data;
  const isGuest = !user || user.authProvider === "GUEST";

  const baselines = baselineData?.items || [];
  const pageInfo = {
    currentPage: baselineData?.page || page,
    totalPages: baselineData?.totalPages || 1,
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    showErrorToast(error);
  }

  return (
    <>
      {baselines.length > 0 && !isGuest && (
        <div className="flex justify-end mt-6">
          <Link
            href="/baselines?new=true"
            className="flex h-9 px-5 py-3 justify-center items-center rounded-md bg-deep-navy text-white hover:bg-opacity-80 transition"
          >
            베이스라인 생성
          </Link>
        </div>
      )}

      <BaselineList baselines={baselines} currentPage={page} pageSize={size} />

      {baselines.length > 0 && (
        <Pagination
          currentPage={pageInfo.currentPage}
          totalPages={pageInfo.totalPages}
        />
      )}
    </>
  );
}
