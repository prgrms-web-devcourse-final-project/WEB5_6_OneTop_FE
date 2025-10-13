import { useEffect, useState } from "react";
import { clientScenariosApi } from "../api/clientScenariosApi";

export const useScenarioPolling = (scenarioId: number | null) => {
  const [status, setStatus] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!scenarioId || !isPolling) return;

    const pollStatus = async () => {
      try {
        const response = await clientScenariosApi.getScenarioStatus(scenarioId);
        setStatus(response.status);

        if (response.status === "COMPLETED" || response.status === "FAILED") {
          setIsPolling(false);
        }
      } catch (err) {
        setError(err as Error);
        setIsPolling(false);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 1000); // 1초마다 폴링

    return () => clearInterval(interval);
  }, [scenarioId, isPolling]);

  return { status, isPolling, error };
};
