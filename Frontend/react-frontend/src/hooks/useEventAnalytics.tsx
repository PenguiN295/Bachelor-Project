import { useQuery } from "@tanstack/react-query";
import url from '../../config';
import type EventAnalytics from '../Interfaces/EventAnalytics';
import { useAuth } from "../context/AuthContext";

export const useEventAnalytics = (slug: string | undefined) => {
    const { token, logout } = useAuth();

    const { data: analytics, isLoading, error } = useQuery({
        queryKey: ["event-analytics", slug],
        queryFn: async (): Promise<EventAnalytics> => {
            const response = await fetch(`${url}/event/${slug}/analytics`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!response.ok) {
                if (response.status === 401) { logout(); throw new Error("Unauthorized"); }
                throw new Error("Fetch failed");
            }
            return response.json();
        },
        enabled: !!token && !!slug,
    });

    return { analytics, loading: isLoading, error };
};
