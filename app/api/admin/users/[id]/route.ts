import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDb } from '@/lib/mongodb';


export async function GET(
  request: NextRequest,
<<<<<<< HEAD
  { params }: { params: Promise<{ id: string }> }
=======
  { params }: { params: { id: string } }
>>>>>>> 1d8a32f0f80f75e8b0d824104a1c7abf61e5b431
) {
  try {
    await connectToDb();
    
<<<<<<< HEAD
    const { id } = await params;
=======
    const { id } = params;
>>>>>>> 1d8a32f0f80f75e8b0d824104a1c7abf61e5b431
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
<<<<<<< HEAD
    const user = await User.find({id})
=======
    const user = await User.findById(id)
>>>>>>> 1d8a32f0f80f75e8b0d824104a1c7abf61e5b431
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
    const updateData = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Remove fields that shouldn't be updated via this endpoint
    const { password, clerkId, _id, ...safeUpdateData } = updateData;
    
    const user = await User.findByIdAndUpdate(
      id,
      safeUpdateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'User updated successfully',
      user 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}