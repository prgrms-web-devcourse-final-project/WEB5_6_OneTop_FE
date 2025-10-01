"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function logoutAction() {
  // 근데 이게 서버에는 관련 액션이 없던 것 같은데.
  try {  
    const cookieStore = await cookies();
    cookieStore.delete("JSESSIONID");

    revalidateTag('auth');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error) {
    throw new Error("Failed to logout", { cause: error });
  }
}