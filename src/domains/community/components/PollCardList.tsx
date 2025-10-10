import { getPost } from "../api/getPost";
import { getPostList } from "../api/getPostList";
import { PostDetail } from "../types";
import PollCard from "./PollCard";

async function PollCardList() {
  const { items } = await getPostList({
    page: 1,
    size: 10,
    category: "POLL",
    searchType: "TITLE",
    sort: "LIKES",
    keyword: "",
  });

  const details = await Promise.all(
    items.map((item: PostDetail) => getPost(item.postId.toString()))
  );

  return (
    <ul className="flex gap-4 overflow-x-auto w-full">
      {details.map((item: PostDetail) => (
        <PollCard key={item.postId} items={item} />
      ))}
    </ul>
  );
}
export default PollCardList;
