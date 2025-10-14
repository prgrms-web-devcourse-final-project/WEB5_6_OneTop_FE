import { useMemo } from "react";
import {
  DecisionNode,
  VirtualNode,
  TreeData,
  TreeStructure,
  TreeNode,
} from "../types";

const buildTreeStructure = (treeData: TreeData): TreeStructure => {
  const nodeMap = new Map<string, TreeNode>();
  const childrenMap = new Map<string, TreeNode[]>();
  const branchChoicesMap = new Map<string, DecisionNode[]>();
  const baseNodeIds = new Set(
    treeData.baseNodes.map((node) => `base-${node.id}`)
  );

  // 노드 등록
  treeData.baseNodes.forEach((node) => nodeMap.set(`base-${node.id}`, node));
  treeData.decisionNodes.forEach((node) => nodeMap.set(`dec-${node.id}`, node));

  // 다음 나이 찾기
  const getNextAge = (currentAge: number): number | null => {
    const nextAge = treeData.baseNodes
      .map((b) => b.ageYear)
      .filter((age) => age > currentAge)
      .sort((a, b) => a - b)[0];
    return nextAge ?? null;
  };

  // VirtualNode 생성
  const createVirtualNode = (
    parentDecNode: DecisionNode
  ): VirtualNode | null => {
    const virtualId = `virtual-${parentDecNode.id}`;
    if (nodeMap.has(virtualId)) {
      return nodeMap.get(virtualId) as VirtualNode;
    }

    const nextAge = getNextAge(parentDecNode.ageYear);
    if (nextAge === null) return null;

    const virtualNode: VirtualNode = {
      id: virtualId,
      type: "VIRTUAL",
      category: parentDecNode.category,
      situation: parentDecNode.aiNextSituation ?? null,
      decision: parentDecNode.decision,
      ageYear: nextAge,
      sourceBaseNodeId: parentDecNode.pivotLinkBaseNodeId,
      parentDecisionNodeId: parentDecNode.id,
      decisionLineId: parentDecNode.decisionLineId,
      aiNextRecommendedOption: parentDecNode.aiNextRecommendedOption || null,
    };

    nodeMap.set(virtualId, virtualNode);
    return virtualNode;
  };

  // 자식 찾기
  const findChildrenByType = (
    parentId: number,
    edgeType: "fork" | "normal"
  ): DecisionNode[] => {
    if (edgeType === "fork") {
      return treeData.decisionNodes.filter(
        (child) =>
          child.pivotLinkDecisionNodeId === parentId &&
          child.incomingEdgeType === "fork"
      );
    }
    return treeData.decisionNodes.filter(
      (child) =>
        child.parentId === parentId && child.incomingEdgeType === "normal"
    );
  };

  // 자식 추가
  const addChild = (parentKey: string, child: TreeNode | null) => {
    if (!child) return;
    if (!childrenMap.has(parentKey)) {
      childrenMap.set(parentKey, []);
    }
    const children = childrenMap.get(parentKey)!;
    if (!children.some((c) => c.id === child.id)) {
      children.push(child);
    }
  };

  // DecisionNode 자식 처리
  const processDecisionChildren = (
    decNode: DecisionNode,
    parentKey: string
  ) => {
    const forkChildren = findChildrenByType(decNode.id, "fork");
    const nextChildren = findChildrenByType(decNode.id, "normal");

    // next 먼저 추가 (순서 보장)
    const target = nextChildren[0] ?? createVirtualNode(decNode);
    addChild(parentKey, target);

    // fork 자식들 나중에 추가
    forkChildren.forEach((forkChild) => {
      const forkNext = findChildrenByType(forkChild.id, "normal");
      const target = forkNext[0] ?? createVirtualNode(forkChild);
      addChild(parentKey, target);
    });
  };

  // BaseNode 분기 처리
  const fromBaseDecisions = treeData.decisionNodes.filter(
    (node) => node.incomingEdgeType === "from-base"
  );

  fromBaseDecisions.forEach((decNode) => {
    const baseKey = `base-${decNode.pivotLinkBaseNodeId}`;
    if (!branchChoicesMap.has(baseKey)) {
      branchChoicesMap.set(baseKey, []);
    }
    branchChoicesMap.get(baseKey)!.push(decNode);
    processDecisionChildren(decNode, baseKey);
  });

  // DecisionNode 분기 처리
  const regularDecisions = treeData.decisionNodes.filter(
    (node) => node.incomingEdgeType !== "from-base"
  );

  regularDecisions.forEach((decNode) => {
    const decKey = `dec-${decNode.id}`;
    const forkChildren = findChildrenByType(decNode.id, "fork");

    if (forkChildren.length > 0) {
      branchChoicesMap.set(decKey, forkChildren);
    }
    processDecisionChildren(decNode, decKey);
  });

  return {
    nodeMap,
    childrenMap,
    baseNodeIds,
    branchChoicesMap,
  };
};

export const useTreeData = (treeData: TreeData | undefined) => {
  const treeStructure = useMemo((): TreeStructure | null => {
    if (!treeData) return null;
    return buildTreeStructure(treeData);
  }, [treeData]);

  const findNodeById = (nodeId: string): TreeNode | null => {
    if (!treeStructure) return null;

    if (
      nodeId.startsWith("base-") ||
      nodeId.startsWith("dec-") ||
      nodeId.startsWith("virtual-")
    ) {
      return treeStructure.nodeMap.get(nodeId) || null;
    }

    return (
      treeStructure.nodeMap.get(`base-${nodeId}`) ||
      treeStructure.nodeMap.get(`dec-${nodeId}`) ||
      null
    );
  };

  const getBranchChoices = (nodeId: string): DecisionNode[] => {
    if (!treeStructure) return [];

    const key =
      nodeId.startsWith("base-") || nodeId.startsWith("dec-")
        ? nodeId
        : `dec-${nodeId}`;

    return treeStructure.branchChoicesMap.get(key) || [];
  };

  const isBaselineNode = (nodeId: string): boolean => {
    if (!treeStructure) return false;

    const key = nodeId.startsWith("base-") ? nodeId : `base-${nodeId}`;
    return treeStructure.baseNodeIds.has(key);
  };

  return {
    treeStructure,
    findNodeById,
    getBranchChoices,
    isBaselineNode,
  };
};
