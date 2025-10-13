import { ScenarioInfoResponse } from "@/domains/scenarios/types";
import tw from "@/share/utils/tw";
import Image from "next/image";

const getThemeByScore = (score: number) => {
  if (score >= 460) {
    return {
      accent: "linear-gradient(135deg, #77E4D4, #A682FF, #FFD580)",
      background:
        "radial-gradient(circle at 20% 30%, #0A0F1A 0%, #150A33 100%)",
      blendMode: "screen",
    };
  } else if (score >= 400) {
    return {
      accent: "#77E4D4",
      background: "#0A0F1A",
    };
  } else if (score >= 300) {
    return {
      accent: "#6A8FFF",
      background: "#10172A",
    };
  } else if (score >= 200) {
    return {
      accent: "#FFCA5F",
      background: "#1A1410",
    };
  } else {
    return {
      accent: "#FF6B6B",
      background: "#1C0E0E",
    };
  }
};

const dummyData = {
  scenarioId: 1001,
  status: "COMPLETED",
  job: "AI 연구원",
  total: 480,
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
    {
      type: "건강",
      point: 80,
      analysis: "규칙적인 운동과 올바른 식습관",
    },
    {
      type: "사회",
      point: 75,
      analysis: "의미 있는 일을 통한 성취감",
    },
  ],
};

const img = "https://cdn.edujin.co.kr/news/photo/202310/43954_86537_5933.png";

function SharedScenarioItem({
  scenarioInfo,
  className,
}: {
  scenarioInfo: ScenarioInfoResponse;
  className?: string;
}) {
  const data = scenarioInfo || dummyData;
  const { accent, background, blendMode } = getThemeByScore(data.total);

  return (
    <div
      className={tw(`relative overflow-hidden rounded-md ${className}`)}
      style={{ background }}
    >
      {/* 애니메이션 색상 */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <div
          className="subtle-space-animation"
          style={{
            background:
              data.total >= 460
                ? accent
                : `radial-gradient(
                ellipse at center,
                transparent 30%,
                ${accent}40 50%,
                transparent 70%
              )`,
            filter: data.total >= 460 ? "blur(40px)" : "none",
            mixBlendMode: (blendMode ||
              "normal") as React.CSSProperties["mixBlendMode"],
          }}
        />
      </div>

      <div className="grid grid-cols-10 h-full">
        <div className="relative h-full rounded-l-md overflow-hidden col-span-3">
          <Image
            src={img}
            alt="scenario"
            fill
            sizes="(max-width: 768px) 20%, 200px"
            className="object-cover"
            priority={false}
          />
        </div>

        <div
          className="w-full h-full p-4 rounded-md flex flex-col gap-2 col-span-7"
          style={{
            background:
              "linear-gradient(246deg, rgba(217, 217, 217, 0.00) 15%, rgba(130, 79, 147, 0.25) 95%)",
          }}
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-white">{data.job}</h3>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-white">{data.summary}</h3>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-white">{data.description}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 my-2">
            {data.indicators.map((indicator) => (
              <div
                className="flex gap-4 items-center border border-white py-2 px-4 rounded-md"
                key={indicator.type}
              >
                <div className="flex items-center justify-center gap-1">
                  <h3 className="text-white font-semibold text-nowrap">
                    {indicator.type}
                  </h3>
                  <p className="text-white">{indicator.point}</p>
                </div>
                <div className="w-0.5 h-full bg-white" />
                <p className="text-white text-sm h-10 flex items-center">
                  {indicator.analysis}
                </p>
              </div>
            ))}
          </div>
          <h2 className="text-xl text-white flex justify-center border border-white rounded-b-md py-2">
            총점 {data.total}
          </h2>
        </div>
      </div>
    </div>
  );
}
export default SharedScenarioItem;
