import { api, getApiBaseUrl } from "@/share/config/api";
import { nextFetcher } from "@/share/utils/nextFetcher";
import { headers } from "next/headers";


export async function getComments({ id }: { id: string }) {

  const res = await nextFetcher(`${getApiBaseUrl()}/api/v1/posts/${id}/comments`, {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}
