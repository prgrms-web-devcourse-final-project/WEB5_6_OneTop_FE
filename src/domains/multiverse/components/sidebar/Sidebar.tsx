import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { BaseNode, DecisionNode } from "../../types";
import { IoClose } from "react-icons/io5";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: BaseNode | DecisionNode | null;
  parentNode: BaseNode | DecisionNode | null;
  childNodes: (BaseNode | DecisionNode)[];
  onNavigateToParent: () => void;
  onNavigateToChild: (childId: string) => void;
  isBaselineNode: boolean;
  isAtMaxDepth: boolean;
}

const Sidebar = ({
  isOpen,
  onClose,
  selectedNode,
  parentNode,
  childNodes,
  onNavigateToParent,
  onNavigateToChild,
  isBaselineNode,
  isAtMaxDepth,
}: SidebarProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !selectedNode) return null;

  const handleRedirect = () => {
    router.push(`/scenarios`);
    onClose();
  };

  const handleChoiceSubmit = () => {
    const value = inputRef.current?.value.trim();
    if (!value) return;

    console.log("새 선택지:", value);
    inputRef.current!.value = "";
  };

  const getMaxSlots = () => {
    if (isAtMaxDepth) return 1;
    return isBaselineNode ? 2 : 3;
  };

  const canAddNode = () => {
    return childNodes.length < getMaxSlots();
  };

  const showInputSection = () => {
    return (
      (isAtMaxDepth && childNodes.length === 0) ||
      (!isAtMaxDepth && canAddNode())
    );
  };

  return (
    <div
      className={`
        fixed left-0 top-15 h-[calc(100vh-64px)] w-100 bg-midnight-blue text-white z-10 transition-transform duration-300 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition-colors"
      >
        <IoClose className="w-6 h-6" />
      </button>

      <div className="p-10 h-full flex flex-col">
        <div className="flex-1 space-y-6">
          {/* 선택상황 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">선택상황</h4>
            {selectedNode.situation && <p>{selectedNode.situation}</p>}
            <hr className="border-gray-500 mt-4" />
          </div>

          {/* 이전선택 */}
          {parentNode && (
            <div>
              <h4 className="text-lg font-semibold mb-4">이전선택</h4>
              <div className="p-3 bg-slate-700 rounded-lg border-1 border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    {"decision" in parentNode && parentNode.decision && (
                      <p>{parentNode.decision}</p>
                    )}
                  </div>
                  <button
                    onClick={onNavigateToParent}
                    className="text-gray-400 hover:text-gray-200 text-xs transition-colors"
                  >
                    해당 선택지로 이동
                  </button>
                </div>
              </div>
              <hr className="border-gray-500 mt-4" />
            </div>
          )}

          {/* 슬롯 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">선택지</h4>
            <div className="space-y-3">
              {Array.from({ length: getMaxSlots() }, (_, index) => {
                const child = childNodes[index];
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-1 ${
                      child
                        ? "bg-slate-700 border-slate-600"
                        : "border-dashed border-slate-600"
                    }`}
                  >
                    {child ? (
                      <div className="flex items-center justify-between">
                        <div>
                          {"decision" in child && child.decision && (
                            <p>{child.decision}</p>
                          )}
                        </div>
                        <button
                          onClick={() => onNavigateToChild(child.id.toString())}
                          className="text-gray-400 hover:text-gray-200 text-xs transition-colors"
                        >
                          해당 선택지로 이동
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
                );
              })}
            </div>
            <hr className="border-gray-600 mt-4" />
          </div>

          {/* 추가선택지 입력 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">추가선택지 입력</h4>
            {showInputSection() ? (
              <>
                <p className="text-xs text-slate-400 mb-3">
                  {isAtMaxDepth
                    ? "마지막 선택지를 입력하세요. 선택을 결정한다면 선택지는 수정할 수 없습니다."
                    : "선택을 결정한다면 선택지는 수정할 수 없습니다."}
                </p>
                <div className="space-y-3">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="선택지를 입력하세요"
                    className="w-full p-2 bg-slate-700 border-1 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-slate-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleChoiceSubmit();
                      }
                    }}
                  />
                  <button
                    onClick={handleChoiceSubmit}
                    className="w-full p-2 bg-gray-400 hover:bg-gray-500 rounded-lg text-sm transition-colors"
                  >
                    결정하기
                  </button>
                </div>
              </>
            ) : (
              <p className="text-slate-400 text-sm">
                모든 선택지를 입력했습니다.
              </p>
            )}
            <hr className="border-gray-500 mt-4" />
          </div>
        </div>

        {/* 하단 버튼 - 최대 깊이이고 슬롯이 채워졌을 때 */}
        {isAtMaxDepth && (
          <div className="mt-6">
            <button
              onClick={handleRedirect}
              className="w-full p-2 bg-gray-400 hover:bg-gray-500 rounded-lg text-sm transition-colors"
            >
              상세 페이지로 이동
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
