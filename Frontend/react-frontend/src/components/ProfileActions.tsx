import { useState, type ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import url from '../../config';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, KeyRound, User } from 'lucide-react';

const ProfileActions: React.FC<{ modifyUser: 'username' | 'password' }> = ({ modifyUser }) => {
    const { updateUser, token } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await fetch(`${url}/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to update profile');
            return response.text();
        },
        onSuccess: () => {
            if (modifyUser === 'username' && formData.username.trim() !== '') {
                updateUser(formData.username);
            } else {
                toast.success("Password updated successfully");
            }
            queryClient.invalidateQueries({ queryKey: ["userInfo"] })
            navigate('/profile');
        },
        onError: (error) => {
            console.error('Update failed:', error);
            toast.error("Error updating profile. Please try again.");
        }
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload: any = {};
        if (modifyUser === 'username') {
            if (formData.username.trim().length < 3) {
                toast.error("Username must be at least 3 characters long");
                return;
            }
            payload.Username = formData.username;
        }
        if (modifyUser === 'password') {
            payload.Password = formData.password;
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            if (formData.password.length < 6) {
                toast.error("Password must be at least 6 characters long");
                return;
            }
        }

        mutation.mutate(payload);
    };

    return (
        <Card className="w-full max-w-md border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    {modifyUser === 'username' ? <User className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
                </div>
                <CardTitle className="text-2xl font-bold">
                    {modifyUser === 'username' ? 'Change Username' : 'Update Password'}
                </CardTitle>
                <CardDescription>
                    {modifyUser === 'username' 
                        ? 'Choose a unique username to represent you on the platform.' 
                        : 'Ensure your account stays secure with a strong password.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {modifyUser === 'username' ? (
                        <div className="space-y-2">
                            <Label htmlFor="username">New Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter new username"
                                className="bg-slate-50"
                                required
                                disabled={mutation.isPending}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    className="bg-slate-50"
                                    required
                                    disabled={mutation.isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    className="bg-slate-50"
                                    required
                                    disabled={mutation.isPending}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            className="flex-1"
                            onClick={() => navigate('/profile')}
                            disabled={mutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="flex-1"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default ProfileActions;