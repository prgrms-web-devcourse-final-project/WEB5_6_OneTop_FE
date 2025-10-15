"use server";

import { ERROR_MESSAGES } from "@/domains/types";
import { getApiBaseUrl } from "@/share/config/api";
import { nextFetcher } from "@/share/utils/nextFetcher";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// csrf 토큰 처리
// double submit cookie 방식으로 처리
// httpOnly + csrftoken 방식으로 처리

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString().trim();

  if (!email || !password) throw new Error("이메일과 비밀번호를 입력해주세요.");

  try {
    const res = await nextFetcher(
      `${getApiBaseUrl()}/api/v1/users-auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      }
    );

    const data = await res.json();

    // Set-Cookie 헤더로 자동으로 JSESSIONID가 설정됨
    const setCookieHeaders = res.headers.get("set-cookie");
    console.log("Set-Cookie headers:", setCookieHeaders);

    if (setCookieHeaders) {
      const jsessionid = setCookieHeaders.match(/JSESSIONID=([^;]+)/)?.[1];
      const cookieStore = await cookies();
      cookieStore.set("JSESSIONID", jsessionid || "", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    // 성공 시 쿼리 갱신
    revalidatePath("/");

    return { success: true, data };
  } catch (error) {
    console.log("error", error);
    
    // Error 객체에서 메시지를 추출
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // 서버에서 온 에러 코드를 ERROR_MESSAGES 키로 매칭
    // nextFetcher에서 errorBody.title을 던지므로 이미 "NICKNAME_DUPLICATION" 형식
    const parsedMessage = ERROR_MESSAGES[errorMessage as keyof typeof ERROR_MESSAGES] 
      || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    
    return {
      success: false,
      data: {
        data: {
          message: parsedMessage,
        },
      },
    };
  }
}
