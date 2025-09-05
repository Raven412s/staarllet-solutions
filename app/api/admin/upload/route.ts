// app/api/admin/upload/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getUser } from '@/lib/getUser';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
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
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;
    
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'uploads',
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}