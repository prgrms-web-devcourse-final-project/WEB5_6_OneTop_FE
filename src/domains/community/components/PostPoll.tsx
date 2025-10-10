"use client";
import { useSetPolls } from "@/domains/community/components/useSetPolls";
import tw from "@/share/utils/tw";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PostPollType } from "../types";
import { FaCheckCircle } from "react-icons/fa";




function PostPoll({ items }: { items: PostPollType[] }) {
  const { id } = useParams();
  const [pollItems, setPollItems] = useState<PostPollType[]>(() => items);
  console.log(items);

  // 상위 컴포넌트에서 items가 변경될 때 state 업데이트
  useEffect(() => {
    setPollItems(items);
  }, [items]);

  const fullCount = pollItems.reduce((acc, item) => acc + item.voteCount, 0);
  const whatEverVoted = pollItems.find((item) => item.isVoted);
  const { mutate: setPolls } = useSetPolls();

  // 기존 선택된 게 있으면 제거하고 투표 추가
  const handleVote = (targetIndex: number) => {
    setPolls({ choice: [targetIndex + 1], postId: id as string });

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
    <ul className="flex gap-2 flex-col p-2">
      {pollItems.map((item, index) => (
        <li key={index}>
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
                "text-deep-navy absolute right-[50%] bottom-[50%] translate-y-[50%] translate-x-[50%] z-50",
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
                  "text-green-200 absolute left-2 bottom-[50%] translate-y-[50%] z-50"
                )}
                size={20}
              />
            )}
            <div
              className={tw(
                "absolute right-0 bottom-[50%] translate-y-[50%] w-fit px-2 flex items-center gap-2 z-50 opacity-0",
                whatEverVoted && "opacity-100"
                
              )}
            >
              <span className={tw("text-midnight-blue", item.isVoted && "text-white")}>
                {fullCount > 0
                  ? ((item.voteCount / fullCount) * 100).toFixed(0)
                  : 0}
                %
              </span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
export default PostPoll;
