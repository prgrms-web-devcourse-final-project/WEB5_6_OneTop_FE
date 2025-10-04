import { api } from "@/share/config/api";
import { MyInfo } from "../type";

export const getMyInfo = async (): Promise<MyInfo> => {
  const { data } = await api.get("/api/v1/users-info");
  return data;
};

export const putMyInfo = async (infoData: Partial<MyInfo>): Promise<MyInfo> => {
  const { data } = await api.put("/api/v1/users-info", infoData);
  return data;
};
