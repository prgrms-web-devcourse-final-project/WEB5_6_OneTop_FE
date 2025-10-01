// 빈 nesting 한 단계가 더 생기는 것이 별로인 것 같기도 한데 유저에게 제공되는 주소로는 조금 더 명확한 것 같기도 함.

import PostCommnet from "@/domains/community/components/PostCommnet";
import PostContent from "@/domains/community/components/PostContent";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;


  return (
    <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)] pt-4">
      <div className="w-[80%] flex flex-col min-h-[calc(100vh-140px)] py-15 gap-4">
        {/* 게시글 영역 */}
        <PostContent id={id} />
        {/* 댓글 영역 */}
        <PostCommnet id={id} />
      </div>
    </div>
  );
}
export default Page;
