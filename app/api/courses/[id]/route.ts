import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

/** 📘 GET: lấy chi tiết 1 khóa học theo ID */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const course = await Course.findById(params.id);
    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(course);
  } catch (error) {
    console.error("GET /api/courses/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** 📙 PATCH: cập nhật khóa học */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const course = await Course.findById(params.id);
    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    if (String(course.instructorId) !== userId && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, description, published } = await req.json();
    if (title) course.title = title;
    if (description) course.description = description;
    if (typeof published === "boolean") course.published = published;

    await course.save();
    return NextResponse.json(course);
  } catch (error) {
    console.error("PATCH /api/courses/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
