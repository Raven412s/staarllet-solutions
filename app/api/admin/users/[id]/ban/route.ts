import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDb } from '@/lib/mongodb';


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDb();
    
    const { id } =await params;
    const { banned } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (typeof banned !== 'boolean') {
      return NextResponse.json(
        { error: 'Banned status is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOneAndUpdate(
      {clerkId: id},
      { isBanned: banned },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Optional: Integrate with Clerk to ban/unban there too
    try {
      // This would require your Clerk secret key
      const clerkResponse = await fetch(
        `https://api.clerk.dev/v1/users/${user.clerkId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ banned: banned })
        }
      );
      
      if (!clerkResponse.ok) {
        console.error('Failed to update user in Clerk');
      }
    } catch (clerkError) {
      console.error('Error updating Clerk:', clerkError);
      // Continue even if Clerk update fails
    }
    
    return NextResponse.json({ 
      message: `User ${banned ? 'banned' : 'unbanned'} successfully`,
      user 
    });
  } catch (error) {
    console.error('Error updating user ban status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}