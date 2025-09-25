"use server";

import { revalidatePath } from "next/cache";

export async function signupAction(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString().trim();
  const name = (formData.get("name") ?? "").toString().trim();
  const nickname = (formData.get("nickname") ?? "").toString().trim();
  const birthday_rawData = {
    year: (formData.get("birthday_at.year") ?? "").toString().trim(),
    month: (formData.get("birthday_at.month") ?? "").toString().trim(),
    day: (formData.get("birthday_at.day") ?? "").toString().trim(),
  };
  // toISOString 써서 변환해야 되나?
  const birthday_at = new Date(
    Number(birthday_rawData.year),
    Number(birthday_rawData.month) - 1,
    Number(birthday_rawData.day)
  );
  const agree = (formData.get("agree") ?? "").toString().trim();

  if (!email || !password || !name || !nickname || !birthday_at || !agree) {
    throw new Error("모든 필수 항목을 입력해주세요.");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // TODO: NEXT ROUTER 사용해 베이스 URL 변경하도록 조정
  const res = await fetch(`${apiUrl}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // 여기는 필요 없을 수도.
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
      name,
      nickname,
      birthday_at,
      agree,
    }),
    cache: "no-store",
    next: {
      revalidate: 10,
      tags: ["auth", "signup"],
    },
  });

  const result = await res.json();
  revalidatePath("/");

  return result
}
