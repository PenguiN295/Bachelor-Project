import { createContext } from "react";
import React from "react";
import { useState, useContext } from "react";
import url from '../../config';
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
interface AuthContextType {
    username: string | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    register: (username: string, newToken: string) => void;
    updateUser: (newUsername: string) => void;
    loading: boolean

}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {data : username = '', isLoading} = useQuery({
          queryKey: ["userInfo", token],
          queryFn: async (): Promise<string> => {
             const response = await fetch(`${url}/user-info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch user info');
            const data = await response.json();
            return data.username;
            
    },
        enabled:  !!token,
    }
    )
    

    const login = (newToken: string) => {
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
        queryClient.setQueryData(["userInfo", token], newUsername);
    };
    return (
        <AuthContext.Provider value={{ username, token, login, logout, register, loading : isLoading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

