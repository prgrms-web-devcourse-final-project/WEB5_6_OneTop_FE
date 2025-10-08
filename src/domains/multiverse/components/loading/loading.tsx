import { TimelineCore } from "@/share/components/TimelineCore";
import ParticleBackground from "../ParticleBackground";

function Loading() {
  // 임시 데이터
  const data = [
    { year: 2000, title: "회사 설립" },
    { year: 2005, title: "첫 제품 출시" },
    { year: 2010, title: "글로벌 진출" },
    { year: 2015, title: "새로운 서비스 런칭" },
    { year: 2020, title: "AI 프로젝트 시작" },
  ];

  const renderContent = (year: number, index: number) => {
    const item = data.find((d) => d.year === year);
    if (!item) return null;

    return (
      <div
        className={`absolute flex flex-col items-center z-10 ${
          index % 2 !== 0 ? "top-[10px]" : "top-[95px]"
        }`}
      >
        <div className="flex items-center justify-center w-20 h-20 rounded-full border border-midnight-blue text-xl font-semibold bg-white">
          {item.year}
        </div>
        <p className="mt-3 w-[95%] text-center text-base font-semibold text-gray-200 break-keep line-clamp-3">
          {item.title}
        </p>
      </div>
    );
  };

  return (
    <div
      className="relative w-full h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(270deg, #0F1A2B 0%, #111 100%)" }}
    >
      <ParticleBackground />

      <div className="z-10">
        <TimelineCore
          years={data.map((d) => d.year)}
          renderContent={renderContent}
        />
      </div>
    </div>
  );
}

export default Loading;
