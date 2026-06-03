import React from 'react';
import { usePastEvents } from "../hooks/usePastEvents";
import LoadingState from "../components/LoadingState";
import EventCardList from "../components/EventCardList";
import { History, CalendarX } from "lucide-react";

const PastEventsPage: React.FC = () => {
    const { events, loading } = usePastEvents();

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-3">
                        <History className="w-8 h-8 text-primary" />
                        Past Events
                    </h1>
                    <p className="text-slate-500 mt-2">Review performance and access analytics for your completed events.</p>
                </div>

                <main>
                    {loading ? (
                        <div className="py-12"><LoadingState /></div>
                    ) : events.length > 0 ? (
                        <div className="mt-3">
                            <EventCardList events={events} />
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center shadow-sm max-w-2xl mx-auto">
                            <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <CalendarX className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No past events found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Once your organized events conclude, they will appear here for your records.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default PastEventsPage;