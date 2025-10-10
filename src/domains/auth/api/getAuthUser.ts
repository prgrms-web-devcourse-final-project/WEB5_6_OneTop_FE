"use server";

import { queryKeys } from "@/share/config/queryKeys";
import { nextFetcher } from "@/share/utils/nextFetcher";
import { headers } from "next/headers";

// src/domains/auth/api/getAuthUser.ts 수정
export async function getAuthUser() {

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const response = await nextFetcher(`${baseUrl}/api/v1/users-auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: {
        revalidate: 300,
        tags: queryKeys.auth.me(),
      },
    });

    if (!response.ok) {
      const errorText = await response.json();
      throw new Error(errorText.message);
    }

    if (!response || response.status === 401) {
      return null;
    }

    // JSON 파싱 시도
    try {
      const data = await response.json();
      return data;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return null;
    }

  } catch (error) {
    console.error("getAuthUser error:", error);
    return null;
  }
}