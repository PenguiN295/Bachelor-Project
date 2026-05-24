import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { CreateEventButton } from "../components/CreateEventButton";
import EventCardList from "../components/EventCardList";
import LoadingState from "../components/LoadingState";
import { useEvents } from "../hooks/useEvents"


const OwnEventsPage: React.FC = () => {
    const createdByMe = true;
    const { 
        events, 
        loading, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage 
    } = useEvents( createdByMe ? undefined : '', createdByMe );
    
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return <>
    <div className="container mt-5">
        <main className="col-md-9">
            {loading ? (
                <LoadingState />
            ) : events.length > 0 ? (
                <>
                    <EventCardList events={events} />
                    <div ref={ref} className="py-4 text-center">
                        {isFetchingNextPage ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading more...</span>
                            </div>
                        ) : hasNextPage ? (
                            <p className="text-muted small">Scroll for more</p>
                        ) : (
                            <p className="text-muted small">You've reached the end</p>
                        )}
                    </div>
                </>
            ) : (
                <div> You haven't created any events. Make One!
                    <CreateEventButton />
                </div>
            )}
        </main>
        </div>
    </>
}


export default OwnEventsPage