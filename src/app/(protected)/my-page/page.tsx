import MyPageContainer from "@/domains/my-page/components/MyPageContainer";
import { getAuthUser } from "@/domains/auth/api/getAuthUser";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지 | Re:Life",
  description: "당신의 정보를 확인해보세요.",
};

export default async function Page() {
  const user = await getAuthUser();

  if (!user || user.authProvider === "GUEST") {
    redirect("/");
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)] pt-[60px]">
      <MyPageContainer />
    </div>
  );
}
