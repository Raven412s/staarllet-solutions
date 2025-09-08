// app/api/admin/notifications/route.ts
import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET() {
  await connectToDb();
  const notifications = await Notification.find().sort({ createdAt: -1 });
  return NextResponse.json(notifications);
}

export async function DELETE(req: Request) {
  await connectToDb();
  const { id } = await req.json().catch(() => ({}));

  if (id) {
    // delete single notification
    await Notification.findByIdAndDelete(id);
  } else {
    // clear all notifications
    await Notification.deleteMany({});
  }

  return NextResponse.json({ success: true });
}
