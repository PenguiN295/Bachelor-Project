import React, { useState, type ChangeEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import url from '../../config';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
    const [credentials, setCredentials] = useState({ username: '',email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {register} = useAuth();
    const navigate = useNavigate();
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (credentials.password !== credentials.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        try{
            const response = await fetch(`${url}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },   
                body: JSON.stringify({
                    Username: credentials.username,
                    Email: credentials.email,
                    Password: credentials.password
                })
            }); 
            if (!response.ok) {
                throw new Error('Invalid Email or Password');
            }
            const data = await response.json();
            register(credentials.username, data.token);
            navigate('/dashboard');

        }
        catch(err)
        {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
        finally{
            setLoading(false);
        }
    };
        return(
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 className="text-center mb-4">Register</h2>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                required
                                value={credentials.username}
                                onChange={handleChange}
                            />  
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"    
                                required
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input

                                type="password"
                                name="confirmPassword"
                                className="form-control"    
                                required
                                value={credentials.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading} >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <div className="text-left mt-3">
                        <small>Already have an account? <a href="/login">Login here</a></small>
                    </div>
                </div>
            </div>
        );
        
};

export default RegisterPage;