import Link from "next/link";
import { postsSchema } from "../schemas/posts";
import { Post } from "../types";
import { AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";

interface PostItemProps {
  post: Post;
}

const categoryColor = {
  CHAT: "bg-blue-500",
  NOTICE: "bg-green-500",
  POLL: "bg-yellow-500",
  SCENARIO: "bg-purple-500",
};

const categoryText = {
  CHAT: "잡담",
  NOTICE: "공지",
  POLL: "투표",
  SCENARIO: "시나리오",
};

function PostItem({ post }: PostItemProps) {
  const parsedPost = postsSchema.parse(post);

  const { postId, title, author, boardType, createdDate, likeCount, hide, commentCount } =
    parsedPost;

  return (
    <li
      className="flex flex-col gap-2 border-b border-gray-200 p-6 "
      id={`post-${postId}`}
    >
      {/* 계층 1 : 카테고리 */}
      <div className="flex items-center gap-2">
        <div
          className={`w-20 h-8 rounded-full text-white flex items-center justify-center bg-dusty-blue`}
        >
          {categoryText[boardType]}
        </div>
      </div>

      {/* 계층 2 : 제목 */}
      <div className="flex items-center gap-2">
        <Link href={`/community/detail/${postId}`}>
          <span className="font-semibold text-lg">{title}</span>
        </Link>
      </div>

      {/* 계층 3 : 작성자, 작성일, 좋아요, 코멘트수*/}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">{hide ? "익명" : author}</span>
          <span className="text-sm">
            {createdDate.split("T")[0].replace(/-/g, ".")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BiCommentDetail size={18} />
          <span className="text-sm">{commentCount}</span>
          <AiOutlineLike size={18} />
          <span className="text-sm">{likeCount}</span>
        </div>
      </div>
    </li>
  );
}
export default PostItem;
