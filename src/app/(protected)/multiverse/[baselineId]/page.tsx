import { Metadata } from "next";
import TreeFlow from "@/domains/multiverse/components/TreeFlow";

export const metadata = (): Metadata => ({
  title: `Re:Life | multiverse`,
  description: "생성한 multiverse를 확인해보세요.",
});

const Page = () => {
  return <TreeFlow />;
};

export default Page;
