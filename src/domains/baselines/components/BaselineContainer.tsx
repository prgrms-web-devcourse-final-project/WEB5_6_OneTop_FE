"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import { useMobileDetection } from "@/share/hooks/useMobileDetection";
import { useLoginModalStore } from "@/domains/auth/stores/loginModalStore";
import { api } from "@/share/config/api";
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

interface User {
  id: number;
  email: string;
  username: string;
  role: "USER" | "GUEST";
  nickname: string;
}

export const BaselineContainer = ({ footerHeight = 80 }: Props) => {
  const router = useRouter();
  const { data: authData, isLoading: authLoading } = useAuthUser();
  const { setIsOpen: setLoginModalOpen } = useLoginModalStore();

  // user 정보와 생년월일 가져오기
  const [user, setUser] = useState<User | null>(null);
  const [birthYear, setBirthYear] = useState<number | undefined>(undefined);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const isGuest = user?.role === "GUEST";

  useEffect(() => {
    const fetchUserData = async () => {
      if (authLoading || isFetchingData) return;

      try {
        setIsFetchingData(true);
        console.log("=== 사용자 정보 가져오기 시작 ===");

        // user 정보
        const authResponse = await api.get("/api/v1/users-auth/me");
        console.log("users-auth/me response:", authResponse);

        if (authResponse.data) {
          setUser(authResponse.data);
          console.log("user 설정:", authResponse.data);
          console.log("role:", authResponse.data.role);
        }

        // 생년월일 정보
        const infoResponse = await api.get("/api/v1/users-info");
        console.log("users-info response:", infoResponse);

        if (infoResponse.data?.birthdayAt) {
          const birthdayStr = infoResponse.data.birthdayAt;
          const year = parseInt(
            birthdayStr.split("-")[0] || birthdayStr.substring(0, 4)
          );

          if (!isNaN(year)) {
            console.log("추출된 생년:", year);
            setBirthYear(year);
          }
        }
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchUserData();
  }, [authLoading]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempNodes, setTempNodes] = useState<
    Array<{ year: number; age: number }>
  >([]);

  const {
    events,
    isLoading: storeLoading,
    error,
    isSubmitted,
    hasGuestSubmitted,
    loadEvents,
    getEventByYear,
    setError,
    submitBaseline,
    //startNewBaseline,
    initializeForUser,
  } = useBaselineStore();

  useEffect(() => {
    if (!authLoading && user && user.id) {
      initializeForUser(user.id, user.role);
    }
  }, [authLoading, user, initializeForUser]);

  // 1. 3개 작성 완료 시 자동 알림 (useEffect 추가)
  useEffect(() => {
    // 게스트가 정확히 3개를 작성했고, 아직 제출 안 했고, 폼이 닫혀있을 때만 실행
    if (isGuest && events.length === 3 && !isSubmitted && !isFormOpen) {
      const hasShownModal = sessionStorage.getItem("guestLimitModalShown");

      // 세션 동안 한 번만 표시
      if (!hasShownModal) {
        sessionStorage.setItem("guestLimitModalShown", "true");

        Swal.fire({
          title: "게스트 모드 제한",
          html: "게스트 모드에서는 최대 3개까지만 작성할 수 있습니다.<br/>더 많은 베이스라인을 만들려면 로그인하세요.",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#6366f1",
          cancelButtonColor: "#6B7280",
          confirmButtonText: "로그인하기",
          cancelButtonText: "나중에",
        }).then((result) => {
          if (result.isConfirmed) {
            setLoginModalOpen(true);
          }
        });
      }
    }
  }, [isGuest, events.length, isSubmitted, isFormOpen, setLoginModalOpen]);

  // 게스트 제한: 3개, 로그인: 10개
  const maxNodes = isGuest ? 3 : 10;

  // 컴포넌트 마운트 시 게스트가 이미 제출했는지 체크
  useEffect(() => {
    if (!authLoading && isGuest && hasGuestSubmitted && events.length === 0) {
      Swal.fire({
        title: "게스트 모드 제한",
        html: "게스트 모드에서는 1개의 베이스라인만 생성할 수 있습니다.<br/>로그인하면 무제한으로 만들 수 있습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#6366f1",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "로그인하기",
        cancelButtonText: "뒤로가기",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          setLoginModalOpen(true);
        } else {
          router.push("/");
        }
      });
    }
  }, [
    authLoading,
    isGuest,
    hasGuestSubmitted,
    events.length,
    router,
    setLoginModalOpen,
  ]);

  // 컴포넌트 마운트 시 이벤트 로드
  useEffect(() => {
    if (!authLoading && user) {
      loadEvents(birthYear).catch((error) => {
        console.error("이벤트 로드 실패:", error);
      });
    }
  }, [authLoading, user, loadEvents, birthYear]);

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
    if (!user) {
      console.log("사용자 인증 대기 중...");
      return;
    }

    // 게스트는 alert + 로그인 유도
    if (isGuest) {
      const result = await Swal.fire({
        title: "게스트 모드 제한",
        html: "게스트 모드에서는 분기점 추가가 불가능합니다.<br/>로그인하면 최대 10개까지 작성할 수 있습니다.",
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

    // 최대 개수 체크
    if (totalNodes >= maxNodes) {
      Swal.fire({
        title: "최대 개수 초과",
        text: `최대 ${maxNodes}개까지만 분기점을 추가할 수 있습니다.`,
        icon: "warning",
        confirmButtonColor: "#E76F51",
        confirmButtonText: "확인",
      });
      return;
    }

    // 새 임시 노드 생성 (마지막 노드 아래에 추가)
    const currentYear = new Date().getFullYear();
    const allYears = [
      ...events.map((e) => e.year),
      ...tempNodes.map((t) => t.year),
    ];
    const lastYear =
      allYears.length > 0 ? Math.max(...allYears) : currentYear - 1;
    const newYear = Math.max(lastYear + 1, currentYear);
    const newAge = newYear - 2000;

    // 임시 노드를 마지막에 추가
    setTempNodes((prev) => [...prev, { year: newYear, age: newAge }]);
    setSelectedYear(newYear);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);

    if (selectedYear && !getEventByYear(selectedYear)) {
      setTempNodes((prev) => prev.filter((node) => node.year !== selectedYear));
    }
    setTimeout(() => {
      setSelectedYear(null);
    }, 100);
  };

  const handleDeleteTempNode = (year: number) => {
    setTempNodes((prev) => prev.filter((node) => node.year !== year));
    if (selectedYear === year) {
      setIsFormOpen(false);
      setSelectedYear(null);
    }
  };

  useEffect(() => {
    if (selectedYear && getEventByYear(selectedYear)) {
      setTempNodes((prev) => prev.filter((node) => node.year !== selectedYear));
    }
  }, [events, selectedYear, getEventByYear]);

  const selectedEvent = selectedYear ? getEventByYear(selectedYear) : null;

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

  const sortedEvents = events.sort((a, b) => a.year - b.year);

  const handleSubmit = async () => {
    if (!user) {
      console.log("사용자 인증 대기 중...");
      return;
    }

    // 중복 제출 방지
    if (isSubmitting) {
      console.log("이미 제출 중입니다.");
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
          ? "<strong>게스트는 1개의 베이스라인만 생성 가능합니다.</strong>"
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
        setIsSubmitting(true);

        // birthYear가 없으면 즉시 가져오기
        let finalBirthYear = birthYear;

        if (!finalBirthYear) {
          try {
            const infoResponse = await api.get("/api/v1/users-info");
            if (infoResponse.data?.birthdayAt) {
              const birthdayStr = infoResponse.data.birthdayAt;
              const year = parseInt(
                birthdayStr.split("-")[0] || birthdayStr.substring(0, 4)
              );
              if (!isNaN(year)) {
                finalBirthYear = year;
                setBirthYear(year);
              }
            }
          } catch (error) {
            console.error("생년월일 조회 실패:", error);
          }
        }

        await submitBaseline(isGuest, user?.id, finalBirthYear);

        await Swal.fire({
          title: "제출 완료!",
          html: isGuest
            ? "게스트 모드에서 베이스라인이 저장되었습니다.<br/>더 많은 기능을 사용하려면 로그인하세요."
            : "베이스라인이 성공적으로 제출되었습니다.",
          icon: "success",
          confirmButtonColor: "#10B981",
          confirmButtonText: "확인",
        }).then(() => {
          router.push("/scenario-list");
        });
      } catch (error) {
        console.error("제출 오류:", error);

        // 에러 상세 정보 출력
        if (error instanceof Error) {
          Swal.fire({
            title: "제출 실패",
            html: `<pre style="text-align: left; font-size: 12px;">${error.message}</pre>`,
            icon: "error",
            confirmButtonColor: "#E76F51",
            confirmButtonText: "확인",
          });
        }
      } finally {
        setIsSubmitting(false);
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

  const isLoading = authLoading || storeLoading || isFetchingData;

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">
            {authLoading
              ? "인증 확인 중..."
              : isFetchingData
              ? "사용자 정보 로딩 중..."
              : "데이터 로딩 중..."}
          </div>
        </div>
      </div>
    );
  }

  const baseNodeCount = 3;
  const totalNodes = events.length + tempNodes.length; // 실제+임시노드 갯수
  const emptyNodesCount = Math.max(0, baseNodeCount - totalNodes);

  const canAddMore = totalNodes < maxNodes;

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
          canAddMore={canAddMore}
          maxNodes={maxNodes}
          emptyNodesCount={emptyNodesCount}
        />
        {isFormOpen && selectedYear && user && (
          <BaselineSetupForm
            isOpen={isFormOpen}
            selectedYear={selectedYear}
            existingEvent={selectedEvent}
            onClose={handleFormClose}
            birthYear={birthYear}
          />
        )}
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
                    {/* 임시 노드 표시 추가 */}
                    {!isSubmitted &&
                      tempNodes.map((temp, i) => (
                        <li
                          key={`temp-${temp.year}-${i}`}
                          className="flex items-center gap-[6.8vw] text-gray-500"
                        >
                          <h4 className="w-[26.6vw] h-21 text-[24px] line-clamp-2">
                            노드를 클릭해 분기를 입력해 주세요
                          </h4>
                        </li>
                      ))}
                    {!isSubmitted &&
                      Array.from({ length: emptyNodesCount }, (_, i) => (
                        <li
                          key={`empty-${i}`}
                          className="flex items-center gap-[6.8vw] text-gray-500"
                        >
                          <h4 className="w-[26.6vw] h-21 text-[24px] line-clamp-2">
                            노드를 클릭해 분기를 입력해 주세요
                          </h4>
                        </li>
                      ))}
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
                        disabled={isLoading || isSubmitting}
                        className="bg-white font-medium text-gray-800 px-6 py-4 rounded-lg text-lg hover:bg-gray-300 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading || isSubmitting
                          ? "처리 중..."
                          : "마무리하고 제출"}
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
                            : `게스트 모드에서는 최대 ${maxNodes}개 분기점만 작성 가능합니다`}
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
