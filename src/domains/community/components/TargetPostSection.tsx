import TargetPostList from "./TargetPostList";

function TargetPostSection() {
  return (
    <section className="w-full grid grid-cols-1 gap-6 md:grid-cols-2">
      <TargetPostList category="ALL" title="전체 인기 게시글"/>
      <TargetPostList category="SCENARIO" title="시나리오 인기 게시글"/>
      <TargetPostList category="POLL" title="투표 인기 게시글"/>
      <TargetPostList category="CHAT" title="잡담 인기 게시글"/>
      <TargetPostList category="ALL" sortType="LATEST" title="전체 최근 게시글"/>
      <TargetPostList category="SCENARIO" sortType="LATEST" title="시나리오 최근 게시글"/>
      <TargetPostList category="POLL" sortType="LATEST" title="투표 최근 게시글"/>
      <TargetPostList category="CHAT" sortType="LATEST" title="잡담 최근 게시글"/>
    </section>
  );
}

export default TargetPostSection;
