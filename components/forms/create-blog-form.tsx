// components/blog/CreateBlogForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ImageInput } from '../ui/image-input';
import { RichTextEditor } from '../editor/rich-text-editor';
;

// Default empty content structure
const defaultContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
  ],
};

export default function CreateBlogForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [content, setContent] = useState<object>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const slug = generateSlug(title);
    const blogId = `blog_${Date.now()}`;

    // Log the data before submitting
    console.log('Submitting blog data:', {
      title,
      description,
      coverImg,
      content,
      slug,
      blogId,
    });

    // Also log the content structure in detail
    console.log('Content structure:', JSON.stringify(content, null, 2));

    const response = await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        coverImg,
        content,
        slug,
        blogId,
      }),
    });

    if (response.ok) {
      toast.success('Blog created successfully! Your blog is pending admin approval.');
      router.push('/blogs');
      router.refresh();
    } else {
      const error = await response.json();
      console.error('Server error response:', error);
      toast.error(error.error || 'Something went wrong');
    }
  } catch (error) {
    console.error('Error creating blog:', error);
    toast.error('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Create New Blog
        </CardTitle>
        <CardDescription>
          Write a new blog post. It will be published after admin approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImg">Cover Image URL</Label>
            <ImageInput
              value={coverImg}
              onChange={(url) => setCoverImg(url)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Blog...
              </>
            ) : (
              'Create Blog'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}