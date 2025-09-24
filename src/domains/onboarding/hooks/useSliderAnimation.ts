"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useSliderAnimation = (index: number, totalSteps: number) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLFormElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  // 중복 방지하며 itemsRef에 스택으로 추가
  const addItemRef = (el: HTMLDivElement) => {
    if (el && !itemsRef.current?.includes(el)) {
      itemsRef.current?.push(el);
    }
  };

  useEffect(() => {
    if (rootRef.current) {
      gsap.set(rootRef.current, { autoAlpha: 0, clearProps: "visibility" });
    }

    itemsRef.current.forEach((item, i) => {
      gsap.set(item, { autoAlpha: 0 });
    });
  }, []);

  // 슬라이드 요소들의 초기 위치 설정
  useEffect(() => {
    const container = trackRef.current?.parentElement;
    const slideW = container?.clientWidth ?? 0;
    if (slideW && itemsRef.current) {
      // 각 슬라이드 요소의 초기 위치 설정
      itemsRef.current.forEach((item, i) => {
        gsap.set(item, { x: i * slideW });
      });

      // 트랙을 현재 인덱스로 이동
      gsap.to(trackRef.current, {
        x: index * -slideW, // 음수로 이동 (왼쪽으로)
        autoAlpha: 1,
        duration: 1,
        ease: "power3.inOut",
      });
    }
  }, [index]);

  // 슬라이드 전환 시 페이드아웃/페이드인 효과
  useEffect(() => {
    if (itemsRef.current && itemsRef.current.length > 0) {
      const currentSlide = itemsRef.current[index];

      if (currentSlide) {
        // 현재 슬라이드만 페이드인
        gsap.fromTo(
          currentSlide,
          { autoAlpha: 0, scale: 0.95 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          }
        );

        // 다른 모든 슬라이드 페이드아웃
        itemsRef.current.forEach((slide) => {
          if (slide !== currentSlide) {
            gsap.to(slide, {
              autoAlpha: 0,
              scale: 0.95,
              duration: 0.5,
              ease: "power2.in",
            });
          }
        });
      }
    }
  }, [index]);

  useEffect(() => {
    if (rootRef.current) {
      gsap.to(rootRef.current, { autoAlpha: 1, visibility: "visible" });
    }
  }, []);

  return { rootRef, trackRef, addItemRef };
};