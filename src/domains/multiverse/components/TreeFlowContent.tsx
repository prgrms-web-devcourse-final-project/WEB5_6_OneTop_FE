"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ReactFlow, Node, Edge, useReactFlow } from "@xyflow/react";
import { useTreeLayout } from "../hooks/useTreeLayout";
import { useNodeEvents } from "../hooks/useNodeEvents";
import { useTreeData } from "../hooks/useTreeData";
import { DecisionNode, TreeNode } from "../types";

import CustomEdge from "./CustomEdge";
import CustomNode from "./CustomNode";
import Sidebar from "./sidebar/Sidebar";
import LoadingSpinner from "./LoadingSpinner";
import { useTreeDataQuery } from "../hooks/useTreeDataQuery";

const NODE_TYPES = { customNode: CustomNode };
const EDGE_TYPES = { customEdge: CustomEdge };
const DEFAULT_VIEWPORT = { x: 10, y: 50, zoom: 0.4 };

interface TreeFlowContentProps {
  baselineId: number;
}

// 노드 데이터 확장
const createFlowNode = (
  layoutNode: { id: string; x: number; y: number; isAtMaxDepth: boolean },
  nodeData: TreeNode,
  baseNodeIds: Set<string>,
  firstBaseId: number,
  lastBaseId: number,
  selectedNodeId: string | null,
  childrenMap: Map<string, TreeNode[]>
): Node => {
  const isBaselineNode = baseNodeIds.has(layoutNode.id);
  const isHeaderNode = layoutNode.id === `base-${firstBaseId}`;

  // 결말 노드 판단
  let isEndingNode = false;
  let isPreEndingBaseNode = false;

  if (nodeData.type === "BASE") {
    // 마지막 BaseNode: ending
    if (layoutNode.id === `base-${lastBaseId}`) {
      isEndingNode = true;
    }
    // maxDepth인데 마지막 아닌 BaseNode: pre-ending
    else if (layoutNode.isAtMaxDepth) {
      isPreEndingBaseNode = true;
    }
  } else if (nodeData.type === "DECISION" && layoutNode.isAtMaxDepth) {
    // maxDepth + 자식 없는 DecisionNode: ending
    const children = childrenMap.get(layoutNode.id) || [];
    if (children.length === 0) {
      isEndingNode = true;
    }
  }

  return {
    id: layoutNode.id,
    type: "customNode",
    position: { x: layoutNode.x, y: layoutNode.y },
    data: {
      ...nodeData,
      isBaselineNode,
      isHeaderNode,
      isEndingNode,
      isPreEndingBaseNode,
      isAtMaxDepth: layoutNode.isAtMaxDepth,
    },
    selected: selectedNodeId === layoutNode.id,
  };
};

const TreeFlowContent = ({ baselineId }: TreeFlowContentProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLayouting, setIsLayouting] = useState(false);
  const [pendingNavigationNodeId, setPendingNavigationNodeId] = useState<
    string | null
  >(null);

  const memoizedNodeTypes = useMemo(() => NODE_TYPES, []);
  const memoizedEdgeTypes = useMemo(() => EDGE_TYPES, []);
  const { data: treeData, isLoading, refetch } = useTreeDataQuery(baselineId);
  const { fitView } = useReactFlow();
  const { calculateLayout } = useTreeLayout();
  const { treeStructure, getBranchChoices, isBaselineNode } =
    useTreeData(treeData);
  const { handleNodeClick, navigateToNode } = useNodeEvents({
    treeData,
    expandedNodeId,
    selectedNodeId,
    setExpandedNodeId,
    setSelectedNodeId,
    setNodes,
    fitView,
  });

  const selectedNode = selectedNodeId
    ? (nodes.find((n) => n.id === selectedNodeId) as Node<
        TreeNode & Record<string, unknown>
      >) || null
    : null;
  const branchChoices = selectedNodeId ? getBranchChoices(selectedNodeId) : [];
  const isAtMaxDepth = selectedNode?.data?.isAtMaxDepth === true;

  // 레이아웃 업데이트
  const updateLayout = useCallback(async () => {
    if (!treeData || !treeStructure || isLayouting) return;

    setIsLayouting(true);

    try {
      const { nodes: layoutNodes, edges: layoutEdges } = calculateLayout(
        treeStructure,
        treeData.baseNodes,
        expandedNodeId
      );

      const firstBaseId = treeData.baseNodes[0]?.id;
      const lastBaseId = treeData.baseNodes[treeData.baseNodes.length - 1]?.id;

      const flowNodes: Node[] = layoutNodes.map((layoutNode) => {
        const nodeData = treeStructure.nodeMap.get(layoutNode.id)!;
        return createFlowNode(
          layoutNode,
          nodeData,
          treeStructure.baseNodeIds,
          firstBaseId,
          lastBaseId,
          selectedNodeId,
          treeStructure.childrenMap
        );
      });

      const flowEdges: Edge[] = layoutEdges.map((layoutEdge) => ({
        id: layoutEdge.id,
        source: layoutEdge.source,
        target: layoutEdge.target,
        type: "customEdge",
        animated: false,
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (error) {
      console.error("레이아웃 계산 실패:", error);
    } finally {
      setIsLayouting(false);
    }
  }, [
    treeData,
    treeStructure,
    expandedNodeId,
    selectedNodeId,
    calculateLayout,
  ]);

  useEffect(() => {
    if (treeData && treeStructure && !isLayouting) {
      updateLayout();
    }
  }, [expandedNodeId, treeData]);

  // treeStructure 업데이트 후 pending navigation 처리
  useEffect(() => {
    if (!pendingNavigationNodeId || !treeStructure || isLayouting) return;

    if (treeStructure.nodeMap.has(pendingNavigationNodeId)) {
      navigateToNode(pendingNavigationNodeId);
      setPendingNavigationNodeId(null);
    }
  }, [treeStructure, pendingNavigationNodeId, navigateToNode, isLayouting]);

  const handleNodeCreated = useCallback(
    async (newDecisionNode: DecisionNode) => {
      const virtualNodeId = `virtual-${newDecisionNode.id}`;
      await refetch();
      setPendingNavigationNodeId(virtualNodeId);
    },
    [refetch]
  );

  const handleCloseSidebar = useCallback(() => {
    setSelectedNodeId(null);
    setNodes((prev) => prev.map((n) => ({ ...n, selected: false })));
  }, []);

  return (
    <div className="relative w-full h-full">
      {isLoading && <LoadingSpinner message="트리 데이터 로딩 중..." />}
      {isLayouting && <LoadingSpinner message="레이아웃 계산 중..." />}

      <Sidebar
        isOpen={!!selectedNode}
        onClose={handleCloseSidebar}
        selectedNode={selectedNode}
        branchChoices={branchChoices}
        navigateToNode={navigateToNode}
        isBaselineNode={selectedNodeId ? isBaselineNode(selectedNodeId) : false}
        isAtMaxDepth={isAtMaxDepth}
        baselineId={baselineId}
        onNodeCreated={handleNodeCreated}
        treeStructure={treeStructure}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        fitView
        defaultViewport={DEFAULT_VIEWPORT}
        minZoom={0.2}
        maxZoom={1.5}
        className="w-full h-screen relative"
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        selectNodesOnDrag={false}
      />
    </div>
  );
};

export default TreeFlowContent;
