import { getPostList } from "@/domains/community/api/getPostList";
import PostFilter from "@/domains/community/components/PostFilter";
import PollCardList from "@/domains/community/components/PollCardList";
import PostList from "@/domains/community/components/PostList";
import SearchBar from "@/domains/community/components/SearchBar";
import { PostFilterType } from "@/domains/community/types";
import { BannerSection } from "@/share/components/BannerSection";
import Pagination from "@/share/components/Pagination";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "커뮤니티 | Re:Life",
  description: "Re:Life에서 커뮤니티를 통해 다양한 사람들과 소통해보세요.",
  keywords: "커뮤니티, Re:Life, 소통, 커뮤니티, 다양한 사람들과 소통",
};

type CommunityMainParams = {
  category?: PostFilterType;
  page?: number;
  keyword?: string;
  searchType?: string;
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
  const keyword = arrivedSearchParams.keyword || "";
  const searchType = arrivedSearchParams.searchType || "TITLE";

  let posts = [];
  let totalPages = 0;

  try {
    const response = await getPostList({
      page,
      size: 10,
      keyword,
      category,
      searchType,
      sort: "createdDate",
    });

    const data = response;
    posts = data.items || [];
    totalPages = data.totalPages || 0;
  } catch (error) {
    console.error("API 호출 에러:", error);
    posts = []; // 에러 시 빈 배열
  }

  return (
    <>
      <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)]">
        {/* 헤더 영역 */}
        <BannerSection>
          <SearchBar />
          <div className="flex w-full justify-between items-center px-4 absolute bottom-4">
            <PostFilter category={category} />
            <Link
              href="/community/write"
              className="bg-deep-navy text-gray-200 border border-gray-200 rounded-md px-4 py-2 hover:!text-gray-200"
            >
              글쓰기
            </Link>
          </div>
        </BannerSection>

        <div className="w-[60%] py-4">
          {/* 게시글 영역 */}
          <PollCardList />

          <Suspense fallback={<div>목록을 불러오는 중입니다.....</div>}>
            <PostList posts={posts} />
          </Suspense>

          {/* 페이지네이션 영역 */}
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
export default Page;
