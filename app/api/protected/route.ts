// app/api/protected/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // 👈 import config
import mongoose from "mongoose";

// (Tùy chọn) connectDB đơn giản tại đây nếu cần
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: "lms" });
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  return NextResponse.json({
    ok: true,
    user: session.user,
    role: (session as any).role,
  });
}
