import MyPageContainer from "@/domains/my-page/components/MyPageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Re:Life | 마이페이지",
  description: "당신의 정보를 확인해보세요.",
};

export default function Page() {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] pt-[60px]">
      <MyPageContainer />
    </div>
  );
}
