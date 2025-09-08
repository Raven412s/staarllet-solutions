// app/api/courses/[courseId]/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import Course from "@/models/Course";
import {connectToDb} from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await connectToDb();
    const {courseId} = await params
    const course = await Course.findById(courseId).select("reviews");
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    return NextResponse.json(
      { reviews: course.reviews },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}