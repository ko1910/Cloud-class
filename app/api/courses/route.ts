//app/api/courses/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({ published: true }).select("title description");
    return NextResponse.json(courses);
  } catch (error) {
    console.error("GET /api/courses error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description } = await req.json();
  const role = (session.user as any).role;

  if (role === "student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const course = await Course.create({
    title,
    description,
    instructorId: (session.user as any).id,
  });

  return NextResponse.json(course, { status: 201 });
}