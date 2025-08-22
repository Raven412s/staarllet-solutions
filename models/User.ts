import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  name: string;
  role: "Admin" | "Public";
  email: string;
  clerkId: string;
  id: string; // UUID
  password?: string; // optional, only if you support non-Clerk login
  myBlogs?: mongoose.Types.ObjectId[];
  resume?: string;
  image?: string;
  enrolledCourses?: mongoose.Types.ObjectId[];
  achievements?: string[];
  myEnquiries?: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Public"], default: "Public", required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    clerkId: { type: String, required: true, unique: true },
    id: {
      type: String,
      default: () => uuidv4(), // generate UUID if not provided
      unique: true,
      required: true,
    },
    password: { type: String }, // hashed if you support email/pass
    myBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    resume: { type: String }, // PDF file URL
    image: { type: String }, // avatar URL
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    achievements: [{ type: String }],
    myEnquiries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Enquiry" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
