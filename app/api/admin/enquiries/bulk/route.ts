// app/api/admin/enquiries/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectToDb } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

export async function DELETE(req: NextRequest) {
  try {
    await connectToDb();
    
    const { ids } = await req.json();
    
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const result = await Enquiry.deleteMany({ _id: { $in: ids } });
    
    return NextResponse.json({ 
      message: `Deleted ${result.deletedCount} enquiries successfully` 
    });
  } catch (error) {
    console.error('Error deleting enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to delete enquiries' }, 
      { status: 500 }
    );
  }
}