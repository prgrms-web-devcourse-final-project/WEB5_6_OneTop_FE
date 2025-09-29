import { create } from "zustand";
import { LifeEvent } from "../types";
import { clientBaselineApi } from "../api/clientBaselineApi";
import { persist } from "zustand/middleware";

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

  // 로컬 저장 액션들
  addEventLocal: (eventData: EventData) => void;
  updateEventLocal: (eventId: string, eventData: EventData) => void;
  deleteEventLocal: (eventId: string) => void;

  // 백엔드 연동 액션들
  loadEvents: () => Promise<void>;
  submitBaseline: (isGuest?: boolean) => Promise<void>; // 게스트 여부 파라미터 추가

  // 유틸리티 함수들
  getEventByYear: (year: number) => LifeEvent | null;
  clearEvents: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 로컬 ID 생성 함수
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

      // 백엔드에서 이벤트 로드 (게스트 모드에서는 스킵)
      loadEvents: async () => {
        try {
          set({ isLoading: true, error: null });

          // 게스트 모드에서는 백엔드 호출하지 않고 로컬 데이터만 사용
          console.log("게스트 모드: 백엔드 호출 없이 로컬 데이터만 사용");
          set({ isLoading: false });
        } catch (error) {
          console.log("로드 과정에서 오류 발생, 로컬 데이터 유지");
          set({ isLoading: false });
        }
      },

      // 로컬에만 이벤트 추가 (백엔드 호출 없음)
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
          isSubmitted: false, // 새로 추가하면 미제출 상태
        });
      },

      // 로컬에만 이벤트 수정 (백엔드 호출 없음)
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
          isSubmitted: false, // 수정하면 미제출 상태
        });
      },

      // 로컬에만 이벤트 삭제 (백엔드 호출 없음)
      deleteEventLocal: (eventId) => {
        const currentEvents = get().events;
        const filteredEvents = currentEvents.filter(
          (event) => event.id !== eventId
        );

        set({
          events: filteredEvents,
          isSubmitted: false, // 삭제하면 미제출 상태
        });
      },

      // 최종 베이스라인 제출 (게스트 모드에서는 로컬에서만 처리 - 임시)
      submitBaseline: async (isGuest = true) => {
        // 기본값을 true로 변경
        try {
          set({ isLoading: true, error: null });

          const currentEvents = get().events;

          // 최소 2개 검증
          if (currentEvents.length < 2) {
            set({ isLoading: false });
            throw new Error("최소 2개 이상의 분기점을 작성해주세요.");
          }

          // 게스트 모드에서는 항상 로컬에서만 제출 완료 처리
          console.log("게스트 모드: 로컬에서만 제출 처리");
          set({
            isLoading: false,
            isSubmitted: true,
            currentBaseLineId: "guest-mode-" + Date.now(),
          });

          // 나중에 소셜 로그인이 구현되면 아래 코드 활성화
          /*
          if (!isGuest) {
            // 로그인 모드: 실제 서버 전송
            console.log("로그인 모드: 서버로 데이터 전송");
            const eventsToSubmit: EventData[] = currentEvents.map(event => ({
              year: event.year,
              age: event.age,
              category: event.category,
              eventTitle: event.eventTitle,
              actualChoice: event.actualChoice,
              context: event.context,
            }));

            const newEvents = await clientBaselineApi.createBaseLine(eventsToSubmit);
            
            set({ 
              events: newEvents, 
              isLoading: false, 
              isSubmitted: true,
              currentBaseLineId: newEvents[0]?.baseLineId?.toString() || null
            });
          }
          */
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "베이스라인 제출 실패";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // 년도로 이벤트 찾기
      getEventByYear: (year) => {
        const events = get().events;
        return events.find((event) => event.year === year) || null;
      },

      // 이벤트 초기화
      clearEvents: () => {
        set({
          events: [],
          currentBaseLineId: null,
          error: null,
          isSubmitted: false,
        });
      },

      // 로딩 상태 설정
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // 에러 상태 설정
      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: "baseline-storage", // 로컬스토리지 키 이름
      // 로딩 상태나 에러는 저장하지 않음 (세션별로 관리)
      partialize: (state) => ({
        events: state.events,
        currentBaseLineId: state.currentBaseLineId,
        isSubmitted: state.isSubmitted,
      }),
    }
  )
);
