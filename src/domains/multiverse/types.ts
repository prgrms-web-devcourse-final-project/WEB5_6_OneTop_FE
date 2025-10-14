// ===== 노드 =====
export interface BaseNode {
  id: number;
  type: "BASE";
  userId: number;
  baseLineId: number;
  parentId: number | null;
  category: string;
  situation: string;
  decision: string;
  ageYear: number;
  title: string;
  fixedChoice: string;
  altOpt1: string;
  altOpt2: string;
  altOpt1TargetDecisionId: number | null;
  altOpt2TargetDecisionId: number | null;
  description?: string | null;
  effectiveCategory?: string;
  effectiveDecision?: string;
  effectiveSituation?: string;
  currentVersionId?: number;
}

export interface DecisionNode {
  id: number;
  type: "DECISION";
  userId: number;
  decisionLineId: number;
  baseNodeId: number;
  parentId: number | null;
  category: string;
  situation: string;
  decision: string;
  ageYear: number;
  background: string;
  options: string[];
  selectedIndex: number;
  parentOptionIndex: number | null;
  incomingFromId: number | null;
  incomingEdgeType: "normal" | "fork" | "from-base" | null;
  pivotLinkBaseNodeId: number | null;
  pivotLinkDecisionNodeId: number | null;
  pivotSlotIndex: number | null;
  aiNextSituation: string | null;
  aiNextRecommendedOption: string | null;
  description?: string | null;
  childrenIds?: number[] | null;
  effectiveCategory?: string;
  effectiveDecision?: string;
  effectiveSituation?: string;
  followPolicy?: string;
  root?: boolean | null;
  virtual?: boolean | null;
  pinnedCommitId?: number | null;
}

export interface VirtualNode {
  id: string; // "virtual-{id}"
  type: "VIRTUAL";
  parentDecisionNodeId: number;
  sourceBaseNodeId: number | null;
  decisionLineId: number;
  category: string | null;
  situation: string | null;
  decision: string | null;
  ageYear: number;
  aiNextRecommendedOption: string | null;
}

// ===== 통합 노드 =====
export type TreeNode = BaseNode | DecisionNode | VirtualNode;

// ===== 트리 API 응답 =====
export interface TreeData {
  baseNodes: BaseNode[];
  decisionNodes: DecisionNode[];
}

// ===== 트리 구조 타입 =====
export interface TreeStructure {
  nodeMap: Map<string, TreeNode>;
  childrenMap: Map<string, TreeNode[]>;
  baseNodeIds: Set<string>;
  branchChoicesMap: Map<string, DecisionNode[]>;
}

// ===== 레이아웃 =====
export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  isAtMaxDepth: boolean;
}

export interface LayoutEdge {
  id: string;
  source: string;
  target: string;
}

export interface NodeAnalysis {
  depth: number;
  region: "top" | "bottom";
  isLeaf: boolean;
}

// ===== 노드 생성 요청 =====
interface CreateNodeBaseFields {
  userId: number;
  category: string | null;
  situation: string | null;
  options: string[];
  selectedIndex: number;
  description: string;
}

export interface CreateNodeFromBaseRequest extends CreateNodeBaseFields {
  isBaseline: true;
  baseLineId: number;
  pivotOrd: null;
  pivotAge: number;
  selectedAltIndex: number;
}

export interface CreateNodeNextRequest extends CreateNodeBaseFields {
  isBaseline: false;
  parentDecisionNodeId: number;
  ageYear: number;
  parentOptionIndex: number | null;
}

export interface CreateNodeForkRequest
  extends Omit<CreateNodeBaseFields, "situation"> {
  isFork: true;
  parentDecisionNodeId: number;
  situation: string;
  targetOptionIndex: number;
}

export type CreateNodeRequest =
  | CreateNodeFromBaseRequest
  | CreateNodeNextRequest
  | CreateNodeForkRequest;

// ===== 시나리오 요청 =====
export interface ScenarioRequest {
  scenario: {
    decisionLineId: number;
  };
  lastDecision: {
    userId: number;
    parentDecisionNodeId: number;
    category: string | null;
    situation: string;
    ageYear: number;
    options: string[];
    selectedIndex: number;
    parentOptionIndex: number;
    description: string;
  };
}
