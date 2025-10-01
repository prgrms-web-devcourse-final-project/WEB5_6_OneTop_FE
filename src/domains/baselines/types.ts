export enum NodeCategory {
  EDUCATION = "EDUCATION",
  CAREER = "CAREER",
  RELATIONSHIP = "RELATIONSHIP",
  FINANCE = "FINANCE",
  HEALTH = "HEALTH",
  HAPPINESS = "HAPPINESS",
  ETC = "ETC",
}

export interface BaseNodeInput {
  category: NodeCategory;
  situation: string;
  decision: string;
  ageYear: number;
}

export interface BaseLineBulkCreateRequest {
  userId: number;
  title?: string;
  nodes: BaseNodeInput[];
}

export interface BaseLineBulkCreateResponse {
  baseLineId: number;
  nodes: {
    index: number;
    nodeId: number;
  }[];
}

export interface BaseNodeDto {
  id: number;
  category: NodeCategory;
  situation: string;
  decision: string;
  ageYear: number;
  fixedChoice?: string;
  altOpt1?: string;
  altOpt2?: string;
  altOpt1TargetDecisionId?: number;
  altOpt2TargetDecisionId?: number;
  description?: string;
  baseLineId?: number;
  title?: string;
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
  isTemp?: boolean;
  baseLineId?: number;
  title?: string;
}

export const categoryToBackend: Record<LifeEvent["category"], NodeCategory> = {
  교육: NodeCategory.EDUCATION,
  직업: NodeCategory.CAREER,
  관계: NodeCategory.RELATIONSHIP,
  경제: NodeCategory.FINANCE,
  건강: NodeCategory.HEALTH,
  행복: NodeCategory.HAPPINESS,
  기타: NodeCategory.ETC,
};

export const categoryToFrontend: Record<NodeCategory, LifeEvent["category"]> = {
  [NodeCategory.EDUCATION]: "교육",
  [NodeCategory.CAREER]: "직업",
  [NodeCategory.RELATIONSHIP]: "관계",
  [NodeCategory.FINANCE]: "경제",
  [NodeCategory.HEALTH]: "건강",
  [NodeCategory.HAPPINESS]: "행복",
  [NodeCategory.ETC]: "기타",
};

export interface BaseLineListItemDto {
  baselineId: number;
  title: string;
  tags: string[];
  createdDate: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface BaselineListResponse {
  data: BaseLineListItemDto[];
  message: string;
  status: number;
}
