// File: app/api/courses/[id]/route.ts

import { NextResponse, NextRequest } from "next/server"; // Đảm bảo import NextRequest
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb"; // Đảm bảo đây là file 'mongodb.ts' của bạn
import Course from "@/models/Course";

/**
 * 📘 GET: Lấy thông tin chi tiết 1 khóa học theo ID
 */
export async function GET(
  req: NextRequest, // <--- LỖI 1: SỬA THÀNH NextRequest
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("GET /api/courses/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * 📙 PATCH: Cập nhật thông tin khóa học
 */
export async function PATCH(
  req: NextRequest, // Tham số này đã đúng
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (String(course.instructorId) !== userId && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // === LỖI 2: SỬA PHẦN CẬP NHẬT ===
    
    // Lấy các trường cụ thể từ body
    const { title, description, published } = await req.json();

    // Gán thủ công (an toàn)
    if (title) {
      course.title = title;
    }
    if (description) {
      course.description = description;
    }
    if (typeof published === "boolean") {
      course.published = published;
    }
    // Xóa dòng 'Object.assign(course, body);'
    
    // ================================

    await course.save();

    return NextResponse.json(course);
  } catch (error) {
    console.error("PATCH /api/courses/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}