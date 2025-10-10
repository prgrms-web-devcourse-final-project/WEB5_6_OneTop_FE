import { BannerSection } from "@/share/components/BannerSection";
import PostWriteForm from "@/domains/community/components/PostWriteForm";

function Page() {
  return (
    <>
      <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)] pt-15">
        <BannerSection>
          <div className=" border-b border-gray-300 p-4 text-2xl font-semibold my-16">
            글작성
          </div>
        </BannerSection>

        <PostWriteForm />
      </div>
    </>
  );
}
export default Page;
