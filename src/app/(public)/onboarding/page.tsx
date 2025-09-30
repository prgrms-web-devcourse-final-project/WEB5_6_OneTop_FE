"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useLoginModalStore } from "@/domains/auth/stores/loginModalStore";
import { guestLoginAction } from "@/app/api/actions/guest-login";
import { useRouter } from "next/navigation";

function Page() {
  const leftPannelRef = useRef<HTMLButtonElement>(null);
  const rightPannelRef = useRef<HTMLButtonElement>(null);
  const leftDetailRef = useRef<HTMLDivElement>(null);
  const rightDetailRef = useRef<HTMLDivElement>(null);
  const setLoginModalOpen = useLoginModalStore((s) => s.setIsOpen);
  const [guestLoginLoading, setGuestLoginLoading] = useState(false);
  const router = useRouter();

  const open = (e: HTMLElement) => {
    gsap.to(e, {
      height: "auto",
      autoAlpha: 1,
      duration: 0.5,
      ease: "power3.inOut",
    });
  };

  const onGuestLogin = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get("redirectTo");

    try {
      setGuestLoginLoading(true);
      await guestLoginAction();
      router.refresh();
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (error) {
      setGuestLoginLoading(false);
      console.error(error);
    }
  };

  const close = (e: HTMLElement) => {
    gsap.to(e, {
      height: 0,
      autoAlpha: 0,
      duration: 0.5,
      ease: "power3.inOut",
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(leftPannelRef.current, { x: "-100%" });
      gsap.set(rightPannelRef.current, { x: "100%" });
      gsap.set([leftDetailRef.current, rightDetailRef.current], {
        height: 0,
        autoAlpha: 0,
      });
    });

    // 애니메이션 멈추고 1초 뒤 시작 ( 설명 보이도록 )
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
      delay: 1,
      onStart: () => {
        gsap.set([leftDetailRef.current, rightDetailRef.current], {
          autoAlpha: 1,
          clearProps: "visibility",
        });
      },
    });

    tl.to([leftPannelRef.current, rightPannelRef.current], {
      x: 0,
      duration: 0.8,
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* 상단 로고 */}
      <Link
        href="/"
        className="flex items-center gap-2 absolute top-4 left-4 z-30"
      >
        <Image
          src="/logo_64.svg"
          alt="logo"
          width={32}
          height={32}
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <h1 className="text-xl font-bold font-family-logo text-white">
          Re:Life
        </h1>
      </Link>

      {/* 왼쪽 패널 */}
      <button
        ref={leftPannelRef}
        className="absolute top-0 left-0 w-1/2 h-full bg-deep-navy z-20 overflow-hidden cursor-pointer 
        -translate-x-full will-change-transform"
        // 나중에 토큰 발급 로직으로 변경하고 router.push로 이동.
        onClick={onGuestLogin}
        disabled={guestLoginLoading}
        onMouseEnter={() =>
          leftDetailRef.current
            ? open(leftDetailRef.current)
            : console.log("왼쪽 패널 참조 없음")
        }
        onMouseLeave={() =>
          leftDetailRef.current
            ? close(leftDetailRef.current)
            : console.log("왼쪽 패널 참조 없음")
        }
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-white">
          <h2 className="!text-4xl font-bold mb-2">게스트로 사용</h2>
          <p className="text-xl text-gray-300 mb-4">기본 기능을 체험해보세요</p>

          <div
            ref={leftDetailRef}
            className="w-full max-w-md overflow-hidden h-0 opacity-0 invisible"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">게스트 모드의 특징</h3>
              <ul className="text-sm space-y-2 text-gray-200">
                <li>• 기본 서비스 체험 가능</li>
                <li>• 제한된 기능만 이용</li>
                <li>• 데이터 저장 불가</li>
                <li>• 언제든지 회원가입 가능</li>
              </ul>
            </div>
          </div>
        </div>
      </button>

      {/* 오른쪽 패널 */}
      <button
        ref={rightPannelRef}
        className="absolute top-0 right-0 w-1/2 h-full bg-white z-20 overflow-hidden cursor-pointer 
        translate-x-full will-change-transform"
        onClick={() => setLoginModalOpen(true)}
        onMouseEnter={() =>
          rightDetailRef.current
            ? open(rightDetailRef.current)
            : console.log("오른쪽 패널 참조 없음")
        }
        onMouseLeave={() =>
          rightDetailRef.current
            ? close(rightDetailRef.current)
            : console.log("오른쪽 패널 참조 없음")
        }
      >
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h2 className="!text-4xl font-bold mb-4">
            로그인하여 모든 기능 사용
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            완전한 서비스를 경험하세요
          </p>

          {/* 상세: height: 0 → auto */}
          <div
            ref={rightDetailRef}
            className="w-full max-w-md overflow-hidden h-0 opacity-0 invisible"
          >
            <div className="bg-black/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">로그인 모드의 특징</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• 모든 기능 무제한 이용</li>
                <li>• 개인화된 서비스 제공</li>
                <li>• 데이터 저장 및 동기화</li>
                <li>• 대표 프로필 설정</li>
                <li>• 커뮤니티 참여 가능</li>
              </ul>
            </div>
          </div>
        </div>
      </button>

      {/* 중앙 카피 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col gap-4 items-center justify-center text-4xl font-bold text-gray-800">
          <Image src="/logo_64.svg" alt="logo" width={64} height={64} />
          <h1 className="text-xl font-bold font-family-logo">Re:Life</h1>
          <div>당신은 선택지에 있습니다.</div>
          <div className="text-gray-600 text-xl">
            결정적 선택을 시뮬레이션하세요.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
