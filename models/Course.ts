// models/Course.ts
import mongoose, { Schema, Document } from "mongoose";

export interface Lesson {
  title: string;
  content: string;
  duration: number;
  videoUrl?: string;
  _id?: mongoose.Types.ObjectId;
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
  _id?: mongoose.Types.ObjectId;
}

export interface FAQ {
  question: string;
  answer: string;
  _id?: mongoose.Types.ObjectId;
}

export interface Review {
  user: string;
  userEmail?: string; // Add email field to track users
  rating: number;
  comment: string;
  date: Date;
  _id?: mongoose.Types.ObjectId;
}

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail: string;
  introVideo?: string;
  price: number;
  discountedPrice?: number;
  currency: "INR" | "USD" | "EUR";
  instructor: string;
  whatYouWillLearn: string[];
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  language: string;
  category: string;
  status: "published" | "draft";
  studentsEnrolled: number;
  rating: number;
  requirements: string[];
  syllabus: Module[];
  faqs: FAQ[];
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    introVideo: { type: String },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    currency: { type: String, default: "INR" },
    instructor: { type: String, required: true },
    whatYouWillLearn: [{ type: String }],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    duration: { type: String, required: true },
    language: { type: String, default: "English" },
    category: { type: String, required: true },
    status: { type: String, default: "draft" },
    studentsEnrolled: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    requirements: [{ type: String }],
    syllabus: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        lessons: [
          {
            title: { type: String, required: true },
            content: { type: String },
            duration: { type: Number },
            videoUrl: { type: String },
          },
        ],
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    reviews: [
      {
        user: { type: String, required: true },
        userEmail: { type: String }, // Add email field
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
