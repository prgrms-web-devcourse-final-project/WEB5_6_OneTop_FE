"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { useMobileDetection } from "@/share/hooks/useMobileDetection";
import { useLoginModalStore } from "@/domains/auth/stores/loginModalStore";
import { BaselineView } from "./BaselineView";
import { BaselineSetupForm } from "./BaselineSetupForm";
import { useBaselineStore } from "../stores/baselineStore";
import { PiNumberCircleOneLight } from "react-icons/pi";
import { PiNumberCircleTwoLight } from "react-icons/pi";
import { PiNumberCircleThreeLight } from "react-icons/pi";
import { PiNumberCircleFourLight } from "react-icons/pi";
import { PiWarningFill } from "react-icons/pi";
import { useBaselineUser } from "../hooks/useBaselineUser";
import { useGuestLimits } from "../hooks/useGuestLimits";
import { useBaselineNodes } from "../hooks/useBaselineNodes";
import { useBaselineSubmit } from "../hooks/useBaselineSubmit";
import { useScrollButton } from "../hooks/useScrollButton";

interface Props {
  footerHeight?: number;
}

export const BaselineContainer = ({ footerHeight = 80 }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsOpen: setLoginModalOpen } = useLoginModalStore();

  const {
    user,
    birthYear,
    isGuest,
    isLoading: userLoading,
  } = useBaselineUser();

  const {
    events,
    isLoading: storeLoading,
    error,
    isSubmitted,
    hasGuestSubmitted,
    setError,
    initializeForUser,
    startNewBaseline,
  } = useBaselineStore();

  // 새 베이스라인 초기화
  useEffect(() => {
    const isNewBaseline = searchParams.get("new") === "true";

    if (isNewBaseline && user) {
      // 게스트가 이미 제출한 경우 로그인 유도
      if (isGuest && hasGuestSubmitted) {
        Swal.fire({
          title: "게스트 모드 제한",
          html: "게스트 모드에서는 1개의 베이스라인만 생성할 수 있습니다.<br/>로그인하면 무제한으로 만들 수 있습니다.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#6366f1",
          cancelButtonColor: "#6B7280",
          confirmButtonText: "로그인하기",
          cancelButtonText: "시나리오 목록으로",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            setLoginModalOpen(true);
          } else {
            router.push("/scenario-list");
          }
        });
        return;
      }

      // 로그인 사용자이거나 게스트가 아직 제출 안한 경우 초기화
      if (!isGuest || !hasGuestSubmitted) {
        startNewBaseline();
      }

      // URL에서 쿼리 파라미터 제거
      router.replace("/baselines", { scroll: false });
    }
  }, [
    searchParams,
    user,
    isGuest,
    hasGuestSubmitted,
    startNewBaseline,
    router,
    setLoginModalOpen,
  ]);

  // 사용자 초기화
  useEffect(() => {
    if (user && user.id) {
      initializeForUser(user.id, user.role);
    }
  }, [user, initializeForUser]);

  const {
    selectedYear,
    isFormOpen,
    tempNodes,
    selectedEvent,
    allEventsForView,
    setTempNodes,
    handleNodeClick,
    handleFormClose,
    handleDeleteTempNode,
    setIsFormOpen,
    setSelectedYear,
  } = useBaselineNodes(user, birthYear);

  // 게스트 제한
  const { maxNodes } = useGuestLimits({
    isGuest,
    isAuthLoading: userLoading,
    hasGuestSubmitted,
    eventCount: events.length,
    isSubmitted,
    isFormOpen,
  });

  // 노드 추가
  const handleAddNode = async (): Promise<void> => {
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
      await Swal.fire({
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
      await Swal.fire({
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

  const { isSubmitting, handleSubmit, sortedEvents } = useBaselineSubmit(
    user,
    birthYear,
    isGuest
  );

  const { bottomPosition } = useScrollButton(footerHeight);
  const isMobile = useMobileDetection(768);

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

  const isLoading = userLoading || storeLoading;

  if (isLoading && !user) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">사용자 정보 로딩 중...</div>
        </div>
      </div>
    );
  }

  // 사용자 정보 로드 실패 시
  if (!isLoading && !user) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-xl mb-4">사용자 정보를 불러올 수 없습니다</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  const baseNodeCount = 3;
  const totalNodes = events.length + tempNodes.length;
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
                        <h4 className="w-[26.6vw] h-19 text-[24px] line-clamp-2">
                          &quot;{event.eventTitle}&quot;
                        </h4>
                        <p className="flex-1 pr-5 mt-1 text-xl line-clamp-2">
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
                          <h4 className="w-[26.6vw] h-19 text-[24px] line-clamp-2">
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
                          <h4 className="w-[26.6vw] h-19 text-[24px] line-clamp-2">
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
                        className="bg-white font-medium text-gray-800 px-6 py-3 rounded-lg text-lg hover:bg-gray-300 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
