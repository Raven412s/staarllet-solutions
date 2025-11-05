import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Course from '@/models/Course';
import { getUser } from '@/lib/getUser';

// GET a specific course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    await connectToDb();
    const user = await getUser();

    if (!user || user.role !== "Admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// UPDATE a course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    await connectToDb();
    const user = await getUser();

    if (!user || user.role !== "Admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    // Debug: log incoming body to ensure fake fields are present
    console.log('[admin][PUT] update course body:', JSON.stringify(body));

    // Use document find -> set -> save to ensure subdocuments/arrays are applied correctly
    const courseDoc = await Course.findById(id);
    if (!courseDoc) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Transform requirements if needed (same logic as POST)
    if (Array.isArray(body.requirements) && body.requirements.length > 0) {
      if (typeof body.requirements[0] === 'object' && body.requirements[0].value !== undefined) {
        courseDoc.requirements = body.requirements.map((r: any) => r.value).filter(Boolean);
      } else if (typeof body.requirements[0] === 'string') {
        courseDoc.requirements = body.requirements;
      }
    } else if (Array.isArray(body.requirements) && body.requirements.length === 0) {
      courseDoc.requirements = [];
    }

    // Assign remaining simple fields from body onto document
    const updatableFields = [
      'title','subtitle','description','thumbnail','introVideo','price','discountedPrice','currency','instructor',
      'whatYouWillLearn','level','duration','language','category','status','studentsEnrolled','rating',
      'fakeStudentsEnrolled','fakeRating','faqs','syllabus','reviews','fakeReviews'
    ];

    updatableFields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        // @ts-ignore
        courseDoc[key] = body[key];
      }
    });

    await courseDoc.save();

    // Debug: log updated course
    console.log('[admin][PUT] updated course result:', courseDoc.toJSON());

    const course = courseDoc;

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    await connectToDb();
    const user = await getUser();

    if (!user || user.role !== "Admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}