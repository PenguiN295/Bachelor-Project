import { useQuery } from "@tanstack/react-query";
import url from "../../config";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";



export const useCategories = () => {
    const {token } = useAuth();

    const categoriesQuery = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await fetch(`${url}/categories`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            if (!response.ok) toast.error("Failed to fetch categories");
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
    })
    
    return {categories : categoriesQuery.data,
        isLoading: categoriesQuery.isLoading,
        error: categoriesQuery.error
    }
}