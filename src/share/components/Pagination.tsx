"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import tw from "../utils/tw";

interface BasePaginationProps {
  totalPages: number;
}

interface UrlPaginationProps extends BasePaginationProps {
  mode?: "url";
  pageParamName?: string;
}

interface StatePaginationProps extends BasePaginationProps {
  mode: "state";
  currentPage: number;
  onPageChange: (page: number) => void;
}

type PaginationProps = UrlPaginationProps | StatePaginationProps;

export default function Pagination(props: PaginationProps) {
  const { totalPages } = props;
  const mode = props.mode || "url";
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage =
    mode === "url"
      ? Number(
          searchParams.get(
            (props as UrlPaginationProps).pageParamName || "page"
          )
        ) || 1
      : (props as StatePaginationProps).currentPage;

  const createPageUrl = (page: number) => {
    if (mode === "url") {
      const params = new URLSearchParams(searchParams);
      const pageParamName =
        (props as UrlPaginationProps).pageParamName || "page";
      params.set(pageParamName, page.toString());
      return `${pathname}?${params.toString()}`;
    }
    return "#";
  };

  const handleClick = (page: number) => {
    if (mode === "state") {
      (props as StatePaginationProps).onPageChange(page);
    }
  };

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const showPages = 3;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    let start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + showPages - 1);

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

  const buttonClass = "w-10 h-10 flex items-center justify-center rounded-md";
  const disabledClass = tw(buttonClass, "opacity-30 cursor-not-allowed");
  const activeClass = tw(buttonClass, "hover:bg-gray-50");

  const NavigationButton = ({
    page,
    disabled,
    children,
  }: {
    page: number;
    disabled: boolean;
    children: React.ReactNode;
  }) => {
    if (disabled) {
      return (
        <button disabled className={disabledClass}>
          {children}
        </button>
      );
    }

    if (mode === "state") {
      return (
        <button onClick={() => handleClick(page)} className={activeClass}>
          {children}
        </button>
      );
    }

    return (
      <Link href={createPageUrl(page)} className={activeClass}>
        {children}
      </Link>
    );
  };

  const PageButton = ({ page }: { page: number }) => {
    const isActive = page === currentPage;
    const className = tw(
      buttonClass,
      "transition",
      isActive ? "bg-deep-navy text-white" : "hover:bg-gray-50"
    );

    if (mode === "state") {
      return (
        <button onClick={() => handleClick(page)} className={className}>
          {page}
        </button>
      );
    }

    return (
      <Link href={createPageUrl(page)} className={className}>
        {page}
      </Link>
    );
  };

  return (
    <div className="py-8 flex justify-center items-center gap-2">
      <NavigationButton page={currentPage - 1} disabled={currentPage === 1}>
        <FaAngleLeft />
      </NavigationButton>

      {!pageNumbers.includes(1) && (
        <>
          <PageButton page={1} />
          <span className="px-2">...</span>
        </>
      )}

      {pageNumbers.map((page) => (
        <PageButton key={page} page={page} />
      ))}

      {!pageNumbers.includes(totalPages) && (
        <>
          <span className="px-2">...</span>
          <PageButton page={totalPages} />
        </>
      )}

      <NavigationButton
        page={currentPage + 1}
        disabled={currentPage === totalPages}
      >
        <FaAngleRight />
      </NavigationButton>
    </div>
  );
}
