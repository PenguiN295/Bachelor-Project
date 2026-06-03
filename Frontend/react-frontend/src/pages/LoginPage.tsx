import React, { useState, type ChangeEvent } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { error, login, loading } = useLogin();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    login(credentials);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">EventPlatform</h1>
        <p className="text-slate-500">Welcome back! Please login to your account.</p>
      </div>

      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your email and password</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                {error.message}
              </div>
            )}
            
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
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                </div>
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

            <Button type="submit" className="w-full mt-6 h-11 text-base" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
            <div className="text-sm text-slate-500">
                Don't have an account?{' '}
                <button 
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-primary font-semibold hover:underline"
                >
                    Register here
                </button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;