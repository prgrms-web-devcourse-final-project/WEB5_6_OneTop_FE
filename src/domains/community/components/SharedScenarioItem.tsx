const dummyData = {
  scenarioId: 1001,
  status: "COMPLETED",
  job: "AI 연구원",
  total: 500,
  summary:
    "당신은 성공적인 AI 연구자가 되어 학계와 업계에서 인정받으며, 균형 잡힌 삶을 살고 있습니다.",
  description:
    "10년 후, 당신은 세계적으로 인정받는 AI 연구소의 수석 연구원이 되었습니다. 혁신적인 연구 성과로 다수의 논문을 발표하며, 안정적인 수입과 함께 의미 있는 일을 하고 있습니다. 또한 규칙적인 운동과 취미 생활로 건강하고 행복한 일상을 유지하고 있습니다.",
  img: "https://example.com/scenario-images/successful-researcher.jpg",
  createdDate: "2024-01-15T14:30:00",
  indicators: [
    {
      type: "경제",
      point: 85,
      analysis: "안정적인 연구직 수입",
    },
    {
      type: "행복",
      point: 90,
      analysis: "의미 있는 일을 통한 성취감",
    },
  ],
};

function SharedScenarioItem() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{dummyData.job}</h3>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{dummyData.summary}</h3>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{dummyData.description}</h3>
      </div>
      <div className="flex gap-2">
        {dummyData.indicators.map((indicator) => (
          <div
            className="flex gap-4 items-center bg-deep-navy py-2 px-4 rounded-md"
            key={indicator.type}
          >
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg text-white">{indicator.type}</h3>
              <p className="text-lg text-white">{indicator.point}</p>
            </div>
            <div className="w-0.5 h-full bg-white" />
            <p className="text-white">{indicator.analysis}</p>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-bold">총점: {dummyData.total}</h2>
    </div>
  );
}
export default SharedScenarioItem;
