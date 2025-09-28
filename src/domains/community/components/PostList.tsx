import { Post } from "../types";
import PostItem from "./PostItem";

interface PostListProps {
  posts: Post[];
}

function PostList({ posts }: PostListProps) {

  return (
    <ul className="flex flex-col">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
}
export default PostList;
