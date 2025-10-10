"use client";

import { AiFillLike } from "react-icons/ai";
import { useLike } from "../api/useLike";
import { useRef, useState } from "react";
import tw from "@/share/utils/tw";
import { useUndoLike } from "../api/useUndoLike";
import { useCommnetLike } from "../api/useCommnetLike";
import { useCommentUnlike } from "../api/useCommentUnlike";

function PostLikeButton({
  likeCount,
  id,
  likedByMe,
  postId,
}: {
  likeCount: number;
  id: string;
  likedByMe: boolean;
  postId: string;
}) {
  const initialState = useRef({ likedByMe, likeCount });
  const [optimisticState, setOptimisticState] = useState({
    isLiked: likedByMe,
    count: likeCount,
  });

  // TODO : COMMENT 관련 API 추가되면 변경
  const { mutate: likeMutation, isPending } = useCommnetLike({
    onMutate: async () => {
      setOptimisticState((prev) => ({
        isLiked: !prev.isLiked,
        count: prev.count + (prev.isLiked ? -1 : 1),
      }));
    },
    onError: () => {
      setOptimisticState({
        isLiked: initialState.current.likedByMe,
        count: initialState.current.likeCount,
      });
    },
  });

  const { mutate: undoLikeMutation, isPending: isUndoLikePending } =
    useCommentUnlike({
      onMutate: async () => {
        setOptimisticState((prev) => ({
          isLiked: !prev.isLiked,
          count: prev.count + (prev.isLiked ? -1 : 1),
        }));
      },
      onError: () => {
        setOptimisticState({
          isLiked: initialState.current.likedByMe,
          count: initialState.current.likeCount,
        });
      },
    });

  return (
    <button
      type="button"
      className={tw(
        "flex items-center gap-2 hover:text-deep-navy transition-colors duration-300 text-dusty-blue",
        optimisticState.isLiked && "text-amber-500"
      )}
      onClick={() =>
        optimisticState.isLiked
          ? undoLikeMutation({ commentId: id, postId })
          : likeMutation({ commentId: id, postId })
      }
      aria-label="좋아요"
      disabled={isPending || isUndoLikePending}
    >
      <AiFillLike size={20} />
      <span>좋아요</span>
      {optimisticState.count}
    </button>
  );
}
export default PostLikeButton;
