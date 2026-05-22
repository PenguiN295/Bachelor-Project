import { useQuery } from "@tanstack/react-query";
import url from '../../config';
import type Event from '../Interfaces/Event';
import { useAuth } from "../context/AuthContext";

export const usePastEvents = () => {
    const { token, logout } = useAuth();

    const { data: events = [], isLoading, error } = useQuery({
        queryKey: ["past-events"],
        queryFn: async (): Promise<Event[]> => {
            const params = new URLSearchParams();
            params.set('createdByMe', 'true');
            params.set('isPast', 'true');

            const response = await fetch(`${url}/events?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!response.ok) {
                if (response.status === 401) { logout(); throw new Error("Unauthorized"); }
                throw new Error("Fetch failed");
            }
            return response.json();
        },
        enabled: !!token,
    });

    return { events, loading: isLoading, error };
};
