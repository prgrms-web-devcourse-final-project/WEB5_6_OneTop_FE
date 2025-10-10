// 빈 nesting 한 단계가 더 생기는 것이 별로인 것 같기도 한데 유저에게 제공되는 주소로는 조금 더 명확한 것 같기도 함.

import { getComments } from "@/domains/community/api/getComments";
import CommentWrite from "@/domains/community/components/CommentWrite";
import PostCommnet from "@/domains/community/components/PostCommnet";
import PostContent from "@/domains/community/components/PostContent";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";
import PostPoll from "@/domains/community/components/PostPoll";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.comment.get(id),
    queryFn: () => getComments({ id }),
  });

  return (
    <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)] pt-4">
      <div className="w-[80%] flex flex-col min-h-[calc(100vh-140px)] py-15 gap-4">
        {/* 게시글 영역 */}
        <PostContent id={id} />
        {/* 댓글 작성 영역 */}
        <CommentWrite id={id} />
        {/* 댓글 영역 */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PostCommnet id={id} />
        </HydrationBoundary>
      </div>
    </div>
  );
}
export default Page;
