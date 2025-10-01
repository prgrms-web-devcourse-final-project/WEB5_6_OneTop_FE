"use client";

import { useState, useEffect, useRef } from "react";
import { IoEarthOutline } from "react-icons/io5";
import { AiOutlineLineChart } from "react-icons/ai";
import { RxCountdownTimer } from "react-icons/rx";

interface Props {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatItem = ({ icon, value, label }: Props) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // 숫자에서 쉼표와 기호 제거하고 숫자만 추출
  const extractNumber = (str: string): number => {
    const num = str.replace(/[^0-9]/g, "");
    return parseInt(num) || 0;
  };

  const targetNumber = extractNumber(value);
  const suffix = value.includes("+") ? "+" : value.includes("%") ? "%" : "";

  useEffect(() => {
    const element = elementRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2500;
    const steps = 60;
    const increment = targetNumber / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newCount = Math.min(
        Math.floor(increment * currentStep),
        targetNumber
      );
      setCount(newCount);

      if (currentStep >= steps) {
        clearInterval(timer);
        setCount(targetNumber);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, targetNumber]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div
      ref={elementRef}
      className="flex items-center justify-center gap-3 text-white"
    >
      <div className="pt-6">{icon}</div>
      <div className="flex flex-col">
        <span className="text-base mb-1">{label}</span>
        <p className="text-4xl font-extrabold">
          {formatNumber(count)}
          {suffix}
        </p>
      </div>
    </div>
  );
};

const Statistics = () => {
  return (
    <div className="absolute left-[50%] -translate-x-[50%] bottom-8 w-[1440px] bg-deep-navy/60 rounded-lg">
      <div className="h-[150px] flex items-center justify-between">
        <div className="justify-center my-8 px-20 border-r border-white/30">
          <h3 className="text-white text-[45px] font-extrabold">Our Stats</h3>
        </div>
        <div className="flex flex-1 items-center justify-center gap-[10%]">
          <StatItem
            icon={<IoEarthOutline size={32} />}
            value="3000+"
            label="평행우주 생성"
          />
          <StatItem
            icon={<AiOutlineLineChart size={32} />}
            value="100+"
            label="통계 데이터"
          />
          <StatItem
            icon={<RxCountdownTimer size={32} />}
            value="95%"
            label="예측 정확도"
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
