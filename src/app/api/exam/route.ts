import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isbn13 = searchParams.get("isbn13");
  if (!isbn13) return NextResponse.json({ error: "isbn13 required" }, { status: 400 });

  const base = process.env.NEXT_LIBRARY_HOST!;
  const key = process.env.NEXT_LIBRARY_KEY!;
  const url = `${base}/srchDtlList?authKey=${key}&isbn13=${isbn13}&format=json`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "upstream error" }, { status: res.status });

  const data = await res.json();
  return NextResponse.json(data);
}