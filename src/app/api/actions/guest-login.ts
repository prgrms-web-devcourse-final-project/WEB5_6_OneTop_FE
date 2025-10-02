"use server";

import { nextFetcher } from "@/share/utils/nextFetcher";
import { cookies, headers } from "next/headers";

export async function guestLoginAction() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await nextFetcher(`${baseUrl}/api/v1/users-auth/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    cache: "no-store",
  });

  const cookieStore = await cookies();
  const jsessionid = res.headers.get("set-cookie")?.split(";")[0].split("=")[1];
  cookieStore.set("JSESSIONID", jsessionid || "", {
    path: "/",
    httpOnly: true,
  });

  if (!res.ok) {
    const error = await res.json();
    console.log(error);
    throw new Error("Guest login failed");
  }

  return res.json();
}
