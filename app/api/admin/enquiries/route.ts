//  api/admin/enquiries
import { connectToDb } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import Course from "@/models/Course"; // Add this import
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Build filter object with proper typing
    const filter: Record<string, unknown> = {};
    
    // Add search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filter
    if (status !== 'all') {
      filter.called = status === 'called';
    }
    
    // Get total count for pagination
    const total = await Enquiry.countDocuments(filter);
    
    // Fetch data with filters
    const enquiries = await Enquiry.find(filter)
      .populate({
        path: "course",
        select: "title",
        model: Course // Explicitly specify the model
      })
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      enquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("❌ Error fetching enquiries:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}