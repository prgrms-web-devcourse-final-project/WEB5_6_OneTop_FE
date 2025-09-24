import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LifeEvent {
  id: string;
  year: number;
  age: number;
  category: "교육" | "직업" | "관계" | "경제" | "기타";
  eventTitle: string;
  actualChoice: string;
  context?: string;
  createdAt: Date;
}

interface BaselineState {
  events: LifeEvent[];
  selectedEventId: string | null;

  // Actions
  addEvent: (event: Omit<LifeEvent, "id" | "createdAt">) => void;
  updateEvent: (id: string, event: Partial<LifeEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedEvent: (id: string | null) => void;
  getEventByYear: (year: number) => LifeEvent | undefined;
}

export const useBaselineStore = create<BaselineState>()(
  persist(
    (set, get) => ({
      events: [],
      selectedEventId: null,

      addEvent: (eventData) => {
        const newEvent: LifeEvent = {
          id: `event_${Date.now()}`,
          ...eventData,
          createdAt: new Date(),
        };

        set((state) => ({
          events: [...state.events, newEvent].sort((a, b) => a.year - b.year),
        }));
      },

      updateEvent: (id, eventData) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...eventData } : event
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
          selectedEventId:
            state.selectedEventId === id ? null : state.selectedEventId,
        }));
      },

      setSelectedEvent: (id) => {
        set({ selectedEventId: id });
      },

      getEventByYear: (year) => {
        return get().events.find((event) => event.year === year);
      },
    }),
    {
      name: "baseline-storage",
    }
  )
);
