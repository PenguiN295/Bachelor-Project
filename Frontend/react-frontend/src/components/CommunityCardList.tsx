import React from 'react';
import CommunityListItem from './CommunityListItem';
import type Community from '../Interfaces/Community';

interface CommunityListProps {
    communities: Community[];
}

const CommunityCardList: React.FC<CommunityListProps> = ({ communities }) => {
    return (
        <div className="community-list mt-3">
            {communities.map(community => (
                <CommunityListItem key={community.id} community={community} />
            ))}
        </div>
    );
};

export default CommunityCardList;
