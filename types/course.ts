import { ICourse } from "@/models/Course";

// /types/course.ts
export interface CourseFilter {
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  published?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CoursesResponse {
  courses: ICourse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ICourseReview {
  user: string;
  rating: number;
  comment: string;
  createdAt: Date;
}