
// 빈 nesting 한 단계가 더 생기는 것이 별로인 것 같기도 한데 유저에게 제공되는 주소로는 조금 더 명확한 것 같기도 함.

import { getPost } from "@/domains/community/api/getPost";


async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const post = await getPost(id);

  console.log(post);
  
  return <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)] pt-15">{post.title}</div>;
}
export default Page;
