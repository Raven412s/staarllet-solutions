// components/forms/ReviewForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useCurrentUser } from "@/lib/useUser";


interface ReviewFormProps {
  courseId: string;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ courseId, onReviewSubmitted }: ReviewFormProps) {
  const { user, loading} = useCurrentUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please sign in to submit a review");
      return;
    }
    
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/courses/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          rating,
          comment,
          userName: user.name || user.email?.split("@")[0],
        }),
      });
      
      if (response.ok) {
        setRating(0);
        setComment("");
        onReviewSubmitted();
        alert("Review submitted successfully!");
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-center text-gray-600">
            Please sign in to leave a review
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Review
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this course..."
              required
              rows={4}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0 || !comment.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}