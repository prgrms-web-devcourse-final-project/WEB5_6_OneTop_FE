'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

type Props = {
  children: React.ReactNode;
  smooth?: number;
  effects?: boolean;
  smoothTouch?: number | boolean;
};

export default function ScrollSmootherProvider({
  children,
  smooth = 1.2,
  effects = true,
  smoothTouch = 0.1,
}: Props) {
  // 라우팅 변경 시 사용
  // const pathname = usePathname();
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const initialized = useRef(false);

  // 초기 깜빡임을 줄이기 위한 layout effect
  // useEffect로 대체 가능
  // 추가적인 트리거 이벤트 연산은 뒤로 미룸.
  useLayoutEffect(() => {
    if (initialized.current || typeof window === 'undefined') return;

    ScrollTrigger.config({ ignoreMobileResize: true });
    ScrollTrigger.normalizeScroll(true);

    smootherRef.current = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth,
      effects,
      smoothTouch,
    });

    initialized.current = true;

    // 클린업
    return () => {
      smootherRef.current?.kill();
      smootherRef.current = null;
      initialized.current = false;
    };
  }, [smooth, effects, smoothTouch]);

  // 2) 라우팅 변경 시 새 레이아웃 반영
  // useLayoutEffect(() => {
  //   if (!initialized.current) return;
  //   smootherRef.current?.refresh();
  //   ScrollTrigger.refresh();
  // }, [pathname]);

  return (
    <div id="smooth-wrapper" style={{ overflow: 'hidden' }}>
      <div id="smooth-content">{children}</div>
    </div>
  );
}
