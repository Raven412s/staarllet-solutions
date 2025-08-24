// app/blogs/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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

export default async function BlogsPage() {
    const blogs = await getBlogs();
    const publishedBlogs = blogs.filter(blog => blog.approved && blog.published);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Our Blog</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Discover the latest articles, news, and insights from our team.
                </p>
            </div>

            {publishedBlogs.length === 0 ? (
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
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {publishedBlogs.map((blog) => (
                        <Card key={blog._id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={blog.coverImg}
                                    alt={blog.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center text-sm text-muted-foreground mb-3">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    <span className="mx-2">•</span>
                                    <User className="h-4 w-4 mr-1" />
                                    <span>{blog.createdBy.name}</span>
                                </div>

                                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                                    {blog.title}
                                </h2>

                                <p className="text-muted-foreground mb-4 line-clamp-3">
                                    {blog.description}
                                </p>

                                <Button asChild variant="link" className="p-0 h-auto font-semibold">
                                    <Link href={`/blogs/${blog.slug}`} className="flex items-center">
                                        Read more <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
