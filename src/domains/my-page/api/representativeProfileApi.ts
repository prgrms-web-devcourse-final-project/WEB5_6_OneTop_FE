import { api } from "@/share/config/api";
import { RepresentativeProfile } from "../type";

export const getRepresentativeProfile =
  async (): Promise<RepresentativeProfile> => {
    const { data } = await api.get("/api/v1/users/profile");
    return data;
  };

export const putRepresentativeProfile = async (
  scenarioId: number
): Promise<RepresentativeProfile> => {
  const { data } = await api.put("/api/v1/users/profile-scenario", null, {
    params: {
      scenarioId: scenarioId,
    },
  });
  return data;
};
