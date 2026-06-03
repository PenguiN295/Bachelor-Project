import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import url from '../../config';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/LoadingState';
import type UserResponse from '../Interfaces/UserResponse';
import UserComponent from '../components/UserComponent';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ExternalLink, UserCog, AlertCircle } from 'lucide-react';

const UsersPage: React.FC = () => {
    const { token, role } = useAuth();
    const navigate = useNavigate();

    const { data: users, isLoading, error } = useQuery<UserResponse[]>({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const response = await fetch(`${url}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch users");
            return response.json();
        },
        enabled: role === 'Admin'
    });

    if (role !== 'Admin') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-0 shadow-lg text-center p-8">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Access Denied</CardTitle>
                    <CardDescription className="text-slate-500 mb-6 text-base">
                        You do not have the required administrative permissions to view this page.
                    </CardDescription>
                    <Button onClick={() => navigate('/')} className="w-full">Return Home</Button>
                </Card>
            </div>
        );
    }

    if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><LoadingState /></div>;
    
    if (error) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 max-w-md text-center">
                <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-1">Error Loading Users</h3>
                <p className="text-sm opacity-90">Please try again later or contact system support.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <UserCog className="w-8 h-8 text-primary" />
                            User Management
                        </h1>
                        <p className="text-slate-500 mt-1">Review, moderate, and manage platform members.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
                        Total Users: <span className="text-primary font-bold">{users?.length || 0}</span>
                    </div>
                </div>

                <Card className="border-0 shadow-md overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">User</th>
                                        <th className="px-6 py-4 font-semibold">Role</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {users?.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <UserComponent 
                                                        id={user.id} 
                                                        username={user.username} 
                                                        photo={user.photo} 
                                                        showRole={false} 
                                                    />
                                                    {user.isBanned && (
                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 uppercase tracking-tighter">
                                                            Banned
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                                    user.role === 'Admin' 
                                                        ? 'bg-amber-50 text-amber-700 ring-amber-600/20' 
                                                        : 'bg-slate-50 text-slate-700 ring-slate-600/10'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-primary hover:text-primary hover:bg-primary/5"
                                                    onClick={() => navigate(`/profile/${user.id}`)}
                                                >
                                                    View Profile
                                                    <ExternalLink className="w-3.5 h-3.5 ml-2" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {users?.length === 0 && (
                            <div className="p-12 text-center text-slate-500 italic bg-white">
                                No users found in the system.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UsersPage;