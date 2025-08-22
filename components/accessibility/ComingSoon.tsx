"use client"
import React, { useEffect, useState } from "react";

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

// Move target date calculation outside the function to maintain consistency
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 1); // +1 day
targetDate.setHours(targetDate.getHours() + 7); // +7 hrs
targetDate.setMinutes(targetDate.getMinutes() + 44); // +44 mins
targetDate.setSeconds(targetDate.getSeconds() + 34); // +34 secs

const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const difference = +targetDate - +now;

    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return timeLeft;
};

export default function ComingSoon() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubscribed(true);
        setIsLoading(false);
        setEmail("");

        // Reset after 5 seconds
        setTimeout(() => {
            setIsSubscribed(false);
        }, 5000);
    };

    const formatTimeUnit = (unit: number): string => {
        return unit < 10 ? `0${unit}` : `${unit}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 text-center px-6 py-12">
            {/* Animated Background Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-green-300 rounded-full opacity-30 animate-bounce"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-green-100 rounded-full opacity-40 animate-ping"></div>

            <div className="relative z-10 max-w-2xl w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-green-800 tracking-wide mb-4 animate-fade-in">
                        Something Amazing Is Coming Soon
                    </h1>
                    <p className="text-lg text-green-700 max-w-md mx-auto">
                        We&apos;re working hard to bring you an incredible experience. Stay tuned for the launch!
                    </p>
                </div>

                {/* Countdown Timer */}
                <div className="mb-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
                        {[
                            { value: timeLeft.days, label: "Days" },
                            { value: timeLeft.hours, label: "Hours" },
                            { value: timeLeft.minutes, label: "Minutes" },
                            { value: timeLeft.seconds, label: "Seconds" }
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                                <div className="text-3xl md:text-4xl font-bold text-green-700 font-mono">
                                    {formatTimeUnit(item.value)}
                                </div>
                                <div className="text-sm text-green-600 mt-2 uppercase tracking-wide">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subscription Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-green-100">
                    {isSubscribed ? (
                        <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-green-900 mb-2">Thank You!</h3>
                            <p className="text-green-700">You&apos;ll be the first to know when we launch.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-xl font-semibold text-green-900 mb-4">Get Notified When We Launch</h3>
                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                                        disabled={isLoading}
                                    />
                                    <svg
                                        className="absolute right-3 top-3 w-5 h-5 text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        "Notify Me"
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}