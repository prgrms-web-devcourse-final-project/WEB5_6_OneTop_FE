import PostFilter from "@/domains/community/components/PostFilter";
import PostList from "@/domains/community/components/PostList";
import { mockPostListResponse } from "@/domains/community/data/mock";
import { PostFilterType } from "@/domains/community/types";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "커뮤니티 | Re:Life",
  description: "Re:Life에서 커뮤니티를 통해 다양한 사람들과 소통해보세요.",
  keywords: "커뮤니티, Re:Life, 소통, 커뮤니티, 다양한 사람들과 소통",
};

type CommunityMainParams = {
  category?: PostFilterType;
  page?: number;
};

async function Page({ searchParams }: { searchParams: Promise<CommunityMainParams> }) {
  // 실제 서버 조회로 변경
  const arrivedSearchParams = await searchParams;

  const category = arrivedSearchParams.category || "ALL"; 
  const page = arrivedSearchParams.page || 0;

  const posts = mockPostListResponse.data.items;

  return (
    <div className="w-full flex justify-center">
      <div className="w-[80%] pt-16">
        {/* 헤더 영역 */}
        <div className="flex w-full justify-between items-center bg-deep-navy px-4">
          <PostFilter category={category} />
          <button className="bg-deep-navy text-gray-200 border border-gray-200 rounded-md px-4 py-2">
            글쓰기
          </button>
        </div>
        {/* 게시글 영역 */}
        <PostList posts={posts} />
      </div>
    </div>
  );
}
export default Page;
