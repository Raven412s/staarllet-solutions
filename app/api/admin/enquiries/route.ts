import { connectToDb } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDb();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("❌ Error fetching enquiries:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}