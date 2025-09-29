"use client";

const MainContainer = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[url('/main_bg.png')] bg-cover bg-center">
      <button
        type="button"
        onClick={() => (window.location.href = "/onboarding")}
        className="h-[55px] px-[50px] bg-buttercream rounded-full text-gray-800 text-xl font-semibold"
      >
        시작하기
      </button>
    </div>
  );
};
export default MainContainer;
