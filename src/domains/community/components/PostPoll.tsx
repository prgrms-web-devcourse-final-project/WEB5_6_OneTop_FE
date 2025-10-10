"use client";
import tw from "@/share/utils/tw";
import { useState } from "react";

interface PostPoll {
  index: number;
  text: string;
  voteCount: number;
  isVoted: boolean;
}

function PostPoll({ items }: { items: PostPoll[] }) {
  const [pollItems, setPollItems] = useState<PostPoll[]>(() => items);

  const fullCount = pollItems.reduce((acc, item) => acc + item.voteCount, 0);
  const whatEverVoted = pollItems.find((item) => item.isVoted);

  // 기존 선택된 게 있으면 제거하고 투표 추가
  const handleVote = (targetIndex: number) => {
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
        <li
          key={index}
          className={tw("relative overflow-hidden")}
          onClick={() => handleVote(index)}
        >
          <input
            type="button"
            value={item.text}
            className={tw(
              "px-4 py-2 bg-white text-deep-navy rounded h-11 w-full border border-deep-navy",
              item.isVoted && "border-ivory",
              whatEverVoted && "border-ivory bg-gray-200"
            )}
          />
          <div
            className={tw(
              "absolute top-0 left-0 h-full bg-deep-navy flex items-center justify-end",
              "transition-all duration-500 ease-in-out rounded-md px-4",
              whatEverVoted ? "opacity-100" : "opacity-0",
              item.isVoted && "bg-ivory"
            )}
            style={{
              width: whatEverVoted
                ? `${
                    fullCount > 0
                      ? ((item.voteCount / fullCount) * 100).toFixed(0)
                      : 0
                  }%`
                : "0%",
            }}
          ></div>
          <div
            className={tw(
              "absolute right-0 bottom-[50%] translate-y-[50%] w-fit px-2 flex items-center gap-2 z-50 opacity-0",
              whatEverVoted && "opacity-100"
            )}
          >
            <span className={tw("text-midnight-blue")}>
              {fullCount > 0
                ? ((item.voteCount / fullCount) * 100).toFixed(0)
                : 0}
              %
            </span>
            <span className={tw("text-midnight-blue")}>{item.voteCount}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
export default PostPoll;
