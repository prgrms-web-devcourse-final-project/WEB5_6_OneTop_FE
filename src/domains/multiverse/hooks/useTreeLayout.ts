import { useCallback } from "react";
import { TreeNode, LayoutNode, LayoutEdge } from "../types";

export const useTreeLayout = () => {
  const calculateLayout = useCallback(
    async (
      baselineNodes: TreeNode[],
      expandedNodeId: string | null
    ): Promise<{ nodes: LayoutNode[]; edges: LayoutEdge[] }> => {
      return {
        nodes: [],
        edges: [],
      };
    },
    []
  );

  return { calculateLayout };
};
