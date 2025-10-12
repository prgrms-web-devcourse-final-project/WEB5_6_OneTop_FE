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
import TargetPostList from "@/domains/community/components/TargetPostList";
import TargetPostSection from "@/domains/community/components/TargetPostSection";
import SharedScenarioItem from "@/domains/community/components/SharedScenarioItem";

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
  const category = arrivedSearchParams.category;
  const page = arrivedSearchParams.page;
  const keyword = arrivedSearchParams.keyword;
  const searchType = arrivedSearchParams.searchType;

  let posts = [];
  let totalPages = 0;

  try {
    const response = await getPostList({
      page: page || 0,
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
            <PostFilter category={category || "MAIN"} />
            <Link
              href="/community/write"
              className="bg-deep-navy text-gray-200 border border-gray-200 rounded-md px-4 py-2 hover:!text-gray-200"
            >
              글쓰기
            </Link>
          </div>
        </BannerSection>

        <div className="w-[80%] py-4 md:w-[60%]">
          {/* 게시글 영역 */}
          {category || page || keyword || searchType ? (
            <>
              <Suspense fallback={<div>목록을 불러오는 중입니다.....</div>}>
                <PostList posts={posts} />
              </Suspense>

              {/* 페이지네이션 영역 */}
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          ) : (
            // 초기 메인 페이지
            <div className="flex flex-col gap-8">
              <PollCardList />
              <hr className="border-gray-300" />
              <TargetPostSection />
              <hr className="border-gray-300" />
              <SharedScenarioItem />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default Page;
