import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import EventCardList from "../components/EventCardList";
import LoadingState from "../components/LoadingState";
import { useEvents } from "../hooks/useEvents";
import { useUser } from "../hooks/useUser";
import noPhoto from "../assets/nophoto.svg";

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

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (userLoading) return <div className="container mt-5"><LoadingState /></div>;

    return (
        <div className="container mt-5">
            <div className="row mb-5 align-items-center bg-white p-4 rounded shadow-sm">
                <div className="col-auto">
                    <img 
                        src={user?.photo || noPhoto} 
                        className="rounded-circle shadow-sm border"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                </div>
                <div className="col">
                    <h1 className="display-4 fw-bold text-dark mb-1">{user?.username}</h1>
                    <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-calendar3 me-2"></i>
                        <span>Member since 2026</span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="fw-bold d-inline-block border-bottom border-3 border-primary pb-2">
                    Events Created
                </h3>
            </div>

            <main>
                {eventsLoading ? (
                    <LoadingState />
                ) : events.length > 0 ? (
                    <>
                        <EventCardList events={events} />
                        <div ref={ref} className="py-4 text-center">
                            {isFetchingNextPage && (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading more...</span>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-5 rounded shadow-sm text-center">
                        <i className="bi bi-calendar-x display-1 text-muted mb-3 d-block"></i>
                        <h4 className="text-secondary">No events found</h4>
                        <p className="text-muted mb-0">This user hasn't created any events yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
}


export default ViewUserPage;