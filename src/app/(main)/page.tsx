import { Metadata } from "next";

export const metadata: Metadata = {
  title: "홈페이지",
  description: "홈페이지입니다.",
};

export default function Home() {
  return <div className="w-full flex-1">홈페이지입니다.</div>;
}
