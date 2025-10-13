"use client";

import { useState, useRef, useEffect } from "react";
import { FaSpaceShuttle } from "react-icons/fa";

interface Props {
  number: string;
  title: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
  stepRef?: React.RefObject<HTMLDivElement | null>;
}

const Step = ({
  number,
  title,
  description,
  isActive = false,
  onClick,
  stepRef,
}: Props) => {
  return (
    <div
      className="flex flex-col items-center text-center relative md:before:content-none before:content-[''] before:block before:w-[calc(100%+32px)] before:h-[1px] before:bg-white before:absolute before:top-[47%] before:left-0"
      ref={stepRef}
    >
      <div className="text-white text-[42px] md:text-6xl font-bold mb-4">
        {number}
      </div>
      <div className="relative mb-7">
        <div
          onClick={onClick}
          className={`w-5 md:w-7 h-5 md:h-7 rounded-full bg-ivory transition-all duration-300 cursor-pointer md:hover:scale-125`}
        ></div>
        <span className="absolute top-1 md:top-[6px] left-1 md:left-[6px] inline-block w-3 md:w-4 h-3 md:h-4 rounded-full bg-deep-navy pointer-events-none" />
      </div>
      <h3 className="text-white text-lg md:text-2xl font-semibold mb-2 md:mb-4">
        {title}
      </h3>
      <p className="text-gray-300 text-base md:text-lg">{description}</p>
    </div>
  );
};

const Guide = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shuttlePosition, setShuttlePosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const steps = [
    {
      number: "01",
      title: "기록하기",
      description: "인생의 중요한 순간 기록",
    },
    {
      number: "02",
      title: "평행우주",
      description: "다른 선택 AI 시뮬레이션",
    },
    {
      number: "03",
      title: "비교 분석",
      description: "현재와 비교",
    },
    {
      number: "04",
      title: "함께 고민하기",
      description: "커뮤니티",
    },
  ];

  // 우주선 위치 계산
  useEffect(() => {
    const calculatePosition = () => {
      const stepElement = stepRefs[activeStep].current;
      const containerElement = containerRef.current;

      if (stepElement && containerElement) {
        const stepRect = stepElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();

        const stepCenter = stepRect.left + stepRect.width / 2;
        const containerLeft = containerRect.left;
        const position = stepCenter - containerLeft;

        setShuttlePosition(position);
      }
    };

    calculatePosition();
    window.addEventListener("resize", calculatePosition);

    return () => window.removeEventListener("resize", calculatePosition);
  }, [activeStep]);

  return (
    <section className="w-full h-auto md:h-screen relativ">
      <div className="relative z-10 h-full py-[50px] md:py-25">
        <div className="flex flex-col items-center gap-2 md:gap-3 text-white">
          <h2 className="text-2xl md:text-[32px] font-semibold">
            <span className="font-family-logo">Re:Life</span> 가이드
          </h2>
          <p className="text-base md:text-lg">쉽고 간단한 시작 가이드</p>
        </div>
        <div
          className="max-w-[1440px] mx-auto relative my-[50px] md:mt-[25vh]"
          ref={containerRef}
        >
          <div className="absolute top-[90px] left-0 right-0 h-[1px] bg-white hidden md:block" />
          <div
            className="absolute top-[90px] hidden md:block transition-all duration-700 ease-in-out z-10"
            style={{
              left: `${shuttlePosition}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <FaSpaceShuttle size={52} className="text-white" />
          </div>

          <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
            {steps.map((step, index) => (
              <Step
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                isActive={activeStep === index}
                onClick={() => setActiveStep(index)}
                stepRef={stepRefs[index]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guide;
