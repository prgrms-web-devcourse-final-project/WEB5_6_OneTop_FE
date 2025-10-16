import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useLoginModalStore } from "@/domains/auth/stores/loginModalStore";
import type { GuestLimitConfig, GuestLimitsState } from "../types";

export const useGuestLimits = ({
  isGuest,
  isAuthLoading,
  hasGuestSubmitted,
  eventCount,
  isSubmitted,
  isFormOpen,
}: GuestLimitConfig): GuestLimitsState => {
  const router = useRouter();
  const { setIsOpen: setLoginModalOpen } = useLoginModalStore();

  // 3개 작성 완료 알림
  useEffect(() => {
    if (isGuest && eventCount === 3 && !isSubmitted && !isFormOpen) {
      const hasShownModal = sessionStorage.getItem("guestLimitModalShown");

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
  }, [isGuest, eventCount, isSubmitted, isFormOpen, setLoginModalOpen]);

  // 이미 제출한 게스트 체크
  useEffect(() => {
    const justSubmitted = sessionStorage.getItem("justSubmitted");
    if (justSubmitted) {
      return;
    }

    if (!isAuthLoading && isGuest && hasGuestSubmitted && eventCount === 0) {
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
    isAuthLoading,
    isGuest,
    hasGuestSubmitted,
    eventCount,
    router,
    setLoginModalOpen,
  ]);

  const maxNodes = isGuest ? 3 : 10;

  return { maxNodes };
};
