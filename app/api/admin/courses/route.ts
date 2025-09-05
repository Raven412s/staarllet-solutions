import { NextRequest, NextResponse } from "next/server";
import Course from "@/models/Course";
import { connectToDb } from "@/lib/mongodb";
import { getUser } from "@/lib/getUser";

export async function POST(req: NextRequest) {
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
    if (!requestUser || requestUser.role !== "Admin") {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

    const formData = await req.json();
    console.log("API received formData:", formData); // Debug log

    // ✅ FIX: Check if requirements is already transformed or needs transformation
    let requirementsArray: string[];
    
    if (Array.isArray(formData.requirements) && formData.requirements.length > 0) {
      // Case 1: Already transformed array of strings
      if (typeof formData.requirements[0] === 'string') {
        requirementsArray = formData.requirements;
      } 
      // Case 2: Needs transformation (array of objects)
      else if (typeof formData.requirements[0] === 'object' && formData.requirements[0].value !== undefined) {
        requirementsArray = formData.requirements
          .map((req: { value: string }) => req.value)
          .filter((value: string | undefined | null) => value !== undefined && value !== null);
      }
      // Case 3: Empty or invalid
      else {
        requirementsArray = [];
      }
    } else {
      requirementsArray = [];
    }

    const transformedData = {
      ...formData,
      requirements: requirementsArray,
      instructor: formData.instructor,
    };

    console.log("Transformed data for saving:", transformedData); // Debug log

    const course = new Course(transformedData);
    await course.save();

    return NextResponse.json(
      { message: "Course created successfully", course },
      { status: 201 }
    );
  } catch (error) {
    console.error("Course creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}