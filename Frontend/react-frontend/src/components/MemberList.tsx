import React from 'react';
import { useCommunityMembers } from '../hooks/useCommunityMembers';
import UserComponent from './UserComponent';
import LoadingState from './LoadingState';
import { useAuth } from '../context/AuthContext';

interface MemberListProps {
    slug: string;
}

const MemberList: React.FC<MemberListProps> = ({ slug }) => {
    const { data: members, isLoading, error } = useCommunityMembers(slug);
    const { userId } = useAuth();

    if (isLoading) return <LoadingState />;
    if (error) return <div className="text-danger p-3">Error loading members</div>;

    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">Community Members</h5>
            </div>
            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {members?.map(member => (
                        <div key={member.id} className="list-group-item border-0 border-bottom">
                            <UserComponent 
                                id={member.id} 
                                username={member.username} 
                                photo={member.photo} 
                                role={member.role}
                                showRole={true}
                                isMe={member.id === userId}
                            />
                        </div>
                    ))}
                </div>
                {members?.length === 0 && (
                    <div className="p-4 text-center text-muted">
                        No members yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberList;
