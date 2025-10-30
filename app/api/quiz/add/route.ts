
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "instructor") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

  const { courseId, question, options, correctIndex } = await req.json();

  if (!courseId || !question || !options || correctIndex === undefined) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  await connectDB();

  const course = await Course.findById(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  course.quizzes.push({ question, options, correctIndex });
  await course.save();

  return NextResponse.json({
    ok: true,
    quizCount: course.quizzes.length,
  });
}
