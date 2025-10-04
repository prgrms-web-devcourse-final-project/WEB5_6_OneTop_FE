"use client";

import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import { userProfileSchema } from "@/domains/auth/schemas/loginResponseSchema";
import { useSetComment } from "../api/useSetComment";
import { BiSend } from "react-icons/bi";
import { useForm } from "react-hook-form";

// TODO: dehydration 으로 변경해 성능 최적화.
function CommentWrite({ id }: { id: string }) {
  const { data: authUser } = useAuthUser();
  const parsedAuthUser = userProfileSchema.safeParse(authUser?.data);
  const author = parsedAuthUser.data?.nickname;
  const { mutate: setComment } = useSetComment();
  
  const { register, handleSubmit, reset } = useForm<{
    content: string;
    hide: boolean;
  }>();

  const onSubmit = (data: { content: string; hide: boolean }) => {
    setComment(
      { content: data.content, hide: data.hide, id },
      {
        onSuccess: () => {
          reset(); // 폼 초기화
        },
      }
    );
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      {author && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full w-8 h-8 bg-gray-300" />
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
        placeholder={
          !author ? "로그인 후 댓글을 작성해주세요." : "댓글을 입력해주세요."
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
