"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import axios from "axios";
import {
  BaseLineBulkCreateRequest,
  BaseLineBulkCreateResponse,
  BaseNodeDto,
  NodeCategory,
} from "@/domains/baselines/types";

const BACKEND_BASE_URL = process.env.BACKEND_API_URL || "http://localhost:8080";

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
    revalidatePath("/baselines");

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
