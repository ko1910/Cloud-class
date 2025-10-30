
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  await connectDB();

  const courses = await Course.find({}, { title: 1 });
  return NextResponse.json({ courses });
}
