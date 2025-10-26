
// app/protected/page.tsx
"use client";
import { useSession } from "next-auth/react";

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Đang tải...</p>;
  if (!session) return <p>Bạn cần đăng nhập!</p>;

  return <div>Xin chào {session.user?.name} (vai trò: {(session.user as any).role})</div>;
}
