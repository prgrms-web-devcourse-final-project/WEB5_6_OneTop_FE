//////// ERD 기반 타입 정의
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

export enum Gender {
  F = "F",
  M = "M",
  O = "O",
  N = "N",
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

// 백엔드 API 요청/응답 타입
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

export interface PivotDto {
  index: number;
  baseNodeId: number;
  category: NodeCategory;
  situation: string;
  ageYear: number;
}

export interface PivotListDto {
  baseLineId: number;
  pivots: PivotDto[];
}

export interface DecisionNodeDto {
  id: number;
  userId: number;
  type: "DECISION";
  category: NodeCategory;
  situation: string;
  decision: string;
  ageYear: number;
  decisionLineId: number;
  parentDecisionNodeId: number | null;
  options: string[];
  selectedIndex: number | null;
  parentOptionIndex: number | null;
  background: string;
  createdAt: string;
}

export interface DecisionLineDto {
  id: number;
  userId: number;
  baseNodeId: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  nodes: DecisionNodeDto[];
}

export interface TreeDto {
  baseNodes: BaseNodeDto[];
  decisionNodes: DecisionNodeDto[];
}

export interface SceneCompareDto {
  id: string;
  compareResult: string;
  resultType: SceneCompareResultType;
  createdAt: string;
}

export interface SceneTypeDto {
  id: string;
  scenariosId: string;
  type: SceneType;
  point: number;
  analysis: string;
  createdAt: string;
}

// Decision Flow 요청 타입
export interface DecisionFromBaseRequest {
  userId: number;
  baseLineId: number;
  pivotOrd: number;
  selectedAltIndex: number;
  category: NodeCategory;
  situation: string;
  options: string[];
  selectedIndex: number;
}

export interface DecisionFromBaseResponse {
  decisionLineId: number;
  decisionNodeId: number;
}

export interface DecisionNextRequest {
  userId: number;
  parentDecisionNodeId: number;
  category: NodeCategory;
  situation: string;
  ageYear: number;
  options: string[];
  selectedIndex: number;
  parentOptionIndex: number;
}

export interface DecisionNextResponse {
  decisionNodeId: number;
}

// 프론트엔드용 변환 타입
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

// API 응답 래퍼 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  details?: string;
  code?: string;
  title?: string;
}
