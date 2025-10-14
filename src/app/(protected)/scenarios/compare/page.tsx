import { Metadata } from "next";
import { BannerSection } from "@/share/components/BannerSection";
import { ScenarioCompareContainer } from "@/domains/scenarios/components/compare/ScenarioCompareContainer";

export const metadata: Metadata = {
  title: "인생 비교 분석 | Re:Life",
  description:
    "다른 선택, 다른 결과, AI 평행우주 시나리오와 현재 인생 분석 결과를 보여드립니다.",
};

export default function Page() {
  return (
    <div className="w-full min-h-[calc(100vh-140px)]">
      <BannerSection
        title="인생 비교 분석"
        description="현재 vs 평행우주 - 당신의 선택이 만든 두 개의 인생"
      />
      <ScenarioCompareContainer />
    </div>
  );
}
