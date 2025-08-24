import { NextResponse } from "next/server";

import Blog from "@/models/Blog";
import { connectToDb } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDb();
    const blogs = await Blog.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}