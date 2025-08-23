import SectionWrapper from '@/components/wrapper/SectionWrapper';
import { connectToDb } from '@/lib/mongodb';
import { IBlog } from '@/models/Blog';
import { IEnquiry } from '@/models/Enquiry';
import User from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import '@/models'; // Ensures all models are registered

const MyAccountPage = async () => {
    const session = await auth();
    const userId = session.userId;

    await connectToDb();
    const user = await User.findOne({ clerkId: userId })
        .populate('myBlogs')
        // .populate('enrolledCourses')
        .populate('myEnquiries');

    if (!user) {
        return (
            <SectionWrapper
                maxWidth='7xl'
                padding='md'
                background='transparent'
                navbarSpacing='loose'
                className=''
            >
                <div className="bg-red-500/10 w-full min-h-screen h-full rounded-2xl p-6 border border-red-500/20">
                    <div className="flex items-center justify-center h-64">
                        <p className="text-xl text-red-500">User not found. Please try again.</p>
                    </div>
                </div>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper
            maxWidth='7xl'
            padding='md'
            background='transparent'
            navbarSpacing='loose'
            className=''
        >
            <div className="bg-white dark:bg-gray-900 w-full min-h-screen h-full rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Personal Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Resume Section */}
                        {user.resume && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Resume</h2>
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center">
                                        <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">My Resume</span>
                                    </div>
                                    <a
                                        href={user.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-200 rounded-md text-sm transition-colors"
                                    >
                                        View
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Enrolled Courses
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enrolled Courses</h2>
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                                    {user.enrolledCourses?.length || 0}
                                </span>
                            </div>

                            {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                                <div className="space-y-3">
                                    {user.enrolledCourses.slice(0, 3).map((course: any) => (
                                        <div key={course.id} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{course.title || "Course Title"}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{course.progress || "0%"} Complete</p>
                                            </div>
                                            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-md transition-colors">
                                                Continue
                                            </button>
                                        </div>
                                    ))}
                                    {user.enrolledCourses.length > 3 && (
                                        <button className="w-full mt-2 text-center text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                            View all {user.enrolledCourses.length} courses
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No courses enrolled yet.</p>
                            )}
                        </div> */}

                        {/* My Blogs */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Blogs</h2>
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                                    {user.myBlogs?.length || 0}
                                </span>
                            </div>

                            {user.myBlogs && user.myBlogs.length > 0 ? (
                                <div className="space-y-3">
                                    {user.myBlogs.slice(0, 3).map((blog: IBlog) => (
                                        <div key={blog.id.toString()} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <h3 className="font-medium text-gray-900 dark:text-white">{blog.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {typeof blog.content === 'string' 
                                                    ? blog.content 
                                                    : 'Rich content (not previewable)'
                                                }
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="flex space-x-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${blog.published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                        {blog.published ? 'Published' : 'Draft'}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${blog.approved ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                        {blog.approved ? 'Approved' : 'Pending Approval'}
                                                    </span>
                                                </div>
                                                <button className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {user.myBlogs.length > 3 && (
                                        <button className="w-full mt-2 text-center text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                            View all {user.myBlogs.length} blogs
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No blogs created yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Additional Info */}
                    <div className="space-y-6">
                        {/* Achievements */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h2>

                            {user.achievements && user.achievements.length > 0 ? (
                                <div className="space-y-3">
                                    {user.achievements.map((achievement: string, index: number) => (
                                        <div key={index} className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 dark:bg-yellow-900">
                                                <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No achievements yet.</p>
                            )}
                        </div>

                        {/* My Enquiries */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Enquiries</h2>
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                                    {user.myEnquiries?.length || 0}
                                </span>
                            </div>

                            {user.myEnquiries && user.myEnquiries.length > 0 ? (
                                <div className="space-y-3">
                                    {user.myEnquiries.slice(0, 3).map((enquiry: IEnquiry) => (
                                        <div key={enquiry.id.toString()} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {enquiry.type === 'forCallback' ? 'Callback Request' :
                                                 enquiry.type === 'forCourses' ? 'Course Inquiry' :
                                                 enquiry.type === 'forMock' ? 'Mock Interview' :
                                                 enquiry.type === 'forResumeReview' ? 'Resume Review' : 'General Inquiry'}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {enquiry.message || 'No message provided'}
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className={`text-xs px-2 py-1 rounded-full ${enquiry.called ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                    {enquiry.called ? 'Contacted' : 'Pending Contact'}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : "No date"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {user.myEnquiries.length > 3 && (
                                        <button className="w-full mt-2 text-center text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                            View all {user.myEnquiries.length} enquiries
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No enquiries yet.</p>
                            )}
                        </div>

                        {/* Account Info */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                                    <span className="text-gray-900 dark:text-white font-mono text-xs">{user.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Clerk ID:</span>
                                    <span className="text-gray-900 dark:text-white font-mono text-xs">{user.clerkId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default MyAccountPage;