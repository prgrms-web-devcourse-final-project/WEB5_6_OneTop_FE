import BackButton from "@/share/components/BackButton";
import PostLikeButton from "./PostLikeButton";
import { BiCommentDetail } from "react-icons/bi";
import { getPost } from "../api/getPost";
import { postDetailSchema } from "../schemas/posts";
import DeletePostButton from "./DeletePostButton";
import Link from "next/link";
import { getAuthUser } from "@/domains/auth/api/getAuthUser";
import PostPoll from "./PostPoll";

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
    return (
      <div className="text-red-500 min-h-[400px] flex items-center justify-center">
        게시글을 불러올 수 없습니다.
      </div>
    );
  }

  const user = await getAuthUser();
  const isMine = user?.nickname === author;

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
      <div className="min-h-[400px] flex flex-col gap-2 justify-between">
        {/* 컨텐츠 텍스트, 투표 , 시나리오 등 */}
        <div>{content}</div>
        {/* 투표 항목이 있다면 렌더링 */}
        {polls && (
          <div>
            <h3 className="text-lg font-semibold px-2">투표하기</h3>
            <PostPoll
              items={polls.options.map((option) => ({
                index: option.index,
                text: option.text,
                voteCount: 0,
                isVoted: false,
              }))}
            />
          </div>
        )}
        {/* 시나리오 연결 기능이 추가되면 추가될 영역 */}
      </div>

      {/* 하단 메뉴 영역 */}
      <div className="border-b border-gray-300 pt-4 pb-4">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4">
            <PostLikeButton
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

          {isMine && (
            <div className="flex gap-2">
              <Link
                href={`/community/write/${id}`}
                className="bg-deep-navy text-white px-4 py-2 rounded-md flex items-center gap-2 hover:!text-white"
              >
                수정
              </Link>
              <DeletePostButton>삭제</DeletePostButton>
            </div>
          )}
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
