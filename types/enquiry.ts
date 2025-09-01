// types/enquiry.ts
export interface Course {
  _id: string;
  title: string;
}

export interface Enquiry {
  _id: string;
  name: string;
  email: string;
  type: string;
  phone: string;
  message?: string;
  createdAt: string;
  called?: boolean;
  course?: Course;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface EnquiryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}