import React from 'react';
import { usePastEvents } from "../hooks/usePastEvents";
import LoadingState from "../components/LoadingState";
import EventCardList from "../components/EventCardList";

const PastEventsPage: React.FC = () => {
    const { events, loading } = usePastEvents();

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>My Past Events</h2>
                    <p className="text-muted">Review performance and analytics for your completed events.</p>
                </div>
            </div>

            {loading ? (
                <LoadingState />
            ) : events.length > 0 ? (
                <div className="mt-3">
                    <EventCardList events={events} />
                </div>
            ) : (
                <div className="text-center py-5">
                    <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mt-3">No past events found</h4>
                    <p className="text-muted">Once your events finish, they will appear here for analytics.</p>
                </div>
            )}
        </div>
    );
}

export default PastEventsPage;
