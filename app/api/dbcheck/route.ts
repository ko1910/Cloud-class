// app/api/dbcheck/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json({ ok: false, error: "NO_URI" }, { status: 500 });
  }

  try {
    // Chỉ kết nối nếu chưa kết nối
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, { dbName: "lms" });
    }
    return NextResponse.json({
      ok: true,
      state: mongoose.connection.readyState, // 1 = connected
    });
  } catch (e: any) {
    // Ghi log để xem trong Amplify → Monitoring → Logs
    console.error("DBCHECK FAIL:", {
      name: e?.name,
      code: e?.code,
      message: e?.message,
      reason: e?.reason?.code || e?.reason?.message,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "CONNECT_FAIL",
        name: e?.name || null,
        code: e?.code || null,
        message: e?.message || null,
        reason: e?.reason?.message || null,
      },
      { status: 500 }
    );
  }
}
