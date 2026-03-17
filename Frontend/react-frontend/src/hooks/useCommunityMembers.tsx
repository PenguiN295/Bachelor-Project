import { useQuery } from "@tanstack/react-query";
import url from "../../config";
import { useAuth } from "../context/AuthContext";
import type UserResponse from "../Interfaces/UserResponse";

export const useCommunityMembers = (slug: string) => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["community-members", slug],
        queryFn: async (): Promise<UserResponse[]> => {
            const response = await fetch(`${url}/api/communities/${slug}/members`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch community members");
            return response.json();
        },
        enabled: !!slug && !!token,
        staleTime: 5 * 60 * 1000,
    });
};
