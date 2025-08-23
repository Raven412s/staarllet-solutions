"use client";
import EditorToolbar from "@/components/EditorToolbar";
import React, { useCallback, useEffect } from "react";
// Cloudinary config (replace with your own values)
const CLOUDINARY_UPLOAD_PRESET = "your_unsigned_preset"; // TODO: Replace with your unsigned preset
const CLOUDINARY_CLOUD_NAME = "your_cloud_name"; // TODO: Replace with your cloud name

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { z } from "zod";

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';


const AddBlog = () => {

  const BlogSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    coverImage: z.string().optional().or(z.literal("")).refine(
      (val) => !val || /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg|gif)$/i.test(val),
      { message: "Cover image must be a valid image URL" }
    ),
    description: z.string().max(160, "Description must be at most 160 characters"),
    content: z.string().min(1, "Content is required"),
  });

  type BlogForm = z.infer<typeof BlogSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogForm>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: "",
      slug: "",
      coverImage: "",
      description: "",
      content: "",
    },
  });

  const titleValue = watch("title");
  useEffect(() => {
    setValue("slug", slugify(titleValue || "", { lower: true, strict: true }));
  }, [titleValue, setValue]);

  const [mounted, setMounted] = React.useState(false);
  const [editor, setEditor] = React.useState<Editor | null>(null);
  const contentValue = watch("content");

  // Cloudinary image upload handler
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        editor.chain().focus().setImage({ src: data.secure_url }).run();
      } else {
        alert("Image upload failed");
      }
    } catch {
      alert("Image upload error");
    }
  }, [editor]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      import('@tiptap/react').then(({ Editor }) => {
        const instance = new Editor({
          extensions: [
            StarterKit,
            Link.configure({ openOnClick: true }),
            Image,
            Placeholder.configure({
              placeholder: 'Write your blog content here...'
            })
          ],
          content: contentValue,
          onUpdate: ({ editor }) => setValue("content", editor.getHTML()),
          editorProps: {
            attributes: {
              class: 'prose prose-green max-w-none min-h-[200px] bg-white rounded-lg border border-green-200 p-3 focus:outline-none',
            },
          },
        });
        setEditor(instance);
      });
    }
    // Cleanup
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Add New Blog</h1>
      <form className="space-y-6" onSubmit={handleSubmit((data) => { console.log(data); })}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-100"
            {...register("slug")}
            readOnly
          />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            {...register("title")}
            placeholder="Blog Title"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
          <input
            type="text"
            className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            {...register("coverImage")}
            placeholder="https://..."
          />
          {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            {...register("description")}
            placeholder="Short description..."
            rows={2}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          {mounted && editor ? (
            <>
              <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
              <EditorContent editor={editor} />
            </>
          ) : (
            <div className="text-gray-400">Loading editor...</div>
          )}
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
        </div>
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-lg shadow"
        >
          Save Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog
