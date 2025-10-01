"use client";

interface Props {
  number: string;
  title: string;
  description: string;
  isActive?: boolean;
}

const Step = ({ number, title, description, isActive = false }: Props) => {
  return (
    <div className="flex flex-col items-center text-center relative">
      {/* Step Number and Circle */}
      <div className="relative mb-6">
        <div
          className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
            isActive
              ? "border-white bg-white/10"
              : "border-white/50 bg-transparent"
          }`}
        >
          {isActive && (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="text-white text-6xl font-bold mb-4 opacity-90">
        {number}
      </div>
      <h3 className="text-white text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300 text-sm max-w-xs">{description}</p>
    </div>
  );
};

const Guide = () => {
  return (
    <section className="w-full h-screen relative">
      <div className="absolute inset-0" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="text-center mb-20">
          <h2 className="text-white text-4xl font-bold mb-3">Re:Life 가이드</h2>
          <p className="text-gray-300 text-base">쉽고 간단한 시작 가이드</p>
        </div>
        <div className="max-w-7xl w-full relative">
          <div
            className="absolute top-6 left-0 right-0 h-0.5 bg-white/30 hidden lg:block"
            style={{ width: "calc(100% - 100px)", left: "50px" }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <Step
              number="01"
              title="기록하기"
              description="인생의 중요한 순간 기록"
              isActive={true}
            />
            <Step
              number="02"
              title="평행우주"
              description="다른 선택 AI 시뮬레이션"
            />
            <Step number="03" title="비교 분석" description="현재와 비교" />

            <Step number="04" title="함께 고민하기" description="커뮤니티" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guide;
