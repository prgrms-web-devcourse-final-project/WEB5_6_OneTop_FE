import { BiLike } from "react-icons/bi";
import { getComments } from "../api/getComments";
import { commentsResponseSchema } from "../schemas/comments";

async function PostCommnet({ id }: { id: string }) {
  const comments = await getComments({ id });
  const parsedComments = commentsResponseSchema.safeParse(comments);

  if (!parsedComments.success) {
    return (
      <div className="text-red-500 min-h-[400px] flex items-center justify-center">
        댓글을 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {parsedComments.data?.items.map(
        ({
          commentId,
          content,
          author,
          likeCount,
          isMine,
          isLiked,
          createdDate,
        }) => (
          <li key={commentId} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full w-10 h-10 bg-gray-300" />
                <div>{author}</div>
              </div>
              <div className="flex items-center gap-2">
                <div>{isMine ? "내 댓글" : ""}</div>
                <div>{createdDate}</div>
              </div>
            </div>
            <div>{content}</div>

            <div className="flex items-center gap-2">
              <button type="button" className="flex items-center gap-2 hover:text-deep-navy transition-colors duration-300 text-dusty-blue">
                <BiLike size={20} />
                <span>{likeCount}</span>
              </button>
            </div>
          </li>
        )
      )}
    </ul>
  );
}
export default PostCommnet;
