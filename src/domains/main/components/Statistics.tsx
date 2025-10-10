"use client";

import { useEffect, useRef } from "react";
import { IoEarthOutline } from "react-icons/io5";
import { AiOutlineLineChart } from "react-icons/ai";
import { RxCountdownTimer } from "react-icons/rx";
import { useMobileDetection } from "@/share/hooks/useMobileDetection";

interface Props {
  icon: React.ReactNode;
  value: string;
  label: string;
  startCounting: boolean;
}

const StatItem = ({ icon, value, label, startCounting }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);

  // 숫자에서 쉼표와 기호 제거하고 숫자만 추출
  const extractNumber = (str: string): number => {
    const num = str.replace(/[^0-9]/g, "");
    return parseInt(num) || 0;
  };

  const targetNumber = extractNumber(value);
  const suffix = value.includes("+") ? "+" : value.includes("%") ? "%" : "";

  useEffect(() => {
    if (!startCounting) return;

    if (!elementRef.current) return;

    const el = elementRef.current.querySelector("p");
    if (!el) return;

    const duration = 2500;
    const steps = 60;
    const increment = targetNumber / steps;
    let currentStep = 0;
    let current = 0;

    const timer = setInterval(() => {
      currentStep++;
      current += increment;

      if (currentStep >= steps) {
        clearInterval(timer);
        (
          el as HTMLElement
        ).innerText = `${targetNumber.toLocaleString()}${suffix}`;
      } else {
        (el as HTMLElement).innerText = `${Math.floor(
          current
        ).toLocaleString()}${suffix}`;
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetNumber, suffix, startCounting]);

  return (
    <div
      ref={elementRef}
      className="flex items-center justify-center gap-2 md:gap-3 text-white"
    >
      <div className="pt-6">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs md:text-base mb-1">{label}</span>
        <p className="text-2xl md:text-4xl font-extrabold w-full sm:w-[90px] md:w-[130px]">
          0{suffix}
        </p>
      </div>
    </div>
  );
};

const Statistics = ({ startCounting }: { startCounting: boolean }) => {
  const isMobile = useMobileDetection(768);

  return (
    <div className="bg-black/70 rounded-lg">
      <div className="h-25 md:h-[150px] flex items-center justify-between">
        <div className="hidden min-[980px]:flex justify-center my-8 px-8 min-[1200px]:px-20 border-r border-white/30">
          <h3 className="text-white text-[45px] font-extrabold">Our Stats</h3>
        </div>
        <div className="flex flex-1 items-center justify-center gap-[5%] min-[1200px]:gap-[10%]">
          <StatItem
            icon={<IoEarthOutline size={isMobile ? 20 : 32} />}
            value="3000+"
            label="평행우주 생성"
            startCounting={startCounting}
          />

          <StatItem
            icon={<AiOutlineLineChart size={isMobile ? 20 : 32} />}
            value="100+"
            label="통계 데이터"
            startCounting={startCounting}
          />
          <StatItem
            icon={<RxCountdownTimer size={isMobile ? 20 : 32} />}
            value="95%"
            label="예측 정확도"
            startCounting={startCounting}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
