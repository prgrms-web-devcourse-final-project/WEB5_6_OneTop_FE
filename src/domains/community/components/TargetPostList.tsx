import Link from "next/link";
import { Post, PostFilterType, PostSortType } from "../types";
import { getPostList } from "../api/getPostList";
import { BiCommentDetail, BiLike } from "react-icons/bi";

interface TargetPostListProps {
  size?: number;
  category?: PostFilterType;
  sort?: PostSortType;
  keyword?: string;
  title?: string;
}

async function TargetPostList({
  size = 8,
  category = "ALL",
  sort = "LIKES",
  keyword = "",
  title = "게시글",
}: TargetPostListProps) {
  const { items } = await getPostList({
    page: 1,
    searchType: "TITLE",
    size,
    category,
    sort,
    keyword,
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div>
        {items && items.length > 0
          ? items.map((post: Post, idx: number) => (
              <Link
                key={post.postId}
                href={`/community/detail/${post.postId}`}
                className={`block py-4 border-b border-gray-300 hover:bg-gray-50 transition cursor-pointer ${
                  idx === items.length - 1 ? "border-b-0" : ""
                }`}
              >
                <div className="flex justify-between items-center px-4">
                  <span className="text-base text-black text-ellipsis overflow-hidden line-clamp-1">
                    {post.title}
                  </span>
                  <div className="flex items-center gap-4 text-base text-gray-500">
                    <span className="flex items-center gap-2 text-sm">
                      {post.createdDate}
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                      <BiLike size={16} />
                      {post.likeCount}
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                      <BiCommentDetail size={16} />
                      {post.commentCount}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          : null}
      </div>
    </div>
  );
}
export default TargetPostList;
