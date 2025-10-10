"use server";

import { getApiBaseUrl } from "@/share/config/api";
import { nextFetcher } from "@/share/utils/nextFetcher";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function logoutAction() {
  // 근데 이게 서버에는 관련 액션이 없던 것 같은데.
  try {
    const cookieStore = await cookies();
    cookieStore.delete("JSESSIONID");

    revalidateTag('auth');
    revalidatePath('/', 'layout');

    nextFetcher(`${getApiBaseUrl()}/api/v1/users-auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
    });

    return { success: true };
  } catch (error) {
    throw new Error("Failed to logout", { cause: error });
  }
}