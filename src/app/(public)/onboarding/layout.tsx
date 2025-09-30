import { getAuthUser } from "@/domains/auth/api/getAuthUser";
import { userResponseSchema } from "@/domains/auth/schemas/loginResponseSchema";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Re:Life | 로그인/게스트 선택",
  description: "Re:Life | 로그인/게스트 선택",
  icons: {
    icon: "/logo_64.svg",
  },
};

export const dynamic = "force-static";

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
