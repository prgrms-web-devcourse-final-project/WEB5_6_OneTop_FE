import { create } from "zustand";
import { LifeEvent } from "../types";
import { clientBaselineApi } from "../api/clientBaselineApi";

// 이벤트 데이터 타입 정의 (LifeEvent의 category 타입과 맞춤)
export interface EventData {
  year: number;
  age: number;
  category: LifeEvent["category"]; // "교육" | "직업" | "관계" | "경제" | "건강" | "행복" | "기타"
  eventTitle: string;
  actualChoice: string;
  context?: string;
}

export interface BaselineStore {
  events: LifeEvent[];
  currentBaseLineId: string | null;
  isLoading: boolean;
  error: string | null;

  // API 연동 액션들 - 타입을 정확하게 정의
  loadEvents: () => Promise<void>;
  addEvent: (eventData: EventData) => Promise<void>;
  updateEvent: (eventId: string, eventData: EventData) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  submitBaseline: () => Promise<void>;

  // 일괄 생성 (새로운 베이스라인 생성 시)
  createBaselineWithEvents: (events: EventData[]) => Promise<void>;

  // 유틸리티 함수들
  getEventByYear: (year: number) => LifeEvent | null;
  clearEvents: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBaselineStore = create<BaselineStore>((set, get) => ({
  events: [],
  currentBaseLineId: null,
  isLoading: false,
  error: null,

  // 이벤트 로드
  loadEvents: async () => {
    try {
      set({ isLoading: true, error: null });
      const events = await clientBaselineApi.getBaseLine();
      set({ events, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "이벤트 로드 실패";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 단일 이벤트 추가 (일괄 생성 방식)
  addEvent: async (eventData) => {
    try {
      set({ isLoading: true, error: null });

      // 현재 이벤트들과 새 이벤트를 합쳐서 일괄 생성
      const currentEvents = get().events;
      const allEvents: EventData[] = [
        ...currentEvents.map(
          (e): EventData => ({
            year: e.year,
            age: e.age,
            category: e.category, // 이미 올바른 리터럴 타입
            eventTitle: e.eventTitle,
            actualChoice: e.actualChoice,
            context: e.context,
          })
        ),
        eventData,
      ];

      const newEvents = await clientBaselineApi.createBaseLine(allEvents);
      set({ events: newEvents, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "이벤트 추가 실패";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 이벤트 수정 (전체 베이스라인 재생성 방식)
  updateEvent: async (eventId, eventData) => {
    try {
      set({ isLoading: true, error: null });

      const currentEvents = get().events;
      const updatedEvents: EventData[] = currentEvents.map(
        (event): EventData =>
          event.id === eventId
            ? {
                year: eventData.year,
                age: eventData.age,
                category: eventData.category, // 정확한 리터럴 타입
                eventTitle: eventData.eventTitle,
                actualChoice: eventData.actualChoice,
                context: eventData.context,
              }
            : {
                year: event.year,
                age: event.age,
                category: event.category, // 이미 올바른 리터럴 타입
                eventTitle: event.eventTitle,
                actualChoice: event.actualChoice,
                context: event.context,
              }
      );

      const newEvents = await clientBaselineApi.createBaseLine(updatedEvents);
      set({ events: newEvents, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "이벤트 수정 실패";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 이벤트 삭제 (전체 베이스라인 재생성 방식)
  deleteEvent: async (eventId) => {
    try {
      set({ isLoading: true, error: null });

      const currentEvents = get().events;
      const filteredEvents: EventData[] = currentEvents
        .filter((event) => event.id !== eventId)
        .map(
          (event): EventData => ({
            year: event.year,
            age: event.age,
            category: event.category, // 이미 올바른 리터럴 타입
            eventTitle: event.eventTitle,
            actualChoice: event.actualChoice,
            context: event.context,
          })
        );

      if (filteredEvents.length >= 2) {
        // 최소 2개 노드 필요
        const newEvents = await clientBaselineApi.createBaseLine(
          filteredEvents
        );
        set({ events: newEvents, isLoading: false });
      } else {
        // 노드가 2개 미만이면 전체 삭제
        set({ events: [], currentBaseLineId: null, isLoading: false });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "이벤트 삭제 실패";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 일괄 베이스라인 생성
  createBaselineWithEvents: async (events) => {
    try {
      set({ isLoading: true, error: null });

      const newEvents = await clientBaselineApi.createBaseLine(events);
      set({ events: newEvents, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "베이스라인 생성 실패";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 베이스라인 제출
  submitBaseline: async () => {
    try {
      set({ isLoading: true, error: null });

      const nodeIds = get().events.map((event) => event.id);
      await clientBaselineApi.submitBaseLine(nodeIds);

      set({ isLoading: false });
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
    set({ events: [], currentBaseLineId: null, error: null });
  },

  // 로딩 상태 설정
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // 에러 상태 설정
  setError: (error) => {
    set({ error });
  },
}));
