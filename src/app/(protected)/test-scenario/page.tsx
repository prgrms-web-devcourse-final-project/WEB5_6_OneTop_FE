"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { clientScenariosApi } from "@/domains/scenarios/api/clientScenariosApi";
import { api } from "@/share/config/api";

export default function TestScenarioPage() {
  const router = useRouter();
  const [baselineId, setBaselineId] = useState("2");
  const [userId, setUserId] = useState("3");
  const [scenarioId, setScenarioId] = useState("");
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [mode, setMode] = useState<"create" | "test">("test");

  const addLog = (message: string) => {
    setLog((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  // 시나리오 API 테스트
  const handleTestScenario = async () => {
    try {
      setLoading(true);
      setLog([]);

      const id = parseInt(scenarioId);

      addLog(`1. 시나리오 상태 조회 중... (ID: ${id})`);
      const statusResponse = await clientScenariosApi.getScenarioStatus(id);
      addLog(`상태: ${statusResponse.status}`);
      addLog(`메시지: ${statusResponse.message}`);
      console.log("상태 응답:", statusResponse);

      addLog("\n2. 시나리오 정보 조회 중...");
      const infoResponse = await clientScenariosApi.getScenarioInfo(id);
      addLog(`정보 조회 성공`);
      addLog(`직업: ${infoResponse.job}`);
      addLog(`점수: ${infoResponse.total}`);
      addLog(`요약: ${infoResponse.summary.substring(0, 50)}...`);
      addLog(`지표: ${infoResponse.indicators.length}개`);
      console.log("정보 응답:", infoResponse);

      addLog("\n3. 타임라인 조회 중...");
      const timelineResponse = await clientScenariosApi.getScenarioTimeline(id);
      addLog(`타임라인 조회 성공`);
      addLog(`이벤트: ${timelineResponse.length}개`);
      console.log("타임라인 응답:", timelineResponse);

      addLog("\n 모든 API 정상 작동!");
      addLog("\n시나리오 페이지로 이동하려면 버튼을 클릭하세요.");
    } catch (error) {
      console.error("에러:", error);

      if (error instanceof AxiosError) {
        addLog(`\n 실패: ${error.message}`);
        if (error.response) {
          addLog(`상태 코드: ${error.response.status}`);
          addLog(`에러 데이터: ${JSON.stringify(error.response.data)}`);
        }
      } else if (error instanceof Error) {
        addLog(`\n 실패: ${error.message}`);
      } else {
        addLog(`\n 알 수 없는 에러가 발생했습니다.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 시나리오 생성 플로우
  const handleCreateScenario = async () => {
    try {
      setLoading(true);
      setLog([]);

      addLog("1. 피벗 목록 조회 중...");
      const pivots = await clientScenariosApi.getPivots(parseInt(baselineId));
      addLog(` 피벗 ${pivots.length}개 발견`);

      const firstPivot = pivots[0];
      addLog(
        `2. 첫 번째 피벗: index=${firstPivot.index}, age=${firstPivot.ageYear}`
      );

      const payloads = [
        {
          userId: parseInt(userId),
          baseLineId: parseInt(baselineId),
          pivotOrd: firstPivot.index,
          selectedAltIndex: 0,
        },
        {
          userId: parseInt(userId),
          baseLineId: parseInt(baselineId),
          pivotAge: firstPivot.ageYear,
          selectedAltIndex: 0,
        },
      ];

      for (let i = 0; i < payloads.length; i++) {
        const payload = payloads[i];
        addLog(`\n[시도 ${i + 1}/${payloads.length}]`);
        addLog(`요청: ${JSON.stringify(payload)}`);

        try {
          const response = await api.post(
            "/api/v1/decision-flow/from-base",
            payload
          );
          addLog(`DecisionLine 생성 성공!`);
          console.log("DecisionLine:", response.data);

          addLog("\n4. Scenario 생성 중...");
          const scenario = await clientScenariosApi.createScenario(
            response.data.decisionLineId
          );
          addLog(`Scenario 생성: ${scenario.scenarioId}`);

          setTimeout(() => {
            router.push(`/scenarios?scenarioId=${scenario.scenarioId}`);
          }, 2000);

          return;
        } catch (err) {
          if (err instanceof AxiosError) {
            addLog(`실패: ${err.response?.data?.message || err.message}`);
          } else if (err instanceof Error) {
            addLog(`실패: ${err.message}`);
          } else {
            addLog(`실패: 알 수 없는 에러`);
          }
        }
      }

      addLog("\n모든 시도 실패!");
    } catch (error) {
      if (error instanceof Error) {
        addLog(`에러: ${error.message}`);
      } else {
        addLog(`알 수 없는 에러가 발생했습니다.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">시나리오 API 테스트</h1>

        {/* 모드 선택 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("test")}
            className={`flex-1 px-4 py-2 rounded ${
              mode === "test"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            API 테스트 (ID로 조회)
          </button>
          <button
            onClick={() => setMode("create")}
            className={`flex-1 px-4 py-2 rounded ${
              mode === "create"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            시나리오 생성
          </button>
        </div>

        {/* API 테스트 모드 */}
        {mode === "test" && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Scenario ID:
              </label>
              <input
                type="number"
                value={scenarioId}
                onChange={(e) => setScenarioId(e.target.value)}
                placeholder="백엔드에서 받은 scenarioId 입력"
                className="w-full border rounded px-3 py-2"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleTestScenario}
              disabled={loading || !scenarioId}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "조회 중..." : "시나리오 API 테스트"}
            </button>

            {scenarioId && !loading && log.length > 0 && (
              <button
                onClick={() =>
                  router.push(`/scenarios?scenarioId=${scenarioId}`)
                }
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                시나리오 페이지로 이동
              </button>
            )}
          </div>
        )}

        {/* 생성 모드 */}
        {mode === "create" && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">User ID:</label>
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full border rounded px-3 py-2"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                베이스라인 ID:
              </label>
              <input
                type="number"
                value={baselineId}
                onChange={(e) => setBaselineId(e.target.value)}
                className="w-full border rounded px-3 py-2"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleCreateScenario}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "처리 중..." : "시나리오 생성 시도"}
            </button>
          </div>
        )}

        {/* 로그 */}
        {log.length > 0 && (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            <div className="mb-2 text-gray-400">실행 로그:</div>
            {log.map((item, index) => (
              <div key={index} className="mb-1 break-words whitespace-pre-wrap">
                {item}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold mb-2">사용 방법:</h3>
          <div className="text-sm space-y-2">
            <div>
              <strong>API 테스트 모드:</strong>
              <ol className="list-decimal list-inside ml-2">
                <li>백엔드에서 생성한 scenarioId 입력</li>
                <li>시나리오 API 테스트 클릭</li>
                <li>status, info, timeline API 확인</li>
              </ol>
            </div>
            <div className="mt-2">
              <strong>시나리오 생성 모드:</strong>
              <ol className="list-decimal list-inside ml-2">
                <li>DecisionLine 생성 시도</li>
                <li>실패 시 백엔드에 더미 요청</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
