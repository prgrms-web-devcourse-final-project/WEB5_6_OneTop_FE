import { useMobileDetection } from "@/share/hooks/useMobileDetection";
import { CiViewList, CiAlignBottom } from "react-icons/ci";
import { PiNotePencilLight, PiGitForkLight } from "react-icons/pi";

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[200px] md:h-[250px] pt-2 px-3 bg-black/40 rounded-lg text-white hover:bg-blur-xs transition-all duration-300">
      <div className="mb-5 md:mb-7">{icon}</div>
      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-center">
        {title}
      </h3>
      <p className="text-gray-300 text-sm md:text-base text-center">
        {description}
      </p>
    </div>
  );
};

const Feature = () => {
  const isMobile = useMobileDetection(768);

  return (
    <section className="relative w-full py-[50px] md:py-25">
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-10 md:gap-[155px]">
        <div className="flex flex-col items-center gap-2 md:gap-3 text-white text-center">
          <h2 className="text-2xl md:text-[32px] font-semibold">핵심 기능</h2>
          <p className="text-base md:text-lg">다른 선택이 만들어낸 평행우주</p>
        </div>

        {/* 카드 그룹 */}
        <div className="w-full max-w-[1440px] mx-auto px-5 min-[1440px]:px-0 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 break-keep">
          <div className="w-full space-y-0 md:space-y-5 flex gap-4 md:block order-2 md:order-2">
            <FeatureCard
              icon={<PiNotePencilLight size={isMobile ? 48 : 62} />}
              title="인생 분기점 기록 시스템"
              description="중대한 인생 선택 기록"
            />
            <FeatureCard
              icon={<CiAlignBottom size={isMobile ? 48 : 62} />}
              title="비교 & 분석 도구"
              description="현재 삶 vs 가상 삶 시각화"
            />
          </div>

          {/* 중앙 이미지 */}
          <div className="relative flex-1 mt-8 md:mt-0 order-1 md:order-2">
            <h3 className="absolute -top-[45px] md:-top-[90px] left-1/2 -translate-x-1/2 text-buttercream text-[50px] md:text-[100px] font-family-logo z-10">
              Re:Life
            </h3>
            <div className="relative w-full px-5 md:w-[40.6vw] min-h-[250px] md:min-h-[520px] aspect-[5/3] rounded-lg bg-[url('/feature_img.png')] bg-cover bg-center overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-6 md:pb-8">
                <p className="text-white text-base md:text-xl leading-6 md:leading-8 px-4">
                  단순한 상상이 아닌,
                  <br />
                  실제 데이터와 AI 분석을 통해
                  <br />
                  당신만의 평행우주를 보여드립니다.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-0 md:space-y-5 flex gap-4 md:block order-3">
            <FeatureCard
              icon={<PiGitForkLight size={48} className="md:size-[62px]" />}
              title="AI 평행우주 시뮬레이션"
              description="대체 선택 시 인생 시나리오 생성"
            />
            <FeatureCard
              icon={<CiViewList size={48} className="md:size-[62px]" />}
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
