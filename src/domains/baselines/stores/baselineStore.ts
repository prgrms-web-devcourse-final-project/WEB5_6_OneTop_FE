import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EventData, LifeEvent } from "../types";
import { clientBaselineApi } from "../api/clientBaselineApi";

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
  lastUserId: number | null;
  initializeForUser: (userId: number, role: string) => void;
  // 로컬 저장 액션들
  addEventLocal: (eventData: EventData) => void;
  updateEventLocal: (eventId: string, eventData: EventData) => void;
  deleteEventLocal: (eventId: string) => void;

  // 백엔드 연동 액션들
  loadEvents: (birthYear?: number) => Promise<void>;
  submitBaseline: (
    isGuest?: boolean,
    userId?: number,
    birthYear?: number
  ) => Promise<void>;

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
      lastUserId: null,

      // 사용자 변경 시 초기화 함수 추가
      initializeForUser: (userId: number, role: string) => {
        const { lastUserId, hasGuestSubmitted, isSubmitted } = get();

        // 다른 사용자로 로그인한 경우
        if (lastUserId && lastUserId !== userId) {
          set({
            events: [],
            hasGuestSubmitted: false,
            submittedBaseLines: [],
            isSubmitted: false,
            currentBaseLineId: null,
            lastUserId: userId,
          });
          return;
        }

        // 게스트에서 로그인으로 전환
        if (role === "USER" && lastUserId && hasGuestSubmitted) {
          set({
            events: [],
            hasGuestSubmitted: false,
            submittedBaseLines: [],
            isSubmitted: false,
            currentBaseLineId: null,
            lastUserId: userId,
          });
          return;
        }

        // 로그인 사용자가 이미 제출한 베이스라인이 있는 경우
        if (role === "USER" && isSubmitted) {
          set({ lastUserId: userId });
          return;
        }

        // 첫 로그인이거나 같은 사용자
        if (!lastUserId) {
          set({ lastUserId: userId });
        }
      },

      loadEvents: async (birthYear?: number) => {
        try {
          set({ isLoading: true, error: null });
          set({ isLoading: false });
        } catch (error) {
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

      submitBaseline: async (
        isGuest = false,
        userId?: number,
        birthYear?: number
      ) => {
        try {
          set({ isLoading: true, error: null });

          const currentEvents = get().events;

          if (currentEvents.length < 2) {
            set({ isLoading: false });
            throw new Error("최소 2개 이상의 분기점을 작성해주세요.");
          }

          if (!userId) {
            set({ isLoading: false });
            throw new Error("사용자 ID가 필요합니다.");
          }

          const eventsToSubmit = currentEvents.map((event) => ({
            year: event.year,
            age: event.age,
            category: event.category,
            eventTitle: event.eventTitle,
            actualChoice: event.actualChoice,
            context: event.context,
          }));

          const { baseLineId, events: newEvents } =
            await clientBaselineApi.createBaseLine(
              eventsToSubmit,
              "",
              userId,
              birthYear
            );

          set((state) => ({
            events: newEvents,
            isLoading: false,
            isSubmitted: true,
            hasGuestSubmitted: isGuest, // 게스트일 때만 true
            currentBaseLineId: baseLineId.toString(),
            submittedBaseLines: [
              ...state.submittedBaseLines,
              {
                id: baseLineId.toString(),
                createdAt: new Date(),
                nodeCount: newEvents.length,
              },
            ],
            lastUserId: userId,
          }));
        } catch (error) {
          console.error("submitBaseline 에러:", error);
          const errorMessage =
            error instanceof Error ? error.message : "베이스라인 제출 실패";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      startNewBaseline: () => {
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
          hasGuestSubmitted: false,
          submittedBaseLines: [],
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
        lastUserId: state.lastUserId,
      }),
    }
  )
);
