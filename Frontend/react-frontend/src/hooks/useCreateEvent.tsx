import { useMutation, useQueryClient } from "@tanstack/react-query";
import url from "../../config";
import { useAuth } from "../context/AuthContext";

 export const useCreateEvent = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await fetch(`${url}/create-event`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || "Failed to create Event");
            }
            return response.text();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        }
    });
    return {
        createEvent:createMutation.mutate,
        isPending:createMutation.isPending,
        error:createMutation.error
    }
};
