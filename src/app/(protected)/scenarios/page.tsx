import { Metadata } from "next";
import { BannerSection } from "@/share/components/BannerSection";
import { ScenarioContainer } from "@/domains/scenarios/components/ScenarioContainer";

export const metadata: Metadata = {
  title: "Re:Life | 시나리오 분석",
  description:
    "다른 선택, 다른 결과, AI 평행우주 시나리오 분석 결과를 보여드립니다.",
};

export default function Page() {
  return (
    <div className="w-full min-h-[calc(100vh-140px)]">
      <BannerSection
        title="시나리오 분석"
        description="AI가 분석한 당신의 인생 시나리오"
      />
      <ScenarioContainer />
    </div>
  );
}
