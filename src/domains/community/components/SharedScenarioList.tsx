import { getPost } from "../api/getPost";
import { getPostList } from "../api/getPostList";
import { Post, PostDetail } from "../types";
import ProfileAvatar from "./ProfileAvatar";
import SharedScenarioItem from "./SharedScenarioItem";
import Link from "next/link";

async function SharedScenarioList() {
  const data = await getPostList({
    page: 0,
    size: 3,
    keyword: "",
    category: "SCENARIO",
    searchType: "TITLE",
  });

  const scenarios = await Promise.all(
    data.items.map(async (item: Post) => {
      const scenario = await getPost(item.postId.toString());
      return scenario;
    })
  );

  if (data.items.length === 0) {
    return (
      <div className="flex text-center text-gray-500 h-30 items-center justify-center p-4">
        <span className="font-bold">게시글이 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 ">
      {scenarios.map((scenario: PostDetail) => (
        <div
          key={scenario.postId}
          className="border border-gray-200 rounded-md gap-4 text-slate-800 p-4"
        >
          <div className="flex items-center gap-2 justify-between mb-4">
            <div className="flex items-center gap-2">
              <ProfileAvatar nickname={scenario.author || ""} />
              <div>{scenario.author}</div>
            </div>
            <div>{scenario.createdDate}</div>
          </div>
          <div className="mb-4 line-clamp-2 px-4">{scenario.content}</div>
          <SharedScenarioItem
            key={scenario.postId}
            scenarioInfo={scenario.scenario}
          />

          <Link
            href={`/community/detail/${scenario.postId}`}
            className="flex justify-center items-center text-slate-500 border border-gray-200 p-4 hover:text-slate-800 transition-colors duration-300 mt-4"
          >
            전체 게시글 확인하러 가기
          </Link>
        </div>
      ))}
    </div>
  );
}
export default SharedScenarioList;
