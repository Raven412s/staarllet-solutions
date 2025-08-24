// app/blogs/create/page.tsx
import CreateBlogForm from '@/components/forms/create-blog-form';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';

export default async function CreateBlogPage() {
  const user = await getUser();

  // Only authenticated users can create blogs
  if (!user) {
    redirect('/login?redirect=/blogs/create');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CreateBlogForm />
    </div>
  );
}