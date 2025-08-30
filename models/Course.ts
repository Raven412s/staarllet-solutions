import mongoose, { Schema, Document } from "mongoose";

interface Lesson {
  title: string;
  content: string;
  duration: number;
  videoUrl?: string; // Added to match form
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface FAQ {
  question: string;
  answer: string;
}

export interface Review {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ICourse extends Document {
  title: string;
  subtitle?: string;
  description: string;
  thumbnail: string;
  introVideo?: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  instructor: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  language: string;
  category: string;
  requirements: string[]; // Changed from object array to string array
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
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    duration: { type: String, required: true },
    language: { type: String, default: "English" },
    category: { type: String, required: true },
    requirements: [{ type: String }], // Changed to array of strings
    syllabus: [
      {
        title: { type: String, required: true },
        lessons: [
          {
            title: { type: String, required: true },
            content: { type: String },
            duration: { type: Number },
            videoUrl: { type: String }, // Added to match form
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
        user: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);