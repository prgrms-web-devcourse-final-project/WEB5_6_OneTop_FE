
import { getAuthUser } from "@/domains/auth/api/getAuthUser";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Re:Life | 로그인/게스트 선택",
  description: "Re:Life | 로그인/게스트 선택",
  icons: {
    icon: "/logo_64.svg",
  },
};

// 정적 렌더링에서는 쿠키 조회가 불가능하다.

async function Layout({ children }: { children: React.ReactNode }) {
  // TODO: 로그인 상태라면 redirect 처리
  const cookieStore = await cookies();
  const jsessionid = cookieStore.get("JSESSIONID");
  console.log(jsessionid);

  const userInfo = await getAuthUser();

  console.log(userInfo);

  return <div>{children}</div>;
}

export default Layout;
