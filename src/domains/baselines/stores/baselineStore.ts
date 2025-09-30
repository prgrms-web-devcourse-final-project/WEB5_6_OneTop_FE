import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/share/stores/authStore";
import { LifeEvent } from "../types";
import { clientBaselineApi } from "../api/clientBaselineApi";

export interface EventData {
  year: number;
  age: number;
  category: LifeEvent["category"];
  eventTitle: string;
  actualChoice: string;
  context?: string;
}

export interface BaselineStore {
  events: LifeEvent[];
  currentBaseLineId: string | null;
  isLoading: boolean;
  error: string | null;
  isSubmitted: boolean;
  submittedBaseLines: Array<{
    id: string;
    createdAt: Date;
    nodeCount: number;
  }>;
  hasGuestSubmitted: boolean;

  // 로컬 저장 액션들
  addEventLocal: (eventData: EventData) => void;
  updateEventLocal: (eventId: string, eventData: EventData) => void;
  deleteEventLocal: (eventId: string) => void;

  // 백엔드 연동 액션들
  loadEvents: () => Promise<void>;
  submitBaseline: (isGuest?: boolean) => Promise<void>;

  // 새 베이스라인 시작
  startNewBaseline: () => boolean;

  // 유틸리티 함수들
  getEventByYear: (year: number) => LifeEvent | null;
  clearEvents: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const generateLocalId = () =>
  `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useBaselineStore = create<BaselineStore>()(
  persist(
    (set, get) => ({
      events: [],
      currentBaseLineId: null,
      isLoading: false,
      error: null,
      isSubmitted: false,
      submittedBaseLines: [],
      hasGuestSubmitted: false,

      loadEvents: async () => {
        try {
          set({ isLoading: true, error: null });
          //console.log("게스트 모드: 백엔드 호출 없이 로컬 데이터만 사용");
          set({ isLoading: false });
        } catch (error) {
          //console.log("로드 과정에서 오류 발생, 로컬 데이터 유지");
          set({ isLoading: false });
        }
      },

      addEventLocal: (eventData) => {
        const currentEvents = get().events;

        const newEvent: LifeEvent = {
          id: generateLocalId(),
          year: eventData.year,
          age: eventData.age,
          category: eventData.category,
          eventTitle: eventData.eventTitle,
          actualChoice: eventData.actualChoice,
          context: eventData.context,
          createdAt: new Date(),
        };

        set({
          events: [...currentEvents, newEvent].sort((a, b) => a.year - b.year),
          isSubmitted: false,
        });
      },

      updateEventLocal: (eventId, eventData) => {
        const currentEvents = get().events;

        const updatedEvents = currentEvents.map((event) =>
          event.id === eventId
            ? {
                ...event,
                year: eventData.year,
                age: eventData.age,
                category: eventData.category,
                eventTitle: eventData.eventTitle,
                actualChoice: eventData.actualChoice,
                context: eventData.context,
                updatedAt: new Date(),
              }
            : event
        );

        set({
          events: updatedEvents.sort((a, b) => a.year - b.year),
          isSubmitted: false,
        });
      },

      deleteEventLocal: (eventId) => {
        const currentEvents = get().events;
        const filteredEvents = currentEvents.filter(
          (event) => event.id !== eventId
        );

        set({
          events: filteredEvents,
          isSubmitted: false,
        });
      },

      submitBaseline: async (isGuest = false) => {
        try {
          set({ isLoading: true, error: null });

          const currentEvents = get().events;
          const { user } = useAuthStore.getState();

          if (currentEvents.length < 2) {
            set({ isLoading: false });
            throw new Error("최소 2개 이상의 분기점을 작성해주세요.");
          }

          // 게스트 모드: 로컬에만 저장
          if (isGuest || !user || user.role === "GUEST") {
            console.log("게스트 모드: 로컬에서만 제출 처리");

            const newBaseLineId = "guest-mode-" + Date.now();

            set((state) => ({
              isLoading: false,
              isSubmitted: true,
              hasGuestSubmitted: false, // 게스트 플래그도 초기화
              submittedBaseLines: [], // 제출 목록도 초기화
              currentBaseLineId: newBaseLineId,
              // submittedBaseLines: [
              //   ...state.submittedBaseLines,
              //   {
              //     id: newBaseLineId,
              //     createdAt: new Date(),
              //     nodeCount: currentEvents.length,
              //   },
              // ],
            }));
            return;
          }

          // 로그인 사용자: 백엔드로 전송
          console.log("로그인 모드: 서버로 데이터 전송");

          const eventsToSubmit = currentEvents.map((event) => ({
            year: event.year,
            age: event.age,
            category: event.category,
            eventTitle: event.eventTitle,
            actualChoice: event.actualChoice,
            context: event.context,
          }));

          const newEvents = await clientBaselineApi.createBaseLine(
            eventsToSubmit,
            "",
            user.id
          );

          const newBaseLineId = newEvents[0]?.baseLineId?.toString() || null;

          set((state) => ({
            events: newEvents,
            isLoading: false,
            isSubmitted: true,
            currentBaseLineId: newBaseLineId,
            submittedBaseLines: [
              ...state.submittedBaseLines,
              {
                id: newBaseLineId || `baseline-${Date.now()}`,
                createdAt: new Date(),
                nodeCount: newEvents.length,
              },
            ],
          }));

          console.log("베이스라인 제출 완료");
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "베이스라인 제출 실패";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      startNewBaseline: () => {
        const { hasGuestSubmitted } = get();
        const { user } = useAuthStore.getState();

        // 게스트가 이미 제출했다면 새로 만들 수 없음
        if (hasGuestSubmitted && (!user || user.role === "GUEST")) {
          console.log("게스트는 1개만 생성 가능");
          return false;
        }

        console.log("새 베이스라인 시작");

        set({
          events: [],
          currentBaseLineId: null,
          error: null,
          isSubmitted: false,
        });

        return true;
      },

      getEventByYear: (year) => {
        const events = get().events;
        return events.find((event) => event.year === year) || null;
      },

      clearEvents: () => {
        set({
          events: [],
          currentBaseLineId: null,
          error: null,
          isSubmitted: false,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: "baseline-storage",
      partialize: (state) => ({
        events: state.events,
        currentBaseLineId: state.currentBaseLineId,
        isSubmitted: state.isSubmitted,
        submittedBaseLines: state.submittedBaseLines,
        hasGuestSubmitted: state.hasGuestSubmitted,
      }),
      onRehydrateStorage: () => (state) => {
        // rehydrate 후 사용자 역할 확인
        const { user } = useAuthStore.getState();
        if (state && user && user.role === "USER" && state.hasGuestSubmitted) {
          // 로그인 사용자인데 게스트 데이터가 있으면 초기화
          state.events = [];
          state.hasGuestSubmitted = false;
          state.submittedBaseLines = [];
          state.isSubmitted = false;
        }
      },
    }
  )
);
