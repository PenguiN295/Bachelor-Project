


import { useMutation } from "@tanstack/react-query";
import url from "../../config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
    const { register: authRegister } = useAuth();
    const navigate = useNavigate();
    const registerMutation = useMutation({
        mutationFn: async (credentials: { email: string, password: string, username: string }) => {
            const response = await fetch(`${url}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Email: credentials.email,
                    Password: credentials.password,
                    Username: credentials.username,
                })
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || "Failed to login");
            }
            return response.json()

        },
        onSuccess: async (data) => {
            authRegister(data.token);
            navigate("/dashboard");
        }
        
    })

    return {
        register: registerMutation.mutate,
        loading: registerMutation.isPending,
        error: registerMutation.error
    }
}