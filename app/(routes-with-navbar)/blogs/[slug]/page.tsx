<<<<<<< HEAD
// app/blogs/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BlogContentRenderer } from '@/components/blogs/blog-content-renderer';

interface IBlog {
    _id: string;
    slug: string;
    title: string;
    description: string;
    coverImg: string;
    blogId: string;
    content: string | object;
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    approved: boolean;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

async function getBlog(slug: string): Promise<IBlog | null> {
    try {
        // Use absolute URL for server-side fetching
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!res.ok) {
            if (res.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch blog');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
    }
}

// Function to render the blog content based on its format
function renderBlogContent(content: string | object) {
    if (typeof content === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Handle JSON content (like TipTap editor format)
    if (typeof content === 'object' && content !== null) {
        // You might want to use a proper renderer for your editor format
        // This is a simplified example
        return (
            <div className="prose max-w-none">
                <p>This blog content is in a structured format that requires a specific renderer.</p>
                <p>Consider implementing a renderer for your editor&apos;s output format.</p>
=======
"use client";
import SectionWrapper from '@/components/wrapper/SectionWrapper';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Type definitions
interface User {
    id: string;
    name: string;
    isLoggedIn: boolean;
}

interface Blog {
    id: string;
    title: string;
    description: string;
    coverImg: string;
    createdBy: string;
    isApproved: boolean;
    createdAt: Date;
    content: string;
}

interface BlogFormData {
    title: string;
    description: string;
    content: string;
    coverImg: string;
}

interface FormErrors {
    title?: string;
    description?: string;
    content?: string;
    coverImg?: string;
}

// 
const mockUser: User = { id: "user123", name: "John Doe", isLoggedIn: true };
const mockBlogs: Blog[] = [
    {
        id: "1",
        title: "How to Hire Top Talent",
        description: "Tips for finding and hiring the best candidates.",
        coverImg: "/backgrounds/background-1.png",
        createdBy: "user123",
        isApproved: true,
        createdAt: new Date("2025-08-20"),
        content: "Content of the blog..."
    },
    {
        id: "2",
        title: "Branding in Recruitment",
        description: "Why employer branding matters.",
        coverImg: "/backgrounds/background-2.png",
        createdBy: "user456",
        isApproved: true,
        createdAt: new Date("2025-08-22"),
        content: "Content of the blog..."
    },
    {
        id: "3",
        title: "Pending Blog Example",
        description: "This blog is pending approval.",
        coverImg: "/backgrounds/background-3.png",
        createdBy: "user123",
        isApproved: false,
        createdAt: new Date("2025-08-23"),
        content: "Content of the pending blog..."
    }
];

interface BlogCardProps {
    blog: Blog;
    showPending?: boolean;
}

const BlogCard = ({ blog, showPending = false }: BlogCardProps) => {
    const isPending = !blog.isApproved;
    
    return (
        <div className={`border rounded-lg p-4 shadow w-full max-w-xl flex flex-col gap-3 transition-all hover:shadow-md ${
            isPending ? "bg-yellow-50 border-yellow-200" : "bg-white"
        }`}>
            <div className="relative">
                <img 
                    src={blog.coverImg} 
                    alt={blog.title} 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = "https://via.placeholder.com/600x300?text=Blog+Cover";
                    }}
                />
                {isPending && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        Pending Approval
                    </span>
                )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{blog.title}</h2>
            <p className="text-gray-600 line-clamp-2">{blog.description}</p>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                    By {blog.createdBy} • {blog.createdAt.toLocaleDateString()}
                </span>
                {isPending && showPending && (
                    <span className="text-xs text-yellow-600">Waiting for admin approval</span>
                )}
            </div>
        </div>
    );
};

interface BlogEditorProps {
    onSubmit: (blog: Blog) => void;
    onCancel: () => void;
}

const BlogEditor = ({ onSubmit, onCancel }: BlogEditorProps) => {
    const [formData, setFormData] = useState<BlogFormData>({
        title: "",
        description: "",
        content: "",
        coverImg: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [previewMode, setPreviewMode] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.content.trim()) newErrors.content = "Content is required";
        if (formData.coverImg && !isValidUrl(formData.coverImg)) newErrors.coverImg = "Please enter a valid URL";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string: string): boolean => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleInputChange = (field: keyof BlogFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const newBlog: Blog = {
            id: Math.random().toString(36).slice(2),
            title: formData.title,
            description: formData.description,
            content: formData.content,
            coverImg: formData.coverImg || "https://via.placeholder.com/600x300?text=Blog+Cover",
            createdBy: mockUser.id,
            isApproved: false,
            createdAt: new Date()
        };
        
        onSubmit(newBlog);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="max-w-md mx-auto text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Submitted Successfully!</h2>
                    <p className="text-gray-600 mb-6">Your blog has been submitted for admin approval and will be visible to others once approved.</p>
                    <button 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        onClick={onCancel}
                    >
                        Back to Blogs
                    </button>
                </div>
>>>>>>> 1d8a32f0f80f75e8b0d824104a1c7abf61e5b431
            </div>
        );
    }

<<<<<<< HEAD
    return <p>No content available.</p>;
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const {slug} =await params
    const blog = await getBlog(slug);


    if (!blog || !blog.approved || !blog.published) {
        notFound();
    }

    // Calculate reading time (simple estimation)
    const wordCount = typeof blog.content === 'string'
        ? blog.content.split(/\s+/).length
        : 0;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button asChild variant="ghost" className="mb-6">
                <Link href="/blogs" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
                </Link>
            </Button>

            <article className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">{blog.title}</h1>

                <div className="flex flex-wrap items-center text-muted-foreground mb-6">
                    <div className="flex items-center mr-4 mb-2">
                        <User className="h-4 w-4 mr-1" />
                        <span>{blog.createdBy.name}</span>
                    </div>
                    <div className="flex items-center mr-4 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    {readingTime > 0 && (
                        <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{readingTime} min read</span>
                        </div>
                    )}
                </div>

                <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
                    <Image
                        src={blog.coverImg}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="prose prose-lg max-w-none">
                    <BlogContentRenderer content={blog.content} />
                </div>
            </article>

            <div className="mt-12">
                <Button asChild>
                    <Link href="/blogs">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Blogs
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const {slug} =await params
    const blog = await getBlog(slug);


    if (!blog || !blog.approved || !blog.published) {
        return {
            title: 'Blog Not Found',
        };
    }

    return {
        title: blog.title,
        description: blog.description,
        openGraph: {
            title: blog.title,
            description: blog.description,
            images: [blog.coverImg],
            type: 'article',
            publishedTime: blog.createdAt,
            authors: [blog.createdBy.name],
        },
    };
}
=======
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header similar to Blogger.com */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={onCancel}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">New Blog Post</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setPreviewMode(!previewMode)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                {previewMode ? "Edit" : "Preview"}
                            </button>
                            <button 
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {previewMode ? (
                    // Preview Mode
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="mb-6">
                            {formData.coverImg && (
                                <img 
                                    src={formData.coverImg} 
                                    alt="Cover" 
                                    className="w-full h-64 object-cover rounded-lg mb-6"
                                    onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        target.src = "https://via.placeholder.com/600x300?text=Blog+Cover";
                                    }}
                                />
                            )}
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {formData.title || "Untitled Post"}
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                {formData.description || "No description provided"}
                            </p>
                            <div className="prose prose-lg max-w-none">
                                <div className="whitespace-pre-wrap text-gray-800">
                                    {formData.content || "No content yet..."}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <form className="space-y-6">
                        {/* Title */}
                        <div>
                            <input 
                                type="text" 
                                placeholder="Post title" 
                                value={formData.title} 
                                onChange={e => handleInputChange('title', e.target.value)}
                                className={`w-full text-4xl font-bold border-none outline-none bg-transparent placeholder-gray-400 ${
                                    errors.title ? 'text-red-500' : 'text-gray-900'
                                }`}
                                style={{ resize: 'none' }}
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <input 
                                type="text" 
                                placeholder="Brief description of your post" 
                                value={formData.description} 
                                onChange={e => handleInputChange('description', e.target.value)}
                                className={`w-full text-xl border-none outline-none bg-transparent placeholder-gray-400 ${
                                    errors.description ? 'text-red-500' : 'text-gray-600'
                                }`}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                        </div>

