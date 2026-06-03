import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { CreateEventButton } from "../components/CreateEventButton";
import EventCardList from "../components/EventCardList";
import LoadingState from "../components/LoadingState";
import { useEvents } from "../hooks/useEvents"
import { CalendarDays, Loader2, CalendarX } from "lucide-react";

const OwnEventsPage: React.FC = () => {
    const createdByMe = true;
    const { 
        events, 
        loading, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage 
    } = useEvents( undefined, createdByMe );
    
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-3">
                        <CalendarDays className="w-8 h-8 text-primary" />
                        My Created Events
                    </h1>
                    <p className="text-slate-500 mt-2">Manage and monitor all the events you've organized.</p>
                </div>

                <main>
                    {loading ? (
                        <div className="py-12"><LoadingState /></div>
                    ) : events.length > 0 ? (
                        <>
                            <EventCardList events={events} />
                            
                            <div ref={ref} className="py-12 flex flex-col items-center justify-center gap-2">
                                {isFetchingNextPage ? (
                                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                ) : !hasNextPage && events.length > 3 ? (
                                    <p className="text-slate-400 text-sm font-medium">You've reached the end of your events</p>
                                ) : null}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center shadow-sm max-w-2xl mx-auto">
                            <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <CalendarX className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">You haven't created any events yet</h3>
                            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Ready to host something amazing? Start by creating your first event today!</p>
                            <div className="max-w-xs mx-auto">
                                <CreateEventButton />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default OwnEventsPage;