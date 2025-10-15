"use client";

import { useSearchParams } from "next/navigation";
import Pagination from "@/share/components/Pagination";
import Link from "next/link";
import EmptyState from "@/share/components/EmptyState";
import { useMyComments } from "../../hooks/useMyComments";
import Loading from "@/share/components/Loading";
import { showErrorToast } from "@/share/components/ErrorToast";

export default function MyComments() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("commentPage")) || 1;

  const { data, isLoading, error } = useMyComments(page);

  if (isLoading) {
    return <Loading text="댓글을 불러오는 중..." />;
  }

  if (error) {
    showErrorToast(error);
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center">
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
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-1 md:gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
                  <span className="text-sm md:text-base text-gray-500 whitespace-nowrap">
                    게시글
                  </span>
                  <span className="text-sm md:text-base text-black truncate break-all max-w-full md:max-w-[40vw]">
                    {comment.postTitle}
                  </span>
                </div>
                <span className="text-xs md:text-base text-gray-500 flex-shrink-0 whitespace-nowrap md:ml-4">
                  {new Date(comment.postCreatedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 md:gap-2 pl-0 md:pl-8">
                <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
                  <span className="text-sm md:text-base text-gray-500 whitespace-nowrap">
                    내 댓글
                  </span>
                  <span className="text-sm md:text-base text-black truncate break-all max-w-full md:max-w-[40vw]">
                    {comment.content}
                  </span>
                </div>
                <span className="text-xs md:text-base text-gray-500 flex-shrink-0 whitespace-nowrap md:ml-4">
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
          scrollToId="comments"
        />
      )}
    </div>
  );
}
