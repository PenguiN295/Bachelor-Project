import React from 'react';
import { useFriends } from '../hooks/useFriends';
import LoadingState from '../components/LoadingState';
import UserComponent from '../components/UserComponent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Check, X, UserMinus, UserCheck, MessageCircle } from 'lucide-react';
import { useGlobalChat } from '../context/ChatContext';

const FriendsPage: React.FC = () => {
    const { 
        friends, 
        pendingRequests, 
        loading, 
        acceptRequest, 
        rejectRequest, 
        removeFriend, 
        isAccepting, 
        isRejecting, 
        isRemoving 
    } = useFriends();
    
    const { openChat } = useGlobalChat();

    const receivedRequests = pendingRequests.filter(p => !p.isRequester);
    const sentRequests = pendingRequests.filter(p => p.isRequester);

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><LoadingState /></div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Friends
                    </h1>
                    <p className="text-slate-500 mt-2">Manage your connections and pending requests.</p>
                </div>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-slate-200/50">
                        <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            My Friends 
                            <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">{friends.length}</span>
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            Pending 
                            {receivedRequests.length > 0 && (
                                <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-bold">{receivedRequests.length}</span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <Card className="border-0 shadow-sm overflow-hidden">
                            <CardContent className="p-0">
                                {friends.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {friends.map(friend => (
                                            <div key={friend.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <UserComponent 
                                                        id={friend.userId} 
                                                        username={friend.username} 
                                                        photo={friend.photo} 
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Button variant="secondary" className="w-full sm:w-auto" onClick={() => openChat(friend.userId)}>
                                                        <MessageCircle className="w-4 h-4 mr-2" /> Message
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => removeFriend(friend.id)}
                                                        disabled={isRemoving}
                                                    >
                                                        <UserMinus className="w-4 h-4 mr-2" /> Unfriend
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-16 text-center">
                                        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <Users className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-1">No friends yet</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto">Explore events and communities to connect with like-minded people.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-8">
                        {/* Received Requests */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-primary" />
                                Received Requests
                            </h3>
                            <Card className="border-0 shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    {receivedRequests.length > 0 ? (
                                        <div className="divide-y divide-slate-100">
                                            {receivedRequests.map(request => (
                                                <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <UserComponent 
                                                            id={request.userId} 
                                                            username={request.username} 
                                                            photo={request.photo} 
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <Button 
                                                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                                                            onClick={() => acceptRequest(request.id)}
                                                            disabled={isAccepting}
                                                        >
                                                            <Check className="w-4 h-4 mr-2" /> Accept
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            className="w-full sm:w-auto text-slate-600"
                                                            onClick={() => rejectRequest(request.id)}
                                                            disabled={isRejecting}
                                                        >
                                                            <X className="w-4 h-4 mr-2" /> Reject
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500">
                                            You have no pending friend requests.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sent Requests */}
                        {sentRequests.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-slate-200">
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-slate-500">
                                    <UserCheck className="w-5 h-5" />
                                    Sent Requests
                                </h3>
                                <Card className="border-0 shadow-sm overflow-hidden opacity-75">
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-slate-100">
                                            {sentRequests.map(request => (
                                                <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <UserComponent 
                                                            id={request.userId} 
                                                            username={request.username} 
                                                            photo={request.photo} 
                                                        />
                                                    </div>
                                                    <div className="flex items-center shrink-0">
                                                        <Button 
                                                            variant="outline" 
                                                            className="w-full sm:w-auto"
                                                            onClick={() => rejectRequest(request.id)}
                                                            disabled={isRejecting}
                                                        >
                                                            Cancel Request
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default FriendsPage;