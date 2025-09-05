import EditCourseForm from '@/components/forms/edit-course-form';
import { getCourseById } from '@/data/courses';
import { redirect } from 'next/navigation';


interface EditCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditCoursePage = async ({ params }: EditCoursePageProps) => {
    const {id}  = await params
  const course = await getCourseById(id);
  
  if (!course) {
    redirect('/admin/courses');
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Course</h1>
      <EditCourseForm course={course} />
    </div>
  );
};

export default EditCoursePage;