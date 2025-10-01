<<<<<<<<< Temporary merge branch 1
=========
import { getAuthUser } from "@/domains/auth/api/getAuthUser";
import { userResponseSchema } from "@/domains/auth/schemas/loginResponseSchema";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
>>>>>>>>> Temporary merge branch 2

export const metadata: Metadata = {
  title: "Re:Life | 로그인/게스트 선택",
  description: "Re:Life | 로그인/게스트 선택",
  icons: {
    icon: "/logo_64.svg",
  },
};

export const dynamic = "force-dynamic";

async function Layout({ children }: { children: React.ReactNode }) {
  // TODO: 로그인 상태라면 redirect 처리

  return <div>{children}</div>;
}

export default Layout;
