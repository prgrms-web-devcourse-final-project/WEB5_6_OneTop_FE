export type TreeStructure = {
  nodeMap: Map<string, BaseNode | DecisionNode>;
  childrenMap: Map<string, (BaseNode | DecisionNode)[]>;
  baseNodeIds: Set<string>;
  allNodes: (BaseNode | DecisionNode)[];
};

export interface BaseNode {
  id: number;
  userId: number;
  type: string;
  category: string;
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

export interface DecisionNode {
  id: number;
  userId: number;
  type: string;
  category: string;
  situation: string;
  decision: string;
  ageYear: number;
  decisionLineId: number;
  parentId: number | null;
  baseNodeId: number;
  background: string;
  options: string[];
  selectedIndex: number;
  parentOptionIndex: number | null;
}

export interface TreeData {
  baseNodes: BaseNode[];
  decisionNodes: DecisionNode[];
}

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
  region: "top" | "bottom" | "baseline";
  isLeaf: boolean;
  leafIndex?: number;
}
