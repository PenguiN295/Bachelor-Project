import React, { useState } from 'react';
import { useCommunities } from '../hooks/useCommunities';
import CommunityListItem from '../components/CommunityListItem';
import LoadingState from '../components/LoadingState';
import { useNavigate } from 'react-router-dom';

const CommunitiesPage: React.FC = () => {
    const { communities, loading, error } = useCommunities();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredCommunities = communities.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) return (
        <div className="container mt-5 text-center">
            <div className="alert alert-danger">Error loading communities. Please try again later.</div>
        </div>
    );

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Explore Communities</h2>
                    <p className="text-muted">Find and join groups of like-minded people.</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/communities/create')}
                >
                    <i className="bi bi-plus-lg me-2"></i>Create Community
                </button>
            </div>

            <div className="card shadow-sm mb-4 border-0 bg-light p-3">
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 ps-1"
                        placeholder="Search communities by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <LoadingState />
            ) : filteredCommunities.length > 0 ? (
                <div className="community-list mt-3">
                    {filteredCommunities.map(community => (
                        <CommunityListItem key={community.id} community={community} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <div className="mb-3">
                        <i className="bi bi-search" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
                    </div>
                    <h4>No communities found</h4>
                    <p className="text-muted">Try a different search term or be the first to create one!</p>
                </div>
            )}
        </div>
    );
};

export default CommunitiesPage;
