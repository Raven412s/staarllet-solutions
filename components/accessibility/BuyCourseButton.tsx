"use client"
import { useCurrentUser } from "@/lib/useUser";
import { cn } from "@/lib/utils";
import { ICourse } from "@/models/Course";
import { ArrowRight, CheckCircle, Loader2, LogIn, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

const BuyCourseButton = ({ course }: { course: ICourse }) => {
    const router = useRouter()
    const [isRedirecting, setIsRedirecting] = useState(false);
    const whatsappNumber =
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916307607882";

    // ✅ Fetch current user (if logged in)
    let userName = "";
    let userEmail = "";

    const { user, loading } = useCurrentUser();
    if (user) {
        userName = user.name || "";
        userEmail = user.email;
    }

    const priceText = course.discountedPrice
        ? `₹${course.discountedPrice.toLocaleString("en-IN")}`
        : `₹${course.price.toLocaleString("en-IN")}`;

    // ✅ Build WhatsApp-friendly message
    const message = [
        `*Hi,* 👋`,
        ``,
        `I want to buy this course:`,
        `*${course.title}*`,
        `💰 Price: _${priceText}_`,
        ``,
        `Please help me with the purchase.`,
        `Course ID: \`${course._id}\``,
    ];

    if (userName || userEmail) {
        message.push("");
        message.push(`_Submitted by:_`);
        if (userName) message.push(`*Name:* ${userName}`);
        if (userEmail) message.push(`*Email:* ${userEmail}`);
    }

    // ✅ Join & encode safely
    const finalMessage = message.join("\n").replace(/₹/g, "INR ").replace(/,/g, "");
    const waLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
        finalMessage
    )}`;

    const handleLoginRedirect = () => {
        setIsRedirecting(true);
        router.push("/login");
    };

    return (
        <div className="space-y-3 w-full">
            {loading ? (
                <Button 
                    disabled 
                    className="w-full py-4 bg-gray-100 text-gray-600 hover:bg-gray-100 transition-all duration-300 rounded-xl font-medium flex items-center justify-center gap-2 border border-gray-200"
                >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Checking user...
                </Button>
            ) : user ? (
                <>
                    <Button 
                        asChild 
                        className={cn(
                            "w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                        )}
                    >
                        <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full">
                            <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                            Connect & Buy on WhatsApp
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>You&apos;re logged in as {userName || userEmail}</span>
                    </div>
                </>
            ) : (
                <Button 
                    className={cn(
                        "w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                    )}
                    onClick={handleLoginRedirect}
                    disabled={isRedirecting}
                >
                    {isRedirecting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <LogIn className="h-5 w-5 transition-transform group-hover:scale-110" />
                    )}
                    {isRedirecting ? "Redirecting..." : "Login to Purchase"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            )}
        </div>
    )
}

export default BuyCourseButton