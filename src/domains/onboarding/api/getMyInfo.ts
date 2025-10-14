import { getApiBaseUrl } from "@/share/config/api";
import { nextFetcher } from "@/share/utils/nextFetcher";

export const getMyInfo = async () => {
  const res = await nextFetcher(`${getApiBaseUrl()}/api/v1/users-info`, {
    credentials: "include",
  });
  return res.json();
};
