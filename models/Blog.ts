// models/Blog.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  slug: string;             // slugified from title
  title: string;
  description: string;
  coverImg: string;
  blogId: string;           // UUID
  content: string | object; // can be string or JSON (rich editors)
  createdBy: mongoose.Types.ObjectId;
  approved: boolean;        // admin approval
  published: boolean;       // final published status
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    coverImg: { type: String, required: true },
    blogId: {
      type: String,
      unique: true,
      required: true,
      minlength: 16,
      maxlength: 20,
    },
    content: { type: Schema.Types.Mixed, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approved: { type: Boolean, default: false }, // requires admin action
    published: { type: Boolean, default: false }, // true only if approved
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
