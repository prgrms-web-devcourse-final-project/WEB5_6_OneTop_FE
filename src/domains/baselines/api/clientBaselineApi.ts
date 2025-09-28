// 클라이언트 사이드 API (기존 axios 방식 유지)
import { api } from "@/share/config/api";
import {
  LifeEvent,
  BaseNodeDto,
  BaseLineBulkCreateRequest,
  BaseLineBulkCreateResponse,
  PivotListDto,
  TreeDto,
  DecisionFromBaseRequest,
  DecisionFromBaseResponse,
  DecisionNextRequest,
  DecisionNextResponse,
  DecisionLineDto,
  NodeCategory,
} from "../types";

// 카테고리 매핑
const categoryMapping: Record<string, NodeCategory> = {
  교육: NodeCategory.EDUCATION,
  직업: NodeCategory.CAREER,
  관계: NodeCategory.RELATIONSHIP,
  경제: NodeCategory.FINANCE,
  건강: NodeCategory.HEALTH,
  행복: NodeCategory.HAPPINESS,
  기타: NodeCategory.ETC,
};

// 백엔드 NodeCategory에서 프론트엔드 카테고리로 역방향 매핑
const reverseCategoryMapping: Record<NodeCategory, LifeEvent["category"]> = {
  [NodeCategory.EDUCATION]: "교육",
  [NodeCategory.CAREER]: "직업",
  [NodeCategory.RELATIONSHIP]: "관계",
  [NodeCategory.FINANCE]: "경제",
  [NodeCategory.HEALTH]: "건강",
  [NodeCategory.HAPPINESS]: "행복",
  [NodeCategory.ETC]: "기타",
};

// BaseNodeDto를 LifeEvent로 변환
const convertNodeToEvent = (node: BaseNodeDto): LifeEvent => {
  return {
    id: node.id.toString(),
    year: new Date().getFullYear() - (25 - node.ageYear), // 임시 계산
    age: node.ageYear,
    category: reverseCategoryMapping[node.category] || "기타",
    eventTitle: node.situation,
    actualChoice: node.decision,
    context: "",
    createdAt: new Date(),
    baseLineId: node.baseLineId,
    title: node.title,
  };
};

