// components/forms/add-course-form.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BookOpen, Clock, DollarSign, Languages, Plus, Tag, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Control, Resolver, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ImageInput } from "../ui/image-input";

// ----------------- Zod Schema -----------------
export const addCourseSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    subtitle: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    thumbnail: z.string().min(1, "Thumbnail is required"),
    introVideo: z.string().url("Please enter a valid URL").optional().or(z.literal("")),

    price: z.coerce.number().min(0, "Price must be ≥ 0"),
    discountedPrice: z.coerce
      .number()
      .min(0, "Discount must be ≥ 0")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    currency: z.enum(["INR", "USD", "EUR"]).default("INR"),

    instructor: z.string().min(1, "Instructor is required"),
    whatYouWillLearn: z
      .array(
        z.object({
          value: z.string().min(2, "Learning outcome cannot be empty"),
        })
      )
      .min(1, "Add at least one learning outcome"),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    duration: z.string().min(2, "Duration is required (e.g. 45h 20m)"),
    language: z.string().min(1, "Language is required").default("English"),
    category: z.string().min(2, "Category is required"),
    status: z.enum(["draft", "published"]).default("published"),

    requirements: z
      .array(
        z.object({
          value: z.string().min(2, "Requirement cannot be empty"),
        })
      )
      .min(1, "Add at least one requirement"),

    syllabus: z
      .array(
        z.object({
          title: z.string().min(2, "Module title is required"),
          description: z.string().optional(),
          lessons: z
            .array(
              z.object({
                title: z.string().min(2, "Lesson title is required"),
                content: z.string().optional(),
                duration: z.coerce.number().min(0).optional(),
                videoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
              })
            )
            .min(1, "Add at least one lesson"),
        })
      )
      .min(1, "Add at least one module"),

    faqs: z
      .array(
        z.object({
          question: z.string().min(3, "Question must be at least 3 characters"),
          answer: z.string().min(3, "Answer must be at least 3 characters"),
        })
      )
      .optional()
      .default([]),
  })
  .refine(
    (data) => {
      if (!data.discountedPrice && data.discountedPrice !== 0) return true;
      return Number(data.discountedPrice) <= Number(data.price);
    },
    { message: "Discounted price cannot be greater than price", path: ["discountedPrice"] }
  );

export type AddCourseFormValues = z.infer<typeof addCourseSchema>;

