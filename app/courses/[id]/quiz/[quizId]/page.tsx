
"use client";
import { useEffect, useState } from "react";

export default function QuizPage({ params }: { params: { quizId: string } }) {
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/quiz?id=${params.quizId}`)
      .then((res) => res.json())
      .then(setQuiz);
  }, [params.quizId]);

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: params.quizId, answers }),
    });
    const data = await res.json();
    setResult(data);
  };

  if (!quiz) return <p>Đang tải...</p>;
  if (result)
    return (
      <div className="p-6">
        <h2>Kết quả</h2>
        <p>Điểm: {result.score}% ({result.correct}/{result.total})</p>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      {quiz.questions.map((q: any, qi: number) => (
        <div key={qi} className="mb-6">
          <p className="font-semibold">{qi + 1}. {q.question}</p>
          {q.options.map((opt: string, oi: number) => (
            <label key={oi} className="block">
              <input
                type="radio"
                name={`q${qi}`}
                onChange={() => handleAnswer(qi, oi)}
                checked={answers[qi] === oi}
              /> {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
        Nộp bài
      </button>
    </div>
  );
}
