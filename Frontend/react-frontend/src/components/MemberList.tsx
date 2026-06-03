import React from 'react';
import { useCommunityMembers } from '../hooks/useCommunityMembers';
import UserComponent from './UserComponent';
import LoadingState from './LoadingState';
import { useAuth } from '../context/AuthContext';
import url from '../../config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface MemberListProps {
    slug: string;
    canRemove?: boolean;
}

const MemberList: React.FC<MemberListProps> = ({ slug, canRemove }) => {
    const { data: members, isLoading, error } = useCommunityMembers(slug);
    const { userId, role, token } = useAuth();
    const queryClient = useQueryClient();

    const isModerator = canRemove || role === 'Admin';

    const removeMutation = useMutation({
        mutationFn: async (targetUserId: string) => {
            const response = await fetch(`${url}/api/communities/${slug}/members/${targetUserId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to remove member");
            return response.text();
        },
        onSuccess: () => {
            toast.success("Member removed successfully");
            queryClient.invalidateQueries({ queryKey: ["community-members", slug] });
            queryClient.invalidateQueries({ queryKey: ["community", slug] });
        },
        onError: () => toast.error("Could not remove member")
    });

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
                        <div key={member.id} className="list-group-item border-0 border-bottom d-flex justify-content-between align-items-center">
                            <UserComponent 
                                id={member.id} 
                                username={member.username} 
                                photo={member.photo} 
                                role={member.role}
                                showRole={true}
                                isMe={member.id === userId}
                            />
                            {isModerator && member.role !== 'Owner' && (
                                <button 
                                    className="btn btn-sm btn-outline-danger ms-2"
                                    onClick={() => removeMutation.mutate(member.id)}
                                    title="Remove member"
                                >
                                    <i className="bi bi-person-x-fill"></i>
                                </button>
                            )}
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
