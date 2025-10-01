"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useMobileDetection } from "@/share/hooks/useMobileDetection";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Statistics from "./Statistics";

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const isMobile = useMobileDetection(768);

  const sectionRef = useRef<HTMLElement>(null);
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const rightBoxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const logoPathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const leftBox = leftBoxRef.current;
    const rightBox = rightBoxRef.current;
    const title = titleRef.current;
    const linePath = linePathRef.current;
    const linePathLength = linePath?.getTotalLength();
    const logoPaths = logoPathRefs.current.filter(Boolean) as SVGPathElement[];

    if (!section || !leftBox || !rightBox || !title) return;

    // 초기 상태 설정
    gsap.set(leftBox, { x: "0" });
    gsap.set(rightBox, { x: "0" });
    gsap.set(title, { opacity: 1, scale: 1 });
    gsap.set(".text-effect", { opacity: "0" });

    gsap.set(linePath, {
      strokeDasharray: linePathLength,
      strokeDashoffset: linePathLength,
      fill: "none",
    });

    logoPaths.forEach((path) => {
      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        fill: "transparent",
      });
    });

    const getMoveDistance = () => {
      if (isMobile) return "-80%";
      return "-70%";
    };

    const getScrollDistance = () => {
      if (isMobile) return "+=200%";
      return "+=300%";
    };

    // ScrollTrigger 애니메이션
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: getScrollDistance(),
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    const moveDistance = getMoveDistance();
    const rightMoveDistance = moveDistance.replace("-", "");

    tl.to(leftBox, { x: moveDistance, duration: 3, ease: "power2.inOut" }, 0)
      .to(
        rightBox,
        { x: rightMoveDistance, duration: 3, ease: "power2.inOut" },
        0
      )
      .to(
        title,
        { opacity: 0, scale: 0.8, duration: 0.5, ease: "power2.out" },
        "-=1.5"
      )
      .to(
        ".text-effect",
        { opacity: 1, duration: 2.5, stagger: 0.5, ease: "power2.out" },
        2.5
      );
    if (!isMobile && linePath) {
      tl.to(
        linePath,
        {
          strokeDashoffset: 0,
          duration: 5,
          ease: "none",
        },
        4
      );
    }
    tl.to(
      logoPaths,
      {
        strokeDashoffset: 0,
        fill: "#E0AB0F",
        duration: 1.5,
        stagger: 0.3,
        ease: "none",
      },
      isMobile ? 5 : 8
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div className="absolute left-[50%] top-[50%] -translate-[50%] flex flex-col items-center gap-20 text-white">
        <h2 ref={titleRef} className="text-[40px] font-semibold">
          만약 그때 다른 선택을 했더라면?
        </h2>
        <p className="text-2xl">AI와 실제 통계로 확인하는 나만의 평행우주 </p>
      </div>
      <div className="absolute inset-0 pointer-events-none w-screen h-screen -z-1">
        <Image
          src="/hero_bg.png"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
      </div>
      <Statistics />
    </section>
  );
};
export default Hero;
