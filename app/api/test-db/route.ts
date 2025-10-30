// app/api/test-db/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectDB();
    const count = await Course.countDocuments();
    return NextResponse.json({ message: "DB OK", count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}