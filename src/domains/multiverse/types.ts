export interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
}

export interface LayoutNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isAtMaxDepth: boolean;
}

export interface LayoutEdge {
  id: string;
  source: string;
  target: string;
}
