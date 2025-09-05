import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDb } from '@/lib/mongodb';
import { getUser } from '@/lib/getUser';

export async function GET(request: NextRequest) {
  try {
    await connectToDb();
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized: Please login first" },
            { status: 401 }
        );
    }

    if (user.role !== "Admin") {
        return NextResponse.json(
            { error: "Forbidden: You are not an admin" },
            { status: 403 }
        );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    

    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: Record<string, unknown> = {};
    
    // Add search filter (search by name, email, or clerkId)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { clerkId: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add role filter
    if (role !== 'all') {
      filter.role = role;
    }
    
    // Add status filter (banned/active)
    if (status !== 'all') {
      filter.isBanned = status === 'banned';
    }
    
    // Get total count for pagination with filters applied
    const total = await User.countDocuments(filter);
    
    // Determine sort order
    const sortOptions: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1
    };
    
    // Fetch data with filters, sorting, and pagination
    const users = await User.find(filter)
      .select('-password') // Exclude password field
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        search,
        role,
        status,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}