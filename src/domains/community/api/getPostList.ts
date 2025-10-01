import { nextFetcher } from "@/share/utils/nextFetcher";

export async function getPostList(
  page: number,
  size: number,
  keyword?: string,
  category?: string,
  searchType?: string,
  sort?: string
) {
  const path = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`;
  const apiUrl = new URL(path);
  apiUrl.searchParams.set("page", page.toString());
  apiUrl.searchParams.set("size", size.toString());
  apiUrl.searchParams.set("keyword", keyword || "");
  apiUrl.searchParams.set("category", category === "ALL" ? "" : category || "");
  apiUrl.searchParams.set("searchType", searchType || "TITLE");
  apiUrl.searchParams.set("sort", sort || "createdDate");

  const response = await nextFetcher(apiUrl.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return await response.json();
}
