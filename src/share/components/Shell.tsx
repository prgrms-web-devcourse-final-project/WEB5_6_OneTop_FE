"use client";

import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollTopButton from "./ScrollTopButton";
import { usePathname } from "next/navigation";
import { useLoginModalStore } from "@/domains/auth/stores/loginModalStore";

interface ShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showScrollTop?: boolean;
  headerVariant?: "default" | "transparent" | "light" | "primary";
}

export default function Shell({
  children,
  showHeader = true,
  showFooter = true,
  showScrollTop = true,
  headerVariant = "default",
}: ShellProps) {
  const pathname = usePathname();
  const setLoginModalOpen = useLoginModalStore((s) => s.setIsOpen);

  useEffect(() => {
    setLoginModalOpen(false);
  }, [pathname, setLoginModalOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header variant={headerVariant} />}

      <main className="flex flex-col items-center sm:items-start w-full flex-1">
        {children}
      </main>

      {showFooter && <Footer />}

      {showScrollTop && <ScrollTopButton />}
    </div>
  );
}