                        {/* Cover Image */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Image URL (optional)
                            </label>
                            <input 
                                type="url" 
                                placeholder="https://example.com/image.jpg" 
                                value={formData.coverImg} 
                                onChange={e => handleInputChange('coverImg', e.target.value)}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.coverImg ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.coverImg && <p className="text-red-500 text-sm mt-1">{errors.coverImg}</p>}
                            {formData.coverImg && !errors.coverImg && (
                                <div className="mt-4">
                                    <img 
                                        src={formData.coverImg} 
                                        alt="Cover preview" 
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement;
                                            target.src = "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-lg shadow-sm min-h-96">
                            <div className="p-6">
                                <textarea 
                                    placeholder="Tell your story..." 
                                    value={formData.content} 
                                    onChange={e => handleInputChange('content', e.target.value)}
                                    className={`w-full min-h-80 text-lg border-none outline-none resize-none placeholder-gray-400 ${
                                        errors.content ? 'text-red-500' : 'text-gray-800'
                                    }`}
                                    style={{ lineHeight: '1.6' }}
                                />
                                {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const BlogPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
    const [showEditor, setShowEditor] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate user login check with a slight delay
        const timer = setTimeout(() => {
            if (!mockUser.isLoggedIn) {
                router.replace("/login");
            } else {
                setUser(mockUser);
                // Only show approved blogs, sorted by most recent
                const approvedBlogs = mockBlogs.filter(b => b.isApproved)
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                setBlogs(approvedBlogs);
                
                // Get current user's blogs (both approved and pending)
                const userBlogs = mockBlogs.filter(b => b.createdBy === mockUser.id)
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                setUserBlogs(userBlogs);
                
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [router]);

    const handleAddBlog = (blog: Blog) => {
        // For frontend only, add to both userBlogs and mockBlogs
        setUserBlogs(prev => [blog, ...prev]);
        mockBlogs.push(blog);
        setShowEditor(false);
    };

    const handleCancelEditor = () => {
        setShowEditor(false);
    };

    if (loading) {
        return (
            <SectionWrapper
                navbarSpacing="loose"
                padding="sm"
                background="transparent"
                maxWidth="full"
                className="flex items-center justify-center h-screen w-full"
            >
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading blogs...</p>
                </div>
            </SectionWrapper>
        );
    }

    if (showEditor) {
        return <BlogEditor onSubmit={handleAddBlog} onCancel={handleCancelEditor} />;
    }

    return (
        <SectionWrapper
            navbarSpacing="loose"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center min-h-screen w-full gap-6 flex-col pointer-events-auto py-8"
        >
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Blogs</h1>
                <button 
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    onClick={() => setShowEditor(true)}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Blog
                </button>
            </div>
            
            {/* User's blogs section (including pending) */}
            {userBlogs.length > 0 && (
                <div className="w-full max-w-4xl mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Blogs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {userBlogs.map(blog => (
                            <BlogCard key={blog.id} blog={blog} showPending={true} />
                        ))}
                    </div>
                </div>
            )}
            
            {/* All approved blogs section */}
            <div className="w-full max-w-4xl">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">All Blogs</h2>
                {blogs.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="mt-4 text-gray-600">No blogs available yet.</p>
                        <button 
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            onClick={() => setShowEditor(true)}
                        >
                            Create the first blog
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {blogs.map(blog => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
};

export default BlogPage;
>>>>>>> 1d8a32f0f80f75e8b0d824104a1c7abf61e5b431
