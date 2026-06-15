import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, ArrowRight, ShieldCheck, Camera, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import url from '../../config';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserPage: React.FC = () => {
    const { username, photo, role, token, updatePhoto, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const onChangeClick = (where: string) => {
        if (where === 'username') navigate('/ChangePage/username');
        else if (where === 'password') navigate('/ChangePage/password');
    }

    const getInitials = (name: string | null) => {
        if (!name) return 'U';
        return name.substring(0, 2).toUpperCase();
    };

    const photoMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('photo', file);

            const response = await fetch(`${url}/update-photo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Failed to update photo');
            }
            return response.json();
        },
        onSuccess: (data) => {
            updatePhoto(data.photoUrl);
            queryClient.invalidateQueries({ queryKey: ["userInfo"] });
            toast.success("Profile picture updated successfully!");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to update profile picture.");
        }
    });

    const handlePhotoClick = () => {
        if (photoMutation.isPending) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            photoMutation.mutate(e.target.files[0]);
        }
    };

    const deleteAccountMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${url}/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
            return response.text();
        },
        onSuccess: () => {
            toast.success("Account deleted successfully.");
            setShowDeleteConfirm(false);
            logout();
        },
        onError: () => {
            toast.error("Failed to delete account. Please try again.");
            setShowDeleteConfirm(false);
        }
    });

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Account</h1>
                    <p className="text-slate-500">Manage your profile and security settings.</p>
                </div>

                <div className="space-y-6">
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <div className="h-24 bg-primary/10 w-full"></div>
                        <CardContent className="px-6 pb-6 relative">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10 mb-6">
                                <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                                    <Avatar className={`h-24 w-24 border-4 border-white shadow-md transition-opacity ${photoMutation.isPending ? 'opacity-50' : 'group-hover:opacity-90'}`}>
                                        <AvatarImage src={photo || ''} className="object-cover" />
                                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{getInitials(username)}</AvatarFallback>
                                    </Avatar>
                                    
                                    {!photoMutation.isPending && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    )}

                                    {photoMutation.isPending && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                        </div>
                                    )}
                                    
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                    />
                                </div>
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

                                <button 
                                    className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-red-600">Delete Account</div>
                                            <div className="text-sm text-red-500/80">Permanently remove your account and data</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-red-300 group-hover:text-red-500 transition-colors" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Account Modal */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Delete Account
                        </DialogTitle>
                        <DialogDescription>
                            Are you absolutely sure you want to delete your account? This action cannot be undone. All your personal data, created events, and community memberships will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 sm:justify-end gap-2 sm:gap-0">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={deleteAccountMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => deleteAccountMutation.mutate()}
                            disabled={deleteAccountMutation.isPending}
                        >
                            {deleteAccountMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Yes, delete my account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default UserPage;