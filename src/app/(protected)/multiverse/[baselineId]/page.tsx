import { notFound } from "next/navigation";
import { Metadata } from "next";
import TreeFlow from "@/domains/multiverse/components/TreeFlow";

export const metadata: Metadata = {
  title: `multiverse | Re:Life`,
  description: "생성한 multiverse를 확인해보세요.",
};

interface PageProps {
  params: Promise<{ baselineId: number }>;
}

const Page = async ({ params }: PageProps) => {
  const { baselineId } = await params;
  const baselineIdNum = Number(baselineId);

  if (!baselineId || isNaN(baselineIdNum)) {
    notFound();
  }

  return <TreeFlow baselineId={baselineIdNum} />;
};

export default Page;
