"use client";

import BackButton from "@/share/components/BackButton";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostWrite } from "../types";
import tw from "@/share/utils/tw";
import Swal from "sweetalert2";
import { postWriteSchema } from "../schemas/posts";
import { IoClose } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import { useGetPost } from "../api/useGetPost";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import { useEditPost } from "../api/useEditPost";
import { queryKeys } from "@/share/config/queryKeys";
import { refresh } from "@/app/api/actions/refresh";
import SharedScenarioItem from "./SharedScenarioItem";
import { clientScenariosApi } from "@/domains/scenarios/api/clientScenariosApi";
import { useQuery } from "@tanstack/react-query";
import RepresentativeProfileModal from "@/domains/my-page/components/representativeprofile/RepresentativeProfileModal";

function PostEditForm() {
  const [pollItems, setPollItems] = useState<string[]>(["", ""]);
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: user, isSuccess: isUserSuccess } = useAuthUser();
  const { data: post, isSuccess: isPostSuccess } = useGetPost(id);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(
    null
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostWrite>({
    resolver: zodResolver(postWriteSchema),
    defaultValues: {
      ...post,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const { data: scenarioInfo } = useQuery({
    queryKey: ["scenarioInfo", selectedScenarioId],
    queryFn: () => {
      if (!selectedScenarioId) return null;
      return clientScenariosApi.getScenarioInfo(selectedScenarioId as number);
    },
    retry: false,
  });

  const { mutate: editPost } = useEditPost({
    onSuccess: () => {
      Swal.fire({
        title: "success",
        text: "글수정이 완료되었습니다.",
        icon: "success",
      });
      refresh(queryKeys.post.nextId(id as string)[1]);
      router.push(`/community/detail/${id}`);
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

    editPost({ data, id });
  };

  const handleCloseScenarioModal = () => {
    setIsScenarioModalOpen(false);
    setSelectedScenarioId(null);
  };

  const handleOpenScenarioModal = () => {
    setIsScenarioModalOpen(true);
  };

  const handleSelectScenario = (senarioId: number) => {
    setSelectedScenarioId(senarioId);
    setIsScenarioModalOpen(false);
  };

  // 유저 정보 조회 성공 시 작성자 비교
  useEffect(() => {
    if (isUserSuccess && isPostSuccess) {
      if (user?.data?.nickname !== post?.author) {
        Swal.fire({
          title: "해당 게시글의 작성자가 아닙니다.",
          icon: "error",
        });
        router.push("/community");
      }
    }
  }, [
    isUserSuccess,
    isPostSuccess,
    user?.data?.nickname,
    post?.author,
    router,
  ]);

  useEffect(() => {
    if (isPostSuccess) {
      setPollItems(
        post?.polls?.options.map((option) => option.text) || ["", ""]
      );
    }
  }, [isPostSuccess, post?.polls?.options]);

  const category = watch("category");

  return (
    <form
      className="w-[80%] flex flex-col items-center gap-4 py-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      {isScenarioModalOpen && (
        <RepresentativeProfileModal
          isOpen={isScenarioModalOpen}
          onClose={handleCloseScenarioModal}
          selectedScenarioId={selectedScenarioId}
          setSelectedScenarioId={setSelectedScenarioId}
          onSubmit={handleSelectScenario}
        />
      )}
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
                  disabled={category !== "CHAT"}
                  {...register("category")}
                />
                <label
                  htmlFor="chat"
                  className={tw(
                    "px-4 py-2 rounded-full border border-deep-navy hover:bg-gray-100 transition-colors peer-checked:bg-deep-navy peer-checked:text-white peer-checked:hover:bg-deep-navy cursor-pointer block",
                    category !== "CHAT" && "cursor-not-allowed"
                  )}
                >
                  잡담
                </label>
              </div>
              <div className="relative">
                <input
                  type="radio"
                  id="poll"
                  className={tw(
                    "hidden peer",
                    category !== "POLL" && "cursor-not-allowed"
                  )}
                  value="POLL"
                  {...register("category")}
                  disabled={category !== "POLL"}
                />
                <label
                  htmlFor="poll"
                  className={tw(
                    "px-4 py-2 rounded-full border border-deep-navy hover:bg-gray-100 transition-colors peer-checked:bg-deep-navy peer-checked:text-white peer-checked:hover:bg-deep-navy cursor-pointer block",
                    category !== "POLL" && "cursor-not-allowed"
                  )}
                >
                  투표
                </label>
              </div>
              <div className="relative">
                <input
                  type="radio"
                  id="scenario"
                  className={tw(
                    "hidden peer",
                    category !== "SCENARIO" && "cursor-not-allowed"
                  )}
                  value="SCENARIO"
                  {...register("category")}
                  disabled={category !== "SCENARIO"}
                />
                <label
                  htmlFor="scenario"
                  className={tw(
                    "px-4 py-2 rounded-full border border-deep-navy hover:bg-gray-100 transition-colors peer-checked:bg-deep-navy peer-checked:text-white peer-checked:hover:bg-deep-navy cursor-pointer block",
                    category !== "SCENARIO" && "cursor-not-allowed"
                  )}
                >
                  시나리오
                </label>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                id="hide"
                className={tw("hidden peer")}
                {...register("hide")}
                disabled={category !== "CHAT"}
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
          maxLength={50}
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
          maxLength={2000}
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
                  maxLength={100}
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

      {/* 시나리오 영역 */}
      {/* scenario 영역 */}
      {category === "SCENARIO" && (
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-lg">시나리오 선택*</h3>
          <button
            type="button"
            className="bg-deep-navy text-white rounded-md px-4 py-2 w-full"
            onClick={handleOpenScenarioModal}
          >
            시나리오 선택
          </button>
          {post?.scenario && !selectedScenarioId ? (
            <SharedScenarioItem scenarioInfo={post?.scenario} />
          ) : selectedScenarioId && scenarioInfo ? (
            <SharedScenarioItem scenarioInfo={scenarioInfo} />
          ) : (
            <>
              <span className="text-center">
                아직 선택된 시나리오가 없습니다! 시나리오를 선택해주세요.
              </span>
            </>
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
export default PostEditForm;
