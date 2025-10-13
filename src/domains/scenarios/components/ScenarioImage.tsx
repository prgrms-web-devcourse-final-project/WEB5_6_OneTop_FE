"use client";

import { useState } from "react";
import Image from "next/image";

interface ScenarioImageProps {
  imageUrl?: string;
  job?: string;
  description?: string;
}

export const ScenarioImage = ({
  imageUrl,
  job,
  description,
}: ScenarioImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getImageUrl = (url?: string): string | null => {
    if (!url) return null;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8080";
    return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const processedImageUrl = getImageUrl(imageUrl);

  if (!processedImageUrl || imageError) {
    return (
      <div className="bg-gray-50 rounded-lg p-5 md:p-7 h-full flex items-center justify-center">
        <div className="text-center text-gray-800">
          <p className="text-2xl font-semibold mb-2">{job || "당신의 미래"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto p-5 md:p-7 rounded-lg border border-gray-200">
      <h3 className="text-[22px] font-semibold mb-7">
        AI가 그린 당신의 미래 모습
      </h3>
      <div className="flex flex-col md:flex-row items-stary justify-center gap-8">
        <div className="relative w-full md:w-[400px] h-[300px] raspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
              <div className="text-gray-400">이미지 로딩 중...</div>
            </div>
          )}

          <Image
            src={processedImageUrl}
            alt={job || "시나리오 이미지"}
            fill
            className="object-cover"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              console.error("이미지 로드 실패:", processedImageUrl);
              setImageError(true);
              setIsLoading(false);
            }}
            priority
            unoptimized
          />
        </div>
        {description && (
          <div className="flex-1 pt-7">
            <span className="block text-xl font-semibold mb-2">{job}</span>
            <p className="text-gray-800 text-base break-keep">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
