// /data/courses.ts
export const fetchCourses = async () => {
  try {
    // Add intentional delay (e.g., 2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses`, {
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
