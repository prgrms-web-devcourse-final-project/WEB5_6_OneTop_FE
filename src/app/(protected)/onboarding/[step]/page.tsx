import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { Step, steps } from "@/domains/onboarding/lib/steps";

export function generateStaticParams() {
  return steps.map((step) => ({ step: step.key }));
}

export function generateMetadata({ params }: { params: { step: Step } }) {
  const step = steps.find((step) => step.key === params.step);
  if (!step) {
    return {
      title: "프로필 설정",
    };
  } else {
    return {
      title: `프로필 설정 | ${step.label}`,
      description: step.placeholder,
      robots: { index: true, follow: true },
    };
  }
}

function Page() {
  const data = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div className="w-screen h-screen bg-deep-navy relative">
      <div
        className="w-full h-full flex items-center justify-center flex-col"
        style={{
          background:
            "linear-gradient(246deg, rgba(217, 217, 217, 0.00) 41.66%, rgba(130, 79, 147, 0.15) 98.25%)",
        }}
      >
        {/* 페이지 넘기기 버튼 */}
        <button
          type="button"
          className="cursor-pointer absolute left-10 -translate-y-1/2"
        >
          <AiOutlineLeft size={80} className="text-white" />
        </button>
        <button
          type="button"
          className="cursor-pointer absolute right-10 -translate-y-1/2"
        >
          <AiOutlineRight size={80} className="text-white" />
        </button>

        {/* 입력 폼 영역 */}
        <form className="w-full flex flex-col items-center justify-center gap-8">
          {/* 질문 라벨 */}
          <label htmlFor="name" className="text-white text-5xl font-semibold">
            당신의 이름은?
          </label>

          {/* 입력 필드 */}
          <div className="h-[20vh] flex items-center justify-center">
            <input
              id="name"
              type="text"
              className="h-18 rounded-md border-2 border-white w-80 p-6 bg-white 
            placeholder:text-gray-500 text-center text-2xl"
              placeholder="이름을 입력해주세요"
            />
          </div>

          {/* 버튼 */}
          <button
            type="button"
            className="h-12 w-40 rounded-md bg-midnight-blue text-white font-semibold"
            style={{ boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25) inset" }}
          >
            입력 미완료
          </button>
        </form>

        <ul className="w-full list-none flex items-center justify-center gap-4 absolute bottom-10">
          {data.map((item) => (
            <li
              key={item}
              className="w-7 h-7 rounded-full border-2 border-white"
            ></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default Page;
