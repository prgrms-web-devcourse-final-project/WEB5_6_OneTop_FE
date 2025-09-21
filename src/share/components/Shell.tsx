import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollTopButton from "./ScrollTopButton";

interface ShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showScrollTop?: boolean;
  headerVariant?: "default" | "transparent" | "light" | "dark";
}

export default function Shell({
  children,
  showHeader = true,
  showFooter = true,
  showScrollTop = true,
  headerVariant = "default",
}: ShellProps) {
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
