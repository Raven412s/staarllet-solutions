// CourseCard.tsx (Client Component)
"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Edit, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FAQ, ICourse, Lesson, Module, Review } from "@/models/Course"
import Image from "next/image"
import Link from "next/link"


interface Props {
  courses: ICourse[]
}

const CourseCard = ({ courses }: Props) => {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

  const toggleExpand = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
  }

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  return (
    <div className="space-y-6">
      {courses.map((course) => (
        <div key={course._id.toString()} className="bg-white rounded-lg shadow overflow-hidden">
          {/* Course Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="relative w-24 h-24 rounded-lg shadow-md overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    className=" object-cover"
                    fill
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
                  <p className="text-gray-600 mt-1">{course.subtitle}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {course.category}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {course.level}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      {course.language}
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      {course.duration}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <div className="text-right">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">₹{course.discountedPrice}</span>
                    {course.discountedPrice && course.price > course.discountedPrice && (
                      <span className="ml-2 text-gray-500 line-through">₹{course.price}</span>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-gray-700 font-medium">{course.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="p-6 border-b border-gray-200">
            <p className="text-gray-700">{course.description}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">What you&apos;ll learn</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {course.whatYouWillLearn.slice(0, 3).map((item: string, index: number) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                  {course.whatYouWillLearn.length > 3 && (
                    <li className="text-sm text-blue-600">+{course.whatYouWillLearn.length - 3} more skills</li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Requirements</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {course.requirements.slice(0, 3).map((req: string, index: number) => (
                    <li key={index} className="text-sm">{req}</li>
                  ))}
                  {course.requirements.length > 3 && (
                    <li className="text-sm text-blue-600">+{course.requirements.length - 3} more requirements</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Expandable Section */}
          <div className="p-6">
            <button
              onClick={() => toggleExpand(course._id.toString())}
              className="flex items-center text-blue-600 font-medium"
            >
              {expandedCourse === course._id.toString() ? 'Show Less' : 'Show More Details'}
              <svg
                className={`ml-2 h-5 w-5 transition-transform ${expandedCourse === course._id.toString() ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {expandedCourse === course._id.toString() && (
              <div className="mt-4 space-y-6">
                {/* Syllabus */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Course Content</h3>
                  <div className="space-y-3">
                    {course.syllabus.map((module: Module, index: number) => (
                      <div key={module._id?.toString()} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800">
                          Module {index + 1}: {module.title}
                        </h4>
                        {module.description && (
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        )}
                        <div className="mt-2 text-sm text-gray-500">
                          {module.lessons.length} lessons • {module.lessons.reduce((acc, lesson: Lesson) => acc + lesson.duration, 0)} minutes
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                {course.faqs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                      {course.faqs.map((faq: FAQ) => (
                        <div key={faq._id?.toString()} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-800">Q: {faq.question}</h4>
                          <p className="text-sm text-gray-600 mt-1">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {course.reviews.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Student Reviews</h3>
                    <div className="space-y-3">
                      {course.reviews.map((review: Review, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700">{review.rating}</span>
                          </div>
                          <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                          <p className="text-gray-500 text-xs mt-2">- Ashutosh</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Created: {formatDate(course.createdAt)} • Updated: {formatDate(course.updatedAt)}
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/admin/courses/${course._id}/edit`}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <DeleteCourseButton courseId={course._id.toString()} courseTitle={course.title} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CourseCard


const DeleteCourseButton = ({ courseId, courseTitle }: { courseId: string; courseTitle: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to show updated list
        router.refresh();
      } else {
        console.error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the course
            <span className="font-semibold"> &qoute;{courseTitle}&qoute;</span> and remove all
            associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};