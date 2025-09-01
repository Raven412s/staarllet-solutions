"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import PhoneInput from "react-phone-input-2";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Define validation schema with Zod
const RequestCallbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  type: z.string(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  message: z.string().optional(),
});

export type RequestCallbackValues = z.infer<typeof RequestCallbackSchema>;

export type EnquiryFormProps = {
  /** Called when form submits successfully */
  onSuccess?: (values: RequestCallbackValues) => void;
  type: string
  course?: string
};

export default function EnquiryForm({
  onSuccess,
  type,
  course
}: EnquiryFormProps) {
  const [loading, setLoading] = React.useState(false);
  const form = useForm<RequestCallbackValues>({
    resolver: zodResolver(RequestCallbackSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "",
      message: "",
    },
  });

  const successMessages: Record<
    RequestCallbackValues["type"],
    string
  > = {
    forCallback: "You will receive a call from us shortly",
    forCourses: "Your course enquiry has been received",
    forMock: "Your mock test request has been submitted",
    forResumeReview: "Your resume review request has been submitted",
    other: "Your request has been submitted successfully",
  };

  const onSubmit = async (values: RequestCallbackValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, type, course }),
      });

      if (res.ok) {
        const data = await res.json();
        // Use type-specific success message
        const message = successMessages[type] || "Request submitted successfully";
        toast.success(message);

        console.log("Request callback form submitted:", data);
        form.reset(); // ✅ clear form
        onSuccess?.(values);
      } else {
        console.error("Failed to submit enquiry");
        toast.error("Failed to submit enquiry");
      }
    } catch (err) {
      console.error("Error submitting enquiry:", err);
      toast.error("Error submitting enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Common fields */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <PhoneInput
                  country={"in"}
                  value={field.value}
                  onChange={(value) => field.onChange("+" + value)}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "6px",
                    borderColor: "#e5e7eb",
                  }}
                  buttonStyle={{
                    borderColor: "#e5e7eb",
                  }}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional fields based on type */}
        {type === "forCallback" && (
          <FormField
            control={form.control}
            name="message" // This will store the selected time slot
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time</FormLabel>
                <FormControl>
                  <Select {...field} disabled={loading} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10am-12pm">10 AM - 12 PM</SelectItem>
                      <SelectItem value="12pm-2pm">12 PM - 2 PM</SelectItem>
                      <SelectItem value="2pm-4pm">2 PM - 4 PM</SelectItem>
                      <SelectItem value="4pm-6pm">4 PM - 6 PM</SelectItem>
                      <SelectItem value="6pm-8pm">6 PM - 8 PM</SelectItem>
                      <SelectItem value="8pm-10pm">8 PM - 10 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}


        {type === "forCourses" && (
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question about Course</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ask about syllabus, duration, pricing..."
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === "forMock" && (
          <>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mock Interview Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us your target role, skills, or interview type"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {type === "forResumeReview" && (
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Paste Google Drive / LinkedIn resume link"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === "other" && (
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your query..."
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Enquiry"}
        </Button>
      </form>
    </Form>

  );
}
