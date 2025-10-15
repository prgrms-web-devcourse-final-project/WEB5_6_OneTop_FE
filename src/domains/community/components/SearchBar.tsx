"use client";

import { useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchType } from "../types";
import Filter, { FilterItem } from "@/share/components/Filter";
import tw from "@/share/utils/tw";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import gsap from "gsap";

function SearchBar() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => {
    return searchParams.get("keyword") || "";
  });
  const router = useRouter();

  // 필터 로직
  const [pannelOpen, setPannelOpen] = useState<boolean>(false);

  const panelRef = useRef<HTMLDivElement>(null);

  const DEFAULT_TOP: FilterItem = { code: "00", value: "제목" };
  const searchTypeMap: Record<string, SearchType> = {
    "00": "TITLE",
    "10": "TITLE_CONTENT",
    "20": "AUTHOR",
  };

  const [searchType, setSearchType] = useState<{
    top?: FilterItem;
    bottom?: FilterItem;
  } | null>({ top: DEFAULT_TOP });

  // 필터 패널 열기
  const openPanel = (instant = false) => {
    const el = panelRef.current;
    if (!el) return;
    if (instant) gsap.set(el, { height: "auto", opacity: 1 });
    else
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
          clearProps: "height",
        }
      );
    setPannelOpen(true);
  };

  // 필터 패널 닫기
  const closePanel = (instant = false) => {
    const el = panelRef.current;
    if (!el) return;
    if (instant) gsap.set(el, { height: 0, opacity: 0 });
    else
      gsap.to(el, { height: 0, opacity: 0, duration: 0.18, ease: "power2.in" });
    setPannelOpen(false);
  };

  // 제출 동작
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("keyword", search);
    newSearchParams.set("page", "1");
    newSearchParams.set(
      "searchType",
      searchTypeMap[searchType?.top?.code || "00"]
    );

    router.push(`/community?${newSearchParams.toString()}`);
  };

  return (
    <form
      className="relative flex justify-center items-center w-[60%] gap-2"
      onSubmit={handleSubmit}
    >
      <div className="relative">
        <button
          type="button"
          data-filter-trigger
          className={tw(
            "flex items-center w-26 py-2 px-4 h-12 rounded-full font-semibold transition justify-between bg-white text-slate-800",
            pannelOpen && "text-white bg-inherit outline outline-white"
          )}
          onClick={() => (pannelOpen ? closePanel() : openPanel())}
        >
          <span className="text-nowrap">{searchType?.top?.value}</span>
          {pannelOpen ? (
            <MdOutlineKeyboardArrowUp
              className="text-white h-6 w-6 shrink-0"
              size={20}
            />
          ) : (
            <MdOutlineKeyboardArrowDown
              className="text-slate-800 h-6 w-6 shrink-0"
              size={20}
            />
          )}
        </button>

        {/* 필터 보여주는 영역 (접혔다가 열림) */}
        <div
          ref={panelRef}
          className="absolute left-0 top-full mt-2 z-50 min-w-[100px] overflow-hidden rounded-xl shadow-lg bg-white/90 backdrop-blur"
          style={{ height: 0, opacity: 0 }}
        >
          <Filter
            isOpen={pannelOpen}
            onClose={() => closePanel()}
            topItems={[
              { code: "00", value: "제목" },
              { code: "10", value: "제목+내용" },
              { code: "20", value: "작성자" },
            ]}
            filterItem={searchType}
            className="p-4"
            setFilterItem={(v) => {
              closePanel(false);
              setSearchType(v);
            }}
          />
        </div>
      </div>

      <input
        type="text"
        className="w-full rounded-full px-4 py-3 bg-white placeholder:text-gray-500 flex items-center text-slate-800"
        placeholder="검색어를 입력해주세요."
        maxLength={50}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
        name="search"
        aria-label="검색"
      >
        <FaSearch size={20} />
      </button>
    </form>
  );
}
export default SearchBar;
