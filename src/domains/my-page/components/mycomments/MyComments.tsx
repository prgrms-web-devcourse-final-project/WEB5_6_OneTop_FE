"use client";

import { useSearchParams } from "next/navigation";
import Pagination from "@/share/components/Pagination";
import Link from "next/link";
import EmptyState from "@/share/components/EmptyState";
import { useMyComments } from "../../hooks/useMyComments";

export default function MyComments() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("commentPage")) || 1;

  const { data } = useMyComments(page);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          내 댓글
          {data && data.totalElements > 0 && (
            <span className="ml-2">({data.totalElements})</span>
          )}
        </h2>
      </div>

      <div className="px-8">
        {data?.items && data.items.length > 0 ? (
          data.items.map((comment, idx) => (
            <Link
              key={comment.commentId}
              href={`/community/detail/${comment.postId}`}
              className={`block p-4 border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer ${
                idx === data.items.length - 1 ? "border-b-0" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="text-base text-gray-500">게시글</span>
                  <span className="text-base text-black ml-2">
                    {comment.postTitle}
                  </span>
                </div>
                <span className="text-base text-gray-500">
                  {new Date(comment.postCreatedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center pl-8">
                  <span className="text-base text-gray-500">내 댓글</span>
                  <span className="text-base text-black ml-2">
                    {comment.content}
                  </span>
                </div>
                <span className="text-base text-gray-500">
                  {new Date(comment.commentCreatedAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <EmptyState
            title="아직 작성한 댓글이 없습니다"
            description="게시글에 댓글을 남겨보세요."
            linkText="댓글 작성하러 가기"
            linkHref="/community"
          />
        )}
      </div>

      {data && data.items.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          pageParamName="commentPage"
        />
      )}
    </div>
  );
}
