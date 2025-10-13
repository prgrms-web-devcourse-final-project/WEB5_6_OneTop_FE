"use client";

import { AiFillLike } from "react-icons/ai";
import { useLike } from "../api/useLike";
import { useRef, useState } from "react";
import tw from "@/share/utils/tw";
import { useUndoLike } from "../api/useUndoLike";
import { useCommnetLike } from "../api/useCommnetLike";
import { useCommentUnlike } from "../api/useCommentUnlike";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";

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
  const queryClient = useQueryClient();

  const { data: user } = useAuthUser();

  // TODO : COMMENT 관련 API 추가되면 변경
  const { mutate: likeMutation, isPending } = useCommnetLike({
    onMutate: async () => {
      setOptimisticState((prev) => ({
        isLiked: !prev.isLiked,
        count: prev.count + (prev.isLiked ? -1 : 1),
      }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comment.get(id) });
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

  const handleLike = () => {
    if (!user?.data.username) {
      Swal.fire({
        title: "로그인 후 이용해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (optimisticState.isLiked) {
      undoLikeMutation({ commentId: id, postId });
    } else {
      likeMutation({ commentId: id, postId });
    }
  };

  return (
    <button
      type="button"
      className={tw(
        "flex items-center gap-2 hover:text-deep-navy transition-colors duration-300 text-dusty-blue",
        optimisticState.isLiked && "text-amber-500"
      )}
      onClick={handleLike}
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
