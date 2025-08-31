// app/blogs/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogContentRenderer } from "@/components/blogs/blog-content-renderer";

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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) throw new Error("Base URL is not defined");

    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!res.ok) {
      return res.status === 404 ? null : null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || !blog.approved || !blog.published) {
    notFound();
  }

  // ✅ Estimate reading time (200 wpm)
  const wordCount =
    typeof blog.content === "string"
      ? blog.content.split(/\s+/).length
      : JSON.stringify(blog.content).split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/blogs" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Link>
      </Button>

      <article className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center text-muted-foreground mb-6 gap-4">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{blog.createdBy.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Cover Image */}
        {blog.coverImg && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.coverImg}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Blog content */}
        <div className="prose prose-lg max-w-none">
          <BlogContentRenderer content={blog.content} />
        </div>
      </article>

      {/* CTA back */}
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || !blog.approved || !blog.published) {
    return { title: "Blog Not Found" };
  }

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [blog.coverImg],
      type: "article",
      publishedTime: blog.createdAt,
      authors: [blog.createdBy.name],
    },
  };
}
