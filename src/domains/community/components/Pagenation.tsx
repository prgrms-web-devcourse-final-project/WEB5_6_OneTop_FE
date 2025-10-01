import tw from "@/share/utils/tw";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

function Pagenation( { page, totalPages }: { page: number, totalPages: number } ) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const movePage = (next: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(Math.max(1, next)));
    router.push(`${pathname}?${params.toString()}`);
  };

  const renderPageAnchors = (cur: number) => {
    const anchors = [];
    for (let i = -2; i <= 2; i++) {
      const pageNum = cur + i;
      if (pageNum > 0 && pageNum <= totalPages) {
        anchors.push(
          <a
            className={tw("cursor-pointer", i === 0 && "font-semibold")}
            key={"anchor" + pageNum}
            onClick={() => movePage(pageNum)}
          >
            {pageNum}
          </a>
        );
      }
    }
    return anchors;
  };

  return (
    <nav className="mt-4 flex items-center gap-2">
    <button onClick={() => movePage(page - 1)} disabled={page === 1}>
      이전
    </button>
    <span key={page} className="flex gap-2 text-center text-xl">
      {renderPageAnchors(page)}
    </span>
    <button onClick={() => movePage(page + 1)} disabled={page === totalPages}>
      다음
    </button>
    {/* <span className="ml-2 text-sm text-gray-500">
      총 {data.total.toLocaleString()}권
    </span> */}
  </nav>
  )
}

export default Pagenation