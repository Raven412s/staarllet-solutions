import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import SectionWrapper from "@/components/wrapper/SectionWrapper";
import { fetchCourses } from "@/data/courses";
import { ICourse, Review } from "@/models/Course";
import { Clock, IndianRupee, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const CoursesPage = async () => {
    const courses = await fetchCourses();

    if (!courses || courses.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">🚀 No Courses Available</h1>
                    <p className="text-muted-foreground text-lg">
                        Check back later for new courses!
                    </p>
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
            className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto"
        >
            <div className="min-h-screen ">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                        Our <span className="text-primary">Courses</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                        Discover a wide range of courses designed to help you master new
                        skills and advance your career.
                    </p>
                    <Button size="lg" className="rounded-full shadow-lg hover:scale-105 transition-transform">
                        Browse Courses
                    </Button>
                </div>

                {/* Course Grid */}
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {courses.map((course: ICourse, index: number) => (
                            <div
                                key={index}
                            >
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

const CourseCard = ({ course }: { course: ICourse }) => {
    const calculateDiscount = () => {
        if (!course.discountedPrice || course.discountedPrice >= course.price)
            return 0;
        return Math.round(
            ((course.price - course.discountedPrice) / course.price) * 100
        );
    };

    const discountPercentage = calculateDiscount();
    const averageRating = course.reviews?.length
        ? course.reviews.reduce(
            (sum: number, review: Review) => sum + review.rating,
            0
        ) / course.reviews.length
        : 0;

    return (
        <Card className="h-full flex flex-col overflow-hidden rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300">
            {/* Thumbnail */}
            <div className="relative w-full h-52 ">
                <Image
                    fill
                    priority
                    src={course.thumbnail}
                    alt={course.title}
                    className="object-cover"
                />
                {discountPercentage > 0 && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white">
                        Save {discountPercentage}%
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
                <CardDescription className="line-clamp-2">
                    {course.subtitle}
                </CardDescription>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="flex-grow pb-4">
                {/* Ratings & Duration */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                            ({course.reviews?.length || 0})
                        </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{course.duration}</span>
                    </div>
                </div>

                {/* Instructor & Category */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-800">
                        {course.instructor}
                    </span>
                    <Badge variant="outline" className="rounded-full px-3">
                        {course.category}
                    </Badge>
                </div>

                {/* Requirements */}
                <div>
                    <h4 className="text-sm font-semibold mb-1">Requirements:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                        {course.requirements.slice(0, 3).map((req, index) => (
                            <li key={index} className="flex items-start">
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
                    {course.discountedPrice &&
                        course.discountedPrice < course.price ? (
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
                <Link href={`/courses/${course._id}`} className={`${buttonVariants({variant: "outline"})}, text-green-800`}>
                    View Details
                </Link >
                <Button className={buttonVariants()}>
                    Enroll Now
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CoursesPage;
