// app/api/admin/settings/route.ts
import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { getUser } from '@/lib/getUser';

export async function GET() {
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

    // Get settings or return defaults
    let settings = await Setting.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Setting.create({
        siteName: 'My Site',
        address: '',
        phone: '',
        email: '',
        logo: '',
        favicon: ''
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// app/api/admin/settings/route.ts
export async function PUT(req: Request) {
  try {
    await connectToDb();
    
    const body = await req.json();
    
    // Update or create settings
    let settings = await Setting.findOne();
    
    if (settings) {
      settings = await Setting.findOneAndUpdate(
        {},
        { $set: body },
        { new: true }
      );
    } else {
      settings = await Setting.create(body);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}