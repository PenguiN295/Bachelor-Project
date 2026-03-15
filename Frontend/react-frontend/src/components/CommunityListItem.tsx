import React from 'react';
import { useNavigate } from 'react-router-dom';
import type Community from '../Interfaces/Community';
import noPhoto from '../assets/nophoto.svg';

interface CommunityListItemProps {
    community: Community;
}

const CommunityListItem: React.FC<CommunityListItemProps> = ({ community }) => {
    const navigate = useNavigate();

    return (
        <div 
            className="card mb-3 shadow-sm hover-shadow transition" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/community/${community.slug}`)}
        >
            <div className="row g-0 align-items-center">
                <div className="col-auto">
                    <img
                        src={community.photo || noPhoto}
                        alt={community.name}
                        className="rounded-start"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                </div>
                <div className="col">
                    <div className="card-body py-2">
                        <div className="d-flex justify-content-between align-items-start">
                            <h5 className="card-title mb-1">{community.name}</h5>
                            {community.isJoined && (
                                <span className="badge bg-success-subtle text-success border border-success-subtle">
                                    Joined
                                </span>
                            )}
                        </div>
                        <p className="card-text text-muted mb-2 text-truncate-2" style={{ fontSize: '0.9rem' }}>
                            {community.description}
                        </p>
                        <div className="d-flex gap-3 text-muted small">
                            <span><i className="bi bi-people me-1"></i>{community.memberCount} members</span>
                            <span><i className="bi bi-calendar3 me-1"></i>Created {new Date(community.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="col-auto pe-4">
                    <i className="bi bi-chevron-right text-muted"></i>
                </div>
            </div>
        </div>
    );
};

export default CommunityListItem;
