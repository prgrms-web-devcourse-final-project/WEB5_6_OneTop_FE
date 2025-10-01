import BaselineList from "@/domains/scenario-list/component/BaselineList";
import Pagination from "@/share/components/Pagination";
import { BannerSection } from "@/share/components/BannerSection";
import { nextFetcher } from "@/share/utils/nextFetcher";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "시나리오 기록 | Re:Life",
  description: "당신의 시나리오 기록들을 살펴보세요.",
};

type BaselineListParams = {
  page?: number;
  size?: number;
};

interface PageProps {
  searchParams: Promise<BaselineListParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const queryParams = await searchParams;
  const page = Number(queryParams.page) || 1;
  const size = 10;

  let baselines = [];
  let pageInfo = {
    currentPage: page,
    totalPages: 0,
  };

  // API 호출 (1-based)
  const apiUrl = new URL(`http://localhost:8080/api/v1/scenarios/baselines`);
  apiUrl.searchParams.set("page", page.toString());
  apiUrl.searchParams.set("size", size.toString());
  apiUrl.searchParams.set("sort", "createdDate,desc");

  try {
    const response = await nextFetcher(apiUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    baselines = data.content || [];
    pageInfo = {
      currentPage: data.number,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("API 호출 에러:", error);
    baselines = [];
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)]">
      <BannerSection
        title="나의 인생 시나리오"
        description="AI가 분석한 다양한 시점의 내 상황으로 평행우주를 탐험해보세요"
      />
      <div className="max-w-[1440px] m-auto">
        <BaselineList baselines={baselines} />
        <Pagination
          currentPage={pageInfo.currentPage}
          totalPages={pageInfo.totalPages}
        />
      </div>
    </div>
  );
}
