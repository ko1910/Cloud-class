



"use client";

import { useEffect, useState } from "react";

export default function QuizPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<(boolean | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 📘 1️⃣ Lấy dữ liệu khóa học & quiz
  useEffect(() => {
    async function fetchCourse() {
      const res = await fetch(`/api/courses/${params.id}`);
      const data = await res.json();
      setCourse(data);
      setAnswers(Array(data.quizzes?.length || 0).fill(-1)); // -1 = chưa chọn
      setResults(Array(data.quizzes?.length || 0).fill(null)); // null = chưa làm
      setLoading(false);
    }
    fetchCourse();
  }, [params.id]);

  if (loading) return <p>Đang tải...</p>;
  if (!course) return <p>Không tìm thấy khóa học.</p>;

  // 📤 2️⃣ Gửi kết quả quiz lên API
  async function handleSubmit(quizIndex: number) {
    if (answers[quizIndex] === -1) {
      setMessage("⚠️ Hãy chọn một đáp án trước khi nộp!");
      return;
    }

    setMessage("⏳ Đang chấm...");

    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: course._id,
        quizId: quizIndex,
        selectedIndex: answers[quizIndex],
      }),
    });

    const data = await res.json();
    if (data.correct !== undefined) {
      const newResults = [...results];
      newResults[quizIndex] = data.correct;
      setResults(newResults);
      setMessage(data.correct ? "✅ Chính xác!" : "❌ Sai rồi!");
    } else {
      setMessage("⚠️ Lỗi khi chấm bài!");
    }
  }

  // 3️⃣ Hiển thị giao diện quiz
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Quiz - {course.title}
      </h1>

      {course.quizzes?.map((quiz: any, index: number) => (
        <div
          key={index}
          className="border rounded-lg p-4 mb-6 shadow-sm bg-white"
        >
          <p className="font-medium mb-2">
            Câu {index + 1}: {quiz.question}
          </p>

          {quiz.options.map((opt: string, i: number) => (
            <label key={i} className="block mb-1 cursor-pointer">
              <input
                type="radio"
                name={`quiz-${index}`}
                value={i}
                checked={answers[index] === i}
                onChange={() => {
                  const newAnswers = [...answers];
                  newAnswers[index] = i;
                  setAnswers(newAnswers);
                }}
              />{" "}
              {opt}
            </label>
          ))}

          <button
            onClick={() => handleSubmit(index)}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Nộp câu {index + 1}
          </button>

          {results[index] !== null && (
            <p className="mt-2">
              {results[index] ? (
                <span className="text-green-600">✅ Đúng</span>
              ) : (
                <span className="text-red-600">❌ Sai</span>
              )}
            </p>
          )}
        </div>
      ))}

      {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
    </div>
  );
}
