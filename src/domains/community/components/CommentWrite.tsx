"use client";

import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import { userProfileSchema } from "@/domains/auth/schemas/loginResponseSchema";
import { useSetComment } from "../api/useSetComment";
import { BiSend } from "react-icons/bi";
import { useForm } from "react-hook-form";
import ProfileAvatar from "./ProfileAvatar";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/share/config/queryKeys";

// TODO: dehydration 으로 변경해 성능 최적화.
function CommentWrite({ id }: { id: string }) {
  const { data: authUser, isError, error } = useAuthUser();
  const parsedAuthUser = userProfileSchema.safeParse(authUser?.data);
  const author = parsedAuthUser.success ? parsedAuthUser.data?.nickname : null;
  const { mutate: setComment } = useSetComment();
  const qc = useQueryClient();

  const { register, handleSubmit, reset } = useForm<{
    content: string;
    hide: boolean;
  }>();

  const onSubmit = (data: { content: string; hide: boolean }) => {
    // 로그인하지 않은 경우 댓글 작성 방지
    if (!author) {
      alert("로그인 후 댓글을 작성해주세요.");
      return;
    }

    setComment(
      { content: data.content, hide: data.hide, id },
      {
        onSuccess: () => {
          reset(); // 폼 초기화
          qc.invalidateQueries({ queryKey: queryKeys.myComments.all() });
          qc.invalidateQueries({ queryKey: queryKeys.usageStats.all() });
        },
        onError: (error) => {
          console.error("댓글 작성 실패:", error);
          alert("댓글 작성에 실패했습니다.");
        },
      }
    );
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      {author && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ProfileAvatar nickname={author || ""} size={24} />
            <div>{author}</div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("hide")} id="hide" />
            <label htmlFor="hide">비밀글</label>
          </div>
        </div>
      )}
      <textarea
        className="w-full h-25 rounded-md border border-gray-300 px-4 p-4 resize-none"
        disabled={!author}
        {...register("content", { required: true })}
        id="content"
        maxLength={500}
        placeholder={
          !author
            ? "로그인 후 댓글을 작성해주세요."
            : "댓글을 입력해주세요. ( 최대 500자 )"
        }
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 rounded-md border bg-deep-navy text-white w-fit flex items-center gap-2"
        >
          <BiSend />
          댓글 쓰기
        </button>
      </div>
    </form>
  );
}
export default CommentWrite;
