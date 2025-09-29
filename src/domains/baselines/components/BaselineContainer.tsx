"use client";

import { useState, useEffect } from "react";

import { useAuth } from "@/share/hooks/useAuth";
import { useMobileDetection } from "@/share/hooks/useMobileDetection";
import { useLoginModalStore } from "@/domains/auth/stores/loginModalStore";
import Swal from "sweetalert2";
import { BaselineView } from "./BaselineView";
import { BaselineSetupForm } from "./BaselineSetupForm";
import { useBaselineStore } from "../stores/baselineStore";
import { PiNumberCircleOneLight } from "react-icons/pi";
import { PiNumberCircleTwoLight } from "react-icons/pi";
import { PiNumberCircleThreeLight } from "react-icons/pi";
import { PiNumberCircleFourLight } from "react-icons/pi";
import { PiWarningFill } from "react-icons/pi";

interface Props {
  footerHeight?: number;
}

export const BaselineContainer = ({ footerHeight = 80 }: Props) => {
  const { user, isGuest, isLoading: authLoading } = useAuth();
  const { setIsOpen: setLoginModalOpen } = useLoginModalStore();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tempNodes, setTempNodes] = useState<
    Array<{ year: number; age: number }>
  >([]);

  const {
    events,
    isLoading: storeLoading,
    error,
    isSubmitted,
    loadEvents,
    getEventByYear,
    setError,
    submitBaseline,
  } = useBaselineStore();

  // 컴포넌트 마운트 시 이벤트 로드
  useEffect(() => {
    if (!authLoading && user) {
      loadEvents().catch((error) => {
        console.error("이벤트 로드 실패:", error);
      });
    }
  }, [authLoading, user, loadEvents]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "오류 발생",
        text: error,
        icon: "error",
        confirmButtonColor: "#E76F51",
        confirmButtonText: "확인",
      }).then(() => {
        setError(null);
      });
    }
  }, [error, setError]);

  const handleNodeClick = (
    year: number,
    age: number,
    isEmpty: boolean = false
  ) => {
    if (!user) {
      console.log("사용자 인증 대기 중...");
      return;
    }

    if (isSubmitted) {
      Swal.fire({
        title: "편집 불가",
        text: "이미 제출된 베이스라인은 수정할 수 없습니다.",
        icon: "info",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "확인",
      });
      return;
    }

    if (isEmpty) {
      // 빈 노드 클릭 시 새로운 년도 생성
      const currentYear = new Date().getFullYear();
      const allYears = [
        ...events.map((e) => e.year),
        ...tempNodes.map((t) => t.year),
      ];
      const lastEventYear =
        allYears.length > 0 ? Math.max(...allYears) : currentYear - 1;
      const newYear = Math.max(lastEventYear + 1, currentYear);

      setSelectedYear(newYear);
    } else {
      setSelectedYear(year);
    }
    setIsFormOpen(true);
  };

  const handleAddNode = async () => {
    console.log("=== handleAddNode 디버깅 ===");
    console.log("user:", user);
    console.log("user?.type:", user?.type);
    console.log("isGuest:", isGuest);
    console.log("events.length:", events.length);

    if (!user) {
      console.log("사용자 인증 대기 중...");
      return;
    }

    const totalRealNodes = events.length;

    // user 객체가 백엔드 응답 형태인지 확인
    const hasMessageProperty = "message" in user;
    const isAnonymous =
      (hasMessageProperty &&
        (user as { message: string }).message === "anonymous") ||
      !("type" in user);

    // 게스트 체크
    if (isAnonymous || ("type" in user && user.type === "guest") || isGuest) {
      console.log("게스트/익명 사용자 감지 - 로그인 유도");
      const result = await Swal.fire({
        title: "로그인이 필요합니다",
        html: "게스트 모드에서는 최대 5개까지만 작성할 수 있습니다.<br/>로그인하면 최대 10개까지 작성할 수 있습니다.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#6366f1",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "로그인하기",
        cancelButtonText: "취소",
      });

      if (result.isConfirmed) {
        setLoginModalOpen(true);
      }
      return;
    }

    console.log("로그인 사용자 - 5개 체크");
    // 로그인 사용자: 5개 미만일 때는 기본 노드부터 채우도록 안내
    if (totalRealNodes < 5) {
      Swal.fire({
        title: "기본 노드를 먼저 채워주세요",
        text: "기본 5개 노드를 먼저 작성한 후 추가할 수 있습니다.",
        icon: "info",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "확인",
      });
      return;
    }

    if (isSubmitted) {
      Swal.fire({
        title: "추가 불가",
        text: "이미 제출된 베이스라인은 수정할 수 없습니다.",
        icon: "info",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "확인",
      });
      return;
    }

    const totalNodes = events.length + tempNodes.length;
    const maxNodes = 10;

    if (totalNodes >= maxNodes) {
      Swal.fire({
        title: "최대 개수 초과",
        text: "최대 10개까지만 분기점을 추가할 수 있습니다.",
        icon: "warning",
        confirmButtonColor: "#E76F51",
        confirmButtonText: "확인",
      });
      return;
    }

    // 새 임시 노드 생성
    const currentYear = new Date().getFullYear();
    const allYears = [
      ...events.map((e) => e.year),
      ...tempNodes.map((t) => t.year),
    ];
    const lastYear =
      allYears.length > 0 ? Math.max(...allYears) : currentYear - 1;
    const newYear = Math.max(lastYear + 1, currentYear);
    const newAge = newYear - 2000; // 임시 나이정보(추후 연결필요)
    // 임시 노드 추가, 폼 열기
    setTempNodes((prev) => [...prev, { year: newYear, age: newAge }]);
    setSelectedYear(newYear);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);

    // 저장되지 않은 임시 노드 제거
    if (selectedYear && !getEventByYear(selectedYear)) {
      setTempNodes((prev) => prev.filter((node) => node.year !== selectedYear));
    }
    setTimeout(() => {
      setSelectedYear(null);
    }, 100);
  };

  const handleDeleteTempNode = (year: number) => {
    setTempNodes((prev) => prev.filter((node) => node.year !== year));
    // 현재 선택된 노드가 삭제되는 노드라면 폼도 닫기
    if (selectedYear === year) {
      setIsFormOpen(false);
      setSelectedYear(null);
    }
  };

  // 이벤트가 저장되면 해당 임시 노드 제거
  useEffect(() => {
    if (selectedYear && getEventByYear(selectedYear)) {
      setTempNodes((prev) => prev.filter((node) => node.year !== selectedYear));
    }
  }, [events, selectedYear, getEventByYear]);

  const selectedEvent = selectedYear ? getEventByYear(selectedYear) : null;

  // 모든 노드 정보 (실제 이벤트 + 임시 노드)
  const allEventsForView = [
    ...events,
    ...tempNodes.map((temp) => ({
      id: `temp-${temp.year}`,
      year: temp.year,
      age: temp.age,
      category: "기타" as const,
      eventTitle: "",
      actualChoice: "",
      context: "",
      createdAt: new Date(),
      isTemp: true,
    })),
  ];

  // 년도순 정렬
  const sortedEvents = events.sort((a, b) => a.year - b.year);

  // 제출 처리 함수
  const handleSubmit = async () => {
    if (!user) {
      console.log("사용자 인증 대기 중...");
      return;
    }

    if (sortedEvents.length < 2) {
      Swal.fire({
        title: "분기점이 부족합니다",
        text: "최소 2개 이상의 분기점을 작성한 후 제출해주세요.",
        icon: "warning",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "확인",
      });
      return;
    }

    if (isSubmitted) {
      Swal.fire({
        title: "이미 제출됨",
        text: "이미 제출된 베이스라인입니다.",
        icon: "info",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "확인",
      });
      return;
    }

    const result = await Swal.fire({
      title: "베이스라인 제출",
      html: `총 ${sortedEvents.length}개의 분기점을 제출하시겠습니까? <br>${
        isGuest
          ? "게스트 모드에서는 로컬에만 저장됩니다."
          : "제출 후에는 수정이 불가능합니다."
      }`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "제출하기",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      try {
        await submitBaseline(isGuest);

        Swal.fire({
          title: "제출 완료!",
          text: isGuest
            ? "게스트 모드에서 베이스라인이 로컬에 저장되었습니다."
            : "베이스라인이 성공적으로 제출되었습니다.",
          icon: "success",
          confirmButtonColor: "#10B981",
          confirmButtonText: "확인",
        }).then(() => {
          window.location.href = "/multiverse/123";
        });
      } catch (error) {
        console.error("제출 오류:", error);
      }
    }
  };

  const [bottomPosition, setBottomPosition] = useState(30);
  const isMobile = useMobileDetection(768);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (distanceFromBottom <= footerHeight) {
        const adjustment =
          ((footerHeight - distanceFromBottom) / footerHeight) * 70;
        setBottomPosition(30 + adjustment);
      } else {
        setBottomPosition(30);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [footerHeight]);

  const isLoading = authLoading || storeLoading;

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">
            {authLoading ? "인증 확인 중..." : "데이터 로딩 중..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)]">
      <div className="w-full min-h-[calc(100vh-140px)] flex overflow-hidden">
        <BaselineView
          onNodeClick={handleNodeClick}
          onAddNode={handleAddNode}
          onDeleteTempNode={handleDeleteTempNode}
          selectedYear={selectedYear}
          events={allEventsForView}
          tempNodes={tempNodes}
          isGuest={isGuest || !user}
        />
        {/* 폼이 열려있을 때만 폼 표시 */}
        {isFormOpen && selectedYear && user && (
          <BaselineSetupForm
            isOpen={isFormOpen}
            selectedYear={selectedYear}
            existingEvent={selectedEvent}
            onClose={handleFormClose}
          />
        )}
        {/* 폼이 열려있지 않을 때 콘텐츠 표시 */}
        {!isFormOpen && (
          <div className="flex flex-col flex-1 justify-start pl-[16.15vw] bg-[linear-gradient(246deg,_rgba(217,217,217,0)_41.66%,_rgba(130,79,147,0.15)_98.25%)]">
            <div className="text-white pt-[116px]">
              {sortedEvents.length > 0 ? (
                <div>
                  <ul className="flex flex-col gap-[200px]">
                    {sortedEvents.map((event) => (
                      <li
                        key={event.id}
                        className="flex items-start gap-[6.8vw]"
                      >
                        <h4 className="w-[26.6vw] h-21 text-[24px] line-clamp-2">
                          &quot;{event.eventTitle}&quot;
                        </h4>
                        <p className="mt-1 text-xl line-clamp-2">
                          {event.actualChoice}
                        </p>
                      </li>
                    ))}
                    {/* 빈 자리 표시 (게스트: 5개, 로그인: 10개까지) */}
                    {!isSubmitted &&
                      Array.from(
                        { length: Math.max(0, 5 - sortedEvents.length) },
                        (_, i) => (
                          <li
                            key={`empty-${i}`}
                            className="flex items-center gap-[6.8vw] text-gray-500"
                          >
                            <h4 className="w-[26.6vw] h-21 text-[24px] line-clamp-2">
                              노드를 클릭해 분기를 입력해 주세요
                            </h4>
                          </li>
                        )
                      )}
                  </ul>

                  {!isSubmitted && (
                    <div
                      className={`flex justify-end fixed right-[130px] ${
                        isMobile ? "left-4" : "left-8"
                      } transition-all duration-300`}
                      style={{ bottom: `${bottomPosition}px` }}
                    >
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-white font-medium text-gray-800 px-6 py-4 rounded-lg text-lg hover:bg-gray-300 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "처리 중..." : "마무리하고 제출"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="fixed left-[45%] top-[23%] text-center">
                  <h2 className="text-3xl font-semibold mb-5">
                    인생 분기점 기록하기
                  </h2>
                  <p className="text-lg text-gray-400 mb-12">
                    왼쪽 노드를 클릭해서 당신의 중요한 선택들을 기록해보세요
                  </p>
                  <div className="bg-black/30 rounded-lg p-8 w-[500px] border border-white">
                    <h3 className="text-2xl mb-6 text-white">시작하는 방법</h3>
                    <ol className="text-lg text-left text-gray-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <PiNumberCircleOneLight size={32} />
                        왼쪽 타임라인의 노드를 클릭하세요
                      </li>
                      <li className="flex items-center gap-2">
                        <PiNumberCircleTwoLight size={32} />그 시기의 중요한
                        선택을 입력하세요
                      </li>
                      <li className="flex items-center gap-2">
                        <PiNumberCircleThreeLight size={32} />
                        실제로 어떤 결정을 했는지 기록하세요
                      </li>
                      <li className="flex items-center gap-2">
                        <PiNumberCircleFourLight size={32} />
                        저장하면 타임라인에 반영됩니다
                      </li>
                    </ol>
                    {(isGuest || !user) && (
                      <div className="mt-5">
                        <p className="flex items-center justify-center gap-2 text-base">
                          <PiWarningFill size={32} />
                          {!user
                            ? "인증 확인 중입니다"
                            : "게스트 모드에서는 기본 5개 분기점만 작성 가능합니다"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
