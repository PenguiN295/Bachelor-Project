import React from 'react';
import { useNavigate } from 'react-router-dom';
import type Community from '../Interfaces/Community';
import noPhoto from '../assets/nophoto.svg';
import { formatDate } from '../utils/dateUtils';
import { Users, CalendarDays, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CommunityListItemProps {
    community: Community;
}

const CommunityListItem: React.FC<CommunityListItemProps> = ({ community }) => {
    const navigate = useNavigate();

    return (
        <Card 
            className="mb-4 overflow-hidden cursor-pointer transition-all hover:shadow-md border-slate-200 group"
            onClick={() => navigate(`/community/${community.slug}`)}
        >
            <div className="flex flex-col sm:flex-row items-center">
                <div className="w-full sm:w-32 sm:h-32 shrink-0 bg-slate-100">
                    <img
                        src={community.photo || noPhoto}
                        alt={community.name}
                        className="w-full h-48 sm:h-full object-cover"
                    />
                </div>
                <div className="p-4 flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{community.name}</h5>
                        {community.isJoined && (
                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 transition-colors">
                                Joined
                            </span>
                        )}
                    </div>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {community.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1.5 text-primary/70" />
                            {community.memberCount} members
                        </div>
                        <div className="flex items-center">
                            <CalendarDays className="w-4 h-4 mr-1.5 text-primary/70" />
                            Created {formatDate(community.createdAt)}
                        </div>
                    </div>
                </div>
                <div className="hidden sm:flex pr-6 text-slate-400 group-hover:text-primary transition-colors">
                    <ChevronRight className="w-6 h-6" />
                </div>
            </div>
        </Card>
    );
};

export default CommunityListItem;