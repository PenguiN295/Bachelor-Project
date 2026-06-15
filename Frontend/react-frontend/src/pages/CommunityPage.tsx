import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useCommunity } from '../hooks/useCommunity';
import { useEvents } from '../hooks/useEvents';
import LoadingState from '../components/LoadingState';
import EventCardList from '../components/EventCardList';
import MemberList from '../components/MemberList';
import noPhoto from '../assets/nophoto.svg';
import { formatDate } from '../utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarDays, CalendarPlus, LogOut, Loader2, CalendarX, Trash2, Info, ShieldCheck } from 'lucide-react';

const CommunityPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { community, loading, join, leave, isJoining, isLeaving, deleteCommunity, isDeleting } = useCommunity(slug || '');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const { 
        events: communityEvents, 
        loading: eventsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useEvents(undefined, undefined, community?.id, community?.isJoined);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><LoadingState /></div>;
    
    if (!community) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
            <h3 className="text-2xl font-bold text-slate-800">Community not found</h3>
            <Button onClick={() => navigate('/communities')}>
                Back to Communities
            </Button>
        </div>
    );

    const handleDeleteCommunity = () => {
        deleteCommunity();
        setShowDeleteConfirm(false);
        navigate('/communities');
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Hero Banner */}
            <div className="w-full h-64 md:h-80 relative overflow-hidden bg-slate-900">
                <img 
                    src={community.photo || noPhoto} 
                    alt={community.name} 
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative -mt-24 sm:-mt-32">
                
                {/* Header Card */}
                <Card className="border-0 shadow-md overflow-visible bg-white mb-8">
                    <CardContent className="p-6 sm:p-10">
                        <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 sm:-mt-24 mb-2">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-white shadow-lg bg-white shrink-0 overflow-hidden">
                                <img 
                                    src={community.photo || noPhoto} 
                                    alt={community.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 pb-2">
                                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{community.name}</h1>
                                <div className="flex flex-wrap gap-4 text-slate-600 font-medium">
                                    <span className="flex items-center">
                                        <Users className="w-5 h-5 mr-2 text-primary" />
                                        {community.memberCount} members
                                    </span>
                                    <span className="flex items-center">
                                        <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                                        Created {formatDate(community.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <div className="pb-2 flex shrink-0">
                                {community.isJoined ? (
                                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                                        <Button 
                                            className="w-full sm:w-auto shadow-sm"
                                            onClick={() => navigate(`/CreateEvent/${community.id}`)}
                                        >
                                            <CalendarPlus className="w-4 h-4 mr-2" /> Create Event
                                        </Button>
                                        
                                        {community.userRole === 'Owner' ? (
                                            <Button 
                                                variant="outline"
                                                className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive shadow-sm"
                                                onClick={() => setShowDeleteConfirm(true)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="outline"
                                                className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive shadow-sm"
                                                onClick={() => leave()}
                                                disabled={isLeaving}
                                            >
                                                <LogOut className="w-4 h-4 mr-2" /> 
                                                {isLeaving ? 'Leaving...' : 'Leave'}
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <Button 
                                        size="lg"
                                        className="w-full sm:w-auto shadow-sm"
                                        onClick={() => join()}
                                        disabled={isJoining}
                                    >
                                        {isJoining ? 'Joining...' : 'Join Community'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Sidebar - Metadata & People */}
                    <aside className="w-full lg:w-80 shrink-0 space-y-6">
                        {/* About Card */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary" />
                                    About
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                    {community.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Rules Card */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    Community Rules
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <ol className="list-decimal list-inside space-y-3 text-sm text-slate-600">
                                    <li>Be respectful to all members.</li>
                                    <li>No spamming or self-promotion.</li>
                                    <li>Follow the event guidelines.</li>
                                    <li>Have fun and participate!</li>
                                </ol>
                            </CardContent>
                        </Card>

                        {/* Member List Component */}
                        <MemberList 
                            slug={slug || ''} 
                            currentUserRole={community.userRole}
                        />
                    </aside>
                    
                    {/* Main Content - Events */}
                    <main className="flex-1 min-w-0">
                        <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Community Events</h2>
                                <p className="text-slate-500 mt-1">Upcoming and past events in this community.</p>
                            </div>
                        </div>
                        
                        {eventsLoading ? (
                            <div className="py-12"><LoadingState /></div>
                        ) : communityEvents.length > 0 ? (
                            <>
                                <EventCardList events={communityEvents} />
                                <div ref={ref} className="py-8 flex justify-center">
                                    {isFetchingNextPage && (
                                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                    <CalendarX className="w-8 h-8 text-slate-300" />
                                </div>
                                <h4 className="text-lg font-semibold text-slate-900 mb-1">No upcoming events</h4>
                                <p className="text-slate-500 mb-6">There are no events scheduled for this community yet.</p>
                                {community.isJoined && (
                                    <Button variant="outline" onClick={() => navigate(`/CreateEvent/${community!.id}`)}>
                                        Create the first one!
                                    </Button>
                                )}
                            </div>
                        )}
                    </main>

                </div>
            </div>

            {/* Delete Confirmation Modal Overlay */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md mx-4 shadow-xl border-0">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Community</h3>
                            <p className="text-slate-600 mb-6">Are you sure you want to permanently delete this community? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>Cancel</Button>
                                <Button variant="destructive" onClick={handleDeleteCommunity} disabled={isDeleting}>
                                    {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Delete Community
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;