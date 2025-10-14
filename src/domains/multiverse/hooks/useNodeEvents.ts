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
  // BaseNode 클릭 시
  const handleBaseNodeClick = useCallback(
    (node: Node) => {
      const isExpanded = expandedNodeId === node.id;
      const isSelected = selectedNodeId === node.id;

      if (isExpanded && isSelected) {
        setExpandedNodeId(null);
        setSelectedNodeId(null);
      } else if (isExpanded && !isSelected) {
        setSelectedNodeId(node.id);
        fitView({ nodes: [{ id: node.id }], duration: 800, maxZoom: 0.7 });
      } else {
        setExpandedNodeId(node.id);
        setSelectedNodeId(node.id);
        fitView({ nodes: [{ id: node.id }], duration: 800, maxZoom: 0.7 });
      }
    },
    [
      expandedNodeId,
      selectedNodeId,
      setExpandedNodeId,
      setSelectedNodeId,
      fitView,
    ]
  );

  // DecisionNode/VirtualNode 클릭 시
  const handleDecisionNodeClick = useCallback(
    (node: Node) => {
      setSelectedNodeId(node.id);
      fitView({ nodes: [{ id: node.id }], duration: 800, maxZoom: 1.0 });
    },
    [setSelectedNodeId, fitView]
  );

  // 노드 타입 별 클릭
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!treeData) return;

      setNodes((prevNodes) =>
        prevNodes.map((n) => ({ ...n, selected: n.id === node.id }))
      );

      if (node.id.startsWith("base-") || node.data?.isBaselineNode) {
        handleBaseNodeClick(node);
      } else {
        handleDecisionNodeClick(node);
      }
    },
    [treeData, setNodes, handleBaseNodeClick, handleDecisionNodeClick]
  );

  // 해당 선택지로 이동 클릭 시
  const navigateToNode = useCallback(
    (nodeId: string) => {
      if (!treeData) return;

      setNodes((prevNodes) =>
        prevNodes.map((n) => ({ ...n, selected: n.id === nodeId }))
      );

      setSelectedNodeId(nodeId);
      fitView({ nodes: [{ id: nodeId }], duration: 800, maxZoom: 1.0 });
    },
    [treeData, setNodes, setSelectedNodeId, fitView]
  );

  return { handleNodeClick, navigateToNode };
};
