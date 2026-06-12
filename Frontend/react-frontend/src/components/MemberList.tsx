import React from 'react';
import { useCommunityMembers } from '../hooks/useCommunityMembers';
import UserComponent from './UserComponent';
import LoadingState from './LoadingState';
import { useAuth } from '../context/AuthContext';
import url from '../../config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserMinus, ShieldAlert, Shield, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberListProps {
    slug: string;
    currentUserRole?: string;
}

const MemberList: React.FC<MemberListProps> = ({ slug, currentUserRole }) => {
    const { data: members, isLoading, error } = useCommunityMembers(slug);
    const { userId, role: globalRole, token } = useAuth();
    const queryClient = useQueryClient();

    const isGlobalAdmin = globalRole === 'Admin';
    const isOwner = currentUserRole === 'Owner' || isGlobalAdmin;
    const isModerator = currentUserRole === 'Moderator' || isOwner;

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

    const promoteMutation = useMutation({
        mutationFn: async (targetUserId: string) => {
            const response = await fetch(`${url}/api/communities/${slug}/members/${targetUserId}/promote`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to promote member");
            return response.text();
        },
        onSuccess: () => {
            toast.success("Member promoted to Moderator");
            queryClient.invalidateQueries({ queryKey: ["community-members", slug] });
        },
        onError: () => toast.error("Could not promote member")
    });

    const demoteMutation = useMutation({
        mutationFn: async (targetUserId: string) => {
            const response = await fetch(`${url}/api/communities/${slug}/members/${targetUserId}/demote`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to demote member");
            return response.text();
        },
        onSuccess: () => {
            toast.success("Moderator demoted to Member");
            queryClient.invalidateQueries({ queryKey: ["community-members", slug] });
        },
        onError: () => toast.error("Could not demote member")
    });

    if (isLoading) return <LoadingState />;
    if (error) return <div className="text-destructive p-3">Error loading members</div>;

    const canRemoveUser = (targetRole?: string) => {
        if (isGlobalAdmin) return targetRole !== 'Owner';
        if (currentUserRole === 'Owner') return targetRole !== 'Owner';
        if (currentUserRole === 'Moderator') return targetRole === 'Member';
        return false;
    };

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                <CardTitle className="text-lg flex justify-between items-center">
                    <span>Members</span>
                    <span className="text-sm font-normal text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {members?.length || 0}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    <div className="divide-y divide-slate-100">
                        {members?.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors">
                                <div className="flex-1 min-w-0 pr-2">
                                    <UserComponent 
                                        id={member.id} 
                                        username={member.username} 
                                        photo={member.photo} 
                                        role={member.role}
                                        showRole={true}
                                        isMe={member.id === userId}
                                    />
                                </div>
                                
                                {member.id !== userId && (isOwner || isModerator) && (
                                    <div className="shrink-0 flex items-center pr-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                {isOwner && member.role === 'Member' && (
                                                    <DropdownMenuItem 
                                                        onClick={() => promoteMutation.mutate(member.id)}
                                                        disabled={promoteMutation.isPending}
                                                    >
                                                        <Shield className="mr-2 h-4 w-4 text-emerald-600" />
                                                        <span>Promote to Mod</span>
                                                    </DropdownMenuItem>
                                                )}
                                                
                                                {isOwner && member.role === 'Moderator' && (
                                                    <DropdownMenuItem 
                                                        onClick={() => demoteMutation.mutate(member.id)}
                                                        disabled={demoteMutation.isPending}
                                                    >
                                                        <ShieldAlert className="mr-2 h-4 w-4 text-amber-600" />
                                                        <span>Demote to Member</span>
                                                    </DropdownMenuItem>
                                                )}

                                                {canRemoveUser(member.role) && (
                                                    <DropdownMenuItem 
                                                        onClick={() => removeMutation.mutate(member.id)}
                                                        disabled={removeMutation.isPending}
                                                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                    >
                                                        <UserMinus className="mr-2 h-4 w-4" />
                                                        <span>Remove from Community</span>
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {members?.length === 0 && (
                        <div className="p-6 text-center text-slate-500">
                            No members yet.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MemberList;