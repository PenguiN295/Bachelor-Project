import React, { useState } from 'react';
import { useCommunities } from '../hooks/useCommunities';
import CommunityCardList from '../components/CommunityCardList';
import LoadingState from '../components/LoadingState';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, UsersRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CommunitiesPage: React.FC = () => {
    const { communities, loading, error } = useCommunities();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredCommunities = communities.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) return (
        <div className="container mx-auto px-4 py-8 max-w-5xl mt-5 text-center">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                Error loading communities. Please try again later.
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        Explore Communities
                    </h1>
                    <p className="text-slate-500 mt-1">Find and join groups of like-minded people.</p>
                </div>
                <Button 
                    onClick={() => navigate('/communities/create')}
                    size="lg"
                    className="w-full md:w-auto shrink-0"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Community
                </Button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        type="text"
                        className="pl-10 py-6 text-base bg-slate-50 border-slate-200 focus-visible:ring-primary/20"
                        placeholder="Search communities by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <LoadingState />
            ) : filteredCommunities.length > 0 ? (
                <div className="max-w-4xl mx-auto">
                    <CommunityCardList communities={filteredCommunities} />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm max-w-3xl mx-auto mt-8">
                    <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <UsersRound className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No communities found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        We couldn't find any communities matching "{searchTerm}". Try a different search term or be the first to create one!
                    </p>
                </div>
            )}
        </div>
    );
};

export default CommunitiesPage;