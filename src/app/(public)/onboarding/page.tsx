"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/public/logo_64.svg";
import Link from "next/link";

function Page() {
  const [isAnimated, setIsAnimated] = useState(false);
  // const [hoveredSection, setHoveredSection] = useState<
  //   "guest" | "login" | null
  // >(null);

  useEffect(() => {
    // 페이지 로드 후 애니메이션 시작
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      <Link
        href="/"
        className="flex items-center gap-2 absolute top-4 left-4  z-30"
      >
        <Image
          src={logo}
          alt="logo"
          width={32}
          height={32}
          style={{
            width: "32px",
            height: "32px",
            filter: "brightness(0) invert(1)",
          }}
        />
        <h1 className={`text-xl font-bold font-family-logo text-white`}>
          Re:Life
        </h1>
      </Link>

      {/* 왼쪽 섹션 - 게스트로 사용 */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-deep-navy transition-transform duration-1000 ease-in-out z-20 ${
          isAnimated ? "translate-x-0" : "translate-x-[-100%]"
        }`}
        // onMouseEnter={() => setHoveredSection("guest")}
        // onMouseLeave={() => setHoveredSection(null)}
      >
        <div className="group flex flex-col items-center justify-center h-full p-8 text-white">
          <h2 className="!text-4xl font-bold mb-2">게스트로 사용</h2>
          <p className="text-xl text-gray-300 mb-4">기본 기능을 체험해보세요</p>

          {/* 펼쳐질 영역 */}
          <div
            className="
              w-full max-w-md
              overflow-hidden
              transition-all duration-500 ease-out
              max-h-0 opacity-0 translate-y-2
              group-hover:max-h-[320px] group-hover:opacity-100 group-hover:translate-y-0
              will-change-[max-height,opacity,transform]
            "
            aria-hidden="true"
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
      </div>

      {/* 오른쪽 섹션 - 로그인하여 모든 기능 사용 */}
      <div
        className={`absolute top-0 right-0 group w-1/2 h-full bg-white transition-transform duration-1000 ease-in-out z-20 ${
          isAnimated ? "translate-x-0" : "translate-x-[100%]"
        }`}
        // onMouseEnter={() => setHoveredSection("login")}
        // onMouseLeave={() => setHoveredSection(null)}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 bg-white">
          <h2 className="!text-4xl font-bold mb-4">
            로그인하여 모든 기능 사용
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            완전한 서비스를 경험하세요
          </p>

          {/* Hover 시 추가 설명 - CSS group으로 처리 */}
          <div className="group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-4 transition-all duration-300">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-3">로그인 모드의 특징</h3>
              <ul className="text-sm space-y-2 text-blue-100">
                <li>• 모든 기능 무제한 이용</li>
                <li>• 개인화된 서비스 제공</li>
                <li>• 데이터 저장 및 동기화</li>
                <li>• 고급 기능 및 설정</li>
                <li>• 커뮤니티 참여 가능</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 중앙 선택 텍스트 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col gap-4 items-center justify-center text-4xl font-bold text-gray-800">
          <Image
            src={logo}
            alt="logo"
            width={64}
            height={64}
            style={{
              width: "64px",
              height: "64px",
            }}
          />
          <h1 className={`text-xl font-bold font-family-logo`}>Re:Life</h1>
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
