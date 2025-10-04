import { nextFetcher } from "@/share/utils/nextFetcher";
import { getApiBaseUrl } from "@/share/config/api";


export async function getPost(id: string) {
  const path = `${getApiBaseUrl()}/api/v1/posts/${id}`;
  const response = await nextFetcher(path, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}
