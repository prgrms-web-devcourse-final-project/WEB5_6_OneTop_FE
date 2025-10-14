import {
  BaseNode,
  LayoutNode,
  LayoutEdge,
  TreeStructure,
  NodeAnalysis,
  TreeNode,
} from "../types";

const LAYOUT_CONFIG = {
  NODE_SPACING: 300,
  START_X: 100,
  BASELINE_PADDING: 50,
  MIN_HEIGHT: 100,
  NODE_Y_SPACE: 150,
} as const;

const getNodeKey = (node: TreeNode): string => {
  if (node.type === "VIRTUAL") return node.id;
  if (node.type === "DECISION") return `dec-${node.id}`;
  return `base-${node.id}`;
};

export const useTreeLayout = () => {
  // 트리 분석
  const analyzeTree = (
    expandedNodeId: string,
    treeStructure: TreeStructure
  ) => {
    const { childrenMap } = treeStructure;
    const directChildren = childrenMap.get(expandedNodeId) || [];

    if (directChildren.length === 0) {
      return {
        nodeAnalysis: new Map<string, NodeAnalysis>(),
        regions: { top: [] as string[], bottom: [] as string[] },
      };
    }

    const nodeAnalysis = new Map<string, NodeAnalysis>();
    const regions = { top: [] as string[], bottom: [] as string[] };

    const dfs = (nodeKey: string, depth: number, region: "top" | "bottom") => {
      const children = childrenMap.get(nodeKey) || [];
      const isLeaf = children.length === 0;

      nodeAnalysis.set(nodeKey, { depth, region, isLeaf });

      if (isLeaf) {
        regions[region].push(nodeKey);
        return;
      }

      children.forEach((child) => {
        dfs(getNodeKey(child), depth + 1, region);
      });
    };

    directChildren.forEach((child, index) => {
      const region = index === 0 ? "top" : "bottom";
      dfs(getNodeKey(child), 1, region);
    });

    return { nodeAnalysis, regions };
  };

  // 영역 계산
  const calculateRegions = (topLeaves: number, bottomLeaves: number) => {
    const viewportHeight = 800;
    const baselineY = viewportHeight / 2;

    const topHeight = Math.max(
      LAYOUT_CONFIG.MIN_HEIGHT,
      topLeaves * LAYOUT_CONFIG.NODE_Y_SPACE
    );
    const bottomHeight = Math.max(
      LAYOUT_CONFIG.MIN_HEIGHT,
      bottomLeaves * LAYOUT_CONFIG.NODE_Y_SPACE
    );

    return {
      baselineY,
      topRegion: {
        start: baselineY - topHeight - LAYOUT_CONFIG.BASELINE_PADDING,
        height: topHeight,
      },
      bottomRegion: {
        start: baselineY + LAYOUT_CONFIG.BASELINE_PADDING,
        height: bottomHeight,
      },
    };
  };

  // Y 좌표 계산
  const calculateY = (
    nodeId: string,
    leafPositions: Map<string, number>,
    layoutNodesMap: Map<string, LayoutNode>,
    analysis: NodeAnalysis,
    yRegions: ReturnType<typeof calculateRegions>,
    childrenMap: Map<string, TreeNode[]>
  ): number => {
    if (leafPositions.has(nodeId)) {
      return leafPositions.get(nodeId)!;
    }

    const children = childrenMap.get(nodeId) || [];
    const childKeys = children.map(getNodeKey);

    const childYPositions = childKeys
      .map((childKey) => layoutNodesMap.get(childKey)?.y)
      .filter((posY): posY is number => posY !== undefined);

    if (childYPositions.length === 0) {
      return analysis.region === "top"
        ? yRegions.topRegion.start + yRegions.topRegion.height / 2
        : yRegions.bottomRegion.start + yRegions.bottomRegion.height / 2;
    }

    const sortedYPositions = [...childYPositions].sort((a, b) => a - b);

    if (sortedYPositions.length === 1) {
      return sortedYPositions[0];
    }

    if (sortedYPositions.length === 2) {
      return (sortedYPositions[0] + sortedYPositions[1]) / 2;
    }

    if (sortedYPositions.length === 3) {
      return sortedYPositions[1];
    }

    return (
      sortedYPositions.reduce((sum, pos) => sum + pos, 0) /
      sortedYPositions.length
    );
  };

  const positionNodes = (
    nodeAnalysis: Map<string, NodeAnalysis>,
    regions: { top: string[]; bottom: string[] },
    baselineIndex: number,
    maxBaselineDepth: number,
    treeStructure: TreeStructure
  ): { nodes: LayoutNode[]; edges: LayoutEdge[] } => {
    const { childrenMap } = treeStructure;
    const layoutNodes: LayoutNode[] = [];
    const layoutNodesMap = new Map<string, LayoutNode>();
    const layoutEdges: LayoutEdge[] = [];

    const topLeaves = regions.top.length;
    const bottomLeaves = regions.bottom.length;
    const yRegions = calculateRegions(topLeaves, bottomLeaves);

    const leafPositions = new Map<string, number>();

    regions.top.forEach((leafId, index) => {
      const spacePerLeaf =
        topLeaves > 0
          ? yRegions.topRegion.height / topLeaves
          : yRegions.topRegion.height;
      const y = yRegions.topRegion.start + spacePerLeaf * (index + 0.5);
      leafPositions.set(leafId, y);
    });

    regions.bottom.forEach((leafId, index) => {
      const spacePerLeaf =
        bottomLeaves > 0
          ? yRegions.bottomRegion.height / bottomLeaves
          : yRegions.bottomRegion.height;
      const y = yRegions.bottomRegion.start + spacePerLeaf * (index + 0.5);
      leafPositions.set(leafId, y);
    });

    const nodesByDepth = new Map<number, string[]>();
    let maxDepth = 0;

    nodeAnalysis.forEach((analysis, nodeId) => {
      const { depth } = analysis;
      if (!nodesByDepth.has(depth)) {
        nodesByDepth.set(depth, []);
      }
      nodesByDepth.get(depth)!.push(nodeId);
      if (depth > maxDepth) {
        maxDepth = depth;
      }
    });

    for (let depth = maxDepth; depth >= 1; depth--) {
      const nodesAtDepth = nodesByDepth.get(depth) || [];

      nodesAtDepth.forEach((nodeId) => {
        const analysis = nodeAnalysis.get(nodeId)!;
        const x =
          LAYOUT_CONFIG.START_X +
          (baselineIndex + depth) * LAYOUT_CONFIG.NODE_SPACING;

        const y = calculateY(
          nodeId,
          leafPositions,
          layoutNodesMap,
          analysis,
          yRegions,
          childrenMap
        );

        const totalDepth = baselineIndex + depth;
        const isAtMaxDepth = totalDepth >= maxBaselineDepth;

        const newNode = { id: nodeId, x, y, isAtMaxDepth };
        layoutNodes.push(newNode);
        layoutNodesMap.set(nodeId, newNode);
      });
    }

    nodeAnalysis.forEach((_analysis, nodeId) => {
      const children = childrenMap.get(nodeId) || [];
      children.forEach((child) => {
        const childKey = getNodeKey(child);
        layoutEdges.push({
          id: `${nodeId}-${childKey}`,
          source: nodeId,
          target: childKey,
        });
      });
    });

    return { nodes: layoutNodes, edges: layoutEdges };
  };

  // 레이아웃 계산
  const calculateLayout = (
    treeStructure: TreeStructure,
    baselineNodes: BaseNode[],
    expandedNodeId: string | null
  ): { nodes: LayoutNode[]; edges: LayoutEdge[] } => {
    const nodes: LayoutNode[] = [];
    const edges: LayoutEdge[] = [];
    const { childrenMap } = treeStructure;

    const regions = calculateRegions(0, 0);

    baselineNodes.forEach((node, i) => {
      const nodeKey = `base-${node.id}`;
      nodes.push({
        id: nodeKey,
        x: LAYOUT_CONFIG.START_X + i * LAYOUT_CONFIG.NODE_SPACING,
        y: regions.baselineY,
        isAtMaxDepth: i >= baselineNodes.length - 2,
      });

      if (i < baselineNodes.length - 1) {
        const nextNodeKey = `base-${baselineNodes[i + 1].id}`;
        edges.push({
          id: `baseline-${i}`,
          source: nodeKey,
          target: nextNodeKey,
        });
      }
    });

    if (!expandedNodeId) {
      return { nodes, edges };
    }

    const baselineIndex = baselineNodes.findIndex(
      (node) => `base-${node.id}` === expandedNodeId
    );

    if (baselineIndex === -1) {
      return { nodes, edges };
    }

    const { nodeAnalysis, regions: leafRegions } = analyzeTree(
      expandedNodeId,
      treeStructure
    );

    if (nodeAnalysis.size === 0) {
      return { nodes, edges };
    }

    const { nodes: expandedNodes, edges: expandedEdges } = positionNodes(
      nodeAnalysis,
      leafRegions,
      baselineIndex,
      baselineNodes.length - 2,
      treeStructure
    );

    nodes.push(...expandedNodes);
    edges.push(...expandedEdges);

    const directChildren = childrenMap.get(expandedNodeId) || [];
    directChildren.forEach((child) => {
      const childKey = getNodeKey(child);
      edges.push({
        id: `${expandedNodeId}-${childKey}`,
        source: expandedNodeId,
        target: childKey,
      });
    });

    return { nodes, edges };
  };

  return { calculateLayout };
};
