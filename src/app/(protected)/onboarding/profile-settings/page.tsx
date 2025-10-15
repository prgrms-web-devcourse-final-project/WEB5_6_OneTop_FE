import { Suspense } from "react";
import FormSlider from "@/domains/onboarding/components/FormSlider";
import { getMyInfo } from "@/domains/onboarding/api/getMyInfo";
import { redirect } from "next/navigation";

// Protected 라우트라서 SEO는 간단하게
export function generateMetadata() {
  return {
    title: "프로필 설정 | Re:Life",
    robots: { index: false, follow: false }, // Protected 라우트라서 인덱싱 안함
  };
}

async function Page() {
  const data = await getMyInfo();

  if (typeof data?.mbti === "string") {
    redirect("/baselines");
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-white text-xl">프로필 설정을 불러오는 중입니다.</div>
          </div>
        </div>
      }
    >
      <FormSlider initialStep={0} />
    </Suspense>
  );
}

export default Page;
