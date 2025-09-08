// app/api/courses/review/route.ts
import { NextRequest, NextResponse } from "next/server";

import Course from "@/models/Course";
import { connectToDb } from "@/lib/mongodb";
import { getUser } from "@/lib/getUser";
import Notification from "@/models/Notification";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, rating, comment, userName } = await request.json();

    if (!courseId || !rating || !comment || !userName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDb();

    // Check if user already reviewed this course
    const course = await Course.findById(courseId);
    const existingReview = course.reviews.find(
      (review: any) => review.user === user.email
    );

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this course" },
        { status: 400 }
      );
    }

    // Add new review
    const newReview = {
      user: userName,
      email: user.email, // Store email to check for existing reviews
      rating,
      comment,
      date: new Date(),
    };

    // Update course with new review and recalculate average rating
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { reviews: newReview },
        $set: {
          rating: calculateNewRating(
            course.rating,
            course.reviews.length,
            rating
          ),
        },
      },
      { new: true }
    );

    await Notification.create({
      type: "newReview",
      message: `New review on ${course.title} by ${user.name}`,
    });

    return NextResponse.json(
      { message: "Review added successfully", course: updatedCourse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateNewRating(
  currentRating: number,
  reviewCount: number,
  newRating: number
): number {
  return (currentRating * reviewCount + newRating) / (reviewCount + 1);
}
