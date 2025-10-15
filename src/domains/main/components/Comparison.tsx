"use client";

import { useState, useRef, useEffect } from "react";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";

const Comparison = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center gap-6 text-center pt-10 px-5 z-10">
        <p className="text-lg md:text-2xl text-white leading-7 md:leading-9 text-shadow-2xs break-keep">
          <span className="font-family-logo font-bold text-3xl md:text-4xl">
            Re:Life
          </span>
          는<br />
          당신의 인생 선택을 기록하고, 다른 선택을 했다면 어떤 평행우주가
          펼쳐질지 보여줍니다. <br />
          지금 바로 시작해보세요!
        </p>
        <button
          type="button"
          onClick={() => (window.location.href = "/onboarding/profile-settings")}
          className="h-[55px] px-[50px] bg-deep-navy rounded-full text-white text-xl font-medium transition-all duration-300 hover:scale-105"
        >
          시작하기
        </button>
      </div>
      <div
        ref={containerRef}
        className="compare relative w-full h-full overflow-hidden"
      >
        {/* Before Image */}
        <figure className="absolute inset-0 m-0 w-full h-full bg-[url('/comparison_right.png')] bg-cover bg-center">
          {/* After Image */}
          <div
            className={`absolute top-0 left-0 bottom-0 h-full overflow-hidden`}
            style={{
              width: `${sliderPosition}%`,
            }}
          >
            <div
              className="absolute top-0 left-0 h-full bg-[url('/comparison_left.png')] bg-cover bg-center"
              style={{
                width: `${containerWidth}px`,
              }}
            />
          </div>

          {/* Arrow Handle */}
          <div
            className="absolute bottom-15 md:bottom-25 h-[50px] w-[50px] -translate-y-1/2 -translate-x-1/2 pointer-events-none bg-ivory rounded-full z-10 scale-100 hover:shadow-xl hover:scale-110 hover:bg-black transform transition-transform duration-300"
            style={{ left: `${sliderPosition}%` }}
          >
            <BiSolidLeftArrow
              size={20}
              className="text-deep-navy absolute left-1 top-1/2 -translate-y-1/2"
            />
            <BiSolidRightArrow
              size={20}
              className="text-deep-navy absolute right-1 top-1/2 -translate-y-1/2"
            />
          </div>
        </figure>

        {/* Range Slider */}
        <label htmlFor="compare-slider" className="sr-only">
          평행우주 비교 슬라이더
        </label>
        <input
          id="compare-slider"
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          aria-label="평행우주 비교 슬라이더"
          onChange={handleSliderChange}
          className="absolute bottom-15 md:bottom-25 -translate-y-1/2 left-[-25px] w-[calc(100%+50px)] z-[5] bg-transparent appearance-none focus:outline-none"
        />
        <p className="w-full absolute text-center bottom-10 md:bottom-[85px] text-gray-300 opacity-60">
          마우스를 좌우로 드래그 해보세요
        </p>
      </div>
    </div>
  );
};

export default Comparison;
