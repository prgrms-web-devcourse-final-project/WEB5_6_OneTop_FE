import { mockPostListResponse } from "@/domains/community/data/mock";
import { PostFilterType } from "@/domains/community/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || "10");
  const category = (searchParams.get("category") as PostFilterType) || "ALL";

  try {
    // 게시글 목록 조회
    let posts = mockPostListResponse.data.items;

    if (category !== "ALL") {
      posts = posts.filter((post) => post.category === category);
    }

    const startIndex = page * size;
    const endIndex = (page + 1) * size;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    return NextResponse.json({
      data: {
        items: paginatedPosts,
        page,
        size,
        totalPages: Math.ceil(posts.length / size),
        totalElements: posts.length,
        last: endIndex >= posts.length,
      },
      message: "게시글 목록 조회 성공",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      message: "게시글 목록 조회 실패",
      status: 500,
    });
  }
}
