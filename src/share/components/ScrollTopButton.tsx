"use client";

import tw from "@/share/utils/tw";
import { BsArrowUp } from "react-icons/bs";
import type React from "react";
import { useState, useEffect } from "react";
import { useMobileDetection } from "@/share/hooks/useMobileDetection";

interface Props {
  target?: HTMLElement;
  isVisible?: boolean;
  showOnScroll?: boolean; // 스크롤에 따라 자동으로 보이기/숨기기
  scrollThreshold?: number; // 몇 px 스크롤했을 때 보일지
  footerHeight?: number; // 푸터 높이 (px)
}

type ExtendProps = Props & React.ButtonHTMLAttributes<HTMLButtonElement>;

function ScrollTopButton({
  target,
  isVisible = true,
  showOnScroll = true,
  scrollThreshold = 200,
  footerHeight = 80,
  className,
  ...rest
}: ExtendProps) {
  const [autoVisible, setAutoVisible] = useState(false);
  const [bottomPosition, setBottomPosition] = useState(30);

  const isMobile = useMobileDetection(768);

  // 스크롤 감지
  useEffect(() => {
    if (!showOnScroll) return;

    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      setAutoVisible(scrollTop > scrollThreshold);

      // 푸터 근처에서 버튼 위치 조정
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (distanceFromBottom <= footerHeight) {
        // 푸터 영역에 들어가면 위치 조정
        const adjustment =
          ((footerHeight - distanceFromBottom) / footerHeight) * 70;
        setBottomPosition(30 + adjustment);
      } else {
        // 일반 영역에서는 기본 위치
        setBottomPosition(30);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [showOnScroll, scrollThreshold, footerHeight]);

  const handleClick = () => {
    if (target) target.scroll({ top: 0, behavior: "smooth" });
    else window.scroll({ top: 0, behavior: "smooth" });
  };

  const finalIsVisible = showOnScroll ? autoVisible : isVisible;

  return (
    <>
      <button
        className={tw(
          "fixed right-[50px] flex bg-deep-navy border border-white backdrop-blur-sm",
          "w-[50px] h-[50px] rounded-full items-center justify-center overflow-hidden",
          "shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out z-20",
          "hover:scale-110",
          "transform transition-all duration-300 ease-in-out",
          finalIsVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0 pointer-events-none",
          isMobile ? "right-[20px]" : "right-[50px]",
          className
        )}
        style={{ bottom: `${bottomPosition}px` }}
        onClick={handleClick}
        aria-label="맨 위로 이동"
        {...rest}
      >
        <BsArrowUp className="text-white text-2xl animate-arrow-up" />
      </button>
    </>
  );
}

export default ScrollTopButton;
