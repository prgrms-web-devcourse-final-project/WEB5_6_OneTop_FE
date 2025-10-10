"use client";

import { useState, useEffect } from "react";
import { ReactFlow, Node, Edge, useReactFlow } from "@xyflow/react";

import { MOCK_TREE_DATA as treeData } from "../data/mockData";
import { useTreeLayout } from "../hooks/useTreeLayout";
import { useNodeEvents } from "../hooks/useNodeEvents";
import { useTreeData } from "../hooks/useTreeData";
import { TreeData } from "../types";

import CustomEdge from "./CustomEdge";
import CustomNode from "./CustomNode";
import Sidebar from "./sidebar/Sidebar";
import LoadingSpinner from "./LoadingSpinner";

const NODE_TYPES = { customNode: CustomNode };
const EDGE_TYPES = { customEdge: CustomEdge };
const DEFAULT_VIEWPORT = { x: 10, y: 50, zoom: 0.4 };

interface TreeFlowContentProps {
  baselineId?: string;
}

const TreeFlowContent = ({ baselineId = "101" }: TreeFlowContentProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLayouting, setIsLayouting] = useState(false);

  // ===== 훅 =====
  const { fitView } = useReactFlow();
  const { calculateLayout } = useTreeLayout();
  const { treeStructure, findNodeById, getChildNodes, isBaselineNode } =
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

  // ===== 파생 상태 =====
  const selectedNode = selectedNodeId ? findNodeById(selectedNodeId) : null;
  const parentNode = selectedNode?.parentId
    ? findNodeById(selectedNode.parentId.toString())
    : null;
  const childNodes = selectedNodeId ? getChildNodes(selectedNodeId) : [];
  const isAtMaxDepth =
    nodes.find((n) => n.id === selectedNodeId)?.data?.isAtMaxDepth === true;

  // ===== 레이아웃 업데이트 =====
  const updateLayout = async () => {
    if (!treeData || !treeStructure || isLayouting) return;

    setIsLayouting(true);

    try {
      const { nodes: layoutNodes, edges: layoutEdges } = calculateLayout(
        treeStructure,
        treeData.baseNodes,
        expandedNodeId
      );

      const flowNodes: Node[] = layoutNodes.map((layoutNode) => {
        const nodeData = treeStructure.nodeMap.get(layoutNode.id)!;
        return {
          id: layoutNode.id,
          type: "customNode",
          position: { x: layoutNode.x, y: layoutNode.y },
          data: {
            ...nodeData,
            isBaselineNode: treeStructure.baseNodeIds.has(layoutNode.id),
            isAtMaxDepth: layoutNode.isAtMaxDepth,
          },
          selected: selectedNodeId === layoutNode.id,
        };
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
  };

  useEffect(() => {
    updateLayout();
  }, [expandedNodeId, treeData]);

  return (
    <div className="relative w-full h-full">
      {/* 데이터 로딩 */}
      {/* {isLoading && <LoadingSpinner message="트리 데이터 로딩 중..." />} */}

      {/* 레이아웃 로딩 */}
      {isLayouting && <LoadingSpinner message="레이아웃 계산 중..." />}

      {/* 사이드바 */}
      <Sidebar
        isOpen={!!selectedNode}
        onClose={() => setSelectedNodeId(null)}
        selectedNode={selectedNode}
        parentNode={parentNode}
        childNodes={childNodes}
        onNavigateToParent={() =>
          parentNode && navigateToNode(parentNode.id.toString())
        }
        onNavigateToChild={(childId) => navigateToNode(childId)}
        isBaselineNode={selectedNodeId ? isBaselineNode(selectedNodeId) : false}
        isAtMaxDepth={isAtMaxDepth}
      />

      {/* 트리 */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
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
