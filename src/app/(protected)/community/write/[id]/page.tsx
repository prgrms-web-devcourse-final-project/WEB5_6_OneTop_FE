import { BannerSection } from "@/share/components/BannerSection";
import PostWriteForm from "@/domains/community/components/PostWriteForm";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPost } from "@/domains/community/api/getPost";
import { queryKeys } from "@/share/config/queryKeys";
import PostEditForm from "@/domains/community/components/PostEditForm";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.post.id(id),
    queryFn: () => getPost(id),
  });

  return (
    <>
      <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)] pt-15">
        <BannerSection>
          <div className=" border-b border-gray-300 p-4 text-2xl font-semibold my-16">
            글 수정
          </div>
        </BannerSection>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <PostEditForm />
        </HydrationBoundary>
      </div>
    </>
  );
}
export default Page;
