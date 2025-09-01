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
