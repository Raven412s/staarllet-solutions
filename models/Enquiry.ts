import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  createdBy?: mongoose.Types.ObjectId; // if user is registered
  name: string;
  email: string;
  phone: string;
  message?: string;
  type: "forCallback" | "forCourses" | "forMock" | "forResumeReview" | "other";
  resume?: string; // optional, src/path to resume PDF
  called?: boolean; // for callback follow-up
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
      enum: ["forCallback", "forCourses", "forMock", "forResumeReview", "other"],
      required: true,
    },
    resume: { type: String }, // URL or file path
    called: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry ||
  mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
