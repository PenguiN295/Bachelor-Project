import React, { useState, type ChangeEvent } from 'react';
import { useRegister } from '../hooks/useRegister';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const RegisterPage: React.FC = () => {
    const [credentials, setCredentials] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const { register, loading, error } = useRegister();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (credentials.password !== credentials.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (credentials.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        register(credentials);
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-primary mb-2">EventPlatform</h1>
                <p className="text-slate-500">Create an account to join and host events.</p>
            </div>

            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-1 text-center pb-6">
                    <CardTitle className="text-2xl font-bold">Register</CardTitle>
                    <CardDescription>Fill in your details to get started</CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                                {error.message}
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="johndoe"
                                required
                                disabled={loading}
                                value={credentials.username}
                                onChange={handleChange}
                                className="bg-slate-50"
                            />  
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                required
                                disabled={loading}
                                value={credentials.email}
                                onChange={handleChange}
                                className="bg-slate-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                value={credentials.password}
                                onChange={handleChange}
                                className="bg-slate-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                value={credentials.confirmPassword}
                                onChange={handleChange}
                                className="bg-slate-50"
                            />
                        </div>

                        <Button type="submit" className="w-full mt-6 h-11 text-base" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                'Register'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
                    <div className="text-sm text-slate-500">
                        Already have an account?{' '}
                        <button 
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-primary font-semibold hover:underline"
                        >
                            Login here
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;