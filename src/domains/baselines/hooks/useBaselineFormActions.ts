import Swal from "sweetalert2";
import { useBaselineStore } from "../stores/baselineStore";
import type { LifeEvent } from "../types";
import type { FormData } from "../lib/schemas";

interface UseBaselineFormActionsProps {
  existingEvent: LifeEvent | null | undefined;
  onClose: () => void;
  birthYear?: number;
}

interface UseBaselineFormActionsReturn {
  handleFormSubmit: (data: FormData) => Promise<void>;
  handleDelete: () => Promise<void>;
}

export const useBaselineFormActions = ({
  existingEvent,
  onClose,
  birthYear,
}: UseBaselineFormActionsProps): UseBaselineFormActionsReturn => {
  const { addEventLocal, updateEventLocal, deleteEventLocal, isSubmitted } =
    useBaselineStore();

  const handleFormSubmit = async (data: FormData): Promise<void> => {
    try {
      const calculatedYear = birthYear
        ? birthYear + (data.ageAtEvent - 1)
        : 2000 + (data.ageAtEvent - 1);

      const eventData = {
        year: calculatedYear,
        age: data.ageAtEvent,
        category: data.category,
        eventTitle: data.eventTitle.trim(),
        actualChoice: data.actualChoice.trim(),
        context: data.context?.trim(),
      };

      if (existingEvent) {
        updateEventLocal(existingEvent.id, eventData);

        await Swal.fire({
          title: "수정 완료",
          html: "분기점이 수정되었습니다. <br/>'마무리하고 제출' 버튼을 클릭하여 최종 저장하세요.",
          icon: "success",
          confirmButtonColor: "#6366f1",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        addEventLocal(eventData);

        await Swal.fire({
          title: "저장 완료",
          html: "분기점이 임시 저장되었습니다. <br/>'마무리하고 제출' 버튼을 클릭하여 최종 저장하세요.",
          icon: "success",
          confirmButtonColor: "#6366f1",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      onClose();
    } catch (error) {
      console.error("저장 실패:", error);
      await Swal.fire({
        title: "저장 실패",
        text: "저장 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonColor: "#E76F51",
        confirmButtonText: "확인",
      });
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!existingEvent) return;

    // 제출된 상태에서는 삭제 불가
    if (isSubmitted) {
      await Swal.fire({
        title: "삭제 불가",
        text: "이미 제출된 베이스라인은 수정할 수 없습니다.",
        icon: "warning",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "확인",
      });
      return;
    }

    const result = await Swal.fire({
      title: "분기점 삭제",
      text: "정말로 이 분기점을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E76F51",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      try {
        deleteEventLocal(existingEvent.id);
        onClose();

        await Swal.fire({
          title: "삭제 완료",
          text: "분기점이 삭제되었습니다.",
          icon: "success",
          confirmButtonColor: "#E76F51",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("삭제 실패:", error);
        await Swal.fire({
          title: "삭제 실패",
          text: "삭제 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonColor: "#E76F51",
          confirmButtonText: "확인",
        });
      }
    }
  };

  return {
    handleFormSubmit,
    handleDelete,
  };
};
