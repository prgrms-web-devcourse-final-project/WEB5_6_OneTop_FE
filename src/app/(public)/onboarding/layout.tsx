
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


async function Layout({ children, params }: { children: React.ReactNode, params: { redirectTo: string | null } }) {
  // TODO: 로그인 상태라면 redirect 처리

  const authUser = await getAuthUser();
  const parsedAuthUser = userResponseSchema.safeParse(authUser);
  const isLogin = parsedAuthUser.data?.message === "authenticated";

  if (isLogin && params.redirectTo) {
    redirect(params.redirectTo);
  } else if (isLogin) {
    redirect("/");
  }

  return <div>{children}</div>;
}

export default Layout;
