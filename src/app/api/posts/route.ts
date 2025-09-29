import { postListResponseSchema } from "@/domains/community/schemas/posts";
import { PostFilterType } from "@/domains/community/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || "10");
  const category = (searchParams.get("category") as PostFilterType) || "ALL";
  const searchType = searchParams.get("searchType") || "TITLE";
  const keyword = searchParams.get("keyword") || "";
  const sort = searchParams.get("sort") || "string";

  // Server Component에서 백엔드로 직접 호출
  const cookieStore = await cookies();
  const jsessionId = cookieStore.get("JSESSIONID");

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/posts?page=${page}&size=10&category=${category}&searchType=TITLE&keyword=&sort=createdDate`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(jsessionId && { Cookie: `JSESSIONID=${jsessionId.value}` }),
        },
      }
    );

    if (
      response.ok &&
      response.headers.get("content-type")?.includes("application/json")
    ) {
      const data = await response.json();
      const posts = data.data?.items || [];
    } else {
      console.log("Login required or invalid response");
      const posts = [];
    }
  } catch (error) {
    console.error("API Error:", error);
    const posts = [];
  }
}
