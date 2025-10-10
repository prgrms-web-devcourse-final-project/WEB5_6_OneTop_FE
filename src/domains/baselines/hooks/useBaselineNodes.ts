import { useState, useEffect } from "react";
import { useBaselineStore } from "../stores/baselineStore";
import type {
  BaselineUser,
  TempNode,
  LifeEvent,
  BaselineNodesState,
} from "../types";
import Swal from "sweetalert2";

export const useBaselineNodes = (
  user: BaselineUser | null,
  birthYear?: number
): BaselineNodesState => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tempNodes, setTempNodes] = useState<TempNode[]>([]);

  const { events, isSubmitted, getEventByYear, loadEvents } =
    useBaselineStore();

  useEffect(() => {
    if (user) {
      loadEvents(birthYear).catch((error) => {
        console.error("이벤트 로드 실패:", error);
      });
    }
  }, [user, loadEvents, birthYear]);

  const handleNodeClick = (
    year: number,
    age: number,
    isEmpty: boolean = false
  ): void => {
    if (!user) return;

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

  const handleFormClose = (): void => {
    setIsFormOpen(false);
    if (selectedYear && !getEventByYear(selectedYear)) {
      setTempNodes((prev) => prev.filter((node) => node.year !== selectedYear));
    }
    setTimeout(() => {
      setSelectedYear(null);
    }, 100);
  };

  const handleDeleteTempNode = (year: number): void => {
    setTempNodes((prev) => prev.filter((node) => node.year !== year));
    if (selectedYear === year) {
      setIsFormOpen(false);
      setSelectedYear(null);
    }
  };

  const selectedEvent = selectedYear ? getEventByYear(selectedYear) : null;

  const allEventsForView: Array<LifeEvent & { isTemp?: boolean }> = [
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

  return {
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
  };
};
