"use client";
import tw from "@/share/utils/tw";
import { useState } from "react";

interface PostPoll {
  index: number;
  subject: string;
  votes: number;
  isVoted: boolean;
}

function PostPoll() {
  const [pollItems, setPollItems] = useState<PostPoll[]>(() => [
    { index: 0, subject: "1번 항목", votes: 5, isVoted: false },
    { index: 1, subject: "2번 항목", votes: 2, isVoted: false },
    { index: 2, subject: "3번 항목", votes: 0, isVoted: false },
  ]);

  const [votedIndex, setVotedIndex] = useState<number | null>(() =>
    pollItems.findIndex((item) => item.isVoted)
  );

  const fullCount = pollItems.reduce((acc, item) => acc + item.votes, 0);
  const whatEverVoted = pollItems.find((item) => item.isVoted);

  // 기존 선택된 게 있으면 제거하고 투표 추가
  const handleVote = (index: number) => {
    const newPollItems = pollItems.map((item, i) => ({
      ...item,
      votes: item.isVoted
        ? item.votes - 1
        : i === index
        ? item.votes + 1
        : item.votes,
      isVoted: item.isVoted ? false : i === index,
    }));
    setPollItems(newPollItems);
  };

  return (
    <ul className="flex gap-2 flex-col p-2">
      {pollItems.map((item, index) => (
        <li
          key={index}
          className="relative overflow-hidden"
          onClick={() => handleVote(item.index)}
        >
          <input
            type="button"
            value={item.subject}
            className="px-4 py-2 bg-white text-deep-navy rounded h-11 w-full border border-deep-navy"
          />
          <div
            className={tw(
              "absolute top-0 left-0 h-full bg-deep-navy flex items-center justify-end",
              "transition-all duration-500 ease-in-out rounded-md px-4",
              whatEverVoted ? "opacity-100" : "opacity-0"
            )}
            style={{
              width: whatEverVoted
                ? `${
                    fullCount > 0
                      ? ((item.votes / fullCount) * 100).toFixed(0)
                      : 0
                  }%`
                : "0%",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-white">
                {fullCount > 0
                  ? ((item.votes / fullCount) * 100).toFixed(0)
                  : 0}
                %
              </span>
              <span className="text-white">{item.votes}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
export default PostPoll;
