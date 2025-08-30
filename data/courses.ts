// /data/courses.ts
export const fetchCourses = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses`, {
      next: { revalidate: 3600 } // 1 hour cache
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