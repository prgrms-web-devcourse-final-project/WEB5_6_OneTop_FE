import { api } from "@/share/config/api";
import { UsageStats } from "../type";

export const getUsageStats = async (): Promise<UsageStats> => {
  const { data } = await api.get("/api/v1/users/use-log");
  return data;
};
