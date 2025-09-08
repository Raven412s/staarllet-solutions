"use client"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    Textarea
} from "@/components/ui/textarea"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import { useState } from "react"
import {
    useForm
} from "react-hook-form"
import {
    toast
} from "sonner"
import {
    z
} from "zod"

const formSchema = z.object({
    mail_recipient: z.string().email("Invalid email address"),
    mail_Subject: z.string().min(1, "Subject is required").min(3, "Subject must be at least 3 characters"),
    mail_body: z.string().min(1, "Message body is required")
});

type EmailProps = {
    to?: string;
    /** Called when form submits successfully */
    onSuccess?: (values: z.infer<typeof formSchema>) => void;
}

export default function SendEmailForm({ to, onSuccess }: EmailProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mail_recipient: to || "",
            mail_Subject: "",
            mail_body: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {            
            // Map form fields to API expected fields
            const apiData = {
                to: values.mail_recipient,
                subject: values.mail_Subject,
                text: values.mail_body
            };
            
            const res = await fetch("/api/mailer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiData),
            });

            if (res.ok) {
                toast.success("Mail sent");
                form.reset(); // ✅ clear form
                onSuccess?.(values);
            } else {
                console.error("Failed to send mail");
                toast.error("Failed to send mail");
            }
        } catch (err) {
            console.error("Error sending mail:", err);
            toast.error("Error sending mail");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                <FormField
                    control={form.control}
                    name="mail_recipient"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>To</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter recipient's email ID"
                                    type="email"
                                    {...field}
                                    value={field.value || to}
                                    disabled={loading}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mail_Subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter the subject of this mail"
                                    type="text"
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
                    name="mail_body"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Body</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter the mail body here"
                                    className="resize-none"
                                    {...field}
                                    disabled={loading}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Mail"}
                </Button>
            </form>
        </Form>
    )
}