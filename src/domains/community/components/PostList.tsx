import { Post } from "../types";
import PostItem from "./PostItem";

interface PostListProps {
  posts: Post[];
  className?: string;
}

function PostList({ posts, className }: PostListProps) {

  return (
    <ul className={`flex flex-col w-full ${className}`}>
      {posts.map((post) => (
        <PostItem key={post.postId} post={post} />
      ))}
    </ul>
  );
}
export default PostList;
