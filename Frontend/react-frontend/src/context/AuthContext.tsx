import { createContext } from "react";
import React from "react";
import { useState, useEffect, useContext} from "react";
import url from '../../config';
import { useNavigate } from "react-router";
interface AuthContextType {
    username: string | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    register : (username: string, newToken: string) =>void;
    updateUser: (newUsername: string) => void;
    loading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token && !username) {
            fetchUserInfo(token);
        } else {
            setLoading(false);
        }
    }, [token, username]);
    const fetchUserInfo = async (token: string) => {
        try {
            const response = await fetch(`${url}/user-info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch user info');
            const data = await response.json();
            setUsername(data.username);
            localStorage.setItem('username', data.username);
        } catch (error) {
            console.error('Error fetching user info:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
        setUsername(null);
        localStorage.clear();
       // window.location.href = '/login';
        navigate('/login');
    };
    const register  =(username: string, newToken: string) => {
        localStorage.setItem('username', username);
        setUsername(username);
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };
    const updateUser = (newUsername:string) => {
        localStorage.setItem('username', newUsername);
        setUsername(newUsername);
    };
    return (
        <AuthContext.Provider value={{ username, token, login, logout, register, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

