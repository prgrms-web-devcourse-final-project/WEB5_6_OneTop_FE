import PollCardList from "./PollCardList";
import TargetPostSection from "./TargetPostSection";
import SharedScenarioList from "./SharedScenarioList";

function CommunityMain() {
  return (
    <div className="flex flex-col gap-8 py-4">
      <h2 className="text-2xl font-bold">투표 목록</h2>
      <PollCardList />
      <hr className="border-gray-300" />
      <TargetPostSection />
      <hr className="border-gray-300" />
      <h2 className="text-2xl font-bold">유저 공유 시나리오</h2>
      <SharedScenarioList />
      <hr className="border-gray-300" />
    </div>
  );
}
export default CommunityMain;
