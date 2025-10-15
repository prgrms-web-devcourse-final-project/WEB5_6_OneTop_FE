import { nextFetcher } from "@/share/utils/nextFetcher";
import { getApiBaseUrl } from "@/share/config/api";

interface GetPostListProps {
  page: number;
  size: number;
  keyword?: string;
  category?: string;
  searchType?: string;
  sortType?: string;
}

export async function getPostList({
  page,
  size,
  keyword,
  category,
  searchType,
  sortType,
}: GetPostListProps) {
  const path = `${getApiBaseUrl()}/api/v1/posts`;
  const apiUrl = new URL(path);

  apiUrl.searchParams.set("page", page.toString());
  apiUrl.searchParams.set("size", size.toString());
  apiUrl.searchParams.set("keyword", keyword || "");
  apiUrl.searchParams.set("category", category === "ALL" ? "" : category || "");
  apiUrl.searchParams.set("searchType", searchType || "TITLE");
  apiUrl.searchParams.set("sortType", sortType || "LATEST");

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


  return await response.json() || { items: [] };
}
