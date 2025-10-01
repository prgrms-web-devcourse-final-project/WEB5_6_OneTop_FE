"use server";

import { cookies } from "next/headers";

export async function nextFetcher(url: string, options?: RequestInit) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // 기본 헤더 설정
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // 기존 헤더와 새 헤더를 병합
  const mergedHeaders = {
    ...defaultHeaders,
    ...(allCookies && {
      Cookie: allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; "),
    }),
    ...options?.headers, // 옵션으로 부여한 속성이 우선순위를 가지도록 수정
  };
  const newOptions: RequestInit = {
    ...options,
    headers: mergedHeaders,
  };

  const response = await fetch(url, newOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Error fetching data:", errorBody);
    switch (response.status) {
      case 401:
        throw new Error("Unauthorized");
      case 403:
        throw new Error("Forbidden");
      default:
        throw new Error(`Request failed with status ${response.status}`);
    }
  }

  return response;
}
