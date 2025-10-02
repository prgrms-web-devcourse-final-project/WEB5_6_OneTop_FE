import { nextFetcher } from "@/share/utils/nextFetcher";

export async function getBaselineList(
  page: number,
  size: number,
  sort: string = "createdDate,desc"
) {
  const path = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/scenarios/baselines`;
  const apiUrl = new URL(path);

  apiUrl.searchParams.set("page", page.toString());
  apiUrl.searchParams.set("size", size.toString());
  apiUrl.searchParams.set("sort", sort);

  const response = await nextFetcher(apiUrl.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
