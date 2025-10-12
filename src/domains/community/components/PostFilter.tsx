"use client";
import { PostFilterType } from "../types";
import tw from "@/share/utils/tw";
import { useRouter, useSearchParams } from "next/navigation";

interface PostFilterProps {
  category: PostFilterType;
}

const categoryOptions = [
  { label: "메인", value: "MAIN" },
  { label: "전체", value: "ALL" },
  { label: "잡담", value: "CHAT" },
  { label: "투표", value: "POLL" },
  { label: "시나리오", value: "SCENARIO" },
] as const;

function PostFilter({ category }: PostFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (category: PostFilterType) => {
    const params = new URLSearchParams(searchParams);

    if (category === "MAIN") {
      params.delete("category");
      params.delete("page");
      params.delete("keyword");
      params.delete("searchType");
    } else {
      params.set("category", category);
      params.set("page", "1");
    }

    router.push(`/community?${params.toString()}`);
  };

  return (
    <ul className="flex items-center gap-4 ">
      {categoryOptions.map((option) => (
        <li
          key={option.value}
          className={tw(
            "text-gray-300 text-xl hover:text-gray-50 cursor-pointer transition-colors",
            category === option.value && "text-white font-semibold"
          )}
          onClick={() => handleFilterChange(option.value)}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}
export default PostFilter;
