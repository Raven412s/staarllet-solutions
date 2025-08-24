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
            </div>
        );
    }

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
