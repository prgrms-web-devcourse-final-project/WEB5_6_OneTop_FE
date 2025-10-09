"use server";

import { cookies, headers } from "next/headers";

export async function nextFetcher(url: string, options?: RequestInit) {
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

      switch (response.status) {
        case 401:
          throw new Error(errorBody.message);
        case 403:
          throw new Error(errorBody.message);
        default:
          throw new Error(`${response.status} - ${errorBody.message}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  return response;
}
