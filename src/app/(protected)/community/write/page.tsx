"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postDetailSchema } from "@/domains/community/schemas/posts";
import { z } from "zod";
import { PostDetail } from "@/domains/community/types";

function Page() {
  const {register, handleSubmit} = useForm({
    resolver: zodResolver(postDetailSchema),
  });

  const onSubmit = (data: PostDetail) => {
    console.log(data);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center min-h-[calc(100vh-140px)] pt-15">
        <div className="w-[80%] flex flex-col items-center">
          <div className=" border-b border-gray-300 p-4 text-2xl font-semibold my-16">
            글작성
          </div>

          <form className="flex gap-4 w-full">
            <input
              type="radio"
              name="postType"
              id="postType"
              className="w-4 h-4 group-hover:bg-deep-navy"
              value="CHAT"
            />
            <label htmlFor="postType">잡담</label>
            <input
              type="radio"
              name="postType"
              id="postType"
              className="w-4 h-4 group-hover:bg-deep-navy"
              value="POLL"
            />
            <label htmlFor="postType">투표</label>
            <input
              type="radio"
              name="postType"
              id="postType"
              className="w-4 h-4 group-hover:bg-deep-navy"
              value="SCENARIO"
            />
            <label htmlFor="postType">시나리오</label>
          </form>
        </div>
      </div>
    </>
  );
}
export default Page;
