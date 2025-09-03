import SectionWrapper from "@/components/wrapper/SectionWrapper";
import { Suspense } from "react";
import { CourseDetailContent } from "./CourseDetailContent";

function CourseLoading() {
  return (
    <SectionWrapper
      navbarSpacing="loose"
      padding="sm"
      background="transparent"
      maxWidth="full"
      className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto "
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">

          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-blue-800 rounded-full animate-pulse w-32"></div>
                <div className="h-12 bg-white/20 rounded animate-pulse"></div>
                <div className="h-6 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-300 rounded-xl mb-6"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-12 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
// Server component that fetches data and streams it
async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // For PPR, we pass the course ID to the client component
  return (
    <Suspense fallback={<CourseLoading />}>
      <CourseDetailContent courseId={id} />
    </Suspense>
  );
}

export default CourseDetailPage;