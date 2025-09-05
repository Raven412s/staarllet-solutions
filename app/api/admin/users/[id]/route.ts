import { getUser } from '@/lib/getUser';
import { connectToDb } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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


    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const user = await User.find({id})
      .select('-password')
      .populate('myBlogs', 'title')
      .populate('enrolledCourses', 'name')
      .populate('myEnquiries', 'subject');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDb();
    
    const { id } = await params;
    const body = await request.json();
    
    const updatedUser = await User.findOneAndUpdate(
      {id: id},
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clerkId } = await params;
    console.log('Deleting user with clerkId:', clerkId);
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // 1. Clerk REST API के through user delete करें
    const clerkResponse = await fetch(
      `https://api.clerk.com/v1/users/${clerkId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!clerkResponse.ok) {
      const errorText = await clerkResponse.text();
      console.warn(`Failed to delete user ${clerkId} from Clerk:`, errorText);
      // Continue with database deletion even if Clerk deletion fails
    } else {
      console.log(`User ${clerkId} deleted from Clerk`);
    }

    // 2. Database से user delete करें
    await connectToDb();
    const deletedUser = await User.findOneAndDelete({ clerkId });

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully', user: deletedUser },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}