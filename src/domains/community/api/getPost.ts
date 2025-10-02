import { nextFetcher } from "@/share/utils/nextFetcher";


export async function getPost(id: string) {
  const path = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${id}`;
  const response = await nextFetcher(path, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}
