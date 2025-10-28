// File: app/api/quiz/submit/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb"; // Đảm bảo đường dẫn này đúng
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment"; // <-- THÊM IMPORT NÀY

export async function POST(req: Request) {
  try {
    // 1️⃣ Kiểm tra đăng nhập
    const session = await getServerSession(authOptions);
    if (!session || !session.user) { // Thêm kiểm tra .user cho chắc
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // 2️⃣ Lấy dữ liệu từ request
    const { courseId, quizId, selectedIndex } = await req.json();
    if (!courseId || !quizId || selectedIndex === undefined) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 3️⃣ Kết nối DB
    await connectDB();

    // 4️⃣ THÊM BƯỚC KIỂM TRA ENROLL (QUAN TRỌNG)
    const enrollment = await Enrollment.findOne({ userId: userId, courseId: courseId });
    if (!enrollment) {
      return NextResponse.json({ error: "Bạn chưa ghi danh vào khóa học này" }, { status: 403 });
    }

    // 5️⃣ Lấy course
    const course = await Course.findById(courseId).select("quizzes");
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 6️⃣ SỬA LẠI CÁCH TÌM QUIZ (Dùng .find() để tìm bằng _id)
    const quiz = course.quizzes.find((q: any) => q._id.toString() === quizId);

    if (!quiz) {
      // Dòng log này để debug (bạn có thể xóa sau)
      console.log("Tìm Quiz ID (từ Client):", `"${quizId}"`);
      console.log("Các ID có trong DB:", course.quizzes.map((q: any) => `"${q._id.toString()}"`));
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // 7️⃣ SỬA LẠI TÊN TRƯỜNG (thêm 'Answer')
    const correct = quiz.correctAnswerIndex === selectedIndex;

    // 8️⃣ Trả kết quả
    return NextResponse.json({ correct });

  } catch (error) {
    console.error("❌ Error submitting quiz:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}