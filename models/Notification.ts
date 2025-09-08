// models/Notification.ts
import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  type: "newUser" | "newEnquiry" | "newReview";
  message: string;
  createdAt: Date;
  read: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["newUser", "newEnquiry", "newReview"],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
