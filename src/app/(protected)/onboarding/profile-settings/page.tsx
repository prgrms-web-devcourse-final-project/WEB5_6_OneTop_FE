import { Suspense } from "react";
import FormSlider from "@/domains/onboarding/components/FormSlider";
import { getAuthUser } from "@/domains/auth/api/getAuthUser";

// Protected 라우트라서 SEO는 간단하게
export function generateMetadata() {
  return {
    title: "Re:Life | 프로필 설정",
    robots: { index: false, follow: false }, // Protected 라우트라서 인덱싱 안함
  };
}

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormSlider initialStep={0} />
    </Suspense>
  );
}

export default Page;
