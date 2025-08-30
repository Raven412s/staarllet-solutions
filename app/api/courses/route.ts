import { connectToDb } from "@/lib/mongodb";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

// GET all published course (for public listing)
export async function GET() {
  try {
    await connectToDb();
    
    const course = await Course.find({})
    .sort({ createdAt: -1 })
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
