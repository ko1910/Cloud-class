export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

async function getParams(context: any) {
  const p = context?.params;
  if (typeof p?.then === "function") return await p;
  return p;
}

/** 📘 GET: Lấy chi tiết khóa học */
export async function GET(req: NextRequest, context: any) {
  const { id } = await getParams(context);
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await connectDB();
  try {
    const course = await Course.findById(id);
    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(course);
  } catch (e) {
    console.error("GET /api/courses/[id] error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** 📙 PATCH: Cập nhật khóa học */
export async function PATCH(req: NextRequest, context: any) {
  const { id } = await getParams(context);
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  try {
    const course = await Course.findById(id);
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
  } catch (e) {
    console.error("PATCH /api/courses/[id] error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
