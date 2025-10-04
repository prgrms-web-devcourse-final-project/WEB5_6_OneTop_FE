"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Statistics from "./Statistics";

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const planet1Ref = useRef<HTMLDivElement>(null);
  const planet2Ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [startCounting, setStartCounting] = useState(false);
  const hasStartedCounting = useRef(false);

  // 우주 배경
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const starCount = 2000;
    const stars: Array<{ x: number; y: number; z: number }> = [];
    const fov = 200;
    let centerX = width / 2;
    let centerY = height / 2;
    let mouseX = 0;
    let mouseY = 0;
    let scrollDepth = 1;
    let animationId: number;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
      });
    }

    function animate() {
      if (!ctx) return;

      ctx.fillStyle = "rgba(2, 2, 13, 0.3)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < starCount; i++) {
        const star = stars[i];
        star.z -= 1.5 + scrollDepth * 0.03;
        if (star.z <= 1) star.z = 2000;

        const scale = fov / (fov + star.z);
        const x2d = (star.x + mouseX * 5) * scale + centerX;
        const y2d = (star.y + mouseY * 5) * scale + centerY;
        const brightness = 1 - star.z / 2000;

        ctx.beginPath();
        ctx.arc(x2d, y2d, scale * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - centerX) / centerX;
      mouseY = (e.clientY - centerY) / centerY;
    };

    const handleWheel = (e: WheelEvent) => {
      scrollDepth += e.deltaY * 0.02;
      if (scrollDepth < -50) scrollDepth = -50;
      if (scrollDepth > 100) scrollDepth = 100;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("wheel", handleWheel);
    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const beam = beamRef.current;
    const planet1 = planet1Ref.current;
    const planet2 = planet2Ref.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const stats = statsRef.current;

    if (!section || !beam || !planet1 || !planet2) return;

    gsap.set(beam, {
      scaleX: 0,
      scaleY: 1,
      opacity: 0,
      transformOrigin: "center center",
    });
    gsap.set(planet1, { y: -400, opacity: 0 });
    gsap.set(planet2, { y: 400, opacity: 0 });
    gsap.set([title, subtitle], { opacity: 0, y: 30 });
    gsap.set(stats, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=400%",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          if (self.progress > 0.9 && !hasStartedCounting.current) {
            hasStartedCounting.current = true;
            setStartCounting(true);
          }
        },
      },
    });
    tl.to(beam, {
      scaleX: 1,
      opacity: 1,
      duration: 2,
      ease: "power2.out",
    })
      .to(
        beam,
        {
          scaleX: 3,
          scaleY: 60,
          opacity: 0,
          duration: 2,
          ease: "power2.in",
        },
        "+=0.3"
      )
      .to(planet1, { y: 0, opacity: 1, duration: 2.5, ease: "power3.out" }, 2.5)
      .to(planet2, { y: 0, opacity: 1, duration: 2.5, ease: "power3.out" }, 2.5)
      .to(title, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, 5)
      .to(
        subtitle,
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
        5.3
      )
      .to(
        stats,
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          onComplete: () => setStartCounting(true),
        },
        5.6
      );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-[#02020D] overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full bg-[#02020D]"
      />
      <div
        ref={beamRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[10px] 
    bg-gradient-to-r from-[rgba(0,150,255,0)] via-[rgba(0,200,255,1)] to-[rgba(0,150,255,0)] 
    shadow-[0_0_40px_rgba(0,200,255,0.9),0_0_80px_rgba(0,150,255,0.7),0_0_120px_rgba(0,100,255,0.5)] rounded-full z-10 opacity-0"
      />
      <div
        ref={planet1Ref}
        className="absolute left-1/2 -translate-x-1/2 -bottom-55 opacity-0"
      >
        <div className="relative w-[450px] h-[450px]">
          <Image src="/parallel_universe01.png" alt="" fill sizes="450px" />
        </div>
      </div>
      <div
        ref={planet2Ref}
        className="absolute left-1/2 -translate-x-1/2 -top-37.5 opacity-0"
      >
        <div className="relative w-[450px] h-[450px]">
          <Image src="/parallel_universe02.png" alt="" fill sizes="450px" />
        </div>
      </div>
      <div className="absolute w-full left-1/2 top-[40%] -translate-x-1/2 flex flex-col items-center gap-8 text-white z-30">
        <h2
          ref={titleRef}
          className="relative px-12.5 text-[42px] font-semibold text-center opacity-0"
        >
          <span className="absolute left-0 w-[35px] h-7 bg-[url('/quote_left.png')] bg-cover bg-center"></span>
          만약 그때 다른 선택을 했더라면?
          <span className="absolute right-0 w-[35px] h-7 bg-[url('/quote_right.png')] bg-cover bg-center"></span>
        </h2>
        <p ref={subtitleRef} className="text-2xl text-center opacity-0">
          AI와 실제 통계로 확인하는 나만의 평행우주
        </p>
      </div>
      <div
        ref={statsRef}
        className="max-w-[1440px] w-full absolute bottom-8 left-1/2 -translate-x-1/2 z-30 opacity-0"
      >
        <Statistics startCounting={startCounting} />
      </div>
    </section>
  );
};

export default Hero;
