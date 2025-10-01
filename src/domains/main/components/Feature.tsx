"use client";

import { LuFilePenLine } from "react-icons/lu";
import { LuAlignEndHorizontal } from "react-icons/lu";
import { PiGitForkThin } from "react-icons/pi";

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: Props) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-8 bg-black/20 backdrop-blur-sm rounded-2xl hover:bg-black/30 transition-all duration-300">
      <div className="text-white text-5xl mb-2">{icon}</div>
      <h3 className="text-white text-xl font-bold">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
};

const Feature = () => {
  return (
    <section className="w-full h-screen relative">
      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white text-2xl font-bold mb-3">핵심 기능</h2>
          <p className="text-gray-300 text-sm max-w-xs">
            다른 선택이 만들어낸 평행우주
          </p>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Features */}
          <div className="space-y-8">
            <FeatureCard
              icon={<LuFilePenLine size={62} />}
              title="인생 분기점 기록 시스템"
              description="중대한 인생 선택 기록"
            />

            <FeatureCard
              icon={<LuAlignEndHorizontal size={62} />}
              title="비교 & 분석 도구"
              description="현재 삶 vs 가상 삶 시각화"
            />
          </div>

          {/* Center - Main Image */}
          <div className="flex flex-col items-center">
            <h1
              className="text-white text-7xl font-bold mb-8"
              style={{ fontFamily: "serif" }}
            >
              Re:Life
            </h1>
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <p className="text-white text-sm leading-relaxed">
                  단순한 상상이 아닌,
                  <br />
                  실제 데이터와 AI 분석을 통해
                  <br />
                  당신만의 평행우주를 보여드립니다.
                </p>
              </div>
            </div>
          </div>

          {/* Right Features */}
          <div className="space-y-8">
            <FeatureCard
              icon={<PiGitForkThin size={62} />}
              title="AI 평행우주 시뮬레이션"
              description="대체 선택 시 인생 시나리오 생성"
            />

            <FeatureCard
              icon={
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              }
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
