import { connectToDb } from "@/lib/mongodb";
import Course, { ICourse } from "@/models/Course";

// /data/courses.ts
export const fetchCourses = async () => {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/courses`, {
      next: { revalidate: 3 }, // 3 seconds cache
    });

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export async function getCourse(id: string): Promise<ICourse | null> {
  try {
    const courses: ICourse[] = await fetchCourses();
    return courses.find((c) => c._id.toString() === id) || null;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export const getCourseById = async (id: string) => {
  try {
    await connectToDb();
    const course = await Course.findById(id);
    return JSON.parse(JSON.stringify(course)); // Convert to plain object
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
};