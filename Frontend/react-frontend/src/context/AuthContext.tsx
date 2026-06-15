import { createContext } from "react";
import React from "react";
import { useState, useContext } from "react";
import url from '../../config';
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
interface AuthContextType {
    userId: string | null;
    username: string | null;
    photo: string | null;
    role: string | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    register: (newToken: string) => void;
    updateUser: (newUsername: string) => void;
    updatePhoto: (newPhotoUrl: string) => void;
    loading: boolean
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token')) || null;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: userInfo, isLoading } = useQuery({
        queryKey: ["userInfo", token],
        queryFn: async (): Promise<{ username: string, id: string, photo: string | null, role: string }> => {
            const response = await fetch(`${url}/user-info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch user info');
            return response.json();
        },
        enabled: !!token,
        retry: false,
    }
    )

    const login = async (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        queryClient.clear();
        navigate('/login');
    };
    const register = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };
    const updateUser = (newUsername: string) => {
        queryClient.setQueryData(["userInfo", token], (old: any) => ({ ...old, username: newUsername }));
        toast.success("Username updated successfully")
    };
    const updatePhoto = (newPhotoUrl: string) => {
        queryClient.setQueryData(["userInfo", token], (old: any) => ({ ...old, photo: newPhotoUrl }));
    };
    return (
        <AuthContext.Provider value={{ 
            userId: userInfo?.id || null,
            username: userInfo?.username || null, 
            photo: userInfo?.photo || null,
            role: userInfo?.role || null,
            token, 
            login, 
            logout, 
            register, 
            loading: isLoading, 
            updateUser,
            updatePhoto
        }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

