import { api } from "@/share/config/api";
import { nextFetcher } from "@/share/utils/nextFetcher";
import { headers } from "next/headers";


export async function getComments({ id }: { id: string }) {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await nextFetcher(`${baseUrl}/api/v1/posts/${id}/comments`, {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}
