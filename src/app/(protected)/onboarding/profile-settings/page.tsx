import { Suspense } from "react";
import FormSlider from "@/domains/onboarding/components/FormSlider";
import { getMyInfo } from "@/domains/onboarding/api/getMyInfo";
import { redirect } from "next/navigation";

// Protected 라우트라서 SEO는 간단하게
export function generateMetadata() {
  return {
    title: "Re:Life | 프로필 설정",
    robots: { index: false, follow: false }, // Protected 라우트라서 인덱싱 안함
  };
}

async function Page() {
  const data = await getMyInfo();

  if (typeof data?.mbti === "string") {
    redirect("/baselines");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormSlider initialStep={0} />
    </Suspense>
  );
}

export default Page;
