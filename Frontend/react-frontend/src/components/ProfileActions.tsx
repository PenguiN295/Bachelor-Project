import { useState, type ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import url from '../../config';
import { useAuth } from '../context/AuthContext';

const ProfileActions: React.FC<{ modifyUser: 'username' | 'password' }> = ({ modifyUser }) => {
    const { updateUser, token } = useAuth();
    const navigate = useNavigate();

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
            }
            navigate('/dashboard');
        },
        onError: (error) => {
            console.error('Update failed:', error);
            alert("Error updating profile. Please try again.");
        }
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (modifyUser === 'password' && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const payload: any = {};
        if (modifyUser === 'username') payload.Username = formData.username;
        if (modifyUser === 'password') payload.Password = formData.password;

        mutation.mutate(payload);
    };

    const renderSubmitButton = () => (
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
            ) : 'Save Changes'}
        </button>
    );

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}>
                <h3 className="text-center mb-4">
                    {modifyUser === 'username' ? 'Change Username' : 'Update Password'}
                </h3>
                <form onSubmit={handleSubmit}>
                    {modifyUser === 'username' ? (
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
                    ) : (
                        <>
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
                        </>
                    )}
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/profile')}>
                            Cancel
                        </button>
                        {renderSubmitButton()}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfileActions;