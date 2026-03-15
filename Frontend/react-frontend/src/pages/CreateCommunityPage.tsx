import React, { useState } from 'react';
import { useCreateCommunity } from '../hooks/useCreateCommunity';
import { useNavigate } from 'react-router-dom';

const CreateCommunityPage: React.FC = () => {
    const { createCommunity, isPending } = useCreateCommunity();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Description', description);
        if (image) {
            formData.append('ImageFile', image);
        }
        createCommunity(formData);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm p-4">
                        <div className="d-flex align-items-center mb-4">
                            <button 
                                className="btn btn-link text-decoration-none p-0 me-3" 
                                onClick={() => navigate('/communities')}
                            >
                                <i className="bi bi-arrow-left fs-4"></i>
                            </button>
                            <h2 className="mb-0">Create a Community</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 text-center">
                                <label className="form-label d-block text-start fw-bold">Community Image</label>
                                <div 
                                    className="community-photo-upload mx-auto border rounded d-flex align-items-center justify-content-center overflow-hidden position-relative"
                                    style={{ width: '200px', height: '200px', backgroundColor: '#f8f9fa' }}
                                >
                                    {preview ? (
                                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="text-center text-muted">
                                            <i className="bi bi-image fs-1 d-block"></i>
                                            <span>Click to upload</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        className="position-absolute opacity-0 w-100 h-100 cursor-pointer"
                                        style={{ top: 0, left: 0, cursor: 'pointer' }}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Community Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="What's your community called?"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Description</label>
                                <textarea
                                    className="form-control"
                                    rows={4}
                                    placeholder="Tell people what your community is about..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="d-grid gap-2">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary py-2" 
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Creating...</>
                                    ) : 'Create Community'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary py-2"
                                    onClick={() => navigate('/communities')}
                                    disabled={isPending}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCommunityPage;
