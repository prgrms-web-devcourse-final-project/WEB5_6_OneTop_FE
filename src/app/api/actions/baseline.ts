"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import axios from "axios";
import {
  BaseLineBulkCreateRequest,
  BaseLineBulkCreateResponse,
  BaseNodeDto,
  PivotListDto,
  DecisionFromBaseRequest,
  DecisionFromBaseResponse,
  DecisionNextRequest,
  DecisionNextResponse,
  DecisionLineDto,
  NodeCategory,
} from "@/domains/baselines/types";

const BACKEND_BASE_URL = process.env.BACKEND_API_URL || "http://localhost:3000"; // env 파일 있는지 확인??

// 카테고리 변환 유틸리티 함수
function parseNodeCategory(
  categoryString: string | FormDataEntryValue | null | undefined
): NodeCategory {
  if (!categoryString || typeof categoryString !== "string")
    return NodeCategory.ETC;

  // 영문 카테고리인 경우
  if (Object.values(NodeCategory).includes(categoryString as NodeCategory)) {
    return categoryString as NodeCategory;
  }

  // 한글 카테고리인 경우 변환
  const categoryMapping: Record<string, NodeCategory> = {
    교육: NodeCategory.EDUCATION,
    직업: NodeCategory.CAREER,
    관계: NodeCategory.RELATIONSHIP,
    경제: NodeCategory.FINANCE,
    건강: NodeCategory.HEALTH,
    행복: NodeCategory.HAPPINESS,
    기타: NodeCategory.ETC,
  };

  return categoryMapping[categoryString] || NodeCategory.ETC;
}

// Server Actions용 axios 인스턴스 생성
async function createServerAxios() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("JSESSIONID");

  const serverAxios = axios.create({
    baseURL: BACKEND_BASE_URL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // 쿠키가 있으면 헤더에 추가
  if (sessionCookie) {
    serverAxios.defaults.headers.common[
      "Cookie"
    ] = `JSESSIONID=${sessionCookie.value}`;
  }

  // 응답 인터셉터 (에러 처리)
  serverAxios.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error.message;

      if (status === 401) {
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      }

      throw new Error(message || "서버 요청 중 오류가 발생했습니다.");
    }
  );

  return serverAxios;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 베이스라인 일괄 생성
export async function createBaseLineAction(
  formData: FormData
): Promise<ApiResponse<BaseLineBulkCreateResponse>> {
  try {
    const rawData: BaseLineBulkCreateRequest = {
      userId: Number(formData.get("userId")) || 1,
      title: formData.get("title")?.toString() || "",
      nodes: JSON.parse(formData.get("nodes")?.toString() || "[]"),
    };

    const api = await createServerAxios();
    const response: BaseLineBulkCreateResponse = await api.post(
      "/api/v1/base-lines/bulk",
      rawData
    );

    // 성공 시 관련 페이지 재검증
    revalidatePath("/baseline");

    return {
      success: true,
      data: response,
      message: "베이스라인이 성공적으로 생성되었습니다.",
    };
  } catch (error) {
    console.error("베이스라인 생성 실패:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "베이스라인 생성에 실패했습니다.",
    };
  }
}

// 베이스라인 노드 조회
export async function getBaseLineNodesAction(
  baseLineId: number
): Promise<ApiResponse<BaseNodeDto[]>> {
  try {
    const api = await createServerAxios();
    const response: BaseNodeDto[] = await api.get(
      `/api/v1/base-lines/${baseLineId}/nodes`
    );

    return {
      success: true,
      data: Array.isArray(response) ? response : [],
    };
  } catch (error) {
    console.error("베이스라인 노드 조회 실패:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "베이스라인 노드 조회에 실패했습니다.",
      data: [],
    };
  }
}

