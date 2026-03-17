import React from 'react';
import { useNavigate } from 'react-router-dom';
import noPhoto from '../assets/nophoto.svg';

interface UserComponentProps {
    id: string;
    username: string;
    photo?: string | null;
    role?: string | null;
    showRole?: boolean;
    isMe?: boolean;
}

const UserComponent: React.FC<UserComponentProps> = ({ id, username, photo, role, showRole = false, isMe = false }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (isMe) {
            navigate('/profile');
        } else {
            navigate(`/profile/${id}`);
        }
    };

    return (
        <div 
            className="d-flex align-items-center p-2 rounded hover-bg-light transition-all"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="me-3">
                <img 
                    src={photo || noPhoto} 
                    className="rounded-circle border"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <div className="fw-bold text-dark text-truncate">{username}</div>
                {showRole && role && (
                    <div className="small text-muted text-capitalize">{role}</div>
                )}
            </div>
        </div>
    );
};

export default UserComponent;
