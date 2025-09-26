"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function signupAction(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString().trim();
  const username = (formData.get("name") ?? "").toString().trim();
  const nickname = (formData.get("nickname") ?? "").toString().trim();
  const birthday_rawData = {
    year: (formData.get("birthday_at.year") ?? "").toString().trim(),
    month: (formData.get("birthday_at.month") ?? "").toString().trim(),
    day: (formData.get("birthday_at.day") ?? "").toString().trim(),
  };
  // toISOString 써서 변환해야 되나?
  const birthdayAt = `${
    birthday_rawData.year
  }-${birthday_rawData.month.padStart(2, "0")}-${birthday_rawData.day.padStart(
    2,
    "0"
  )}T00:00:00.000Z`;

  const agree = (formData.get("agree") ?? "").toString().trim();

  console.log("Server Action Received:", {
    email,
    password,
    username,
    nickname,
    birthdayAt,
    agree,
  });

  if (!email || !password || !username || !nickname || !birthdayAt || !agree) {
    throw new Error("모든 필수 항목을 입력해주세요.");
  }

  //121212a*
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`http://localhost:8080/api/v1/users-auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // 여기는 필요 없을 수도.
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
      username,
      nickname,
      birthdayAt,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.log("회원가입 실패 -Backend response:", res);
    // throw new Error("회원가입 실패");
  }

  console.log("회원가입 성공 -Backend response:", res);
  revalidatePath("/");

  // 임시로 안전한 객체 반환
  return { success: true };
}
