import BackButton from "@/share/components/BackButton";
import LikeButton from "./LikeButton";
import { BiCommentDetail } from "react-icons/bi";
import { getPost } from "../api/getPost";
import { postDetailSchema } from "../schemas/posts";

async function PostContent({ id }: { id: string }) {
  const post = await getPost(id);
  const parsedPost = postDetailSchema.safeParse(post);
  const {
    postId,
    title,
    content,
    author,
    category,
    likeCount,
    liked,
    createdDate,
    polls,
  } = parsedPost.data || {};

  if (!parsedPost.success) {
    return <div className="text-red-500 min-h-[400px] flex items-center justify-center">게시글을 불러올 수 없습니다.</div>;
  }

  return (
    <>
      {/* 헤더 영역 */}
      <header className="w-full flex border-b border-gray-300 pb-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full w-10 h-10 bg-gray-300" />
          <div>
            <h3>{author}</h3>
          </div>
        </div>
        <div>
          <p>{createdDate}</p>
        </div>
      </header>

      {/* 제목 영역 */}
      <h2 className="text-2xl font-bold">{title}</h2>

      {/* 메인 컨텐츠 영역 */}
      <div className="min-h-[400px]">
        {/* 컨텐츠 텍스트, 투표 , 시나리오 등 */}
        <div className="flex-1 flex flex-col gap-2">
          <div>{content}</div>
          <div>{polls?.options.map((option) => option.text)}</div>
          {/* 시나리오 연결 기능이 추가되면 추가될 영역 */}
        </div>
      </div>

      {/* 하단 메뉴 영역 */}
      <div className="border-b border-gray-300 pt-4 pb-4">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4">
            <LikeButton
              likeCount={likeCount || 0}
              id={postId?.toString() || ""}
              likedByMe={liked || false}
            />
            <button
              type="button"
              className="flex items-center gap-2 hover:text-deep-navy transition-colors duration-300 text-dusty-blue"
            >
              <BiCommentDetail size={20} />
              <span>댓글 수</span>
              {likeCount}
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
    </>
  );
}
export default PostContent;
