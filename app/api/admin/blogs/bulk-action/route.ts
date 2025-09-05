import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import { getUser } from '@/lib/getUser';
import { connectToDb } from '@/lib/mongodb';

export async function PATCH(req: NextRequest) {
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
    const { blogIds, action, value } = await req.json();

    let updateFields = {};
    if (action === 'approve') {
      updateFields = { approved: value };
    } else if (action === 'publish') {
      updateFields = { published: value };
    }

    const result = await Blog.updateMany(
      { blogId: { $in: blogIds } },
      updateFields
    );

    return NextResponse.json({
      message: `${result.modifiedCount} blogs updated successfully`,
    });
  } catch (error) {
    console.error('Error performing bulk action:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDb();
    const { blogIds } = await req.json();

    const result = await Blog.deleteMany({ blogId: { $in: blogIds } });

    return NextResponse.json({
      message: `${result.deletedCount} blogs deleted successfully`,
    });
  } catch (error) {
    console.error('Error performing bulk delete:', error);
    return NextResponse.json(
      { error: 'Failed to delete blogs in bulk' },
      { status: 500 }
    );
  }
}
