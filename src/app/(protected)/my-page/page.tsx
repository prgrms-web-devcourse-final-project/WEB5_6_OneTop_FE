import MyPageContainer from "@/domains/my-page/components/MyPageContainer";
import { getAuthUser } from "@/domains/auth/api/getAuthUser";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "마이페이지 | Re:Life",
  description: "당신의 정보를 확인해보세요.",
};

export default async function Page() {
  const user = await getAuthUser();

  return (
    <div className="w-full min-h-[calc(100vh-140px)] pt-[60px]">
      {user && user.authProvider !== "GUEST" ? (
        <MyPageContainer />
      ) : (
        <div className="flex items-center justify-center w-full h-[calc(100vh-140px)]">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-medium">로그인이 필요한 서비스입니다.</p>
            <Link
              href="/"
              className="px-4 py-2 bg-deep-navy font-medium text-white rounded-md hover:bg-midnight-blue"
            >
              메인으로 가기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
