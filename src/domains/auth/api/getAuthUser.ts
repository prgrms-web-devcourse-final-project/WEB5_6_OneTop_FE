"use server";


import { headers } from "next/headers";

export async function getAuthUser() {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');
    
    console.log("=== getAuthUser Debug ===");
    console.log("Full cookie header:", cookieHeader);
    console.log("Has JSESSIONID:", cookieHeader?.includes('JSESSIONID'));
    
    // JSESSIONID 값 추출해서 확인
    const jsessionMatch = cookieHeader?.match(/JSESSIONID=([^;]+)/);
    console.log("JSESSIONID value:", jsessionMatch?.[1]);
    
    if (!cookieHeader?.includes('JSESSIONID')) {
      console.log("No JSESSIONID found in cookies");
      return null;
    }

    console.log("Making request to: http://localhost:3000/api/v1/users-auth/me");
    
    const response = await fetch("http://localhost:3000/api/v1/users-auth/me", {
      headers: {
        "Cookie": cookieHeader,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: 'no-store',
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.log("Response not ok, status:", response.status);
      const errorText = await response.text();
      console.log("Error response:", errorText);
      return null;
    }

    const data = await response.json();
    console.log("Response data:", data);
    console.log("Data type:", typeof data);
    console.log("Data.message:", data.message);
    
    if (data.message === "anonymous" || data === "anonymous") {
      console.log("User is anonymous");
      return null;
    }

    console.log("User authenticated:", data);
    return data;
  } catch (error) {
    console.error("Failed to get auth user:", error);
    console.error("Error details:", error);
    return null;
  }
}