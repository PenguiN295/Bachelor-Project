import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import url from "../../config";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

interface FeedbackStatus {
    canReview: boolean;
    hasReviewed: boolean;
}

export const useEventFeedback = (slug?: string) => {
    const { token, userId } = useAuth();
    const queryClient = useQueryClient();

    const statusQuery = useQuery({
        queryKey: ["feedback-status", slug],
        queryFn: async (): Promise<FeedbackStatus> => {
            const response = await fetch(`${url}/event/${slug}/feedback-status`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch feedback status");
            return response.json();
        },
        enabled: !!token && !!slug && !!userId,
    });

    const submitFeedbackMutation = useMutation({
        mutationFn: async (data: { rating: number; comment: string; isAnonymous: boolean }) => {
            const response = await fetch(`${url}/event/${slug}/feedback`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to submit feedback");
            }
            
            return response.json();
        },
        onSuccess: () => {
            toast.success("Feedback submitted successfully!");
            queryClient.invalidateQueries({ queryKey: ["feedback-status", slug] });
            queryClient.invalidateQueries({ queryKey: ["event-analytics", slug] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Could not submit feedback");
        }
    });

    return {
        canReview: statusQuery.data?.canReview ?? false,
        hasReviewed: statusQuery.data?.hasReviewed ?? false,
        isLoadingStatus: statusQuery.isLoading,
        submitFeedback: submitFeedbackMutation.mutate,
        isSubmitting: submitFeedbackMutation.isPending
    };
};