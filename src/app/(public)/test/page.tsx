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
    <div className="w-full h-full py-20">
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
