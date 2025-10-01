// 빈 nesting 한 단계가 더 생기는 것이 별로인 것 같기도 한데 유저에게 제공되는 주소로는 조금 더 명확한 것 같기도 함.

import { getPost } from "@/domains/community/api/getPost";
import LikeButton from "@/domains/community/components/LikeButton";
import { postDetailSchema } from "@/domains/community/schemas/posts";
import BackButton from "@/share/components/BackButton";
import { BiCommentDetail } from "react-icons/bi";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  const parsedPost = postDetailSchema.safeParse(post);

  console.log(parsedPost);

  return (
    <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)] pt-4">
      <div className="w-[80%] flex flex-col min-h-[calc(100vh-140px)] pt-15 gap-4">
        {/* 헤더 영역 */}
        <header className="w-full flex border-b border-gray-300 pb-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full w-10 h-10 bg-gray-300" />
            <div>
              <h3>{parsedPost?.data?.author && parsedPost.data.author}</h3>
            </div>
          </div>
          <div>
            <p>
              {parsedPost?.data?.createdDate && parsedPost.data.createdDate}
            </p>
          </div>
        </header>

        {/* 제목 영역 */}
        <h2 className="text-2xl font-bold">
          {parsedPost?.data?.title && parsedPost.data.title}
        </h2>

        {/* 메인 컨텐츠 영역 */}
        <div className="min-h-[400px] border-b border-gray-300 pb-4 flex flex-col justify-between">
          {/* 컨텐츠 텍스트, 투표 , 시나리오 등 */}
          <div className="flex-1 flex flex-col gap-2">
            <div>{parsedPost?.data?.content && parsedPost.data.content}</div>
            <div>
              {parsedPost?.data?.polls.options.map((option) => option.text)}
            </div>
            {/* 시나리오 연결 기능이 추가되면 추가될 영역 */}
          </div>
        </div>
        {/* 하단 메뉴 영역 */}
        <div>
          <div className="flex gap-4 items-center justify-between mb-4">
            <div className="flex gap-4">
              <LikeButton
                likeCount={parsedPost?.data?.likeCount || 0}
                id={id}
                likedByMe={parsedPost?.data?.liked || false}
              />
              <button
                type="button"
                className="flex items-center gap-2 hover:text-deep-navy transition-colors duration-300 text-dusty-blue"
              >
                <BiCommentDetail size={20} />
                <span>댓글 수</span>
                {parsedPost?.data?.likeCount && parsedPost.data.likeCount}
              </button>
            </div>

            <div className="flex gap-2">
              <button className="bg-deep-navy text-white px-4 py-2 rounded-md">
                수정
              </button>
              <button className="bg-inherit text-deep-navy border border-deep-navy px-4 py-2 rounded-md">
                삭제
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <BackButton className="bg-deep-navy text-white px-4 py-2 rounded-md">
              목록으로
            </BackButton>
          </div>
        </div>

        {/* 댓글 영역 */}
      </div>
    </div>
  );
}
export default Page;
