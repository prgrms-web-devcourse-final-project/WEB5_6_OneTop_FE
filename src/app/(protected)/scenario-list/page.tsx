import { BannerSection } from "@/share/components/BannerSection";
import BaselineSection from "@/domains/scenario-list/component/BaselineSection";
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
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const size = 10;

  return (
    <div className="w-full min-h-[calc(100vh-140px)]">
      <BannerSection
        title="나의 인생 시나리오"
        description="AI가 분석한 다양한 시점의 내 상황으로 평행우주를 탐험해보세요"
      />
      <div className="max-w-[1440px] m-auto">
        <BaselineSection page={page} size={size} />
      </div>
    </div>
  );
}
