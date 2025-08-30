// components/admin/blog-view-modal.tsx
'use client';

import { BlogContentRenderer } from '@/components/blogs/blog-content-renderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, Eye, FileText, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BlogViewModalProps {
  blogId: string;
  isOpen: boolean;
  onClose: () => void;
}

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

export function BlogViewModal({ blogId, isOpen, onClose }: BlogViewModalProps) {
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && blogId) {
      fetchBlog();
    }
  }, [isOpen, blogId]);

  const fetchBlog = async () => {
    if (!blogId) return;
    
    setLoading(true); 
    setError(null);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/admin/blogs/${blogId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch blog');
      }

      const blogData = await res.json();
      setBlog(blogData);
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = (content: string | object) => {
    if (typeof content === 'string') {
      const wordCount = content.split(/\s+/).length;
      return Math.ceil(wordCount / 200);
    }
    return 3; // Default estimate for structured content
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Blog Preview
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[70vh] px-6 pointer-events-auto">
          {loading && (
            <div className="space-y-4 py-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-destructive">
              <p>{error}</p>
              <Button onClick={fetchBlog} className="mt-4">
                Try Again
              </Button>
            </div>
          )}

          {blog && !loading && (
            <div className="py-4">
              {/* Blog Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{blog.title}</h1>
                <p className="text-muted-foreground text-lg">{blog.description}</p>
              </div>

              <Separator className="my-6" />

              {/* Blog Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Blog Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Author</p>
                        <p className="font-medium">{blog.createdBy.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">{formatDate(blog.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Reading Time</p>
                        <p className="font-medium">{calculateReadingTime(blog.content)} min read</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Status</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Approval Status</p>
                      <Badge variant={blog.approved ? "default" : "secondary"} className="mt-1">
                        {blog.approved ? "Approved" : "Pending Approval"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Publishing Status</p>
                      <Badge variant={blog.published ? "default" : "outline"} className="mt-1">
                        {blog.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Slug</p>
                      <p className="font-medium text-sm mt-1">{blog.slug}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Cover Image */}
              {blog.coverImg && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Cover Image</h3>
                  <div className="relative h-64 w-full rounded-lg overflow-hidden border">
                    <Image
                      src={blog.coverImg}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              {/* Blog Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Content</h3>
                <div className="prose prose-lg max-w-none border rounded-lg p-6">
                  <BlogContentRenderer content={blog.content} />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Blog
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}