import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import url from "../../config";
import { useAuth } from "../context/AuthContext";

export interface NotificationResponse {
    id: string;
    actorId?: string;
    type: string;
    referenceId?: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const useNotifications = () => {
    const { token, userId } = useAuth();
    const queryClient = useQueryClient();

    const notificationsQuery = useQuery({
        queryKey: ["notifications", userId],
        queryFn: async (): Promise<NotificationResponse[]> => {
            const response = await fetch(`${url}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch notifications");
            return response.json();
        },
        enabled: !!token && !!userId,
        refetchInterval: 30000,
    });

    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${url}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to mark as read");
            return response.text();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        }
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${url}/api/notifications/read-all`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to mark all as read");
            return response.text();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        }
    });

    const unreadCount = notificationsQuery.data?.filter(n => !n.isRead).length || 0;

    return {
        notifications: notificationsQuery.data || [],
        unreadCount,
        loading: notificationsQuery.isLoading,
        error: notificationsQuery.error,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate
    };
};