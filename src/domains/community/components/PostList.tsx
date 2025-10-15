import { Post } from "../types";
import PostItem from "./PostItem";

interface PostListProps {
  posts: Post[];
  className?: string;
}

function PostList({ posts, className }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        관련 게시글이 없습니다.
      </div>
    );
  }

  return (
    <ul className={`flex flex-col w-full ${className}`}>
      {posts.map((post) => (
        <PostItem key={post.postId} post={post} />
      ))}
    </ul>
  );
}
export default PostList;
