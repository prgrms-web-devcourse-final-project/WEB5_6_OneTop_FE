"use client";

import React from "react";

import Swal from "sweetalert2";
import { useDeletePost } from "../api/useDeletePost";
import { useParams, useRouter } from "next/navigation";
import tw from "@/share/utils/tw";

interface DeletePostButtonProps {
  children: React.ReactNode;
  className?: string;
}

function DeletePostButton({ children, className }: DeletePostButtonProps) {
  const { id } = useParams();
  const { mutate: deletePost } = useDeletePost();
  const router = useRouter();

  const handleDeletePost = () => {
    Swal.fire({
      title: "정말 이 게시글을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost(id as string);
        router.push("/community");
      }
    });
  };

  return (
    <button
      type="button"
      className={tw(
        "px-3 py-2 bg-inherit text-deep-navy rounded h-11 flex-shrink-0 border border-deep-navy",
        className
      )}
      onClick={handleDeletePost}
    >
      {children}
    </button>
  );
}
export default DeletePostButton;
