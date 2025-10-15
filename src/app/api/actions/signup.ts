"use server";

import { ERROR_MESSAGES } from "@/domains/types";
import { nextFetcher } from "@/share/utils/nextFetcher";
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
  // ISO 8601 형식으로 변환
  const birthdayAt = `${
    birthday_rawData.year
  }-${birthday_rawData.month.padStart(2, "0")}-${birthday_rawData.day.padStart(
    2,
    "0"
  )}T00:00:00`;

  const agree = (formData.get("agree") ?? "").toString().trim();

  console.log("=== 보내는 데이터 ===", {
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

  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const res = await nextFetcher(`${baseUrl}/api/v1/users-auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
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

    revalidatePath("/");

    return { success: true, data: await res.json() };
  } catch (error) {  
    // Error 객체에서 메시지를 추출
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // 서버에서 온 에러 코드를 ERROR_MESSAGES 키로 매칭
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
