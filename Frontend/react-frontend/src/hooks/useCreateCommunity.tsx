import { useMutation, useQueryClient } from "@tanstack/react-query";
import url from "../../config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useCreateCommunity = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const createMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await fetch(`${url}/api/communities`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || "Failed to create community");
            }
            return response.json();
        },
        onSuccess: (data) => {
            toast.success("Community created successfully!");
            queryClient.invalidateQueries({ queryKey: ["communities"] });
            navigate(`/community/${data.slug}`);
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    return {
        createCommunity: createMutation.mutate,
        isPending: createMutation.isPending,
        error: createMutation.error
    };
};
