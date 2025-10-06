import { CiViewList } from "react-icons/ci";
import { CiAlignBottom } from "react-icons/ci";
import { PiNotePencilLight } from "react-icons/pi";
import { PiGitForkLight } from "react-icons/pi";

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: Props) => {
  return (
    <div className="flex flex-col items-center justify-end w-[16.3vw] h-[250px] pb-8 bg-black/40 rounded-lg text-white hover:bg-blur-xs transition-all duration-300">
      <div className="mb-7">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300 text-base">{description}</p>
    </div>
  );
};

const Feature = () => {
  return (
    <section className="relative w-full py-25">
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-[155px]">
        <div className="flex flex-col items-center gap-3 text-white">
          <h2 className="text-[32px] font-semibold">핵심 기능</h2>
          <p className="text-lg">다른 선택이 만들어낸 평행우주</p>
        </div>
        <div className="max-w-[1440px] mx-auto flex gap-10">
          <div className="space-y-5">
            <FeatureCard
              icon={<PiNotePencilLight size={62} />}
              title="인생 분기점 기록 시스템"
              description="중대한 인생 선택 기록"
            />
            <FeatureCard
              icon={<CiAlignBottom size={62} />}
              title="비교 & 분석 도구"
              description="현재 삶 vs 가상 삶 시각화"
            />
          </div>
          <div className="relative flex-1">
            <h3 className="absolute -top-[90px] left-[50%] -translate-x-1/2 text-buttercream text-[100px] font-family-logo z-10">
              Re:Life
            </h3>
            <div className="relative w-[40.55vw] min-h-[520px] aspect-[5/3] rounded-lg bg-[url('/feature_img.png')] bg-cover bg-center overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-8">
                <p className="text-white text-xl leading-8">
                  단순한 상상이 아닌,
                  <br />
                  실제 데이터와 AI 분석을 통해
                  <br />
                  당신만의 평행우주를 보여드립니다.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <FeatureCard
              icon={<PiGitForkLight size={62} />}
              title="AI 평행우주 시뮬레이션"
              description="대체 선택 시 인생 시나리오 생성"
            />
            <FeatureCard
              icon={<CiViewList size={62} />}
              title="소셜 & 커뮤니티 기능"
              description="A vs B 투표, 시나리오 공유"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
