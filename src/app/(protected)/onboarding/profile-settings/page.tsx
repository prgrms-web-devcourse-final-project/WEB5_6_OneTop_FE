import FormSlider from "@/domains/onboarding/components/FormSlider";

// Protected 라우트라서 SEO는 간단하게
export function generateMetadata() {
  return {
    title: "프로필 설정",
    robots: { index: false, follow: false }, // Protected 라우트라서 인덱싱 안함
  };
}

function Page() {
  return (
    <>
    
      <FormSlider initialStep={0} />
    </>
  );
}
export default Page;
