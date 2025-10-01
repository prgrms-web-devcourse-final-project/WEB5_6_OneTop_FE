"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import tw from "../utils/tw";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 3;

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + showPages - 1);

    if (end === totalPages && end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="py-10 flex justify-center items-center gap-2">
      {/* 이전 버튼 */}
      {currentPage === 1 ? (
        <button
          disabled
          className={tw(
            "w-10 h-10 flex items-center justify-center rounded-md",
            "opacity-30 cursor-not-allowed"
          )}
        >
          <FaAngleLeft />
        </button>
      ) : (
        <Link
          href={createPageUrl(currentPage - 1)}
          className={tw(
            "w-10 h-10 flex items-center justify-center rounded-md",
            "hover:bg-gray-50"
          )}
        >
          <FaAngleLeft />
        </Link>
      )}

      {/* 첫 페이지 */}
      {!pageNumbers.includes(1) && (
        <>
          <Link
            href={createPageUrl(1)}
            className="w-10 h-10 hover:bg-gray-50 rounded-md flex items-center justify-center"
          >
            1
          </Link>
          <span className="px-2">...</span>
        </>
      )}

      {/* 중간 페이지들 */}
      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={tw(
            "w-10 h-10 transition rounded-md flex items-center justify-center",
            page === currentPage
              ? "bg-deep-navy text-white"
              : "hover:bg-gray-50"
          )}
        >
          {page}
        </Link>
      ))}

      {/* 마지막 페이지 */}
      {!pageNumbers.includes(totalPages) && (
        <>
          <span className="px-2">...</span>
          <Link
            href={createPageUrl(totalPages)}
            className="w-10 h-10 hover:bg-gray-50 rounded-md flex items-center justify-center"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* 다음 버튼 */}
      {currentPage === totalPages ? (
        <button
          disabled
          className={tw(
            "w-10 h-10 flex items-center justify-center rounded-md",
            "opacity-30 cursor-not-allowed"
          )}
        >
          <FaAngleRight />
        </button>
      ) : (
        <Link
          href={createPageUrl(currentPage + 1)}
          className={tw(
            "w-10 h-10 flex items-center justify-center rounded-md",
            "hover:bg-gray-50"
          )}
        >
          <FaAngleRight />
        </Link>
      )}
    </div>
  );
}
