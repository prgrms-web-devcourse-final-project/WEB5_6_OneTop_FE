import PostList from "@/domains/community/components/PostList";
import { mockPostListResponse } from "@/domains/community/data/mock";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "커뮤니티 | Re:Life",
  description: "Re:Life에서 커뮤니티를 통해 다양한 사람들과 소통해보세요.",
  keywords: "커뮤니티, Re:Life, 소통, 커뮤니티, 다양한 사람들과 소통",
};


function Page() {
  // 실제 서버 조회로 변경
  
  const posts = mockPostListResponse.data.items;

  return (
    <div>
      <PostList posts={posts} />
    </div>
  )
}
export default Page