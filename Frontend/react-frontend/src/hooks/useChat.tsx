import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import url from "../../config";
import { useAuth } from "../context/AuthContext";
import type { ChatMessageResponse } from "../Interfaces/ChatMessageResponse";

export interface ChatPartner {
    id: string;
    username: string;
    photo?: string;
    unreadCount: number;
    lastMessage?: string;
    lastMessageAt?: string;
}

export const useChat = (partnerId?: string) => {
    const { token, userId } = useAuth();
    const queryClient = useQueryClient();

    const partnersQuery = useQuery({
        queryKey: ["chat-partners", userId],
        queryFn: async (): Promise<ChatPartner[]> => {
            const response = await fetch(`${url}/api/chat/partners`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch chat partners");
            return response.json();
        },
        enabled: !!token && !!userId,
    });

    const conversationQuery = useQuery({
        queryKey: ["conversation", partnerId?.toLowerCase()],
        queryFn: async (): Promise<ChatMessageResponse[]> => {
            const response = await fetch(`${url}/api/chat/conversation/${partnerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch conversation");
            return response.json();
        },
        enabled: !!token && !!partnerId,
    });

    const sendMessageMutation = useMutation({
        mutationFn: async (content: string) => {
            const response = await fetch(`${url}/api/chat/send`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ receiverId: partnerId, content })
            });
            if (!response.ok) throw new Error("Failed to send message");
            return response.json();
        },
        onSuccess: (newMessage) => {
            // Optimistically update the conversation cache
            queryClient.setQueryData(["conversation", partnerId?.toLowerCase()], (oldData: any) => {
                if (!oldData) return [newMessage];
                if (oldData.find((m: any) => m.id === newMessage.id)) return oldData;
                return [...oldData, newMessage];
            });
            queryClient.invalidateQueries({ queryKey: ["chat-partners"] });
        }
    });

    const markAsReadMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${url}/api/chat/read/${partnerId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to mark as read");
            return response.text();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chat-partners"] });
        }
    });

    return {
        partners: partnersQuery.data || [],
        partnersLoading: partnersQuery.isLoading,
        conversation: conversationQuery.data || [],
        conversationLoading: conversationQuery.isLoading,
        sendMessage: sendMessageMutation.mutate,
        isSending: sendMessageMutation.isPending,
        markAsRead: markAsReadMutation.mutate
    };
};