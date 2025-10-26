
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

export async function POST(req: Request) {
  try {
    // 1️⃣ Kiểm tra đăng nhập
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Lấy dữ liệu từ request
    const { courseId, quizId, selectedIndex } = await req.json();
    if (!courseId || quizId === undefined || selectedIndex === undefined) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 3️⃣ Kết nối DB
    await connectDB();

    // 4️⃣ Lấy course
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // ✅ 5️⃣ quizId trong code của bạn hiện đang dùng như "vị trí trong mảng"
    // Nếu quizId là index (0,1,2,...) thì phần này đúng
    // Nếu quizId là ObjectId (Mongo tự sinh) → cần tìm theo _id thay vì index
    const quiz = course.quizzes[quizId]; // nếu bạn dùng index
    // const quiz = course.quizzes.id(quizId); // nếu bạn dùng _id của quiz

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // 6️⃣ Kiểm tra đúng/sai
    const correct = quiz.correctIndex === selectedIndex;

    // 7️⃣ Trả kết quả
    return NextResponse.json({ correct });
  } catch (error) {
    console.error("❌ Error submitting quiz:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
