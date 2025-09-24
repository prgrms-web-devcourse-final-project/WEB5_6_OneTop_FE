import { apiClient } from "./client";

export interface BaseNode {
  id?: string;
  year: number;
  age: number;
  category: string;
  eventTitle: string;
  actualChoice: string;
  context?: string;
}

export interface TreeData {
  id: string;
  userId: string;
  baseNodes: BaseNode[];
}

export const baselineApi = {
  // 베이스라인 분기점 입력
  createBaseNode: async (nodeData: Omit<BaseNode, "id">): Promise<BaseNode> => {
    const response = await apiClient.post("/base-nodes", nodeData);
    return response.data;
  },

  // 분기 정보 조회 (전체 트리)
  getTree: async (id: string): Promise<TreeData> => {
    const response = await apiClient.get(`/trees/${id}`);
    return response.data;
  },

  // 분기 정보 조회 (라인별)
  getTreeLine: async (id: string) => {
    const response = await apiClient.get(`/trees/line/${id}`);
    return response.data;
  },

  // 새로운 선택 분기 입력
  createNode: async (nodeData: unknown) => {
    const response = await apiClient.post("/nodes", nodeData);
    return response.data;
  },

  // 분기 삭제
  deleteTree: async () => {
    const response = await apiClient.delete("/trees");
    return response.data;
  },
};
