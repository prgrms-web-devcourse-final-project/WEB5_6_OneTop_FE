"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { TuiEditorRef } from "@/domains/community/components/ToastEditor";

const TuiEditor = dynamic(
  () => import("@/domains/community/components/ToastEditor"),
  { ssr: false }
);

function TestPage() {
  const editorRef = useRef<TuiEditorRef>(null);
  const editorRef2 = useRef<TuiEditorRef>(null);
  const [content, setContent] = useState("");
  const [pollItems, setPollItems] = useState<string[]>([""]);

  const handleGetContent = () => {
    const html = editorRef2.current?.getHTML();
    const markdown = editorRef2.current?.getMarkdown();

    console.log("HTML:", html);
    console.log("Markdown:", markdown);
  };

  const handleChangeContent = () => {
    const content = editorRef2.current?.getMarkdown();

    setContent(content || "");
  };

  return (
    <div className="w-full h-full py-20 flex flex-col gap-4">
      {/* 태그 radio 영역 */}
      <h3 className="text-lg">태그 선택</h3>
      <div className="flex gap-2">
        <div className="relative">
          <input type="radio" name="tag" id="tag1" className="hidden peer" />
          <label
            htmlFor="tag1"
            className="px-4 py-2 rounded-full border border-deep-navy hover:bg-gray-100 transition-colors peer-checked:bg-deep-navy peer-checked:text-white peer-checked:hover:bg-deep-navy cursor-pointer block"
          >
            태그1
          </label>
        </div>
        <div className="relative">
          <input type="radio" name="tag" id="tag2" className="hidden peer" />
          <label
            htmlFor="tag2"
            className="px-4 py-2 rounded-full border border-deep-navy hover:bg-gray-100 transition-colors peer-checked:bg-deep-navy peer-checked:text-white peer-checked:hover:bg-deep-navy cursor-pointer block"
          >
            태그2
          </label>
        </div>
        <div className="relative">
          <input type="radio" name="tag" id="tag3" className="hidden peer" />
          <label
            htmlFor="tag3"
            className="px-4 py-2 rounded-full border border-deep-navy hover:bg-gray-100 transition-colors peer-checked:bg-deep-navy peer-checked:text-white peer-checked:hover:bg-deep-navy cursor-pointer block"
          >
            태그3
          </label>
        </div>
      </div>

      {/* title 영역 */}
      <h3 className="text-lg">제목 *</h3>
      <input
        type="text"
        placeholder="제목을 입력해주세요."
        className="w-full p-4 border border-gray-300 rounded-md font-medium bg-gray-50 focus:bg-white trasition-colors"
      />

      {/* content 영역 */}
      <h3 className="text-lg">내용 *</h3>
      <textarea
        placeholder="내용을 입력해주세요."
        className="w-full p-4 border border-gray-300 rounded-md font-medium bg-gray-50 h-50 focus:bg-white trasition-colors"
      />

      {/* poll 영역 */}
      <h3 className="text-lg">투표</h3>
      <div className="flex gap-2 flex-col">
        {pollItems.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="투표 항목을 입력해주세요."
              className="w-full p-4 border border-gray-300 rounded-md font-medium bg-gray-50 focus:bg-white trasition-colors"
            />
          </div>
        ))}
        <button
          className="px-4 py-2 bg-deep-navy text-white rounded h-11"
          onClick={() => setPollItems([...pollItems, ""])}
        >
          투표 항목 추가
        </button>
      </div>

      {/* <PostPoll /> */}

      <TuiEditor ref={editorRef} viewer={true} initialValue={content} />

      <TuiEditor
        ref={editorRef2}
        viewer={false}
        onChange={handleChangeContent}
      />

      <button
        onClick={handleGetContent}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        내용 가져오기
      </button>
    </div>
  );
}

export default TestPage;