// 피벗 조회
export async function getPivotsAction(
  baseLineId: number
): Promise<ApiResponse<PivotListDto>> {
  try {
    const api = await createServerAxios();
    const response: PivotListDto = await api.get(
      `/api/v1/base-lines/${baseLineId}/pivots`
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("피벗 조회 실패:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "피벗 조회에 실패했습니다.",
    };
  }
}

// Decision Flow - From Base
export async function createDecisionFromBaseAction(
  formData: FormData
): Promise<ApiResponse<DecisionFromBaseResponse>> {
  try {
    const rawData: DecisionFromBaseRequest = {
      userId: Number(formData.get("userId")) || 1,
      baseLineId: Number(formData.get("baseLineId")),
      pivotOrd: Number(formData.get("pivotOrd")),
      selectedAltIndex: Number(formData.get("selectedAltIndex")),
      category: parseNodeCategory(formData.get("category")?.toString()),
      situation: formData.get("situation")?.toString() || "",
      options: JSON.parse(formData.get("options")?.toString() || "[]"),
      selectedIndex: Number(formData.get("selectedIndex")),
    };

    const api = await createServerAxios();
    const response: DecisionFromBaseResponse = await api.post(
      "/api/v1/decision-flow/from-base",
      rawData
    );

    revalidatePath("/decision-flow");

    return {
      success: true,
      data: response,
      message: "첫 번째 결정이 생성되었습니다.",
    };
  } catch (error) {
    console.error("Decision From Base 생성 실패:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "첫 번째 결정 생성에 실패했습니다.",
    };
  }
}

// Decision Flow - Next
export async function createDecisionNextAction(
  formData: FormData
): Promise<ApiResponse<DecisionNextResponse>> {
  try {
    const rawData: DecisionNextRequest = {
      userId: Number(formData.get("userId")) || 1,
      parentDecisionNodeId: Number(formData.get("parentDecisionNodeId")),
      category: parseNodeCategory(formData.get("category")?.toString()),
      situation: formData.get("situation")?.toString() || "",
      ageYear: Number(formData.get("ageYear")),
      options: JSON.parse(formData.get("options")?.toString() || "[]"),
      selectedIndex: Number(formData.get("selectedIndex")),
      parentOptionIndex: Number(formData.get("parentOptionIndex")),
    };

    const api = await createServerAxios();
    const response: DecisionNextResponse = await api.post(
      "/api/v1/decision-flow/next",
      rawData
    );

    revalidatePath("/decision-flow");

    return {
      success: true,
      data: response,
      message: "다음 결정이 생성되었습니다.",
    };
  } catch (error) {
    console.error("Decision Next 생성 실패:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "다음 결정 생성에 실패했습니다.",
    };
  }
}

// Decision Line Complete/Cancel
export async function completeDecisionLineAction(
  decisionLineId: number
): Promise<ApiResponse<void>> {
  try {
    const api = await createServerAxios();
    await api.post(`/api/v1/decision-flow/${decisionLineId}/complete`);

    revalidatePath("/decision-flow");

    return {
      success: true,
      message: "결정 라인이 완료되었습니다.",
    };
  } catch (error) {
    console.error("Decision Line 완료 실패:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "결정 라인 완료에 실패했습니다.",
    };
  }
}

export async function cancelDecisionLineAction(
  decisionLineId: number
): Promise<ApiResponse<void>> {
  try {
    const api = await createServerAxios();
    await api.post(`/api/v1/decision-flow/${decisionLineId}/cancel`);

    revalidatePath("/decision-flow");

    return {
      success: true,
      message: "결정 라인이 취소되었습니다.",
    };
  } catch (error) {
    console.error("Decision Line 취소 실패:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "결정 라인 취소에 실패했습니다.",
    };
  }
}

// Decision Lines 조회
export async function getDecisionLinesAction(
  userId: number
): Promise<ApiResponse<DecisionLineDto[]>> {
  try {
    const api = await createServerAxios();
    const response: DecisionLineDto[] = await api.get(
      `/api/v1/decision-lines?userId=${userId}`
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Decision Lines 조회 실패:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "결정 라인 목록 조회에 실패했습니다.",
      data: [],
    };
  }
}

export async function getDecisionLineDetailAction(
  decisionLineId: number
): Promise<ApiResponse<DecisionLineDto>> {
  try {
    const api = await createServerAxios();
    const response: DecisionLineDto = await api.get(
      `/api/v1/decision-lines/${decisionLineId}`
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Decision Line 상세 조회 실패:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "결정 라인 상세 조회에 실패했습니다.",
    };
  }
}
