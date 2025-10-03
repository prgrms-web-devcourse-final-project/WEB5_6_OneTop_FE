"use client";

import { BiLike, BiSolidTrash } from "react-icons/bi";
import { getComments } from "../api/getComments";
import { commentsResponseSchema } from "../schemas/comments";
import { PiNotePencil } from "react-icons/pi";
import { useGetComments } from "../api/useGetComments";
import { useDeleteComment } from "../api/useDeleteComment";
import { useState } from "react";

export function PostCommnet({ id }: { id: string }) {
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string | null>("");

  const { data: comments, isLoading, isError } = useGetComments({ id });
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  // const {mutate: updateComment, isPending: isUpdateing} = useUpdateComment();

  const parsedComments = commentsResponseSchema.safeParse(comments?.data || comments);

  if (!parsedComments.success) {
    return (
      <div className="text-red-500 min-h-[400px] flex items-center justify-center">
        댓글 데이터 형식이 올바르지 않습니다.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-red-500 min-h-[400px] flex items-center justify-center">
        댓글을 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2 ">
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
          <li
            key={commentId}
            className="flex flex-col gap-4 bg-gray-100 p-4 border-b border-gray-300"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full w-8 h-8 bg-gray-300" />
                <div>{author}</div>
              </div>
              <div className="flex items-center gap-2">
                <div>{isMine ? "내 댓글" : ""}</div>
                <div>{createdDate}</div>
              </div>
            </div>
            <div>{content}</div>

            <div className="flex items-center gap-2 justify-between">
              <button
                type="button"
                className="flex items-center gap-2 hover:text-deep-navy transition-colors duration-300 text-dusty-blue"
              >
                <BiLike size={20} />
                <span>{likeCount}</span>
              </button>

              {/* 본인 댓글일 때만 수정, 삭제 버튼 표시 */}
              {isMine && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:text-deep-navy transition-colors duration-300 text-dusty-blue"
                  >
                    <PiNotePencil size={20} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:text-deep-navy transition-colors duration-300 text-dusty-blue"
                  >
                    <BiSolidTrash size={20} />
                  </button>
                </div>
              )}
            </div>
          </li>
        )
      )}
    </ul>
  );
}
export default PostCommnet;
