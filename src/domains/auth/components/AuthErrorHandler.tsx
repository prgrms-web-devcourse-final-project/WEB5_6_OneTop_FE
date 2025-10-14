"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

const ERROR_MESSAGES: Record<string, string> = {
  // OAuth2 에러
  OAUTH2_FAILURE: "소셜 로그인에 실패했습니다.\n다시 시도해주세요.",
  ACCESS_DENIED: "소셜 로그인 접근이 거부되었습니다.",
  EMAIL_MISSING:
    "이메일 정보를 가져올 수 없습니다.\n이메일 제공 동의가 필요합니다.",
  INVALID_STATE:
    "소셜 로그인 상태가 유효하지 않습니다.\n처음부터 다시 시도해주세요.",
  PROVIDER_UNAVAILABLE:
    "소셜 로그인 서비스를 일시적으로 사용할 수 없습니다.\n잠시 후 다시 시도해주세요.",
  CLIENT_CONFIG_ERROR:
    "소셜 로그인 설정에 문제가 있습니다.\n관리자에게 문의해주세요.",
};

export default function AuthErrorHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    const code = searchParams.get("code");

    if (status === "error" && code) {
      const errorMessage =
        ERROR_MESSAGES[code] || "인증 중 오류가 발생했습니다.";

      Swal.fire({
        icon: "error",
        title: "OAuth 로그인 실패",
        html: errorMessage.replace(/\n/g, "<br/>"),
        confirmButtonText: "확인",
        confirmButtonColor: "#E76F51",
      }).then(() => {
        router.replace(window.location.pathname);
      });
    }
  }, [searchParams, router]);

  return null;
}
