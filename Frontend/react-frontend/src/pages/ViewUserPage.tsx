import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import EventCardList from "../components/EventCardList";
import LoadingState from "../components/LoadingState";
import { useEvents } from "../hooks/useEvents";
import { useUser } from "../hooks/useUser";
import noPhoto from "../assets/nophoto.svg";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import url from "../../config";
import { toast } from "sonner";
import { CalendarDays, Lock, Unlock, Loader2, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ViewUserPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { 
        events, 
        loading: eventsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useEvents(userId);
    const { data: user, isLoading: userLoading } = useUser(userId?? '');
    const { role, token } = useAuth();
    const queryClient = useQueryClient();

    const banMutation = useMutation({
        mutationFn: async (isBanning: boolean) => {
            const action = isBanning ? 'ban' : 'unban';
            const response = await fetch(`${url}/api/user/${userId}/${action}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(`Failed to ${action} user`);
            return response.text();
        },
        onSuccess: (_, isBanning) => {
            toast.success(`User ${isBanning ? 'banned' : 'unbanned'} successfully`);
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
        },
        onError: (_, isBanning) => toast.error(`Could not ${isBanning ? 'ban' : 'unban'} user`)
    });

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (userLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><LoadingState /></div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
                    <div className="h-32 bg-slate-100 w-full relative">
                         {role === 'Admin' && user?.role !== 'Admin' && (
                            <div className="absolute top-4 right-4">
                                <Button 
                                    variant={user?.isBanned ? "secondary" : "destructive"}
                                    onClick={() => banMutation.mutate(!user?.isBanned)}
                                    disabled={banMutation.isPending}
                                    className="shadow-sm"
                                >
                                    {banMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : user?.isBanned ? (
                                        <Unlock className="w-4 h-4 mr-2" />
                                    ) : (
                                        <Lock className="w-4 h-4 mr-2" />
                                    )}
                                    {user?.isBanned ? 'Unban User' : 'Ban User'}
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="px-8 pb-8 relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
                        <div className="-mt-16">
                            <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
                                <AvatarImage src={user?.photo || noPhoto} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                                    {user?.username?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1 text-center sm:text-left pb-2">
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-3">
                                {user?.username}
                                {user?.isBanned && (
                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600 uppercase tracking-wide">
                                        Banned
                                    </span>
                                )}
                            </h1>
                            <div className="flex items-center justify-center sm:justify-start mt-1 text-slate-500 font-medium">
                                <CalendarDays className="w-4 h-4 mr-2 text-primary/70" />
                                <span>Member since 2026</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-7 bg-primary rounded-full"></span>
                        Events Created
                    </h2>
                </div>

                <main>
                    {eventsLoading ? (
                        <div className="py-12"><LoadingState /></div>
                    ) : events.length > 0 ? (
                        <>
                            <EventCardList events={events} />
                            <div ref={ref} className="py-12 flex justify-center">
                                {isFetchingNextPage && (
                                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center shadow-sm">
                            <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <CalendarX className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No events found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">This user hasn't created any events yet.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default ViewUserPage;