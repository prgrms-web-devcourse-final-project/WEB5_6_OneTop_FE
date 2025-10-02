import {
  BaseNode,
  LayoutNode,
  LayoutEdge,
  TreeStructure,
  NodeAnalysis,
  DecisionNode,
} from "../types";

const LAYOUT_CONFIG = {
  NODE_SPACING: 300,
  START_X: 100,
  BASELINE_PADDING: 50,
  MIN_HEIGHT: 100,
  NODE_Y_SPACE: 150,
} as const;

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
        regions: { top: [], bottom: [] },
      };
    }

    const nodeAnalysis = new Map<string, NodeAnalysis>();
    const regions = { top: [] as string[], bottom: [] as string[] };

    directChildren.forEach((child, index) => {
      const region = index === 0 ? "top" : "bottom";
      const queue = [{ nodeId: child.id.toString(), depth: 1 }];
      const visited = new Set([child.id.toString()]);

      while (queue.length > 0) {
        const { nodeId, depth } = queue.shift()!;
        const children = childrenMap.get(nodeId) || [];
        const isLeaf = children.length === 0;

        nodeAnalysis.set(nodeId, { depth, region, isLeaf });

        if (isLeaf) {
          regions[region].push(nodeId);
        }

        children.forEach((childNode) => {
          const childId = childNode.id.toString();
          if (!visited.has(childId)) {
            visited.add(childId);
            queue.push({ nodeId: childId, depth: depth + 1 });
          }
        });
      }
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
    childrenMap: Map<string, (BaseNode | DecisionNode)[]>
  ): number => {
    // 리프 노드
    if (leafPositions.has(nodeId)) {
      return leafPositions.get(nodeId)!;
    }

    // 내부 노드
    const children = childrenMap.get(nodeId) || [];
    const childYPositions = children
      .map((child) => layoutNodesMap.get(child.id.toString())?.y)
      .filter((posY): posY is number => posY !== undefined);

    // 자식 1 - 자식의 Y
    if (childYPositions.length === 1) {
      return childYPositions[0];
    }

    // 자식 2 - 자식들의 중앙
    if (childYPositions.length === 2) {
      return childYPositions.reduce((sum, pos) => sum + pos, 0) / 2;
    }

    // 자식 3개 - 가운데 자식의 Y
    if (childYPositions.length === 3) {
      return childYPositions[1];
    }

    // 자식 없음 - 영역 중앙
    return analysis.region === "top"
      ? yRegions.topRegion.start + yRegions.topRegion.height / 2
      : yRegions.bottomRegion.start + yRegions.bottomRegion.height / 2;
  };

  // 노드 배치
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

    // 리프 노드 위치 계산
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

    // 위치 계산 (리프 → 루트)
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

    // edges 생성
    nodeAnalysis.forEach((_analysis, nodeId) => {
      const children = childrenMap.get(nodeId) || [];
      children.forEach((child) => {
        layoutEdges.push({
          id: `${nodeId}-${child.id}`,
          source: nodeId,
          target: child.id.toString(),
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

    // 베이스라인 노드 배치
    const regions = calculateRegions(0, 0);
    baselineNodes.forEach((node, i) => {
      nodes.push({
        id: node.id.toString(),
        x: LAYOUT_CONFIG.START_X + i * LAYOUT_CONFIG.NODE_SPACING,
        y: regions.baselineY,
        isAtMaxDepth: i === baselineNodes.length - 1,
      });

      if (i < baselineNodes.length - 1) {
        edges.push({
          id: `baseline-${i}`,
          source: node.id.toString(),
          target: baselineNodes[i + 1].id.toString(),
        });
      }
    });

    if (!expandedNodeId) return { nodes, edges };

    const baselineIndex = baselineNodes.findIndex(
      (node) => node.id.toString() === expandedNodeId
    );
    if (baselineIndex === -1) return { nodes, edges };

    const { nodeAnalysis, regions: leafRegions } = analyzeTree(
      expandedNodeId,
      treeStructure
    );

    if (nodeAnalysis.size === 0) return { nodes, edges };

    const { nodes: expandedNodes, edges: expandedEdges } = positionNodes(
      nodeAnalysis,
      leafRegions,
      baselineIndex,
      baselineNodes.length - 1,
      treeStructure
    );

    nodes.push(...expandedNodes);
    edges.push(...expandedEdges);

    // 베이스라인 → 첫 자식 연결
    const directChildren = childrenMap.get(expandedNodeId) || [];
    directChildren.forEach((child) => {
      edges.push({
        id: `${expandedNodeId}-${child.id}`,
        source: expandedNodeId,
        target: child.id.toString(),
      });
    });

    return { nodes, edges };
  };

  return { calculateLayout };
};
