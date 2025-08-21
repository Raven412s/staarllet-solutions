import { NextResponse } from "next/server";
import Enquiry from "@/models/Enquiry";
import { connectToDb } from "@/lib/mongodb";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDb();
    const awaitedParams = await params
    const { id } = awaitedParams;
    const body = await req.json();
    const { called } = body;
    const updated = await Enquiry.findByIdAndUpdate(id, { called }, { new: true });
    if (!updated) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
