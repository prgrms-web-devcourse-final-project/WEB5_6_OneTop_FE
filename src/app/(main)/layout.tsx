import { Suspense } from "react";
import AuthErrorHandler from "@/domains/auth/components/AuthErrorHandler";
import Shell from "@/share/components/Shell";
import ScrollSmootherProvider from "@/share/providers/ScrollSmoothProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Shell showFooter={false} headerVariant="transparent">
      <Suspense fallback={null}>
        <AuthErrorHandler />
      </Suspense>

      <div className="bg-[#02020D] w-full">
        <ScrollSmootherProvider>{children}</ScrollSmootherProvider>
      </div>
    </Shell>
  );
}
