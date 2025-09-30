import { useMemo } from "react";
import { BaseNode, DecisionNode, TreeData, TreeStructure } from "../types";

export const useTreeData = (treeData: TreeData | undefined) => {
  const treeStructure = useMemo((): TreeStructure | null => {
    if (!treeData) return null;

    const allNodes = [...treeData.baseNodes, ...treeData.decisionNodes];
    const nodeMap = new Map<string, BaseNode | DecisionNode>();
    const childrenMap = new Map<string, (BaseNode | DecisionNode)[]>();
    const baseNodeIds = new Set(
      treeData.baseNodes.map((node) => node.id.toString())
    );

    allNodes.forEach((node) => {
      nodeMap.set(node.id.toString(), node);
    });

    allNodes.forEach((node) => {
      if (node.parentId) {
        const parentId = node.parentId.toString();
        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, []);
        }
        childrenMap.get(parentId)!.push(node);
      }
    });

    return { nodeMap, childrenMap, baseNodeIds, allNodes };
  }, [treeData]);

  const findNodeById = (nodeId: string): BaseNode | DecisionNode | null => {
    return treeStructure?.nodeMap.get(nodeId) || null;
  };

  const getChildNodes = (parentNodeId: string) => {
    return treeStructure?.childrenMap.get(parentNodeId) || [];
  };

  const isBaselineNode = (nodeId: string): boolean => {
    return treeStructure?.baseNodeIds.has(nodeId) || false;
  };

  return {
    treeStructure,
    findNodeById,
    getChildNodes,
    isBaselineNode,
  };
};
