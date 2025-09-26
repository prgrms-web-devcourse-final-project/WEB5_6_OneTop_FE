import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Re:Life | 로그인/게스트 선택",
  description: "Re:Life | 로그인/게스트 선택",
  icons: {
    icon: "/logo_64.svg",
  },
};

export const dynamic = "force-static";

function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default Layout;
