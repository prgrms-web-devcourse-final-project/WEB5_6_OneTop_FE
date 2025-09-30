import { api } from "@/share/config/api";

// 클라이언트 사이드 전용 버전
export async function getAuthUserClient() {
  try {
    const response = await api.get("http://localhost:3000/api/v1/users-auth/me", {
      withCredentials: true, // 쿠키 자동 포함
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status !== 200) {
      console.log("Auth check failed:", response.status);
      return null;
    }

    // Fix: Axios response.headers is not a Headers object, and .get() is not available.
    // Instead, check content-length via response.headers['content-length'] or response.headers["content-length"]
    if (
      response.headers["content-length"] === "0" ||
      response.data === null
    ) {
      console.log("Empty response - user not authenticated");
      return null;
    }

    const data = response.data;
    console.log("Auth user data:", data);
    return data;
  } catch (error) {
    console.error("getAuthUserClient error:", error);
    return null;
  }
}