import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  name: string;
  role: "Admin" | "Public";
  email: string;
  clerkId: string;
  id: string;
  password?: string;
  myBlogs?: mongoose.Types.ObjectId[];
  resume?: string;
  image?: string;
  enrolledCourses?: mongoose.Types.ObjectId[];
  achievements?: string[];
  myEnquiries?: mongoose.Types.ObjectId[];
  isBanned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Public"], default: "Public", required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    clerkId: { type: String, required: true, unique: true },
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      required: true,
    },
    password: { type: String },
    myBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    resume: { type: String },
    image: { type: String },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    achievements: [{ type: String }],
    myEnquiries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Enquiry" }],
    isBanned: { 
      type: Boolean, 
      default: false
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    },
  }
);

// Middleware to update updatedAt before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

UserSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);