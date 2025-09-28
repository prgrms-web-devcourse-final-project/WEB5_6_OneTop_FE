import { postsSchema } from "../schemas/posts";
import { Post } from "../types";

interface PostItemProps {
  post: Post;
}

const categoryColor = {
  CHAT: "bg-blue-500",
  NOTICE: "bg-green-500",
  VOTE: "bg-yellow-500",
  SCENARIO: "bg-purple-500",
};

const categoryText = {
  CHAT: "채팅",
  NOTICE: "공지",
  VOTE: "투표",
  SCENARIO: "시나리오",
};

function PostItem({ post }: PostItemProps) {
  const parsedPost = postsSchema.parse(post);

  const { id, title, content, author, category, hide, likeCount, createdDate } =
    parsedPost;

  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            categoryColor[category]
          }`}
        ></div>
        <span className="text-sm">
          {categoryText[category]}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">{title}</span>
      </div>
    </li>
  );
}
export default PostItem;
