"use server";

import { queryKeys } from "@/share/config/queryKeys";
import { headers } from "next/headers";

export async function getAuthUser() {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");

    // JSESSIONID 값 추출해서 확인
    const jsessionMatch = cookieHeader?.match(/JSESSIONID=([^;]+)/);
    console.log("JSESSIONID value:", jsessionMatch?.[1]);

    if (!cookieHeader?.includes("JSESSIONID")) {
      console.log("No JSESSIONID found in cookies");
      return null;
    }

    const response = await fetch("http://localhost:3000/api/v1/users-auth/me", {
      headers: {
        Cookie: cookieHeader,
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

    const data = await response.json();

    if (data.message === "anonymous" || data === "anonymous") {
      return null;
    }
    return data;
  } catch (error) {
    throw new Error("Failed to get auth user", { cause: error });
  }
}
