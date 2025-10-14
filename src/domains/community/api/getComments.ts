import { getApiBaseUrl } from "@/share/config/api";
import { nextFetcher } from "@/share/utils/nextFetcher";

export async function getComments({
  id,
  page = 1,
  size = 30,
}: {
  id: string;
  page?: number;
  size?: number;
}) {
  const res = await nextFetcher(
    `${getApiBaseUrl()}/api/v1/posts/${id}/comments?page=${page}&size=${size}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return res.json();
}
