// ERD 기반 타입 정의
export enum NodeType {
  BASE = "BASE",
  DECISION = "DECISION",
}

export enum NodeCategory {
  EDUCATION = "EDUCATION",
  CAREER = "CAREER",
  RELATIONSHIP = "RELATIONSHIP",
  FINANCE = "FINANCE",
  HEALTH = "HEALTH",
  HAPPINESS = "HAPPINESS",
  ETC = "ETC",
}

export enum SceneType {
  ECONOMY = "경제",
  HAPPINESS = "행복",
  RELATIONSHIP = "관계",
  CAREER = "직업",
  HEALTH = "건강",
}

export enum SceneCompareResultType {
  TOTAL = "total",
  ECONOMY = "경제",
  HAPPINESS = "행복",
  RELATIONSHIP = "관계",
  HEALTH = "건강",
  CAREER = "직업",
}

export interface BaseLineBulkCreateRequest {
  userId: number;
  title?: string;
  nodes: Array<{
    category: NodeCategory;
    situation: string;
    decision: string;
    ageYear: number;
  }>;
}

export interface BaseLineBulkCreateResponse {
  baseLineId: number;
  nodes: Array<{
    index: number;
    nodeId: number;
  }>;
}

export interface BaseNodeDto {
  id: number;
  userId: number;
  type: "BASE";
  category: NodeCategory;
  situation: string;
  decision: string;
  ageYear: number;
  baseLineId: number;
  parentId: number | null;
  title: string;
  fixedChoice: string;
  altOpt1: string;
  altOpt2: string;
  altOpt1TargetDecisionId: number | null;
  altOpt2TargetDecisionId: number | null;
}

export interface LifeEvent {
  id: string;
  year: number;
  age: number;
  category: "교육" | "직업" | "관계" | "경제" | "건강" | "행복" | "기타";
  eventTitle: string;
  actualChoice: string;
  context?: string;
  createdAt: Date;
  updatedAt?: Date;
  baseLineId?: number;
  title?: string;
}
