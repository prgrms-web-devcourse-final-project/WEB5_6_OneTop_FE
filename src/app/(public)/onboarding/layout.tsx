
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "로그인/게스트 선택 | Re:Life",
  description: "로그인/게스트 선택 | Re:Life",
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
