"use server";

import { cookies, headers } from "next/headers";
import { getApiBaseUrl } from "../config/api";

export async function nextFetcher(
  url: string,
  options?: RequestInit,
  isRetry = false
) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const headersList = await headers();
  const requestCookies = headersList.get("cookie");

  const xsrfToken = allCookies.find((cookie) => cookie.name === "XSRF-TOKEN");

  // 기본 헤더 설정
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // XSRF 토큰이 있을 때만 헤더에 추가
  if (xsrfToken?.value) {
    defaultHeaders["X-XSRF-TOKEN"] = xsrfToken.value;
  }

  // 기존 헤더와 새 헤더를 병합
  const cookieHeader =
    requestCookies ||
    (allCookies.length
      ? allCookies.map((c) => `${c.name}=${c.value}`).join("; ")
      : "");

  const mergedHeaders = {
    ...defaultHeaders,
    ...(cookieHeader && { Cookie: cookieHeader }),
    ...options?.headers,
  };

  const newOptions: RequestInit = {
    ...options,
    headers: mergedHeaders,
    credentials: "include",
  };

  const response = await fetch(url, newOptions);

  if (!response.ok) {
    try {
      const errorBody = await response.json();

      if (response.status === 403 && !isRetry) {
        console.log("403 에러 - CSRF 토큰 재발급 시도");
        try {
          await fetch(`${getApiBaseUrl()}/api/v1/users-auth/me`, {
            method: "GET",
            credentials: "include",
            headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
          });

          console.log("CSRF 토큰 재발급 성공");
          return await nextFetcher(url, options, true);
        } catch (error) {
          console.error("CSRF 토큰 재발급 실패:", error);
          throw error;
        }
      }

      // errorBody.title에 에러 코드가 있음 (예: "NICKNAME_DUPLICATION")
      // title이 있으면 우선 사용, 없으면 message 사용
      const errorMessage =
        errorBody.title || errorBody.message || "Unknown error";

      throw new Error(errorMessage);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  return response;
}
