import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  const url = `${BACKEND_URL}/api/subjects`;
  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const url = `${BACKEND_URL}/api/subjects`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
  const url = `${BACKEND_URL}/api/subjects/${req.nextUrl.searchParams.get("id")}`;
  const body = await req.json();
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const url = `${BACKEND_URL}/api/subjects/${req.nextUrl.searchParams.get("id")}`;
  const res = await fetch(url, { method: "DELETE" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}