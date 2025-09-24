export interface BaselineEvent {
  id: string;
  year: number;
  age: number;
  category: "교육" | "직업" | "관계" | "경제" | "기타";
  eventTitle: string;
  actualChoice: string;
  context?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface baselineNode {
  year: number;
  age: number;
  hasEvent: boolean;
  event?: BaselineEvent;
}

export interface FormState {
  isOpen: boolean;
  selectedYear: number | null;
  isEditing: boolean;
}
