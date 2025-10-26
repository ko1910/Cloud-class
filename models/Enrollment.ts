
// models/Enrollment.ts
import { Schema, models, model, Types } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

// ✅ Chống trùng lặp user-course
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default models.Enrollment || model("Enrollment", EnrollmentSchema);
