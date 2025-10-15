function loading() {
  return (
    <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)] bg-black">
      {/* 헤더 영역 스켈레톤 */}
      <div className="w-full h-64 bg-gradient-to-b from-gray-800 to-gray-900 relative animate-pulse">
        {/* SearchBar 스켈레톤 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%]">
          <div className="h-12 bg-gray-700 rounded-lg mb-4"></div>
        </div>

        {/* PostFilter + 글쓰기 버튼 스켈레톤 */}
        <div className="flex w-full justify-between items-center px-4 absolute bottom-4">
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-16 bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="w-[80%] py-4 md:w-[60%]">
        {/* 게시글 목록 스켈레톤 */}
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              {/* 게시글 헤더 */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                    <div className="h-2 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-gray-700 rounded"></div>
              </div>

              {/* 게시글 제목 */}
              <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>

              {/* 게시글 내용 */}
              <div className="space-y-2 mb-3">
                <div className="h-3 bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>

              {/* 게시글 하단 정보 */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <div className="h-4 w-12 bg-gray-700 rounded"></div>
                  <div className="h-4 w-12 bg-gray-700 rounded"></div>
                </div>
                <div className="h-4 w-20 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 스켈레톤 */}
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 bg-gray-700 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default loading;
