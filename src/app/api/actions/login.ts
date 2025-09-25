"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString().trim();

  if (!email || !password) throw new Error("이메일과 비밀번호를 입력해주세요.");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const res = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
    credentials: "include",
    next: {
      revalidate: 10,
      tags: ["auth", "login"],
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  if (!res.ok) throw new Error("로그인 실패");

  const { accessToken, refreshToken } = await res.json();

  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 3,
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  // 성공 시 쿼리 갱신
  revalidatePath("/");
  const result = await res.json();
  
  return result;
}
