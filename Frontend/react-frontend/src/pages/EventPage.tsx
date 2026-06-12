import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import LoadingState from "../components/LoadingState";
import EventComponent from "../components/EventComponent";
import MapComponent from "../components/MapComponent";

const EventPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { event, loading, isOwner, canDelete, isSubscribed, updateEvent, deleteEvent, creator } = useEvent(slug!);
    const isPast = event ? new Date(event.endAt) < new Date() : false;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <LoadingState />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center text-slate-500">Event not found or something went wrong.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <EventComponent 
                event={event} 
                isEditable={isOwner}
                canDelete={canDelete}
                isPast={isPast}
                isSubscribed={isSubscribed}
                onSave={updateEvent} 
                onDelete={deleteEvent} 
                creator={creator?.name} 
                creatorId={creator?.id} 
                creatorPhoto={creator?.photo} 
            />
            
            <div className="container mx-auto px-4 max-w-5xl mt-8 space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[400px]">
                    <MapComponent position={{ lat: event.latitude, lng: event.longitude }} />
                </div>
            </div>
        </div>
    );
}

export default EventPage;