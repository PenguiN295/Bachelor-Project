import React, { useEffect } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Users, CalendarDays, CalendarPlus, LogOut, Loader2, CalendarX } from 'lucide-react';

const CommunityPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { community, loading, join, leave, isJoining, isLeaving } = useCommunity(slug || '');
    
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

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <div className="w-full h-64 md:h-80 relative overflow-hidden bg-slate-900">
                <img 
                    src={community.photo || noPhoto} 
                    alt={community.name} 
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative -mt-24 sm:-mt-32">
                <Card className="border-0 shadow-md overflow-visible bg-white">
                    <CardContent className="p-6 sm:p-10">
                        <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 sm:-mt-24 mb-6">
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
                                            variant="outline"
                                            className="border-primary text-primary hover:bg-primary/5"
                                            onClick={() => navigate(`/CreateEvent/${community.id}`)}
                                        >
                                            <CalendarPlus className="w-4 h-4 mr-2" /> Create Event
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => leave()}
                                            disabled={isLeaving || community.userRole === 'Owner'}
                                            title={community.userRole === 'Owner' ? "Owner cannot leave" : ""}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> 
                                            {isLeaving ? 'Leaving...' : 'Leave'}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button 
                                        size="lg"
                                        className="w-full sm:w-auto"
                                        onClick={() => join()}
                                        disabled={isJoining}
                                    >
                                        {isJoining ? 'Joining...' : 'Join Community'}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-100">
                            {/* Left Sidebar - Members */}
                            <div className="lg:col-span-3">
                                <MemberList 
                                    slug={slug || ''} 
                                    canRemove={community.userRole === 'Owner'} 
                                />
                            </div>
                            
                            {/* Main Content */}
                            <div className="lg:col-span-6 space-y-10">
                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                                        About
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                                        {community.description}
                                    </p>
                                </section>

                                <section>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                                            Community Events
                                        </h3>
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
                                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-12 text-center">
                                            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                                <CalendarX className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <h4 className="text-lg font-semibold text-slate-900 mb-1">No upcoming events</h4>
                                            <p className="text-slate-500 mb-4">There are no events scheduled for this community yet.</p>
                                            {community.isJoined && (
                                                <Button variant="outline" onClick={() => navigate(`/CreateEvent/${community!.id}`)}>
                                                    Create the first one!
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </section>
                            </div>
                            
                            {/* Right Sidebar - Rules */}
                            <div className="lg:col-span-3">
                                <Card className="bg-slate-50 border-slate-100 shadow-sm">
                                    <CardContent className="p-6">
                                        <h3 className="font-bold text-slate-900 mb-4">Community Rules</h3>
                                        <ol className="list-decimal list-inside space-y-3 text-sm text-slate-600">
                                            <li>Be respectful to all members.</li>
                                            <li>No spamming or self-promotion.</li>
                                            <li>Follow the event guidelines.</li>
                                            <li>Have fun and participate!</li>
                                        </ol>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CommunityPage;