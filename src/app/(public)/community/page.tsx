import PostFilter from "@/domains/community/components/PostFilter";
import PostList from "@/domains/community/components/PostList";
import { PostFilterType } from "@/domains/community/types";
import { BannerSection } from "@/share/components/BannerSection";
import { nextFetcher } from "@/share/utils/nextFetcher";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";

export const metadata: Metadata = {
  title: "커뮤니티 | Re:Life",
  description: "Re:Life에서 커뮤니티를 통해 다양한 사람들과 소통해보세요.",
  keywords: "커뮤니티, Re:Life, 소통, 커뮤니티, 다양한 사람들과 소통",
};

type CommunityMainParams = {
  category?: PostFilterType;
  page?: number;
};

async function Page({
  searchParams,
}: {
  searchParams: Promise<CommunityMainParams>;
}) {
  // 실제 서버 조회로 변경
  const arrivedSearchParams = await searchParams;

  const category = arrivedSearchParams.category || "ALL";
  const page = arrivedSearchParams.page || 0;

  // GET 방식으로 API 호출 - Next.js API Route 사용
  const apiUrl = new URL(`http://localhost:3000/api/v1/posts`);
  apiUrl.searchParams.set("category", category === "ALL" ? "" : category);
  apiUrl.searchParams.set("page", page.toString());
  apiUrl.searchParams.set("size", "10");
  apiUrl.searchParams.set("searchType", "TITLE");
  // apiUrl.searchParams.set("keyword", "");
  apiUrl.searchParams.set("sort", "createdDate");

  try {
    const response = await nextFetcher(apiUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    const posts = data.data?.items || [];
  } catch (error) {
    console.error("API 호출 에러:", error);
    const posts = []; // 에러 시 빈 배열
  }

  const data = {
    data: {
      items: [],
    },
  };

  const posts = data.data?.items || [];

  return (
    <>
      <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)]">
        <BannerSection
          title="커뮤니티"
          description="커뮤니티를 통해 다양한 사람들과 소통해보세요."
        />
        <div className="w-[80%]">
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
    </>
  );
}
export default Page;
