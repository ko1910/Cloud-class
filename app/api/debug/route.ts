// src/app/api/debug/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  const uri = process.env.MONGODB_URI;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    MONGODB_URI_EXISTS: !!uri,
    MONGODB_URI_PREVIEW: uri ? uri.substring(0, 30) + "..." : "MISSING",
    MONGODB_URI_FULL: uri,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
  });
}