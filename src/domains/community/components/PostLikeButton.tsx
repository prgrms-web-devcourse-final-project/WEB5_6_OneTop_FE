"use client";

import { AiFillLike } from "react-icons/ai";
import { useLike } from "../api/useLike";
import { useRef, useState } from "react";
import tw from "@/share/utils/tw";
import { useUndoLike } from "../api/useUndoLike";
import Swal from "sweetalert2";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";

function PostLikeButton({
  likeCount,
  id,
  likedByMe,
}: {
  likeCount: number;
  id: string;
  likedByMe: boolean;
}) {
  const initialState = useRef({ likedByMe, likeCount });
  const [optimisticState, setOptimisticState] = useState({
    isLiked: likedByMe,
    count: likeCount,
  });

  const { data: user } = useAuthUser();

  const { mutate: likeMutation, isPending } = useLike({
    options: {
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
    },
  });

  const { mutate: undoLikeMutation, isPending: isUndoLikePending } =
    useUndoLike({
      options: {
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
      undoLikeMutation({ id });
    } else {
      likeMutation({ id });
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
