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
import { postDetailSchema } from "@/domains/community/schemas/posts";
import { getPost } from "@/domains/community/api/getPost";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    // 게시글 데이터 가져오기. 캐시를 지정해 하위 요소에서 재호출을 막기.
    const post = await getPost(id);
    const parsedPost = postDetailSchema.safeParse(post);

    if (!parsedPost.success) {
      return {
        title: "게시글을 찾을 수 없습니다 | Re:Life",
        description: "요청하신 게시글을 찾을 수 없습니다.",
      };
    }

    const { title, content, author, category } = parsedPost.data;

    // 카테고리별 타이틀 접두사
    const categoryPrefix =
      {
        CHAT: "자유게시판",
        NOTICE: "공지사항",
        POLL: "투표",
        SCENARIO: "시나리오",
      }[category] || "게시판";

    // 내용에서 HTML 태그 제거하고 요약 생성 (최대 160자)
    const description = content
      .replace(/<[^>]*>/g, "") // HTML 태그 제거
      .replace(/\s+/g, " ") // 연속된 공백을 하나로
      .trim()
      .substring(0, 160);

    return {
      title: `${title} | ${categoryPrefix} | Re:Life`,
      description:
        description || `${author}님이 작성한 ${categoryPrefix} 게시글입니다.`,
      openGraph: {
        title: title,
        description: description,
        type: "article",
        authors: [author],
        siteName: "Re:Life",
        images: [
          {
            url: post.image || "/logo_128.svg",
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary",
        title: title,
        description: description,
      },
    };
  } catch (error) {
    console.error("메타데이터 생성 중 오류:", error);
    return {
      title: "게시글 | Re:Life",
      description: "Re:Life 커뮤니티 게시글입니다.",
    };
  }
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const queryClient = new QueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.comment.get(id),
        queryFn: () => getComments({ id }),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.post.id(id),
        queryFn: () => getPost(id),
      }),
    ]);
  } catch (error) {
    console.error("Prefetch error:", error);
  }

  return (
    <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)] pt-4">
      <div className="w-[80%] md:w-[60%] flex flex-col min-h-[calc(100vh-140px)] py-15 gap-4">
        {/* 게시글 영역 */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PostContent id={id} />
          {/* 댓글 작성 영역 */}
          <CommentWrite id={id} />
          {/* 댓글 영역 */}
          <PostCommnet id={id} />
        </HydrationBoundary>
      </div>
    </div>
  );
}
export default Page;
