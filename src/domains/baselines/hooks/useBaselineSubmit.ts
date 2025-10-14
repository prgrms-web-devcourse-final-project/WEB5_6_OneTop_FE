import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { api } from "@/share/config/api";
import { useBaselineStore } from "../stores/baselineStore";
import type {
  BaselineUser,
  UserInfoResponse,
  BaselineSubmitState,
} from "../types";
import { queryKeys } from "@/share/config/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

export const useBaselineSubmit = (
  user: BaselineUser | null,
  birthYear: number | undefined,
  isGuest: boolean
): BaselineSubmitState => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { events, isSubmitted, submitBaseline, startNewBaseline } =
    useBaselineStore();
  const sortedEvents = [...events].sort((a, b) => a.year - b.year);
  const queryClient = useQueryClient();

  const handleSubmit = async (): Promise<void> => {
    if (!user || isSubmitting) return;

    if (sortedEvents.length < 2) {
      await Swal.fire({
        title: "분기점이 부족합니다",
        text: "최소 2개 이상의 분기점을 작성한 후 제출해주세요.",
        icon: "warning",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "확인",
      });
      return;
    }

    if (isSubmitted) {
      await Swal.fire({
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

        let finalBirthYear = birthYear;
        if (!finalBirthYear) {
          const infoResponse = await api.get<UserInfoResponse>(
            "/api/v1/users-info"
          );
          if (infoResponse.data?.birthdayAt) {
            const birthdayStr = infoResponse.data.birthdayAt;
            const year = parseInt(
              birthdayStr.split("-")[0] || birthdayStr.substring(0, 4)
            );
            if (!isNaN(year)) {
              finalBirthYear = year;
            }
          }
        }

        await submitBaseline(isGuest, user.id, finalBirthYear);

        queryClient.invalidateQueries({
          queryKey: queryKeys.baselines.all(),
        });
        await Swal.fire({
          title: "제출 완료!",
          html: isGuest
            ? "게스트 모드에서 베이스라인이 저장되었습니다.<br/>더 많은 기능을 사용하려면 로그인하세요."
            : "베이스라인이 성공적으로 제출되었습니다.",
          icon: "success",
          confirmButtonColor: "#10B981",
          confirmButtonText: "확인",
        });

        startNewBaseline();

        router.push("/scenario-list");
      } catch (error) {
        console.error("제출 오류:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.";

        await Swal.fire({
          title: "제출 실패",
          html: `<pre style="text-align: left; font-size: 12px;">${errorMessage}</pre>`,
          icon: "error",
          confirmButtonColor: "#E76F51",
          confirmButtonText: "확인",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return { isSubmitting, handleSubmit, sortedEvents };
};
