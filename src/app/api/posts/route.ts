import { mockPostListResponse } from "@/domains/community/data/mock";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const size = searchParams.get("size");

  const posts = mockPostListResponse.data.items;

  return NextResponse.json(posts);
}