import { Metadata } from "next";
import MainContainer from "@/domains/main/components/MainContainer";

export const metadata: Metadata = {
  title: "Re:Life",
  description:
    "만약 그때 다른 선택을 했다면? AI와 실제 통계로 확인하는 나만의 평행우주",
};

export default function Home() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)">
      <MainContainer />
    </div>
  );
}
