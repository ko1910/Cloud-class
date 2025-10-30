import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    url: process.env.NEXTAUTH_URL || null,
    secretSet: !!process.env.NEXTAUTH_SECRET,
  });
}
