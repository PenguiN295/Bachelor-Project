


import { useMutation } from "@tanstack/react-query";
import url from "../../config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const {login :authLogin} = useAuth();
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: async (credentials : {email: string, password : string}) => {
            const response = await fetch(`${url}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                   Email : credentials.email,
                   Password : credentials.password
                })
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || "Failed to login");
            }
            return response.json()
           
        },
        onSuccess : async (data) =>{
            authLogin(data.token);
            navigate("/dashboard");
        }
    })

    return {login: loginMutation.mutate,
        loading: loginMutation.isPending,
        error : loginMutation.error
    }
}