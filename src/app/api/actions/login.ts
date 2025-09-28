"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";


// csrf 토큰 처리
// 어떻게 부여되는가. httpOnly 쿠키로 부여되는가? <- 아닌 것 같음. 읽을 수 있는 형태
// 읽을 수 있다면 헤더에 명시적으로 싣어줘야 하는지
// 읽을 수 없다면 credentials: "include" 옵션으로 보내줘야 함.
// 지금은 쿠키를 로그인 시점에 받고 있는데, 분리된다면 로그인 시에 안 받는 거겠지?

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
    headers: { "Content-Type": "application/json",
      "Accept": "application/json"
     },
    credentials: "include",
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    // RFC 7807 Problem Details 형태의 에러 응답 처리
    const errorMessage = error.detail || error.message || "로그인에 실패했습니다.";
    throw new Error(errorMessage);
  }

  if (!res.ok) throw new Error("로그인 실패");

  const data = await res.json();
  console.log("Login response data:", data);

  // Set-Cookie 헤더로 자동으로 JSESSIONID가 설정됨
  const setCookieHeaders = res.headers.get('set-cookie');
  console.log("Set-Cookie headers:", setCookieHeaders);

  // 성공 시 쿼리 갱신
  revalidatePath("/");
}
