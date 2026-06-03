import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserPage: React.FC = () => {
    const { username, photo, role } = useAuth();
    const navigate = useNavigate();

    const onChangeClick = (where: string) => {
        if (where === 'username') navigate('/ChangePage/username');
        else if (where === 'password') navigate('/ChangePage/password');
    }

    const getInitials = (name: string | null) => {
        if (!name) return 'U';
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Account</h1>
                    <p className="text-slate-500">Manage your profile and security settings.</p>
                </div>

                <div className="space-y-6">
                    {/* Profile Summary Card */}
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <div className="h-24 bg-primary/10 w-full"></div>
                        <CardContent className="px-6 pb-6 relative">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10 mb-6">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                                    <AvatarImage src={photo || ''} />
                                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{getInitials(username)}</AvatarFallback>
                                </Avatar>
                                <div className="text-center sm:text-left flex-1">
                                    <h2 className="text-2xl font-bold text-slate-900">{username}</h2>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 text-sm">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        <span>{role === 'Admin' ? 'Administrator' : 'Community Member'}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions Card */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Security & Settings</CardTitle>
                            <CardDescription>Update your personal information and login credentials.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                <button 
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                                    onClick={() => onChangeClick('username')}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-slate-900">Change Username</div>
                                            <div className="text-sm text-slate-500">Update how you appear to others</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                                </button>

                                <button 
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                                    onClick={() => onChangeClick('password')}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                                            <KeyRound className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-slate-900">Change Password</div>
                                            <div className="text-sm text-slate-500">Keep your account secure</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default UserPage;