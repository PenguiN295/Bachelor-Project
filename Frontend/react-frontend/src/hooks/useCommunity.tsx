import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import url from "../../config";
import type Community from "../Interfaces/Community";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useCommunity = (slug: string) => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const communityQuery = useQuery({
        queryKey: ["community", slug],
        queryFn: async (): Promise<Community> => {
            const response = await fetch(`${url}/api/communities/${slug}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch community");
            return response.json();
        },
        enabled: !!slug && !!token,
        staleTime: 5 * 60 * 1000,
    });

    const joinMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${url}/api/communities/${slug}/join`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to join");
            return response.text();
        },
        onSuccess: () => {
            toast.success("Joined community!");
            queryClient.invalidateQueries({ queryKey: ["community", slug] });
            queryClient.invalidateQueries({ queryKey: ["community-members", slug] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["communities"] });
        },
        onError: () => toast.error("Could not join community")
    });

    const leaveMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${url}/api/communities/${slug}/leave`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to leave");
            return response.text();
        },
        onSuccess: () => {
            toast.success("Left community!");
            queryClient.invalidateQueries({ queryKey: ["community", slug] });
            queryClient.invalidateQueries({ queryKey: ["community-members", slug] });
            queryClient.invalidateQueries({ queryKey: ["communities"] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
        onError: () => toast.error("Could not leave community")
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${url}/api/communities/${slug}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to delete community");
            return response.text();
        },
        onSuccess: () => {
            toast.success("Community deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["communities"] });
        },
        onError: () => toast.error("Could not delete community")
    });

    return {
        community: communityQuery.data ?? null,
        loading: communityQuery.isLoading,
        error: communityQuery.error,
        join: joinMutation.mutate,
        isJoining: joinMutation.isPending,
        leave: leaveMutation.mutate,
        isLeaving: leaveMutation.isPending,
        deleteCommunity: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending
    };
};
