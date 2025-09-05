import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import { getUser } from '@/lib/getUser';
import { connectToDb } from '@/lib/mongodb';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
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

    await connectToDb();
    const awaitedParams = await params;
    const { published } = await req.json();
    const blogId = awaitedParams.blogId;

    const blog = await Blog.findOneAndUpdate(
      { blogId }, // Use blogId instead of _id
      { published },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog publish status:', error);
    return NextResponse.json(
      { error: 'Failed to update blog publish status' },
      { status: 500 }
    );
  }
}