// Class 대신 함수형으로 변경
export const clientBaselineApi = {
  // 베이스라인 일괄 생성 (axios 사용)
  createBaseLine: async (
    events: Array<{
      year: number;
      age: number;
      category: string;
      eventTitle: string;
      actualChoice: string;
      context?: string;
    }>,
    title?: string,
    userId: number = 1
  ): Promise<LifeEvent[]> => {
    try {
      console.log("베이스라인 생성 시작:", { events, title, userId });

      const request: BaseLineBulkCreateRequest = {
        userId,
        title: title || "",
        //   nodes: events.map((event) => ({
        //     category: categoryMapping[event.category] || NodeCategory.ETC,
        //     situation: event.eventTitle,
        //     decision: event.actualChoice,
        //     ageYear: event.age,
        //   })),
        // };
        nodes:
          events.length === 1
            ? [
                // 원래 노드
                ...events.map((event) => ({
                  category: categoryMapping[event.category] || NodeCategory.ETC,
                  situation: event.eventTitle,
                  decision: event.actualChoice,
                  ageYear: event.age,
                })),
                // 임시 더미 노드 추가
                {
                  category: NodeCategory.ETC,
                  situation: "임시 테스트 상황",
                  decision: "임시 테스트 결정",
                  ageYear: events[0].age + 1,
                },
              ]
            : events.map((event) => ({
                category: categoryMapping[event.category] || NodeCategory.ETC,
                situation: event.eventTitle,
                decision: event.actualChoice,
                ageYear: event.age,
              })),
      };

      console.log("백엔드 요청 데이터:", request);

      // axios 인터셉터가 자동으로 쿠키 처리
      const response: BaseLineBulkCreateResponse = await api.post(
        "/api/v1/base-lines/bulk",
        request
      );

      console.log("백엔드 응답:", response);

      if (response && response.baseLineId) {
        // 생성된 베이스라인의 노드들을 다시 조회
        const nodes = await clientBaselineApi.getBaseLineNodes(
          response.baseLineId
        );
        console.log("조회된 노드들:", nodes);
        return nodes;
      }
      throw new Error("베이스라인 응답에서 baseLineId를 찾을 수 없습니다");
    } catch (error) {
      console.error("베이스라인 생성 상세 에러:", error);

      // axios 에러인 경우 더 자세한 정보 출력
      // if (error.response) {
      //   console.error("응답 에러 상세:", {
      //     status: error.response.status,
      //     statusText: error.response.statusText,
      //     data: error.response.data,
      //     headers: error.response.headers,
      //   });

      //   // 400 에러인 경우 백엔드 검증 메시지 표시
      //   if (error.response.status === 400) {
      //     const errorMessage =
      //       error.response.data?.message ||
      //       error.response.data?.detail ||
      //       JSON.stringify(error.response.data);
      //     throw new Error(`백엔드 검증 실패: ${errorMessage}`);
      //   }
      // } else if (error.request) {
      //   console.error("요청 에러:", error.request);
      // } else {
      //   console.error("일반 에러:", error.message);
      // }

      throw new Error(`베이스라인 생성에 실패했습니다: ${error}`);
    }
  },

  // 특정 베이스라인의 노드 목록 조회 (axios 사용)
  getBaseLineNodes: async (baseLineId: number): Promise<LifeEvent[]> => {
    try {
      const response: BaseNodeDto[] = await api.get(
        `/api/v1/base-lines/${baseLineId}/nodes`
      );

      if (Array.isArray(response)) {
        return response.map(convertNodeToEvent);
      }
      return [];
    } catch (error) {
      console.error("베이스라인 노드 조회 실패:", error);
      throw new Error("베이스라인 노드를 불러오는데 실패했습니다.");
    }
  },

  // 사용자의 첫 번째 베이스라인 조회
  getBaseLine: async (userId: number = 1): Promise<LifeEvent[]> => {
    try {
      // 실제로는 사용자의 베이스라인 목록을 먼저 조회해야 함
      // 현재는 임시로 baseLineId 1을 사용
      const baseLineId = 1; // 실제로는 사용자의 첫 번째 베이스라인 ID를 가져와야 함

      return await clientBaselineApi.getBaseLineNodes(baseLineId);
    } catch (error) {
      console.error("베이스라인 조회 실패:", error);
      // 베이스라인이 없는 경우 빈 배열 반환
      return [];
    }
  },

  // 단일 노드 조회 (axios 사용)
  getNode: async (nodeId: number): Promise<LifeEvent> => {
    try {
      const response: BaseNodeDto = await api.get(
        `/api/v1/base-lines/nodes/${nodeId}`
      );

      if (response) {
        return convertNodeToEvent(response);
      }
      throw new Error("노드 조회 실패");
    } catch (error) {
      console.error("노드 조회 실패:", error);
      throw new Error("분기점을 불러오는데 실패했습니다.");
    }
  },

  // 노드 수정 (현재 API 명세에 없음)
  updateNode: async (
    nodeId: string,
    eventData: {
      year: number;
      age: number;
      category: string;
      eventTitle: string;
      actualChoice: string;
      context?: string;
    }
  ): Promise<LifeEvent> => {
    throw new Error(
      "현재 노드 수정 기능이 지원되지 않습니다. 전체 베이스라인을 다시 생성해주세요."
    );
  },

  // 노드 삭제 (현재 API 명세에 없음)
  deleteNode: async (nodeId: string): Promise<void> => {
    throw new Error(
      "현재 노드 삭제 기능이 지원되지 않습니다. 전체 베이스라인을 다시 생성해주세요."
    );
  },

  // 베이스라인 제출 (현재 API 명세에 없음)
  submitBaseLine: async (nodeIds: string[]): Promise<void> => {
    // 현재 API 명세에 제출 엔드포인트가 없으므로 로그만 출력
    console.log("베이스라인 제출:", nodeIds);
    // 실제로는 별도의 상태 변경 API가 필요할 수 있음
  },

  // 피벗 목록 조회 (axios 사용)
  getPivots: async (baseLineId: number): Promise<PivotListDto> => {
    try {
      const response: PivotListDto = await api.get(
        `/api/v1/base-lines/${baseLineId}/pivots`
      );
      return response;
    } catch (error) {
      console.error("피벗 조회 실패:", error);
      throw new Error("피벗을 불러오는데 실패했습니다.");
    }
  },

  // 베이스라인 전체 트리 조회 (axios 사용)
  getBaseLineTree: async (baseLineId: number): Promise<TreeDto> => {
    try {
      const response: TreeDto = await api.get(
        `/api/v1/base-lines/${baseLineId}/tree`
      );
      return response;
    } catch (error) {
      console.error("트리 조회 실패:", error);
      throw new Error("트리를 불러오는데 실패했습니다.");
    }
  },

  // Decision Flow - From Base (axios 사용)
  createDecisionFromBase: async (
    data: DecisionFromBaseRequest
  ): Promise<DecisionFromBaseResponse> => {
    try {
      const response: DecisionFromBaseResponse = await api.post(
        "/api/v1/decision-flow/from-base",
        data
      );
      return response;
    } catch (error) {
      console.error("Decision From Base 생성 실패:", error);
      throw new Error("첫 번째 결정 생성에 실패했습니다.");
    }
  },

  // Decision Flow - Next (axios 사용)
  createDecisionNext: async (
    data: DecisionNextRequest
  ): Promise<DecisionNextResponse> => {
    try {
      const response: DecisionNextResponse = await api.post(
        "/api/v1/decision-flow/next",
        data
      );
      return response;
    } catch (error) {
      console.error("Decision Next 생성 실패:", error);
      throw new Error("다음 결정 생성에 실패했습니다.");
    }
  },

  // Decision Line 완료/취소 (axios 사용)
  completeDecisionLine: async (decisionLineId: number): Promise<void> => {
    try {
      await api.post(`/api/v1/decision-flow/${decisionLineId}/complete`);
    } catch (error) {
      console.error("Decision Line 완료 실패:", error);
      throw new Error("결정 라인 완료에 실패했습니다.");
    }
  },

  cancelDecisionLine: async (decisionLineId: number): Promise<void> => {
    try {
      await api.post(`/api/v1/decision-flow/${decisionLineId}/cancel`);
    } catch (error) {
      console.error("Decision Line 취소 실패:", error);
      throw new Error("결정 라인 취소에 실패했습니다.");
    }
  },

  // Decision Lines 조회 (axios 사용)
  getDecisionLines: async (userId: number): Promise<DecisionLineDto[]> => {
    try {
      const response: DecisionLineDto[] = await api.get(
        `/api/v1/decision-lines?userId=${userId}`
      );
      return response;
    } catch (error) {
      console.error("Decision Lines 조회 실패:", error);
      throw new Error("결정 라인 목록 조회에 실패했습니다.");
    }
  },

  getDecisionLineDetail: async (
    decisionLineId: number
  ): Promise<DecisionLineDto> => {
    try {
      const response: DecisionLineDto = await api.get(
        `/api/v1/decision-lines/${decisionLineId}`
      );
      return response;
    } catch (error) {
      console.error("Decision Line 상세 조회 실패:", error);
      throw new Error("결정 라인 상세 조회에 실패했습니다.");
    }
  },
};
