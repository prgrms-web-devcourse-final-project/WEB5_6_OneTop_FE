"use client";

import { useSearchParams } from "next/navigation";
import Pagination from "@/share/components/Pagination";
import Link from "next/link";
import EmptyState from "@/share/components/EmptyState";
import { useMyPosts } from "../../hooks/useMyPosts";
import Loading from "@/share/components/Loading";
import { showErrorToast } from "@/share/components/ErrorToast";

export default function MyPosts() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("postPage")) || 1;

  const { data, isLoading, error } = useMyPosts(page);

  if (isLoading) {
    return <Loading text="작성글을 불러오는 중..." />;
  }

  if (error) {
    showErrorToast(error);
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center">
          내 작성글
          {data && data.totalElements > 0 && (
            <span className="ml-2">({data.totalElements})</span>
          )}
        </h2>
      </div>

      <div className="px-8">
        {data?.items && data.items.length > 0 ? (
          data.items.map((post, idx) => (
            <Link
              key={post.postId}
              href={`/community/detail/${post.postId}`}
              className={`block py-4 border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer ${
                idx === data.items.length - 1 ? "border-b-0" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center px-4 gap-2">
                <span className="text-base text-black truncate break-all max-w-full md:max-w-[70%]">
                  {post.title}
                </span>
                <div className="flex items-center gap-4 text-sm md:text-base text-gray-500 md:justify-end">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>댓글 {post.commentCount}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <EmptyState
            title="아직 작성한 글이 없습니다"
            description="새로운 글을 작성해보세요."
            linkText="글 작성하러 가기"
            linkHref="/community/write"
          />
        )}
      </div>

      {data && data.items.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          pageParamName="postPage"
          scrollToId="posts"
        />
      )}
    </div>
  );
}
