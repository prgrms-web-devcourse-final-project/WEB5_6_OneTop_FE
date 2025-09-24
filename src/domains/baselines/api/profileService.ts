import { apiClient } from "./client";

export interface UserInfo {
  id?: string;
  name: string;
  birthDate: string;
  gender: "male" | "female" | "other";
  mbti: string;
  values: {
    economicSuccess: number;
    relationships: number;
    health: number;
    selfRealization: number;
    workLifeBalance: number;
  };
}

export const profileApi = {
  // 사용자 기본 정보 입력 (첫 가입)
  createUserInfo: async (userInfo: Omit<UserInfo, "id">): Promise<UserInfo> => {
    const response = await apiClient.post("/users-info", userInfo);
    return response.data;
  },

  // 사용자 기본 정보 조회
  getUserInfo: async (): Promise<UserInfo> => {
    const response = await apiClient.get("/users-info");
    return response.data;
  },

  // 사용자 기본 정보 수정
  updateUserInfo: async (userInfo: Partial<UserInfo>): Promise<UserInfo> => {
    const response = await apiClient.put("/users-info", userInfo);
    return response.data;
  },

  // 마이페이지 프로필 조회
  getProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },

  // 사용 통계 조회
  getUsageStats: async () => {
    const response = await apiClient.get("/users/use-log");
    return response.data;
  },

  // 평행우주 목록 조회
  getScenarioList: async () => {
    const response = await apiClient.get("/users/list");
    return response.data;
  },

  // 내 작성글 조회
  getMyPosts: async () => {
    const response = await apiClient.get("/users/my-posts");
    return response.data;
  },

  // 내 댓글 조회
  getMyComments: async () => {
    const response = await apiClient.get("/users/my-comments");
    return response.data;
  },
};
