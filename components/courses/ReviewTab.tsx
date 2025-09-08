// components/course/ReviewsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ReviewForm } from "@/components/forms/review-form";
import { Review } from "@/models/Course";

interface ReviewsTabProps {
  courseId: string;
  initialReviews: Review[];
}

export function ReviewsTab({ courseId, initialReviews }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // This will refetch reviews when refreshTrigger changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/review`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [courseId, refreshTrigger]);

  const handleReviewSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Student Reviews</h2>
      
      <ReviewForm 
        courseId={courseId} 
        onReviewSubmitted={handleReviewSubmitted} 
      />
      
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <Card key={index} className="p-6 rounded-xl">
            <CardContent className="p-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-800">{review.user}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}