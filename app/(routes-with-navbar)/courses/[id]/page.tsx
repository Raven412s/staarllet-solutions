import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import SectionWrapper from "@/components/wrapper/SectionWrapper";
import { Button } from "@/components/ui/button";
import { fetchCourses } from "@/data/courses";
import { ICourse, Review } from "@/models/Course";

interface PageParams {
  id: string;
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { id } = await params;
  const courses: ICourse[] = await fetchCourses();

  const course = courses.find((c) => c._id === id);
  if (!course) return <p className="p-8 text-center">Course not found.</p>;

  return (
    <SectionWrapper
      navbarSpacing="loose"
      padding="sm"
      background="transparent"
      maxWidth="full"
      className="flex items-center justify-center h-full w-full gap-2 flex-col "
    >
      <div className="p-8 max-w-5xl mx-auto space-y-10 pointer-events-auto">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative w-full h-72 rounded-xl shadow-lg overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              className="object-cover"
              fill
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <p className="text-lg text-gray-600 mt-2">{course.subtitle}</p>
            <p className="mt-4">
              <span className="text-gray-400 line-through mr-2">
                ₹{course.price}
              </span>
              <span className="text-green-600 font-bold text-2xl">
                ₹{course.discountedPrice}
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Level: {course.level} • Duration: {course.duration} • Language:{" "}
              {course.language}
            </p>
            <Button className="mt-6 mr-4">Enroll Now</Button>
            <Button variant="outline" className="mt-6">
              Get a Quote
            </Button>
          </div>
        </div>

        {/* Description */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">About this course</h2>
          <p className="text-gray-700">{course.description}</p>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Requirements</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {course.requirements.map((req: string, i: number) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </section>

        {/* Syllabus (Accordion) */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Course Syllabus</h2>
          <Accordion type="single" collapsible>
            {course.syllabus.map((module, i: number) => (
              <AccordionItem key={i} value={`module-${i}`}>
                <AccordionTrigger>{module.title}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {module.lessons.map(
                      (lesson: { title: string; duration: number }, j: number) => (
                        <li
                          key={j}
                          className="flex justify-between bg-gray-50 p-3 rounded-md"
                        >
                          <span>{lesson.title}</span>
                          <span className="text-sm text-gray-500">
                            {lesson.duration} min
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">FAQs</h2>
          <Accordion type="single" collapsible>
            {course.faqs.map(
              (faq: { question: string; answer: string }, i: number) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Student Reviews</h2>
          <div className="space-y-4">
            {course.reviews.map((review: Review, i: number) => (
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
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </SectionWrapper>
  );
}
