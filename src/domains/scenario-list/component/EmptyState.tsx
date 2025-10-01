import Link from "next/link";

function EmptyState() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          생성된 인생 기록이 없습니다.
        </h2>
        <p className="text-gray-600 mb-6">
          먼저 베이스라인에서 인생 분기점을 입력해주세요.
        </p>
        <Link
          href="/baselines"
          className="block w-full bg-deep-navy text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
        >
          베이스라인 입력하러 가기
        </Link>
      </div>
    </div>
  );
}
export default EmptyState;
