// app/courses/[id]/page.tsx
import GetAQuoteModal from "@/components/modals/get-a-quote";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SectionWrapper from "@/components/wrapper/SectionWrapper";
import { fetchCourses } from "@/data/courses";
import { formatDate } from "@/lib/utils";
import { ICourse } from "@/models/Course";
import { Star } from "lucide-react";
import Image from "next/image";


async function getCourse(id: string): Promise<ICourse | null> {
  try {
    const courses: ICourse[] = await fetchCourses();
    return courses.find((c) => c._id.toString() === id) || null;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{id: string}> }) {
  const {id} = await params
  const course = await getCourse(id);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">❌ Course not found</h1>
          <p className="text-muted-foreground">Please check the link or browse our available courses.</p>
        </div>
      </div>
    );
  }

  return (
    <SectionWrapper
      navbarSpacing="loose"
      padding="sm"
      background="transparent"
      maxWidth="full"
      className="flex items-center justify-center w-full"
    >
      <div className="p-8 max-w-5xl mx-auto space-y-10 pointer-events-auto">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative w-full h-72 rounded-xl shadow-lg overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <p className="text-lg text-muted-foreground mt-2">{course.subtitle}</p>
            <div className="mt-4 flex items-baseline gap-2">
              {course.discountedPrice && course.discountedPrice < course.price ? (
                <>
                  <span className="text-gray-400 line-through">₹{course.price}</span>
                  <span className="text-green-600 font-bold text-2xl">₹{course.discountedPrice}</span>
                </>
              ) : (
                <span className="text-green-600 font-bold text-2xl">₹{course.price}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Level: {course.level} • Duration: {course.duration} • Language: {course.language}
            </p>
            <div className="mt-6 flex gap-3">
              <Button>Enroll Now</Button>
              <GetAQuoteModal course={course._id.toString()}><Button variant="outline">Get a Quote</Button></GetAQuoteModal>
            </div>
          </div>
        </div>

        {/* Description */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">About this course</h2>
          <p className="text-gray-700">{course.description}</p>
        </section>

        {/* Requirements */}
        {course.requirements?.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-3">Requirements</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {course.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Syllabus */}
        {course.syllabus?.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-3">Course Syllabus</h2>
            <Accordion type="single" collapsible>
              {course.syllabus.map((module, i) => (
                <AccordionItem key={i} value={`module-${i}`}>
                  <AccordionTrigger>{module.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {module.lessons.map((lesson, j) => (
                        <li
                          key={j}
                          className="flex justify-between bg-gray-50 p-3 rounded-md"
                        >
                          <span>{lesson.title}</span>
                          <span className="text-sm text-gray-500">{lesson.duration} min</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* FAQs */}
        {course.faqs?.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-3">FAQs</h2>
            <Accordion type="single" collapsible>
              {course.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Reviews */}
        {course.reviews?.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-3">Student Reviews</h2>
            <div className="space-y-4">
              {course.reviews.map((review, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-4 h-4 ${
                            idx < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(course.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </SectionWrapper>
  );
}
