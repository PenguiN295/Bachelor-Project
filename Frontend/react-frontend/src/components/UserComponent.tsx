import React from 'react';
import { useNavigate } from 'react-router-dom';
import noPhoto from '../assets/nophoto.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, User } from 'lucide-react';

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

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div 
            className="flex items-center p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group"
            onClick={handleClick}
        >
            <Avatar className="h-10 w-10 mr-3 border border-slate-200 shadow-sm">
                <AvatarImage src={photo || noPhoto} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {getInitials(username || 'User')}
                </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 overflow-hidden">
                <div className="font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                    {username}
                </div>
                {showRole && role && (
                    <div className="flex items-center text-xs font-semibold capitalize mt-0.5">
                        {role === 'Admin' || role === 'Owner' ? (
                            <>
                                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                <span className="text-emerald-700">{role}</span>
                            </>
                        ) : role === 'Moderator' ? (
                            <>
                                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-primary" />
                                <span className="text-primary">{role}</span>
                            </>
                        ) : (
                            <>
                                <User className="w-3.5 h-3.5 mr-1 text-slate-500" />
                                <span className="text-slate-600">{role}</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserComponent;