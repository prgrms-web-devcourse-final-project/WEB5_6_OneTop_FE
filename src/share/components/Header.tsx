"use client";

import Image from "next/image";

function Header() {
  return (
    <header className="w-full h-15 bg-amber-200 flex-shrink-0 px-60 items-center justify-between">
      <div className="flex items-center gap-4">
        <Image src="/logo_32.svg" alt="logo" width={32} height={32} />
        <h1 className="text-2xl font-bold">Re:Life</h1>
      </div>
      <div className="flex items-center gap-12">
        <button className="text-sm">인생 기록</button>
        <button className="text-sm">시나리오 목록</button>
        <button className="text-sm">커뮤니티</button>
        <button className="text-sm">마이 페이지</button>
      </div>

      <button type="button" className="w-25 h-10 ">

      </button>
    </header>
  )
}
export default Header