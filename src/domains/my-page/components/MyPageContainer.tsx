import { Suspense } from "react";
import Loading from "./Loading";
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<Loading />}>
          <MyUsageStats />
        </Suspense>
      </div>

      {/* 대표 프로필 */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<Loading />}>
          <RepresentativeProfile />
        </Suspense>
      </div>

      {/* 내 정보 */}
      <div className="w-full bg-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Suspense fallback={<Loading />}>
            <MyInfo />
          </Suspense>
        </div>
      </div>

      {/* 평행우주 목록 */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<Loading />}>
          <Myscenarios />
        </Suspense>
      </div>

      {/* 작성글 */}
      <div className="w-full bg-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Suspense fallback={<Loading />}>
            <MyPosts />
          </Suspense>
        </div>
      </div>

      {/* 댓글 */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<Loading />}>
          <MyComments />
        </Suspense>
      </div>
    </div>
  );
}
