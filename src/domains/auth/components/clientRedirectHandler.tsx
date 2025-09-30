"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ClientRedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentPath =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    const onboardingUrl = `/onboarding?redirectTo=${encodeURIComponent(
      currentPath
    )}`;

    console.log("Client redirect - current path:", currentPath);
    console.log("Client redirect - onboarding URL:", onboardingUrl);

    router.push(onboardingUrl);
  }, [router, pathname, searchParams]);

  return (
    <div className="min-h-[calc(100vh)] flex items-center justify-center bg-deep-navy">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <div className="text-white text-xl">인증 확인 중...</div>
      </div>
    </div>
  );
}
