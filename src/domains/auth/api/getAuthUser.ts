import { queryKeys } from "@/share/config/queryKeys";
import { nextFetcher } from "@/share/utils/nextFetcher";

// src/domains/auth/api/getAuthUser.ts 수정
export async function getAuthUser() {
  try {
    const response = await nextFetcher("http://localhost:3000/api/v1/users-auth/me", {
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
      const errorText = await response.text();
      throw new Error(errorText);
    }

    // 먼저 text로 읽어보기
    const responseText = await response.text();
    console.log("responseText:", responseText);

    if (!responseText || responseText.trim() === "") {
      return null;
    }

    // JSON 파싱 시도
    try {
      const data = JSON.parse(responseText);
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