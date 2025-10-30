export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Thiếu email hoặc mật khẩu" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Sai mật khẩu" },
        { status: 401 }
      );
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.NEXTAUTH_SECRET || "dev-secret",
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "Đăng nhập thành công!", token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
  }
}
