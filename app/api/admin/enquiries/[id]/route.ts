// app/api/admin/enquiries/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Enquiry from "@/models/Enquiry";
import { connectToDb } from "@/lib/mongodb";
import { getUser } from "@/lib/getUser";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
      const requestUser = await getUser();

    if (!requestUser) {
        return NextResponse.json(
            { error: "Unauthorized: Please login first" },
            { status: 401 }
        );
    }

    if (requestUser.role !== "Admin") {
        return NextResponse.json(
            { error: "Forbidden: You are not an admin" },
            { status: 403 }
        );
    }

    if (!requestUser) {
        return NextResponse.json(
            { error: "Unauthorized: Please login first" },
            { status: 401 }
        );
    }
    if (requestUser.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDb();
    const awaitedParams = await params;
    const { id } = awaitedParams;
    const body = await req.json();
    const { called } = body;
    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { called },
      { new: true }
    );
    if (!updated)
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, enquiry: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const requestUser = await getUser();
    if (!requestUser) {
        return NextResponse.json(
            { error: "Unauthorized: Please login first" },
            { status: 401 }
        );
    }
    if (requestUser.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDb();
    const awaitedParams = await params;
    const id = awaitedParams.id;

    const enquiry = await Enquiry.findByIdAndDelete(id); // Use blogId instead of _id

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting Enquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete Enquiry" },
      { status: 500 }
    );
  }
}
