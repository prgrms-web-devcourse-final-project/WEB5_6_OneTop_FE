import { queryKeys } from "@/share/config/queryKeys";
import { getPost } from "../api/getPost";
import { getPostList } from "../api/getPostList";
import { Post } from "../types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PollCardSwiper from "./PollCardSwiper";

async function PollCardList() {
  const { items } = await getPostList({
    page: 1,
    size: 10,
    category: "POLL",
    searchType: "TITLE",
    sort: "LIKES",
    keyword: "",
  });

  const queryClient = new QueryClient();

  await Promise.all(
    items.map((item: Post) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.post.id(item.postId.toString()),
        queryFn: () => getPost(item.postId.toString()),
      })
    )
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PollCardSwiper items={items} />
    </HydrationBoundary>
  );
}
export default PollCardList;
