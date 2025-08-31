import CourseCard from '@/components/CourseCard'
import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton'
import { buttonVariants } from '@/components/ui/button'
import { fetchCourses } from '@/data/courses'
import { ICourse } from '@/models/Course'
import Link from 'next/link'
import { Suspense } from 'react'

const AdminDashboardCorsesListingPageServer = async () => {
  return (
        <div className="container mx-auto p-6  min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          <p className="text-gray-600 mt-2">Manage and organize your learning content</p>
        </div>
        <Link 
          className={`${buttonVariants()} bg-blue-600 hover:bg-blue-700 flex items-center gap-2 shadow-md`}
          href={"/admin/courses/add"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Course
        </Link>
      </div>

      <Suspense fallback={<CourseCardSkeleton/>}>
        <FetchedCoursesList/>
      </Suspense>

    </div>
  )
}

export default AdminDashboardCorsesListingPageServer



// FetchedCoursesList.tsx (Server Component)


const FetchedCoursesList = async () => {
  const courses: ICourse[] = await fetchCourses()
  if (!courses) return null

  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Courses</h3>
          <p className="text-2xl font-bold">{courses.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">Published</h3>
          <p className="text-2xl font-bold">{courses.filter(c => c.status === 'published').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-medium">Avg. Rating</h3>
          <p className="text-2xl font-bold">
            {(courses.reduce((acc, course) => acc + course.rating, 0) / courses.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Courses List */}
      <CourseCard courses={courses} />
    </>
  )
}


