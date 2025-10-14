import { Metadata } from "next";
import { BaselineContainer } from "@/domains/baselines/components/BaselineContainer";

export const metadata: Metadata = {
  title: "베이스라인 설정 | Re:Life",
  description: "당신의 인생 분기점들을 기록하여 베이스라인을 만들어보세요.",
};

export default function Page() {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] pt-[60px] bg-deep-navy">
      <BaselineContainer />
    </div>
  );
}
