// src/app/api/courses/[id]/quizzes/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course"; 

export async function POST(
  req: Request,
  { params }: { params: { id: string } } 
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role === "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { question, options, correctAnswerIndex } = await req.json();
    const courseId = params.id;

    if (!question || !options || correctAnswerIndex === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // === THÊM LOG ĐỂ DEBUG ===
    console.log("ID CHỦ KHÓA HỌC (từ DB):", String(course.instructorId));
    console.log("ID USER (từ Session):", session.user.id);
    console.log("SO SÁNH:", String(course.instructorId) === session.user.id);
    // ==========================

    if (String(course.instructorId) !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newQuiz = {
      question,
      options,
      correctAnswerIndex,
    };

    course.quizzes.push(newQuiz);
    await course.save();

    const createdQuiz = course.quizzes[course.quizzes.length - 1];
    return NextResponse.json(createdQuiz, { status: 201 });

  } catch (error) {
    console.error("POST /api/courses/[id]/quizzes error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}