import { useCallback } from "react";
import { Node } from "@xyflow/react";
import { TreeData } from "../types";

interface UseNodeEventsProps {
  treeData: TreeData | undefined;
  expandedNodeId: string | null;
  selectedNodeId: string | null;
  setExpandedNodeId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setNodes: (updateFn: (prevNodes: Node[]) => Node[]) => void;
  fitView: (options?: {
    nodes?: { id: string }[];
    duration?: number;
    maxZoom?: number;
  }) => void;
}

export const useNodeEvents = ({
  treeData,
  expandedNodeId,
  selectedNodeId,
  setExpandedNodeId,
  setSelectedNodeId,
  setNodes,
  fitView,
}: UseNodeEventsProps) => {
  // 베이스노드 클릭 시
  const handleBaselineNodeClick = useCallback(
    (node: Node) => {
      const isCurrentlyExpanded = expandedNodeId === node.id;
      const isCurrentlySelected = selectedNodeId === node.id;

      if (isCurrentlyExpanded && isCurrentlySelected) {
        setExpandedNodeId(null);
        setSelectedNodeId(null);
      } else if (isCurrentlyExpanded && !isCurrentlySelected) {
        setSelectedNodeId(node.id);
        fitView({ nodes: [{ id: node.id }], duration: 800, maxZoom: 0.7 });
      } else {
        setExpandedNodeId(node.id);
        setSelectedNodeId(node.id);
        fitView({ nodes: [{ id: node.id }], duration: 800, maxZoom: 0.7 });
      }
    },
    [expandedNodeId, selectedNodeId, fitView]
  );

  // 결정노드 클릭 시
  const handleDecisionNodeClick = useCallback(
    (node: Node) => {
      setSelectedNodeId(node.id);
      fitView({ nodes: [{ id: node.id }], duration: 800, maxZoom: 1.0 });
    },
    [setSelectedNodeId, fitView]
  );

  // 노드 타입 별 처리
  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (!treeData) return;

    setNodes((prevNodes) =>
      prevNodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );

    setSelectedNodeId(node.id);

    if (node.data?.isBaselineNode) {
      handleBaselineNodeClick(node);
    } else {
      handleDecisionNodeClick(node);
    }
  };

  // 해당 선택지로 이동 클릭
  const navigateToNode = (nodeId: string) => {
    if (!treeData) return;

    setSelectedNodeId(nodeId);
    fitView({ nodes: [{ id: nodeId }], duration: 800, maxZoom: 1.0 });
  };

  return {
    handleNodeClick,
    navigateToNode,
  };
};
