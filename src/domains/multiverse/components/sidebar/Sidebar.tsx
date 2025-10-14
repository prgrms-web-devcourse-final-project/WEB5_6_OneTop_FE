import React, { useRef } from "react";
import {
  DecisionNode,
  VirtualNode,
  TreeNode,
  CreateNodeRequest,
  TreeStructure,
} from "../../types";
import { IoClose } from "react-icons/io5";
import { useCreateNode } from "../../hooks/useCreateNode";
import { useAuthUser } from "@/domains/auth/api/useAuthUser";
import { createScenarioWithDecision } from "../../api/tree";
import LoadingOverlay from "./LoadingOverlay";
import ScenarioLinkButtons from "./ScenarioLinkButtons";
import EndingBaseNodeView from "./EndingBaseNodeVIew";
import BaseNodeHeaderView from "./BaseNodeHeaderView";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: { id: string; data: TreeNode & Record<string, unknown> } | null;
  branchChoices: DecisionNode[];
  navigateToNode: (nodeId: string) => void;
  isBaselineNode: boolean;
  isAtMaxDepth: boolean;
  baselineId: number;
  onNodeCreated: (newNode: DecisionNode) => void;
  treeStructure: TreeStructure | null;
}

const Sidebar = ({
  isOpen,
  onClose,
  selectedNode,
  branchChoices,
  navigateToNode,
  isBaselineNode,
  isAtMaxDepth,
  baselineId,
  onNodeCreated,
  treeStructure,
}: SidebarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: user, isLoading } = useAuthUser();
  const { mutate: createNode, isPending } = useCreateNode();
  const router = useRouter();

  const isHeaderNode = selectedNode?.data?.isHeaderNode ?? false;
  const isEndingNode = selectedNode?.data?.isEndingNode ?? false;
  const isPreEndingBaseNode = selectedNode?.data?.isPreEndingBaseNode ?? false;

  // 슬롯 계산
  const getMaxSlots = () => {
    if (isAtMaxDepth) return 1;
    return isBaselineNode ? 2 : 3;
  };

  const canAddNode = () => {
    if (selectedNode?.data.type === "DECISION") {
      return 1 + branchChoices.length < getMaxSlots();
    }
    return branchChoices.length < getMaxSlots();
  };

  const showInputSection = () => {
    if (isAtMaxDepth && selectedNode?.data.type === "DECISION") {
      return false;
    }
    if (isPreEndingBaseNode) {
      return false;
    }
    if (isAtMaxDepth) {
      return branchChoices.length === 0;
    }
    return canAddNode();
  };

  const getDisplayChoices = (): (DecisionNode | null)[] => {
    if (!selectedNode) return [];

    if (selectedNode.data.type !== "DECISION") {
      return Array.from(
        { length: getMaxSlots() },
        (_, index) => branchChoices[index] || null
      );
    }

    const decNode = selectedNode.data as DecisionNode;
    const allChoices = [decNode, ...branchChoices];
    return Array.from(
      { length: getMaxSlots() },
      (_, index) => allChoices[index] || null
    );
  };

  // 네비게이션
  const getDisplayParentNode = (): TreeNode | null => {
    if (!selectedNode || !treeStructure) return null;

    const selectedNodeId = selectedNode.id;

    if (selectedNode.data.type === "VIRTUAL") {
      const virtualNode = selectedNode.data as VirtualNode;
      const parentDecNode = treeStructure.nodeMap.get(
        `dec-${virtualNode.parentDecisionNodeId}`
      ) as DecisionNode | undefined;

      if (!parentDecNode) return null;

      if (parentDecNode.incomingEdgeType === "normal") {
        return parentDecNode;
      }

      if (parentDecNode.incomingEdgeType === "from-base") {
        const baseNodeId = `base-${parentDecNode.pivotLinkBaseNodeId}`;
        return treeStructure.nodeMap.get(baseNodeId) || null;
      }

      if (parentDecNode.incomingEdgeType === "fork") {
        const originalId = parentDecNode.pivotLinkDecisionNodeId;
        if (originalId) {
          const originalNode = treeStructure.nodeMap.get(
            `dec-${originalId}`
          ) as DecisionNode | undefined;

          if (originalNode?.incomingEdgeType === "normal") {
            return originalNode;
          } else if (originalNode?.incomingEdgeType === "from-base") {
            const baseNodeId = `base-${originalNode.pivotLinkBaseNodeId}`;
            return treeStructure.nodeMap.get(baseNodeId) || null;
          }
        }
      }

      return parentDecNode;
    }

    for (const [parentKey, children] of treeStructure.childrenMap.entries()) {
      const hasChild = children.some((child) => {
        if (child.type === "VIRTUAL") return child.id === selectedNodeId;
        if (child.type === "DECISION")
          return `dec-${child.id}` === selectedNodeId;
        if (child.type === "BASE") return `base-${child.id}` === selectedNodeId;
        return false;
      });

      if (hasChild) {
        return treeStructure.nodeMap.get(parentKey) || null;
      }
    }

    return null;
  };

  const getActualParentNode = (): TreeNode | null => {
    if (!selectedNode || !treeStructure) return null;

    if (selectedNode.data.type === "VIRTUAL") {
      const virtualNode = selectedNode.data as VirtualNode;
      return (
        treeStructure.nodeMap.get(`dec-${virtualNode.parentDecisionNodeId}`) ||
        null
      );
    }

    if (selectedNode.data.type === "DECISION") {
      const decNode = selectedNode.data as DecisionNode;
      if (decNode.incomingEdgeType === "normal" && decNode.parentId) {
        return treeStructure.nodeMap.get(`dec-${decNode.parentId}`) || null;
      }
    }

    for (const [parentKey, children] of treeStructure.childrenMap.entries()) {
      const hasChild = children.some((child) => {
        if (child.type === "VIRTUAL") return child.id === selectedNode.id;
        if (child.type === "DECISION")
          return `dec-${child.id}` === selectedNode.id;
        if (child.type === "BASE")
          return `base-${child.id}` === selectedNode.id;
        return false;
      });

      if (hasChild) {
        return treeStructure.nodeMap.get(parentKey) || null;
      }
    }

    return null;
  };

  const getNavigationTarget = (displayChoice: DecisionNode): string => {
    if (!treeStructure) return `dec-${displayChoice.id}`;

    if (
      displayChoice.incomingEdgeType === "from-base" ||
      displayChoice.incomingEdgeType === "fork"
    ) {
      const parentKey =
        displayChoice.incomingEdgeType === "from-base"
          ? `base-${displayChoice.pivotLinkBaseNodeId}`
          : `dec-${displayChoice.pivotLinkDecisionNodeId}`;

      const siblings = treeStructure.childrenMap.get(parentKey) || [];

      const nextChild = siblings.find(
        (c) =>
          c.type === "DECISION" &&
          (c as DecisionNode).parentId === displayChoice.id &&
          (c as DecisionNode).incomingEdgeType === "normal"
      ) as DecisionNode | undefined;

      if (nextChild) return `dec-${nextChild.id}`;

      const virtualId = `virtual-${displayChoice.id}`;
      const virtualChild = siblings.find(
        (c) => c.type === "VIRTUAL" && c.id === virtualId
      ) as VirtualNode | undefined;

      if (virtualChild) return virtualId;

      return `dec-${displayChoice.id}`;
    }

    if (displayChoice.incomingEdgeType === "normal") {
      const nodeKey = `dec-${displayChoice.id}`;
      const children = treeStructure.childrenMap.get(nodeKey) || [];

      const nextChild = children.find(
        (c) =>
          c.type === "DECISION" &&
          (c as DecisionNode).parentId === displayChoice.id &&
          (c as DecisionNode).incomingEdgeType === "normal"
      ) as DecisionNode | undefined;

      if (nextChild) return `dec-${nextChild.id}`;

      const virtualId = `virtual-${displayChoice.id}`;
      const virtualChild = children.find(
        (c) => c.type === "VIRTUAL" && c.id === virtualId
      ) as VirtualNode | undefined;

      if (virtualChild) return virtualId;

      return nodeKey;
    }

    return `dec-${displayChoice.id}`;
  };

  const handleGoToParent = () => {
    const displayParent = getDisplayParentNode();
    if (!displayParent) return;

    let parentId: string;

    if (displayParent.type === "BASE") {
      parentId = `base-${displayParent.id}`;
    } else if (displayParent.type === "DECISION") {
      parentId = `dec-${(displayParent as DecisionNode).id}`;
    } else if (displayParent.type === "VIRTUAL") {
      parentId = (displayParent as VirtualNode).id;
    } else {
      return;
    }

    navigateToNode(parentId);
  };

  const handleSlotNavigation = (choice: DecisionNode) => {
    const targetId = getNavigationTarget(choice);
    navigateToNode(targetId);
  };

  // AI 추천
  const getParentRecommendation = (): string | null => {
    if (!selectedNode || !treeStructure) return null;
    if (selectedNode.data.type !== "DECISION") return null;

    const decNode = selectedNode.data as DecisionNode;
    if (decNode.incomingEdgeType === "fork") {
      const originalDecNode = treeStructure.nodeMap.get(
        `dec-${decNode.pivotLinkDecisionNodeId}`
      ) as DecisionNode | undefined;

      if (originalDecNode?.incomingEdgeType === "from-base") {
        return null;
      }
    }

    if (decNode.incomingEdgeType === "normal" && decNode.parentId) {
      const parentDecNode = treeStructure.nodeMap.get(
        `dec-${decNode.parentId}`
      ) as DecisionNode | undefined;
      return parentDecNode?.aiNextRecommendedOption || null;
    }

    return null;
  };

  // 노드 생성
  const handleChoiceSubmit = () => {
    if (!selectedNode || !user?.data?.id) return;

    const value = inputRef.current?.value.trim();
    if (!value || isPending) return;

    let requestData: CreateNodeRequest;

    if (isBaselineNode) {
      const existingChoices = branchChoices
        .map((decNode) => decNode.decision)
        .filter((choice): choice is string => choice !== null);

      const allOptions = [...existingChoices, value];
      const selectedIndex = existingChoices.length;

      requestData = {
        isBaseline: true as const,
        userId: user.data.id,
        baseLineId: baselineId,
        pivotOrd: null,
        pivotAge: selectedNode.data.ageYear,
        selectedAltIndex: selectedIndex,
        category: selectedNode.data.category,
        situation: selectedNode.data.situation,
        options: allOptions,
        selectedIndex,
        description: "",
      };
    } else if (selectedNode.data.type === "VIRTUAL") {
      const virtualNode = selectedNode.data as VirtualNode;

      requestData = {
        isBaseline: false as const,
        userId: user.data.id,
        parentDecisionNodeId: virtualNode.parentDecisionNodeId,
        category: virtualNode.category || "",
        situation: virtualNode.situation || "",
        ageYear: virtualNode.ageYear,
        options: [value],
        selectedIndex: 0,
        parentOptionIndex: null,
        description: "",
      };
    } else if (selectedNode.data.type === "DECISION") {
      const decNode = selectedNode.data as DecisionNode;
      const originalDecision = decNode.decision;

      const existingForks = branchChoices
        .map((forkNode) => forkNode.decision)
        .filter((choice): choice is string => choice !== null);

      const allOptions = [originalDecision, ...existingForks, value];
      const selectedIndex = 1 + existingForks.length;

      requestData = {
        isFork: true as const,
        userId: user.data.id,
        parentDecisionNodeId: decNode.id,
        category: decNode.category,
        situation: decNode.situation,
        options: allOptions,
        selectedIndex,
        targetOptionIndex: selectedIndex,
        description: "",
      };
    } else {
      return;
    }

    createNode(requestData, {
      onSuccess: (newNode: DecisionNode | DecisionNode[]) => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        const nodeData = Array.isArray(newNode) ? newNode[0] : newNode;
        onNodeCreated(nodeData);
      },
      onError: (error: Error) => {
        console.error("노드 생성 실패:", error);
      },
    });
  };

  const handleCreateScenario = async () => {
    if (!selectedNode || !inputRef.current || !user?.data?.id) return;

    const lastDecisionValue = inputRef.current.value.trim();
    if (!lastDecisionValue) return;

    const decisionLineId =
      selectedNode.data.type === "VIRTUAL"
        ? (selectedNode.data as VirtualNode).decisionLineId
        : selectedNode.data.type === "DECISION"
        ? (selectedNode.data as DecisionNode).decisionLineId
        : null;

    if (!decisionLineId) {
      alert("decisionLineId를 찾을 수 없습니다.");
      return;
    }

    const parentDecisionNodeId =
      selectedNode.data.type === "VIRTUAL"
        ? (selectedNode.data as VirtualNode).parentDecisionNodeId
        : null;

    if (!parentDecisionNodeId) {
      alert("parentDecisionNodeId를 찾을 수 없습니다.");
      return;
    }

    try {
      const data = await createScenarioWithDecision({
        scenario: { decisionLineId: Number(decisionLineId) },
        lastDecision: {
          userId: user.data.id,
          parentDecisionNodeId: parentDecisionNodeId,
          category: null,
          situation: selectedNode.data.situation || "",
          ageYear: selectedNode.data.ageYear || 0,
          options: [lastDecisionValue],
          selectedIndex: 0,
          parentOptionIndex: 0,
          description: "",
        },
      });

      if (data?.scenarioId) {
        router.push(`/scenarios?scenarioId=${data.scenarioId}`);
      } else {
        alert("시나리오 ID를 가져오지 못했습니다.");
      }
    } catch (error) {
      console.error("시나리오 생성 실패:", error);
      alert("시나리오 생성 중 오류가 발생했습니다.");
    }
  };

  // AI 추천 클릭 핸들러
  const handleRecommendationClick = (recommendation: string) => {
    if (!inputRef.current || isPending) return;

    inputRef.current.value = recommendation;

    if (isAtMaxDepth) {
      handleCreateScenario();
    } else {
      handleChoiceSubmit();
    }
  };

  // 계산 값
  const displayChoices = getDisplayChoices();
  const actualParent = getActualParentNode();
  const parentRecommendation = getParentRecommendation();
  const virtualRecommendation =
    selectedNode?.data.type === "VIRTUAL"
      ? (selectedNode.data as VirtualNode).aiNextRecommendedOption
      : null;
  const usedDecisions = new Set(
    [
      selectedNode?.data.decision,
      ...branchChoices.map((c) => c.decision),
    ].filter(Boolean)
  );

  if (!isOpen || !selectedNode) return null;

  if (isLoading || !user?.data?.id) {
    return <div>사용자 정보 로딩 중...</div>;
  }

  if (isHeaderNode) {
    return <BaseNodeHeaderView isOpen={isOpen} onClose={onClose} />;
  }

  if (isEndingNode && selectedNode.data.type === "BASE") {
    return <EndingBaseNodeView isOpen={isOpen} onClose={onClose} />;
  }

  return (
    <>
      <div
        className={`fixed left-0 top-15 h-[calc(100vh-64px)] w-100 bg-midnight-blue text-white z-10 transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <IoClose className="w-6 h-6" />
        </button>

        <div className="p-10 h-full flex flex-col">
          <div className="flex-1 space-y-6">
            {/* 선택상황 섹션 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">선택상황</h4>
              <p className="text-xs text-slate-400 mb-2">
                나이: {selectedNode.data.ageYear}세
              </p>

              {selectedNode.data.situation && (
                <p>{selectedNode.data.situation}</p>
              )}

              {selectedNode.data.type === "VIRTUAL" &&
                !selectedNode.data.situation && (
                  <p className="text-slate-400 italic">
                    다음 선택을 기다리고 있습니다...
                  </p>
                )}

              {/* AI 추천 - VirtualNode */}
              {selectedNode.data.type === "VIRTUAL" &&
                virtualRecommendation && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-400 mb-2">
                      💡 AI 추천 선택지
                    </p>
                    <button
                      onClick={() =>
                        handleRecommendationClick(virtualRecommendation)
                      }
                      disabled={isPending}
                      className="w-full p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm text-left transition-colors disabled:opacity-50"
                    >
                      {virtualRecommendation}
                    </button>
                  </div>
                )}

              {/* AI 추천 - DecisionNode */}
              {selectedNode.data.type === "DECISION" &&
                parentRecommendation &&
                !usedDecisions.has(parentRecommendation) && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-400 mb-2">
                      💡 AI 추천 선택지
                    </p>
                    <button
                      onClick={() =>
                        handleRecommendationClick(parentRecommendation)
                      }
                      disabled={isPending}
                      className="w-full p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm text-left transition-colors disabled:opacity-50"
                    >
                      {parentRecommendation}
                    </button>
                  </div>
                )}
              <hr className="border-gray-500 mt-4" />
            </div>

            {/* 이전선택 섹션 */}
            {actualParent && (
              <div>
                <h4 className="text-lg font-semibold mb-4">이전선택</h4>
                <div className="p-3 bg-slate-700 rounded-lg border-1 border-slate-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">
                        {actualParent.ageYear}세
                      </p>
                      {actualParent.decision && <p>{actualParent.decision}</p>}
                      {actualParent.situation && (
                        <p className="text-sm text-slate-300 mt-1">
                          {actualParent.situation}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleGoToParent}
                      className="text-gray-400 hover:text-gray-200 text-xs transition-colors"
                    >
                      이전 선택으로 이동
                    </button>
                  </div>
                </div>
                <hr className="border-gray-500 mt-4" />
              </div>
            )}

            {/* 결말 노드가 아닐 때만 표시 */}
            {!isEndingNode && (
              <>
                {/* BaseNode 현재 결정 */}
                {isBaselineNode && selectedNode.data.decision && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">현재 결정</h4>
                    <div className="p-3 bg-slate-700 rounded-lg border-1 border-slate-600">
                      <p className="text-xs text-slate-400 mb-1">
                        {selectedNode.data.ageYear}세
                      </p>
                      <p>{selectedNode.data.decision}</p>
                    </div>
                    <hr className="border-gray-600 mt-4" />
                  </div>
                )}

                {/* 선택지 슬롯 */}
                {!isPreEndingBaseNode && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">선택지</h4>
                    <div className="space-y-3">
                      {displayChoices.map((choice, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border-1 ${
                            choice
                              ? "bg-slate-700 border-slate-600"
                              : "border-dashed border-slate-600"
                          }`}
                        >
                          {choice ? (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                {choice.decision && <p>{choice.decision}</p>}
                              </div>
                              <button
                                onClick={() => handleSlotNavigation(choice)}
                                className="text-gray-400 hover:text-gray-200 text-xs transition-colors ml-2"
                              >
                                해당 선택으로 이동
                              </button>
                            </div>
                          ) : (
                            <div className="w-full text-center">
                              <p className="text-gray-500 text-sm">
                                빈 슬롯 {index + 1}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <hr className="border-gray-600 mt-4" />
                  </div>
                )}

                {/* 추가선택지 입력 */}
                {!isPreEndingBaseNode && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      추가선택지 입력
                    </h4>
                    {showInputSection() ? (
                      <>
                        <p className="text-xs text-slate-400 mb-3">
                          {isAtMaxDepth
                            ? "마지막 선택을 입력하세요."
                            : "선택을 결정한다면 선택지는 수정할 수 없습니다."}
                        </p>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (isAtMaxDepth) {
                              handleCreateScenario();
                            } else {
                              handleChoiceSubmit();
                            }
                          }}
                          className="space-y-3"
                        >
                          <input
                            ref={inputRef}
                            type="text"
                            placeholder="선택지를 입력하세요"
                            disabled={isPending}
                            className="w-full p-2 bg-slate-700 border-1 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 disabled:opacity-50"
                          />
                          {!isAtMaxDepth && (
                            <button
                              type="submit"
                              disabled={isPending}
                              className="w-full p-2 bg-gray-400 hover:bg-gray-500 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isPending ? "AI 분석 중..." : "결정하기"}
                            </button>
                          )}
                        </form>
                      </>
                    ) : (
                      <p className="text-slate-400 text-sm">
                        모든 선택지를 입력했습니다.
                      </p>
                    )}
                    <hr className="border-gray-500 mt-4" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* 결말 노드 전용 버튼 */}
          {isEndingNode && (
            <ScenarioLinkButtons
              decisionLineId={
                (selectedNode.data as DecisionNode).decisionLineId
              }
            />
          )}

          {/* 시나리오 생성 버튼 */}
          {!isEndingNode && isAtMaxDepth && showInputSection() && (
            <div className="mt-6">
              <button
                onClick={handleCreateScenario}
                className="w-full p-2 bg-deep-navy rounded-lg text-sm transition-colors"
              >
                시나리오 생성
              </button>
            </div>
          )}
        </div>
      </div>

      <LoadingOverlay isPending={isPending} />
    </>
  );
};

export default Sidebar;
