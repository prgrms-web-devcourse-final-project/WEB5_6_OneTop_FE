"use client";

import Link from "next/link";
import { useGetPost } from "../api/useGetPost";
import PostPoll from "./PostPoll";
import tw from "@/share/utils/tw";

interface PollCardProps {
  className?: string;
  postId: number;
}

function PollCard({ className, postId }: PollCardProps) {
  const { data: items } = useGetPost(postId.toString());

  return (
    // 전체 영역
    <div className="flex flex-col gap-2 bg-gray-100 rounded-md px-4 pt-4">
      {/* 게시글 영역 */}
      <div
        className={tw(
          "w-full min-h-[280px] min-w-0 flex flex-col justify-between",
          className
        )}
      >
        <div className="flex flex-col px-2 min-w-0">
          <div className="flex justify-between min-w-0">
            <h3 className="text-lg font-bold min-w-0 line-clamp-1">{items?.title}</h3>
            <p className="text-sm text-gray-500 min-w-0 text-nowrap">{items?.author}</p>
          </div>
          <p className="line-clamp-2 min-w-0 break-words whitespace-pre-wrap">
            {items?.content}
          </p>
        </div>

        <div className="min-w-0">
          <PostPoll
            items={
              items?.polls?.options.map((option) => ({
                index: option.index,
                text: option.text,
                voteCount: option.voteCount || 0,
                isVoted: items?.polls?.selected?.[0] === option.index || false,
              })) || []
            }
            viewLength={3}
            postId={items?.postId.toString()}
          />
        </div>
      </div>
      {/* 더보기 버튼 영역 */}
      <Link
        href={`/community/post/${items?.postId}`}
        className="flex justify-center items-center text-gray-500 border-t border-gray-200 p-4 hover:text-gray-700 transition-colors duration-300"
      >
        전체 게시글 확인하러 가기
      </Link>
    </div>
  );
}
export default PollCard;
