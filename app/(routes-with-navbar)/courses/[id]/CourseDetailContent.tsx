import SectionWrapper from "@/components/wrapper/SectionWrapper";
import { formatDate } from "@/lib/utils";
import { Award, Calendar, CheckCircle, Clock, Globe, Play, Star, User, Users } from "lucide-react";
import Image from "next/image";


// Import shadcn/ui components
import BuyCourseButton from "@/components/accessibility/BuyCourseButton";
import { ReviewsTab } from "@/components/courses/ReviewTab";
import { VideoModal } from "@/components/modals/VideoModal";
import GetAQuoteModal from "@/components/modals/get-a-quote";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourse } from "@/data/courses";

// Client component that uses the course data
export async function CourseDetailContent({ courseId }: { courseId: string }) {
    const course = await getCourse(courseId);

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-2">❌ Course not found</h1>
                    <p className="text-muted-foreground">
                        Please check the link or browse our available courses.
                    </p>
                </div>
            </div>
        );
    }

    const totalLessons = course.syllabus.reduce(
        (acc, module) => acc + module.lessons.length,
        0
    );


    return (
        <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto"
        >
            <div className="min-h-screen bg-gradient-to-bl from-green-50 to-green-100 rounded-4xl overflow-hidden shadow">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-green-900 to-green-800 text-white ">
                    <div className="max-w-7xl mx-auto px-4 py-16">
                        <div className="grid lg:grid-cols-3 gap-12 items-center">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center gap-2 text-green-200">
                                    <Badge variant="secondary" className="bg-green-600 text-green-50">{course.category}</Badge>
                                    <span className="capitalize">{course.level} Level</span>
                                </div>

                                <h1 className="text-5xl font-bold leading-tight">{course.title}</h1>
                                <p className="text-xl text-green-100">{course.subtitle}</p>
                                <p className="text-lg text-green-100 leading-relaxed">{course.description}</p>

                                <div className="flex flex-wrap items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                                                />
                                            ))}
                                        </div>
                                        {course.fakeRating?
                                            <span className="font-medium">{course.fakeRating}</span>:
                                            <span className="font-medium">{course.rating}</span>
                                        }
                                        {course.fakeStudentsEnrolled?
                                            <span className="text-green-200">({course.fakeStudentsEnrolled.toLocaleString()} students)</span>:
                                            <span className="text-green-200">({course.studentsEnrolled.toLocaleString()} students)</span>
                                        }
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{course.instructor}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        <span>{course.language}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Course Card */}
                            <Card className="rounded-2xl p-8 shadow-2xl border-0">
                                <CardContent className="p-0">
                                    <div className="relative rounded-xl overflow-hidden mb-6">
                                        <div className="relative w-full h-48 ">
                                            <Image
                                                fill
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/10 bg-opacity-40 flex items-center justify-center">
                                            <VideoModal
                                                videoUrl={course.introVideo!}
                                            >
                                                <Button variant="secondary" size="icon" className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 h-auto w-auto">
                                                    <Play className="w-8 h-8 text-green-400 ml-1" />
                                                </Button>
                                            </VideoModal>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-gray-400 line-through text-lg">₹{course.price.toLocaleString()}</span>
                                            <span className="text-3xl font-bold text-green-600">₹{course.discountedPrice?.toLocaleString()}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                <span>{course.studentsEnrolled.toLocaleString()} enrolled</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                <span>{totalLessons} lessons</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>Lifetime access</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 w-full">
                                            <BuyCourseButton course={course} />
                                            <GetAQuoteModal course={course._id.toString()}><Button variant="outline" className="w-full border-2 hover:cursor-pointer text-gray-700 py-3 rounded-xl font-semibold h-auto">
                                                Get a Quote
                                            </Button></GetAQuoteModal>
                                        </div>

                                        <p className="text-xs text-gray-500 text-center">
                                            Last updated: {formatDate(course.updatedAt)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            {/* Navigation Tabs */}
                            <Tabs defaultValue="overview" className="mb-8">
                                <TabsList className="flex flex-wrap gap-1 bg-slate-500/20 p-1 rounded-xl w-full">
                                    {['overview', 'curriculum', 'reviews', 'faq'].map((tab) => (
                                        <TabsTrigger
                                            key={tab}
                                            value={tab}
                                            className={`px-6 py-3 rounded-lg font-medium capitalize transition-all data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:tracking-wider data-[state=active]:shadow-md flex-1`}
                                        >
                                            {tab === 'faq' ? 'FAQ' : tab}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {/* Tab Content */}
                                <TabsContent value="overview" className="space-y-12 mt-6">
                                    {/* What You'll Learn */}
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-800 mb-6">What you&apos;ll learn</h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {course.whatYouWillLearn.map((item, index) => (
                                                <Card key={index} className="p-4 bg-green-50 border-0">
                                                    <CardContent className="p-0 flex items-start gap-3">
                                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">{item}</span>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Requirements</h2>
                                        <Card className="bg-green-50 rounded-xl p-6 border-0">
                                            <CardContent className="p-0">
                                                <ul className="space-y-3">
                                                    {course.requirements.map((req, index) => (
                                                        <li key={index} className="flex items-start gap-3">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5"></div>
                                                            <span className="text-gray-700">{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                <TabsContent value="curriculum" className="mt-6">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Course Curriculum</h2>
                                    <Accordion type="single" collapsible className="w-full">
                                        {course.syllabus.map((module, index) => (
                                            <AccordionItem key={index} value={`module-${index}`} className="border border-gray-200 rounded-xl overflow-hidden mb-4 last:mb-0">
                                                <AccordionTrigger className="w-full p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between">
                                                    <div className="text-left">
                                                        <h3 className="font-semibold text-lg text-gray-800">{module.title}</h3>
                                                        <p className="text-gray-600 mt-1">{module.description}</p>
                                                        <p className="text-sm text-gray-500 mt-2">
                                                            {module.lessons.length} lessons • {module.lessons.reduce((acc, lesson) => acc + lesson.duration, 0)} minutes
                                                        </p>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="p-6 bg-white border-t border-gray-200">
                                                    <div className="space-y-4">
                                                        {module.lessons.map((lesson, lessonIndex) => (
                                                            <Card key={lessonIndex} className="p-4 bg-gray-50 border-0">
                                                                <CardContent className="p-0 flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <Play className="w-4 h-4 text-green-600" />
                                                                        <span className="font-medium text-gray-800">{lesson.title}</span>
                                                                    </div>
                                                                    <span className="text-sm text-gray-500">{lesson.duration} min</span>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </TabsContent>

                                <TabsContent value="reviews" className="mt-6">
                                    <ReviewsTab courseId={courseId} initialReviews={course.reviews} />
                                </TabsContent>

                                <TabsContent value="faq" className="mt-6">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
                                    <Accordion type="single" collapsible className="w-full">
                                        {course.faqs.map((faq, index) => (
                                            <AccordionItem key={index} value={`faq-${index}`} className="border border-gray-200 rounded-xl overflow-hidden mb-4 last:mb-0">
                                                <AccordionTrigger className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors">
                                                    <h3 className="font-semibold text-lg text-gray-800 pr-4 text-left">{faq.question}</h3>
                                                </AccordionTrigger>
                                                <AccordionContent className="p-6 bg-gray-50 border-t border-gray-200">
                                                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Instructor Info */}
                            <Card className="p-6 rounded-xl">
                                <CardHeader className="p-0 pb-4">
                                    <CardTitle className="text-lg">Your Instructor</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-16 h-16">
                                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-800 text-white text-xl font-bold">
                                                {course.instructor.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{course.instructor}</h4>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Course Features */}
                            <Card className="p-6 rounded-xl">
                                <CardHeader className="p-0 pb-4">
                                    <CardTitle className="text-lg">This course includes</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 space-y-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <span>{course.duration} on-demand video</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Award className="w-4 h-4 text-green-600" />
                                        <span>Certificate of completion</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-green-600" />
                                        <span>Community access</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-green-600" />
                                        <span>Lifetime access</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}