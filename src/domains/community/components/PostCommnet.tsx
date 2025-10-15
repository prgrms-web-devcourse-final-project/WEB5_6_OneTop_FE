"use client";

import { BiSolidTrash } from "react-icons/bi";
import { commentsResponseSchema } from "../schemas/comments";
import { PiNotePencil } from "react-icons/pi";
import { useGetComments } from "../api/useGetComments";
import { useDeleteComment } from "../api/useDeleteComment";
import { useState } from "react";
import Swal from "sweetalert2";
import { useUpdateComment } from "../api/useUpdateComment";
import tw from "@/share/utils/tw";
import CommnetLikeButton from "./CommnetLikeButton";
import ProfileAvatar from "./ProfileAvatar";

export function PostCommnet({ id }: { id: string }) {
  // state 선언
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editHide, setEditHide] = useState<boolean>(false);

  // 조회 query
  const { data: comments, isLoading } = useGetComments({ id, page: 1, size: 30 });

  // 수정, 삭제 mutation
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment({
    postId: id,
  });
  const { mutate: updateComment, isPending: isUpdateing } = useUpdateComment({
    postId: id,
  });

  const parsedComments = commentsResponseSchema.safeParse(
    comments?.data || comments
  );

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

  const handleClickDelete = (commentId: string) => {
    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "삭제된 댓글은 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteComment({ commentId });
      }
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateComment({
      commentId: editCommentId as number,
      content: editContent,
      hide: editHide,
    });

    setEditCommentId(null);
    setEditContent("");
    setEditHide(false);
  };

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
                <ProfileAvatar nickname={author || ""} size={24} />
                <div>{author}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500">{isMine ? "내 댓글" : ""}</div>
                <div className="text-sm">{createdDate}</div>
              </div>
            </div>

            {editCommentId === commentId ? (
              <form onSubmit={onSubmit} className="flex gap-2">
                <textarea
                  className="flex-14 h-20 rounded-md border border-gray-300 p-4"
                  value={editContent || ""}
                  maxLength={500}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-deep-navy text-white rounded-md px-4 py-2 flex-1"
                >
                  수정
                </button>
              </form>
            ) : (
              <div>{content}</div>
            )}

            <div className="flex items-center gap-2 justify-between">
              <CommnetLikeButton
                id={commentId.toString()}
                postId={id}
                likeCount={likeCount}
                likedByMe={isLiked}
              />

              {/* 본인 댓글일 때만 수정, 삭제 버튼 표시 */}
              {isMine && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={tw(
                      "flex items-center gap-2 hover:text-deep-navy transition-colors duration-300 text-dusty-blue",
                      editCommentId === commentId &&
                        "text-amber-500 hover:text-amber-500"
                    )}
                    onClick={() => {
                      setEditCommentId(
                        commentId === editCommentId ? null : commentId
                      );
                      setEditContent(content);
                      setEditHide(author === "익명" ? true : false);
                    }}
                    disabled={isUpdateing}
                  >
                    <PiNotePencil size={20} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:text-deep-navy transition-colors duration-300 text-dusty-blue"
                    onClick={() => handleClickDelete(commentId.toString())}
                    disabled={isDeleting}
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
