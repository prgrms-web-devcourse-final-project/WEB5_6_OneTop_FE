"use client";
import { useSetPolls } from "@/domains/community/components/useSetPolls";
import tw from "@/share/utils/tw";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PostPollType } from "../types";
import { FaCheckCircle } from "react-icons/fa";
import { queryKeys } from "@/share/config/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { refresh } from "@/app/api/actions/refresh";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import Swal from "sweetalert2";
import { useLoginModalStore } from "@/domains/auth/stores/loginModalStore";

interface PostPollProps {
  items: PostPollType[];
  className?: string;
  viewLength?: number;
  optionTextLength?: number;
  postId?: string;
}

function PostPoll({
  items,
  className,
  viewLength = 50,
  optionTextLength = 100,
  postId,
}: PostPollProps) {
  // 초기 설정
  const { id } = useParams();
  const { data: user } = useAuthUser();
  const [pollItems, setPollItems] = useState<PostPollType[]>(() => items);
  const queryClient = useQueryClient();
  const setIsOpen = useLoginModalStore((s) => s.setIsOpen);

  // 상위 컴포넌트에서 items가 변경될 때 state 업데이트
  useEffect(() => {
    setPollItems(items);
  }, [items]);

  // 초기 계산
  const fullCount = pollItems.reduce((acc, item) => acc + item.voteCount, 0);
  const whatEverVoted = pollItems.find((item) => item.isVoted);

  // 투표 mutation
  const { mutate: setPolls } = useSetPolls({
    onSuccess: (_data, vars) => {
      const targetId = vars.postId;

      refresh(queryKeys.post.nextId(targetId as string)[1]);

      queryClient.invalidateQueries({
        queryKey: queryKeys.post.id(targetId as string),
      });
    },
  });

  const handleVote = (targetIndex: number) => {
    if (!user?.data.nickname) {
      Swal.fire({
        title: "로그인 후 사용해주세요.",
        icon: "warning",
      }).then(() => {
        setIsOpen(true);
      });
      return;
    }

    setPolls({ choice: [targetIndex], postId: (postId || id) as string });

    const newPollItems = pollItems.map((item, i) => ({
      ...item,
      voteCount: item.isVoted
        ? item.voteCount - 1
        : i === targetIndex
        ? item.voteCount + 1
        : item.voteCount,
      isVoted: item.isVoted ? false : i === targetIndex,
    }));

    setPollItems(newPollItems);
  };

  return (
    <ul className={tw("flex gap-2 flex-col p-2", className)}>
      {pollItems
        .slice(0, Math.min(viewLength, pollItems.length))
        .map((item, index) => (
          <li key={index} className="cursor-pointer">
            <button
              className={tw("relative overflow-hidden w-full")}
              onClick={() => handleVote(index)}
              disabled={whatEverVoted ? true : false}
            >
              <input
                type="button"
                className={tw(
                  "px-4 py-2 bg-white text-deep-navy rounded h-11 w-full border border-deep-navy",
                  whatEverVoted && "border-ivory bg-ivory/30",
                  item.isVoted && "bg-ivory"
                )}
              />
              <div
                className={tw(
                  "text-deep-navy absolute right-[50%] bottom-[50%] translate-y-[50%] translate-x-[50%] z-20 max-w-[80%]",
                  "truncate overflow-hidden",
                  item.isVoted
                    ? "text-white drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
                    : "text-slate-700"
                )}
                style={
                  item.isVoted
                    ? {
                        textShadow:
                          "0 0 2px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.4)",
                      }
                    : {}
                }
              >
                {item.text}
              </div>
              <div
                className={tw(
                  "absolute top-0 left-0 h-full flex items-center justify-end",
                  "transition-all duration-700 ease-in-out rounded-md px-4 z-10",
                  whatEverVoted ? "opacity-100" : "opacity-0",
                  item.isVoted
                    ? "bg-gradient-to-r from-deep-navy/70 to-deep-navy/90"
                    : "bg-inherit border border-ivory"
                )}
                style={{
                  width: whatEverVoted
                    ? `${
                        fullCount > 0
                          ? ((item.voteCount / fullCount) * 100).toFixed(0)
                          : "0%"
                      }%`
                    : "0%",
                }}
              ></div>
              {item.isVoted && (
                <FaCheckCircle
                  className={tw(
                    "text-green-200 absolute left-2 bottom-[50%] translate-y-[50%] z-20"
                  )}
                  size={20}
                />
              )}
              <div
                className={tw(
                  "absolute right-0 bottom-[50%] translate-y-[50%] w-fit px-2 flex items-center gap-2 z-20 opacity-0",
                  whatEverVoted && "opacity-100"
                )}
              >
                <span
                  className={tw(
                    "text-midnight-blue",
                    item.isVoted && "text-white"
                  )}
                >
                  {fullCount > 0
                    ? ((item.voteCount / fullCount) * 100).toFixed(0)
                    : 0}
                  %
                </span>
              </div>
            </button>
          </li>
        ))}

      <li className="text-sm text-gray-500 flex items-end justify-end min-h-5">
        {pollItems.length > viewLength
          ? `${pollItems.length - viewLength}개의 투표 항목이 더 있습니다.`
          : "모든 투표 항목을 보여주고 있습니다."}
      </li>
    </ul>
  );
}
export default PostPoll;
