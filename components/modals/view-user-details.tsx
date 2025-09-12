// components/modals/view-user-detail.tsx
"use client";
import { IUserDto } from "@/app/admin/(dashboard)/users/UsersTable";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AchievementType, BlogType, CourseType, EnquiryType } from "@/types/user";
import { Download, Eye, FileText } from "lucide-react";
import Image from "next/image";
import React from 'react';

interface ViewUserDetailsModalProps {
    user: IUserDto;
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const ViewUserDetailsModal: React.FC<ViewUserDetailsModalProps> = ({
    user,
    children,
    open,
    onOpenChange,
}) => {
    const formatDate = (date: Date | string | unknown) => {
        // Handle various date formats safely
        let dateObj: Date;

        if (date instanceof Date) {
            dateObj = date;
        } else if (typeof date === 'string') {
            dateObj = new Date(date);
        } else if (date && typeof date === 'object' && '$date' in date) {
            // Handle MongoDB date format { $date: string }
            dateObj = new Date((date as { $date: string }).$date);
        } else {
            return 'Invalid date';
        }

        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }

        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function to handle ObjectId arrays
    const getArrayLength = (array: BlogType[] | CourseType[] | EnquiryType[] | AchievementType[] | undefined): number => {
        return array ? array.length : 0;
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        User Details
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[70vh] pr-4">
                    <div className="space-y-6">
                        {/* Profile Section */}
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 rounded-full overflow-hidden">
                                <Image
                                    src={user.image || "/placeholder-user.jpg"}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "/placeholder-user.jpg";
                                    }}
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                                        {user.role}
                                    </Badge>
                                    <Badge variant={user.isBanned ? "destructive" : "outline"}>
                                        {user.isBanned ? "Banned" : "Active"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Clerk ID</p>
                                    <p className="font-medium text-sm">{user.clerkId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">User ID</p>
                                    <p className="font-medium text-sm">{user.id}</p>
                                </div>
                                {user.resume && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Resume</p>
                                        <a
                                            href={user.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-blue-600 hover:underline"
                                        >
                                            <FileText className="h-4 w-4" />
                                            View Resume
                                            <Download className="h-3 w-3" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Activity Stats */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Activity</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold">{getArrayLength(user.myBlogs)}</p>
                                    <p className="text-sm text-muted-foreground">Blogs</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold">{getArrayLength(user.enrolledCourses)}</p>
                                    <p className="text-sm text-muted-foreground">Courses</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold">{getArrayLength(user.achievements)}</p>
                                    <p className="text-sm text-muted-foreground">Achievements</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold">{getArrayLength(user.myEnquiries)}</p>
                                    <p className="text-sm text-muted-foreground">Enquiries</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Timestamps */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Timestamps</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p className="font-medium">{formatDate(user.updatedAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Achievements Section */}
                        {user.achievements && user.achievements.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                                    <div className="space-y-2">
                                        {user.achievements.map((achievement, index) => (
                                            <div key={index} className="p-3 bg-muted rounded-lg">
                                                <p className="font-medium">{achievement}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ViewUserDetailsModal;