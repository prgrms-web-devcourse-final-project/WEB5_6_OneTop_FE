"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
};

export default function Background({ children }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sectionEl = sectionRef.current!;
    const bgEl = bgRef.current!;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        end: "bottom top",
        pin: bgEl,
        pinSpacing: false,
        anticipatePin: 1,
      });
    }, sectionEl);

    // 레이아웃 변동 이후 재계산
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none w-screen h-screen -z-10"
      >
        <Image
          src="/main_bg.png"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
