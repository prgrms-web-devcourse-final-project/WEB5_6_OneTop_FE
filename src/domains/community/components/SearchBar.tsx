"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

function SearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("keyword", search);
    newSearchParams.set("page", "1");
    newSearchParams.set("searchType", "TITLE");

    router.push(
      `/community?${newSearchParams.toString()}`
    );
  };

  return (
    <form className="relative flex justify-center w-[60%]" onSubmit={handleSubmit}>
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
