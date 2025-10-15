import MyUsageStats from "./myusagestats/MyUsageStats";
import MyInfo from "./myinfo/MyInfo";
import Myscenarios from "./myscenarios/MyScenarios";
import MyPosts from "./myposts/MyPosts";
import MyComments from "./mycomments/MyComments";
import RepresentativeProfile from "./representativeprofile/RepresentativeProfile";

export default function MyPageContainer() {
  return (
    <div className="w-full">
      {/* 사용 통계 */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <MyUsageStats />
      </div>

      {/* 대표 프로필 */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <RepresentativeProfile />
      </div>

      {/* 내 정보 */}
      <div className="w-full bg-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
          <MyInfo />
        </div>
      </div>

      {/* 평행우주 목록 */}
      <div
        id="scenarios"
        className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 scroll-mt-4"
      >
        <Myscenarios />
      </div>

      {/* 작성글 */}
      <div id="posts" className="w-full bg-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 scroll-mt-4">
          <MyPosts />
        </div>
      </div>

      {/* 댓글 */}
      <div
        id="comments"
        className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 scroll-mt-4"
      >
        <MyComments />
      </div>
    </div>
  );
}
