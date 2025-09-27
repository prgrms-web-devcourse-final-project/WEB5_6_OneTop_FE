"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { ReactFlow, Node, Edge, useReactFlow } from "@xyflow/react";
import { useTreeLayout } from "../hooks/useTreeLayout";
import { TreeNode as TreeNodeType } from "../types";
import { TreeData } from "../data/mockData";

import CustomEdge from "./CustomEdge";
import CustomNode from "./CustomNode";

const nodeTypes = { customNode: CustomNode };
const edgeTypes = { customEdge: CustomEdge };

const TreeFlowContent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLayouting, setIsLayouting] = useState(false);

  const { fitView } = useReactFlow();
  const { calculateLayout } = useTreeLayout();
  const baselineNodes: TreeNodeType[] = useMemo(() => TreeData, []);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const isBaselineNode = node.data.isBaselineNode;

      setSelectedNodeId(node.id);

      if (isBaselineNode) {
        const isCurrentlyExpanded = expandedNodeId === node.id;

        if (isCurrentlyExpanded) {
          setExpandedNodeId(null);
        } else {
          setExpandedNodeId(node.id);
        }
      } else {
        fitView({
          nodes: [{ id: node.id }],
          duration: 800,
          maxZoom: 1.2,
        });
      }
    },
    [baselineNodes, expandedNodeId, fitView]
  );

  useEffect(() => {
    const updateLayout = async () => {
      setIsLayouting(true);

      try {
        const { nodes: layoutNodes, edges: layoutEdges } =
          await calculateLayout(baselineNodes, expandedNodeId);

        const baselineNodeIds = new Set(baselineNodes.map((node) => node.id));

        const flowNodes: Node[] = layoutNodes.map((layoutNode) => ({
          id: layoutNode.id,
          type: "customNode",
          position: { x: layoutNode.x, y: layoutNode.y },
          data: {
            label: layoutNode.label,
            isSelected: selectedNodeId === layoutNode.id,
            isAtMaxDepth: layoutNode.isAtMaxDepth,
            isBaselineNode: baselineNodeIds.has(layoutNode.id),
          },
        }));

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
        console.error("레이아웃 계산 실패", error);
      } finally {
        setIsLayouting(false);
      }
    };

    updateLayout();
  }, [baselineNodes, expandedNodeId]);

  return (
    <div className="relative w-full h-full">
      {/* 로딩 상태 표시 */}
      {isLayouting && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>계산 중...</span>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={true}
        defaultViewport={{ x: 10, y: 50, zoom: 0.4 }}
        minZoom={0.2}
        maxZoom={1.5}
        className="w-full h-screen relative bg-[linear-gradient(270deg,var(--Deep-Navy,#0F1A2B)_0%,#111_100%)]"
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        selectNodesOnDrag={false}
      />
    </div>
  );
};

export default TreeFlowContent;
