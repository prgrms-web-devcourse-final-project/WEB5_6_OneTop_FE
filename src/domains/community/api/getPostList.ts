import { nextFetcher } from "@/share/utils/nextFetcher";
import { getApiBaseUrl } from "@/share/config/api";

interface GetPostListProps {
  page: number;
  size: number;
  keyword?: string;
  category?: string;
  searchType?: string;
  sort?: string;
}

export async function getPostList({
  page,
  size,
  keyword,
  category,
  searchType,
  sort,
}: GetPostListProps) {
  const path = `${getApiBaseUrl()}/api/v1/posts`;
  const apiUrl = new URL(path);
  const sortArray = Array.isArray(sort) ? sort : [sort || "LATEST"];

  apiUrl.searchParams.set("page", page.toString());
  apiUrl.searchParams.set("size", size.toString());
  apiUrl.searchParams.set("keyword", keyword || "");
  apiUrl.searchParams.set("category", category === "ALL" ? "" : category || "");
  apiUrl.searchParams.set("searchType", searchType || "TITLE");
  apiUrl.searchParams.set("sort", JSON.stringify(sortArray));

  const response = await nextFetcher(apiUrl.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    next: {
      revalidate: 5,
    },
  });

  return await response.json();
}
