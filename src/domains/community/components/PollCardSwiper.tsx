"use client";

import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Post } from "../types";
import PollCard from "./PollCard";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useState } from "react";
import tw from "@/share/utils/tw";
import type { Swiper as SwiperType } from "swiper/types";

interface PollCardSwiperProps {
  items: Post[];
}

export default function PollCardSwiper({ items }: PollCardSwiperProps) {
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper: SwiperType) => {
    setIsStart(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSwiper = (swiper: SwiperType) => {
    setIsStart(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="relative px-4">
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        slidesPerGroup={1}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        breakpoints={{
          768: {
            slidesPerView: 2,
            slidesPerGroup: 1,
          },
        }}
        modules={[Navigation]}
        className="w-full"
        onSwiper={handleSwiper}
        onSlideChange={handleSlideChange}
      >
        {items.map((item: Post) => (
          <SwiperSlide key={item.postId}>
            <PollCard postId={item.postId} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 네비게이션 버튼 */}
      <button
        className={tw(
          "swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all",
          isStart
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 cursor-pointer"
        )}
        aria-label="이전 카드"
      >
        <IoChevronBack className="w-5 h-5 text-gray-700" />
      </button>

      <button
        className={tw(
          "swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all",
          isEnd ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"
        )}
        aria-label="다음 카드"
      >
        <IoChevronForward className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
