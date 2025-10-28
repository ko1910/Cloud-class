
import mongoose, { Schema, model, models } from "mongoose";

const LessonSchema = new Schema({ 
  title: String, 
  type: { type: String, enum: ["video", "article"], default: "article" }, 
  content: String, 
  order: Number 
});

const QuizSchema = new Schema({
  question: { type: String, required: true },
  options: [String],
  correctAnswerIndex: { type: Number, required: true }
});

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructorId: { type: String, default: null },
    published: { type: Boolean, default: false },
    quizzes: [QuizSchema]
  },
  { timestamps: true }
);

const Course = models.Course || model("Course", CourseSchema);
export default Course;
