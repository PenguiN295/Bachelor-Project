import { useState } from 'react';
import { type ChangeEvent } from 'react';
import url from '../../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const ProfileActions: React.FC<{ modifyUser: 'username' | 'password' }> = ({ modifyUser }) => {

    const { updateUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username:   '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (modifyUser === 'password' && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const payload: any = {};
            if (modifyUser === 'username') payload.Username = formData.username;
            if (modifyUser === 'password') payload.Password = formData.password;
            const response = await fetch(`${url}/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...payload
                })
            });

            if (!response.ok) {
                console.error('Failed to update profile:', await response.text());
                throw new Error('Failed to update profile');
            }
            if (formData.username !== localStorage.getItem('username') && formData.username.trim() !== '')
                updateUser(formData.username);

        }
        catch (err) {
            console.error('Error updating profile:', err);
        }
        finally {
            setLoading(false);
            navigate('/dashboard');
        }
    }

    if (modifyUser === 'username') {
        return (

            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}>
                    <h3 className="text-center mb-4">Change Username</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">New Username</label>
                            <input
                                name="username"
                                className="form-control" 
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter new username"
                            />
                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/profile')}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    } else if (modifyUser === 'password') {
        return (
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}>
                    <h3 className="text-center mb-4">Update Password</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">New Password</label>
                            <input
                                name="password"
                                className="form-control"
                                type="password"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/profile')}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}


export default ProfileActions