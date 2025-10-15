
function Loading() {
  return (
    <div className="min-h-screen overflow-hidden fixed inset-0 justify-center items-center z-50 bg-deep-navy">
      <div
        className="flex flex-col items-center justify-center"
        style={{
          background:
            "linear-gradient(246deg, rgba(217, 217, 217, 0.00) 41.66%, rgba(130, 79, 147, 0.15) 98.25%)",
        }}
      >
        <div className="absolute inset-0 opacity-80">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-white text-5xl font-light tracking-[10px] mb-8">
              <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                RE:LIFE
              </span>
            </h1>
            <div className="text-white text-xl mb-4 animate-pulse">
              커뮤니티 로딩 중...
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
