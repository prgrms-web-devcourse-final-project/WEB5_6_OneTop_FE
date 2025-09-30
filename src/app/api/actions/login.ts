"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

// csrf 토큰 처리
// double submit cookie 방식으로 처리
// httpOnly + csrftoken 방식으로 처리

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString().trim();

  if (!email || !password) throw new Error("이메일과 비밀번호를 입력해주세요.");

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/v1/users-auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    // RFC 7807 Problem Details 형태의 에러 응답 처리
    const errorMessage =
      error.detail || error.message || "로그인에 실패했습니다.";
    throw new Error(errorMessage);
  }

  if (!res.ok) throw new Error("로그인 실패");

  const data = await res.json();
  console.log("Login response data:", data);

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
    console.log("Cookie:", jsessionid);
  }

  // 성공 시 쿼리 갱신
  revalidatePath("/");
}
