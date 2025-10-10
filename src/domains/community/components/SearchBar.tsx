"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchType } from "../types";

function SearchBar() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => {
    return searchParams.get("keyword") || "";
  });
  const router = useRouter();
  const [searchType, setSearchType] = useState(() => {
    return searchParams.get("searchType") || "TITLE";
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("keyword", search);
    newSearchParams.set("page", "1");
    newSearchParams.set("searchType", searchType);

    router.push(`/community?${newSearchParams.toString()}`);
  };

  return (
    <form
      className="relative flex justify-center w-[60%] gap-2"
      onSubmit={handleSubmit}
    >
      <select
        className="rounded-md px-4 py-4 bg-white placeholder:text-gray-500 flex items-center text-slate-800"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value as SearchType)}
      >
        <option value="TITLE">제목</option>
        <option value="TITLE_CONTENT">제목+내용</option>
        <option value="AUTHOR">작성자</option>
      </select>
      <input
        type="text"
        className="w-full rounded-full px-4 py-4 bg-white placeholder:text-gray-500 flex items-center text-slate-800"
        placeholder="검색어를 입력해주세요."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
      >
        <FaSearch size={20} />
      </button>
    </form>
  );
}
export default SearchBar;
