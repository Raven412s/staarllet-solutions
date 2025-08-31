// app/courses/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Clock, IndianRupee, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CoursesSkeleton from "@/components/skeletons/CoursesSkeleton";
import { fetchCourses } from "@/data/courses";
import { ICourse, Review } from "@/models/Course";
import SectionWrapper from "@/components/wrapper/SectionWrapper";

async function getCourses(): Promise<ICourse[]> {
    try {
        // Simulate network delay (optional)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const courses = await fetchCourses();
        return courses || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}

export default function CoursesPage() {
    return (

        <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto"
        >
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                    Our <span className="text-primary">Courses</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                    Discover a wide range of courses designed to help you master new
                    skills and advance your career.
                </p>
                <Button size="lg" className="rounded-full shadow-lg hover:scale-105 transition-transform">
                    Browse Courses
                </Button>
            </div>

            {/* Courses Grid */}
            <Suspense fallback={<CoursesSkeleton />}>
                <PublishedCourses />
            </Suspense>

        </SectionWrapper>
    );
}

const PublishedCourses = async () => {
    const courses = await getCourses();

    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">🚀 No Courses Available</h2>
                <p className="text-muted-foreground">Check back later for new courses!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
                <CourseCard key={course._id.toString()} course={course} />
            ))}
        </div>
    );
};

const CourseCard = ({ course }: { course: ICourse }) => {
    const discount =
        course.discountedPrice && course.discountedPrice < course.price
            ? Math.round(((course.price - course.discountedPrice) / course.price) * 100)
            : 0;

    const avgRating = course.reviews?.length
        ? course.reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / course.reviews.length
        : 0;

    return (
        <Card className="overflow-hidden group relative min-h-[38rem] hover:shadow-lg transition-all pt-0 duration-300 flex flex-col h-full rounded-2xl">
            {/* Thumbnail */}
            <div className="relative h-2/3 w-full overflow-hidden">
                <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {discount > 0 && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white">
                        Save {discount}%
                    </Badge>
                )}
                <Badge className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                    {course.level}
                </Badge>
            </div>

            {/* Card Header */}
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold line-clamp-2">
                    {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">{course.subtitle}</CardDescription>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="flex-grow pb-4">
                {/* Ratings & Duration */}
                <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{avgRating.toFixed(1)}</span>
                        <span className="ml-1">({course.reviews?.length || 0})</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                    </div>
                </div>

                {/* Instructor & Category */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">{course.instructor}</span>
                    <Badge variant="outline" className="rounded-full px-3">
                        {course.category}
                    </Badge>
                </div>

                {/* Requirements */}
                <div>
                    <h4 className="text-sm font-semibold mb-1">Requirements:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                        {course.requirements.slice(0, 3).map((req, i) => (
                            <li key={i} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span className="line-clamp-2">{req}</span>
                            </li>
                        ))}
                        {course.requirements.length > 3 && (
                            <li className="text-xs text-gray-500">
                                +{course.requirements.length - 3} more
                            </li>
                        )}
                    </ul>
                </div>
            </CardContent>

            {/* Card Footer */}
            <CardFooter className="pt-3 border-t flex justify-between items-center">
                <div>
                    {course.discountedPrice && course.discountedPrice < course.price ? (
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-primary">
                                <IndianRupee className="inline h-5 w-5" />
                                {course.discountedPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-400 line-through ml-2">
                                <IndianRupee className="inline h-3 w-3" />
                                {course.price.toLocaleString()}
                            </span>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold text-primary">
                            <IndianRupee className="inline h-5 w-5" />
                            {course.price.toLocaleString()}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/courses/${course._id}`}
                        className={buttonVariants({ variant: "outline" })}
                    >
                        View Details
                    </Link>
                    <Button>Enroll Now</Button>
                </div>
            </CardFooter>
        </Card>
    );
};
