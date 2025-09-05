// app/api/admin/images/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getUser } from '@/lib/getUser';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
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
  
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
    });
    
    return NextResponse.json({ images: result.resources });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// app/api/admin/images/route.ts
export async function DELETE(req: Request) {
  try {
    const { publicId } = await req.json();
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}