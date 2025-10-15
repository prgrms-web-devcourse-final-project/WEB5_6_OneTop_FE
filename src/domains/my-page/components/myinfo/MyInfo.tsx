"use client";

import { useState } from "react";
import Link from "next/link";
import MyInfoModal from "./MyInfoModal";
import { useMyInfo } from "../../hooks/useMyInfo";
import InfoCard from "./InfoCard";
import Loading from "@/share/components/Loading";
import {
  FaCalendar,
  FaChartBar,
  FaRegHeart,
  FaRegLightbulb,
  FaRegThumbsUp,
  FaShieldAlt,
  FaUser,
  FaWind,
} from "react-icons/fa";
import { showErrorToast } from "@/share/components/ErrorToast";

export default function MyInfo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { query, mutation } = useMyInfo();
  const { data, isLoading, error } = query;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    showErrorToast(error);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 기본정보 있는지 확인
  const hasAllBasicInfo = data && data.gender && data.beliefs && data.mbti;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-6 gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-semibold">내 정보</h2>
        {data &&
          (hasAllBasicInfo ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm sm:text-base"
            >
              수정
            </button>
          ) : (
            <Link
              href="/onboarding/profile-settings"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm sm:text-base"
            >
              정보 입력하기
            </Link>
          ))}
      </div>

      {!hasAllBasicInfo ? (
        <div className="h-48 sm:h-60 flex items-center justify-center text-gray-600 text-sm sm:text-base px-4 text-center">
          더 정확한 시나리오 생성을 위해 정보를 입력해주세요.
        </div>
      ) : (
        data && (
          <div className="flex flex-col gap-6 sm:gap-8 px-4 sm:px-8">
            <div>
              <h3 className="text-base sm:text-lg mb-3 sm:mb-4">기본 정보</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InfoCard
                  icon={<FaCalendar size={20} />}
                  title="생년월일"
                  value={
                    data.birthdayAt
                      ? `${data.birthdayAt.split("T")[0]} ${
                          new Date().getFullYear() -
                          new Date(data.birthdayAt).getFullYear()
                        }세`
                      : "-"
                  }
                />
                <InfoCard
                  icon={<FaUser size={20} />}
                  title="성별"
                  value={
                    data.gender === "M"
                      ? "남자"
                      : data.gender === "F"
                      ? "여자"
                      : "-"
                  }
                />
                <InfoCard
                  icon={<FaRegLightbulb size={20} />}
                  title="가치관"
                  value={data.beliefs || "-"}
                />
                <InfoCard
                  icon={<FaChartBar size={20} />}
                  title="MBTI"
                  value={data.mbti || "-"}
                />
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg mb-3 sm:mb-4">추가 정보</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InfoCard
                  icon={<FaRegThumbsUp size={20} />}
                  title="삶 만족도"
                  value={data.lifeSatis ?? "-"}
                />
                <InfoCard
                  icon={<FaRegHeart size={20} />}
                  title="관계 만족도"
                  value={data.relationship ?? "-"}
                />
                <InfoCard
                  icon={<FaWind size={20} />}
                  title="자유 중요도"
                  value={data.workLifeBal ?? "-"}
                />
                <InfoCard
                  icon={<FaShieldAlt size={20} />}
                  title="위험 회피"
                  value={data.riskAvoid ?? "-"}
                />
              </div>
            </div>
          </div>
        )
      )}

      {isModalOpen && data && (
        <MyInfoModal
          data={data}
          mutation={mutation}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
