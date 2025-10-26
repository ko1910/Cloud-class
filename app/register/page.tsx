
"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");      // tên hiển thị
  const [email, setEmail] = useState("");    // email đăng nhập
  const [password, setPassword] = useState(""); // mật khẩu
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("⏳ Đang xử lý...");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Đăng ký thất bại");
      } else {
        setMessage("🎉 Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      }
    } catch (error) {
      console.error(error);
      setMessage("🚨 Lỗi kết nối tới server.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Đăng ký tài khoản</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: 8, width: "100%" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: 8, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: 8, width: "100%" }}
        />
        <button
          type="submit"
          style={{
            marginTop: 10,
            padding: "8px 16px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Đăng ký
        </button>
      </form>
      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}
