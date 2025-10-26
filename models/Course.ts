
import mongoose, { Schema, model, models } from "mongoose";

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructorId: { type: String, default: null },
    published: { type: Boolean, default: false },
    quizzes: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctIndex: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Course = models.Course || model("Course", CourseSchema);
export default Course;
