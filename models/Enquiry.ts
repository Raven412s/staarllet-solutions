// models/Enquiry.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  createdBy?: mongoose.Types.ObjectId; // if user is registered
  name: string;
  email: string;
  phone: string;
  message?: string;
  type: "forContact" | "forCallback" | "forCourses" | "forMock" | "forResumeReview" | "other";
  course?: mongoose.Types.ObjectId; // <-- added for "forCourses"
  resume?: string;
  called?: boolean;
  createdAt: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // optional
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    type: {
      type: String,
      enum: ["forContact", "forCallback", "forCourses", "forMock", "forResumeReview", "other"],
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course", // <-- reference to Course model
    },
    resume: { type: String },
    called: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry ||
  mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
