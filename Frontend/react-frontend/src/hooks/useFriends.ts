import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import url from "../../config";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export interface FriendResponse {
    id: string;
    userId: string;
    username: string;
    photo?: string;
    status: string;
    isRequester: boolean;
    createdAt: string;
}

export const useFriends = () => {
    const { token, userId } = useAuth();
    const queryClient = useQueryClient();

    const friendsQuery = useQuery({
        queryKey: ["friends", userId],
        queryFn: async (): Promise<FriendResponse[]> => {
            const response = await fetch(`${url}/api/friends`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch friends");
            return response.json();
        },
        enabled: !!token && !!userId,
    });

    const pendingQuery = useQuery({
        queryKey: ["friends", "pending", userId],
        queryFn: async (): Promise<FriendResponse[]> => {
            const response = await fetch(`${url}/api/friends/pending`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch pending requests");
            return response.json();
        },
        enabled: !!token && !!userId,
    });

    const sendRequestMutation = useMutation({
        mutationFn: async (targetUserId: string) => {
            const response = await fetch(`${url}/api/friends/request/${targetUserId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to send request");
            return response.text();
        },
        onSuccess: () => {
            toast.success("Friend request sent!");
            queryClient.invalidateQueries({ queryKey: ["friends", "pending", userId] });
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: () => toast.error("Could not send friend request.")
    });

    const acceptRequestMutation = useMutation({
        mutationFn: async (friendshipId: string) => {
            const response = await fetch(`${url}/api/friends/accept/${friendshipId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to accept request");
            return response.text();
        },
        onSuccess: () => {
            toast.success("Friend request accepted!");
            queryClient.invalidateQueries({ queryKey: ["friends"] });
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: () => toast.error("Could not accept friend request.")
    });

    const rejectRequestMutation = useMutation({
        mutationFn: async (friendshipId: string) => {
            const response = await fetch(`${url}/api/friends/reject/${friendshipId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to reject request");
            return response.text();
        },
        onSuccess: () => {
            toast.success("Friend request rejected");
            queryClient.invalidateQueries({ queryKey: ["friends", "pending", userId] });
        },
        onError: () => toast.error("Could not reject friend request.")
    });

    const removeFriendMutation = useMutation({
        mutationFn: async (friendshipId: string) => {
            const response = await fetch(`${url}/api/friends/remove/${friendshipId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to remove friend");
            return response.text();
        },
        onSuccess: () => {
            toast.success("Friend removed");
            queryClient.invalidateQueries({ queryKey: ["friends", userId] });
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: () => toast.error("Could not remove friend.")
    });

    return {
        friends: friendsQuery.data || [],
        pendingRequests: pendingQuery.data || [],
        loading: friendsQuery.isLoading || pendingQuery.isLoading,
        sendRequest: sendRequestMutation.mutate,
        isSending: sendRequestMutation.isPending,
        acceptRequest: acceptRequestMutation.mutate,
        isAccepting: acceptRequestMutation.isPending,
        rejectRequest: rejectRequestMutation.mutate,
        isRejecting: rejectRequestMutation.isPending,
        removeFriend: removeFriendMutation.mutate,
        isRemoving: removeFriendMutation.isPending
    };
};