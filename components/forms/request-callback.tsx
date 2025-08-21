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

// Define validation schema with Zod
const RequestCallbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  message: z.string().optional(),
});

export type RequestCallbackValues = z.infer<typeof RequestCallbackSchema>;

export type RequestCallbackFormProps = {
  /** Called when form submits successfully */
  onSuccess?: (values: RequestCallbackValues) => void;
};

export default function RequestCallbackForm({
  onSuccess,
}: RequestCallbackFormProps) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<RequestCallbackValues>({
    resolver: zodResolver(RequestCallbackSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: RequestCallbackValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("You will receive a call from us shortly");
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
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
                  country={"in"} // default India
                  value={field.value}
                  onChange={(value) => field.onChange("+" + value)} // ✅ ensures +91 prefix
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

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your message (optional)"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Request Callback"}
        </Button>
      </form>
    </Form>
  );
}
