import { useQuery } from "@tanstack/react-query";
import url from "../../config";
import { useAuth } from "../context/AuthContext";
import type UserResponse from "../Interfaces/UserResponse";

export const useUser = (userId: string) => {
    const { token } = useAuth();
    return useQuery({
        queryKey: ["user", userId],
        queryFn: async (): Promise<UserResponse> => {
            const response = await fetch(`${url}/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch user");
            return response.json();
        },
        enabled: !!userId && !!token,
        staleTime: 5 * 60 * 1000,
    });
};
