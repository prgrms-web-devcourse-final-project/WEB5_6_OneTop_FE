import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Re:Life | 베이스라인 설정",
  description: "당신의 인생 분기점들을 기록하여 베이스라인을 만들어보세요.",
  icons: {
    icon: "/logo_64.svg",
  },
};

export const dynamic = "force-static";

function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default Layout;
