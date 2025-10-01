"use client";

import dynamic from "next/dynamic";
const TuiEditor = dynamic(() => import("@/domains/community/components/ToastEditor"), {ssr: false});


function TestPage() {
  return <TuiEditor />;
}
export default TestPage;
