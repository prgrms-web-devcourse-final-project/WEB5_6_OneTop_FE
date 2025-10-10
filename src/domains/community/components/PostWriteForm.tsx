"use client";

import BackButton from "@/share/components/BackButton";
import { useSetPost } from "../api/useSetPost";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostDetail, PostWrite } from "../types";
import tw from "@/share/utils/tw";
import Swal from "sweetalert2";
import { postWriteSchema } from "../schemas/posts";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

function PostWriteForm() {
  const [pollItems, setPollItems] = useState<string[]>(["", ""]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostWrite>({
    resolver: zodResolver(postWriteSchema),
    defaultValues: {
      category: "CHAT",
      hide: false,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const { mutate: setPost } = useSetPost({
    options: {
      onSuccess: (data: PostDetail) => {
        Swal.fire({
          title: "success",
          text: "글작성이 완료되었습니다.",
          icon: "success",
        });
        router.push(`/community/detail/${data.postId}`);
      },
    },
  });

  const onSubmit = (data: PostWrite) => {
    // Poll 모드일 때 poll 데이터 추가
    if (category === "POLL") {
      const pollOptions = pollItems
        .map((item, index) => ({
          index,
          text: item.trim(),
        }))
        .filter((option) => option.text.length > 0); // 빈 항목 제거

      if (pollOptions.length < 2) {
        Swal.fire({
          title: "오류",
          text: "투표 항목은 최소 2개 이상 입력해주세요.",
          icon: "error",
        });
        return;
      }

      data.poll = {
        options: pollOptions,
      };
    }

    setPost(data);
  };

  const category = watch("category");

  return (
    <form
      className="w-[80%] flex flex-col items-center gap-4 py-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* 태그 radio 영역 */}
      <div className="w-full flex gap-2">
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-lg">태그 선택</h3>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="radio"
                  id="chat"
                  className="hidden peer"
                  value="CHAT"
                  {...register("category")}
                />
                <label
                  htmlFor="chat"
                  className="px-4 py-2 rounded-full border border-deep-navy hover:bg-gray-100 transition-colors peer-checked:bg-deep-navy peer-checked:text-white peer-checked:hover:bg-deep-navy cursor-pointer block"
                >
                  잡담
                </label>
              </div>
              <div className="relative">
                <input
                  type="radio"
                  id="poll"
                  className="hidden peer"
                  value="POLL"
                  {...register("category")}
                />
                <label
                  htmlFor="poll"
                  className="px-4 py-2 rounded-full border border-deep-navy hover:bg-gray-100 transition-colors peer-checked:bg-deep-navy peer-checked:text-white peer-checked:hover:bg-deep-navy cursor-pointer block"
                >
                  투표
                </label>
              </div>
              <div className="relative">
                <input
                  type="radio"
                  id="scenario"
                  className="hidden peer"
                  value="SCENARIO"
                  {...register("category")}
                />
                <label
                  htmlFor="scenario"
                  className="px-4 py-2 rounded-full border border-deep-navy hover:bg-gray-100 transition-colors peer-checked:bg-deep-navy peer-checked:text-white peer-checked:hover:bg-deep-navy cursor-pointer block"
                >
                  시나리오
                </label>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                id="hide"
                className="hidden peer"
                {...register("hide")}
              />
              <label
                htmlFor="hide"
                className={tw(
                  "px-4 py-2 rounded-full border border-deep-navy hover:bg-gray-100 transition-colors cursor-pointer block",
                  "peer-checked:bg-amber-500 peer-checked:text-gray-50 peer-checked:hover:bg-amber-500 peer-checked:border-amber-500"
                )}
              >
                비밀글
              </label>
            </div>
            {errors.category && (
              <span className="text-red-500">{errors.category.message}</span>
            )}
          </div>
        </div>
      </div>

      {/* title 영역 */}
      <div className="w-full flex flex-col gap-2">
        <h3 className="text-lg">제목 *</h3>
        <input
          type="text"
          placeholder="제목을 입력해주세요."
          className="w-full p-4 border border-gray-300 rounded-md font-medium bg-gray-50 focus:bg-white trasition-colors"
          {...register("title")}
        />
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
      </div>

      {/* content 영역 */}
      <div className="w-full flex flex-col gap-2">
        <h3 className="text-lg">내용 *</h3>
        <textarea
          placeholder="내용을 입력해주세요."
          className="w-full p-4 border border-gray-300 rounded-md font-medium bg-gray-50 min-h-80 focus:bg-white trasition-colors"
          {...register("content")}
        />
        {errors.content && (
          <span className="text-red-500">{errors.content.message}</span>
        )}
      </div>

      {/* poll 영역 */}
      {category === "POLL" && (
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-lg">투표</h3>
          <div className="flex gap-2 flex-col relative">
            {pollItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="투표 항목을 입력해주세요."
                  className="w-full p-4 border border-gray-300 rounded-md font-medium bg-gray-50 focus:bg-white trasition-colors"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...pollItems];
                    newItems[index] = e.target.value;
                    setPollItems(newItems);
                  }}
                />
                {pollItems.length > 2 && (
                  <button
                    type="button"
                    className="px-3 py-2 bg-inherit text-deep-navy rounded h-11 flex-shrink-0 absolute right-0"
                    onClick={() => {
                      const newItems = pollItems.filter((_, i) => i !== index);
                      setPollItems(newItems);
                    }}
                  >
                    <IoClose size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-deep-navy text-white rounded h-11"
              onClick={() => setPollItems([...pollItems, ""])}
            >
              투표 항목 추가
            </button>
          </div>
          {errors.poll && (
            <span className="text-red-500">{errors.poll.message}</span>
          )}
        </div>
      )}

      <hr className="w-full border-gray-300" />

      {/* 버튼 영역 */}
      <div className="w-full flex gap-2 items-center justify-between">
        <div>
          <BackButton className="rounded-md border border-deep-navy px-4 py-2 w-32">
            취소
          </BackButton>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-inherit text-deep-navy rounded-md border border-deep-navy px-4 py-2 w-32"
          >
            삭제
          </button>
          <button
            type="submit"
            className="bg-deep-navy text-white rounded-md px-4 py-2 w-32"
          >
            작성
          </button>
        </div>
      </div>
    </form>
  );
}
export default PostWriteForm;
