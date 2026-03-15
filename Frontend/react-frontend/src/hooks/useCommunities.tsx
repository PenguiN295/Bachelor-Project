import { useQuery } from "@tanstack/react-query";
import url from "../../config";
import type Community from '../Interfaces/Community';
import { useAuth } from "../context/AuthContext";

export const useCommunities = () => {
    const { token, logout } = useAuth();

    const { data: communities = [], isLoading, error } = useQuery({
        queryKey: ["communities"],
        queryFn: async (): Promise<Community[]> => {
            const response = await fetch(`${url}/api/communities`, {
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

    return { communities, loading: isLoading, error };
};