// Helper component for syllabus lessons to avoid hook rules violation
const SyllabusModule = ({ moduleIndex, control }: { moduleIndex: number; control: Control<AddCourseFormValues> }) => {
  const lessonsFA = useFieldArray({
    control,
    name: `syllabus.${moduleIndex}.lessons` as const
  });

  return (
    <div className="rounded-xl border p-4 space-y-3 bg-gray-50/50">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-medium">
          {moduleIndex + 1}
        </div>
        <FormField
          control={control}
          name={`syllabus.${moduleIndex}.title`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Module Title *</FormLabel>
              <FormControl>
                <Input placeholder={`Module ${moduleIndex + 1} title`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={`syllabus.${moduleIndex}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Module Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of what this module covers"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Lessons</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => lessonsFA.append({ title: "", content: "", duration: 0, videoUrl: "" })}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Lesson
          </Button>
        </div>

        {lessonsFA.fields.map((lesson, lessonIndex) => (
          <div key={lesson.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-lg bg-white p-3 border">
            <div className="md:col-span-12 flex items-center gap-2 mb-2">
              <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                {lessonIndex + 1}
              </div>
              <span className="text-sm font-medium">Lesson {lessonIndex + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => lessonsFA.remove(lessonIndex)}
                disabled={lessonsFA.fields.length <= 1}
                className="ml-auto"
              >
                <X className="w-4 h-4" /> Remove
              </Button>
            </div>

            <FormField
              control={control}
              name={`syllabus.${moduleIndex}.lessons.${lessonIndex}.title`}
              render={({ field }) => (
                <FormItem className="md:col-span-4">
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder={`Lesson ${lessonIndex + 1} title`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`syllabus.${moduleIndex}.lessons.${lessonIndex}.content`}
              render={({ field }) => (
                <FormItem className="md:col-span-4">
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input placeholder="Short description or key topics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`syllabus.${moduleIndex}.lessons.${lessonIndex}.duration`}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Duration (min)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`syllabus.${moduleIndex}.lessons.${lessonIndex}.videoUrl`}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// --------------- Component --------------------
export default function AddCourseForm() {
  const router = useRouter()
  const form = useForm<AddCourseFormValues>({
    resolver: zodResolver(addCourseSchema) as Resolver<AddCourseFormValues>,
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      thumbnail: '',
      introVideo: "",
      price: 0,
      discountedPrice: undefined,
      currency: "INR",
      instructor: "",
      whatYouWillLearn: [{ value: "" }],
      level: "beginner",
      duration: "",
      language: "English",
      category: "",
      status: "published",
      requirements: [{ value: "" }],
      syllabus: [
        {
          title: "",
          description: "",
          lessons: [{ title: "", content: "", duration: 0, videoUrl: "" }],
        },
      ],
      faqs: [],
    },
    mode: "onBlur",
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = form;

  // Field Arrays
  const requirementsFA = useFieldArray({ control, name: "requirements" });
  const whatYouWillLearnFA = useFieldArray({ control, name: "whatYouWillLearn" });
  const syllabusFA = useFieldArray({ control, name: "syllabus" });
  const faqsFA = useFieldArray({ control, name: "faqs" });

  const onSubmit = async (values: AddCourseFormValues) => {
    // Clean empty values
    const cleanedValues = {
      ...values,
      requirements: values.requirements
        .map(req => req.value)
        .filter(value => value && value.trim() !== ""),
      whatYouWillLearn: values.whatYouWillLearn
        .map(item => item.value)
        .filter(value => value && value.trim() !== ""),
      faqs: values.faqs.filter(
        faq => faq.question.trim() !== "" && faq.answer.trim() !== ""
      )
    };

    

    try {
      const response = await axios.post("/api/admin/courses", cleanedValues);

      if (response.status === 201) {
        toast.success("Course created successfully")
        router.back();
      }
    } catch (error) {
      console.error("Failed to save course:", error);
      toast.error("Failed to save course")
    }
  };

  const price = watch("price");
  const discountedPrice = watch("discountedPrice") as number | undefined;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-10 p-6 bg-white rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-sm text-muted-foreground">Fill all required fields to create your course. You can edit it later.</p>
        </div>

        {/* Basic Info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Course Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Full Stack Web Development" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="subtitle"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="Short punchline or promise (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    rows={6}
                    placeholder="Describe the course outcomes, projects, and who it's for"
                    className="resize-vertical"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Separator />

        {/* Media */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail *</FormLabel>
                <ImageInput
                  value={field.value}
                  onChange={(url) => {
                    field.onChange(url);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="introVideo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intro Video URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://... (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Separator />

        {/* Pricing */}
        <section className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              control={control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="discountedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discounted Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="4999 (optional)"
                      value={field.value === undefined ? "" : field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? undefined : Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col justify-end">
              <div className="text-sm text-muted-foreground p-2 bg-gray-50 rounded-md">
                {discountedPrice !== undefined &&
                  discountedPrice !== null &&
                  Number(price) > 0 ? (
                  <span>
                    Save {Math.max(0, Math.round(((Number(price) - discountedPrice) / Math.max(1, Number(price))) * 100))}%
                  </span>
                ) : (
                  <span>No discount applied</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Meta */}
        <section className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <User className="w-5 h-5" /> Course Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Instructor's user Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration *</FormLabel>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g. 45h 20m" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language *</FormLabel>
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="English" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g. Web Development" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Separator />

        {/* What You Will Learn */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">What You Will Learn</h3>
            <Button type="button" variant="secondary" size="sm" onClick={() => whatYouWillLearnFA.append({ value: "" })}>
              <Plus className="w-4 h-4 mr-1" /> Add Learning Outcome
            </Button>
          </div>

          <div className="space-y-2">
            {whatYouWillLearnFA.fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={control}
                  name={`whatYouWillLearn.${idx}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="sr-only">Learning Outcome {idx + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder={`What students will learn #${idx + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {whatYouWillLearnFA.fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => whatYouWillLearnFA.remove(idx)}
                    className="mt-2"
                    aria-label="Remove learning outcome"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Requirements */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Requirements</h3>
            <Button type="button" variant="secondary" size="sm" onClick={() => requirementsFA.append({ value: "" })}>
              <Plus className="w-4 h-4 mr-1" /> Add Requirement
            </Button>
          </div>

          <div className="space-y-2">
            {requirementsFA.fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={control}
                  name={`requirements.${idx}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="sr-only">Requirement {idx + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder={`Requirement #${idx + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {requirementsFA.fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => requirementsFA.remove(idx)}
                    className="mt-2"
                    aria-label="Remove requirement"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Syllabus (Modules & Lessons) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Syllabus
            </h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => syllabusFA.append({ title: "", description: "", lessons: [{ title: "", content: "", duration: 0, videoUrl: "" }] })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Module
            </Button>
          </div>

          <div className="space-y-4">
            {syllabusFA.fields.map((module, mIdx) => (
              <div key={module.id} className="relative">
                <SyllabusModule moduleIndex={mIdx} control={control} />
                {syllabusFA.fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => syllabusFA.remove(mIdx)}
                    className="absolute top-2 right-2"
                    aria-label="Remove module"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* FAQs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
            <Button type="button" variant="secondary" size="sm" onClick={() => faqsFA.append({ question: "", answer: "" })}>
              <Plus className="w-4 h-4 mr-1" /> Add FAQ
            </Button>
          </div>

          <div className="space-y-3">
            {faqsFA.fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-lg border">
                <div className="md:col-span-12 font-medium text-sm mb-1">FAQ #{idx + 1}</div>

                <FormField
                  control={control}
                  name={`faqs.${idx}.question`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-5">
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Do I get lifetime access?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`faqs.${idx}.answer`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-6">
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Input placeholder="Yes, you will have lifetime access..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-1 flex items-end justify-center pb-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => faqsFA.remove(idx)}
                    aria-label="Remove FAQ"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {faqsFA.fields.length === 0 && (
              <div className="text-center py-6 text-muted-foreground border rounded-lg">
                No FAQs added yet. Click &quot;Add FAQ&quot; to include some frequently asked questions.
              </div>
            )}
          </div>
        </section>

        <Separator />

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Save Draft
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-40">
            {isSubmitting ? "Saving..." : "Publish Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}