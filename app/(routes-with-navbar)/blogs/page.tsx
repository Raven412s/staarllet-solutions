// app/blogs/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import BlogCardsSkeleton from '@/components/skeletons/BlogCardsSkeleton';

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

async function getBlogs(): Promise<IBlog[]> {
    try {
        // Use absolute URL for server-side fetching
        const baseUrl = process.env.NEXTAUTH_URL;
        const res = await fetch(`${baseUrl}/api/blogs`, {
            next: { revalidate: 3 } // Revalidate every hour
        });

        if (!res.ok) {
            throw new Error('Failed to fetch blogs');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return [];
    }
}

export default function BlogsPage() {


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Our Blog</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Discover the latest articles, news, and insights from our team.
                </p>
            </div>

            <Suspense fallback={<BlogCardsSkeleton />}>
                <PublishedBlogs />
            </Suspense>
        </div>
    );
}

const PublishedBlogs = async () => {
    const blogs = await getBlogs();
    const publishedBlogs = blogs.filter(blog => blog.approved && blog.published);

    if (publishedBlogs.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">No blog posts yet</h2>
                <p className="text-muted-foreground">Check back later for new content.</p>
                <Button asChild>
                    <Link href="/blogs/create">
                        <FileText className="mr-2 h-4 w-4" />
                        Write a Blog
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedBlogs.map((blog) => (
                <Card
                    key={blog._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border pt-0 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                    {/* Cover Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image
                            src={blog.coverImg}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-5 flex-grow">
                        {/* Meta info */}
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <User className="h-4 w-4 mr-1" />
                            <span>{blog.createdBy.name}</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {blog.title}
                        </h2>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {blog.description}
                        </p>
                    </CardContent>

                    {/* Footer pinned bottom */}
                    <CardFooter className="pt-3 border-t flex justify-between items-center">
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="px-0 font-medium text-primary hover:text-primary/80"
                        >
                            <Link href={`/blogs/${blog.slug}`} className="flex items-center gap-1">
                                Read more
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

            ))}
        </div>
    );
};
