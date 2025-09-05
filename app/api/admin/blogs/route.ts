import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectToDb } from "@/lib/mongodb";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    await connectToDb();
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
    const blogs = await Blog.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}