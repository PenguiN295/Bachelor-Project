import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import LoadingState from "../components/LoadingState";
import EventComponent from "../components/EventComponent";
import SubscribeComponent from "../components/SubscribeComponent";
import MapComponent from "../components/MapComponent";


const EventPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { event, loading, isOwner, isSubscribed, updateEvent, deleteEvent, error } = useEvent(id!);

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><LoadingState /></div>;
    if (error || !event) return <div className="vh-100 d-flex justify-content-center align-items-center">Something went wrong</div>;
    return <>
        <div className=" bg-light min-vh-100">
            {loading ? (
                <LoadingState />
            ) : event ? (
                isOwner ? (
                    <div>
                        <EventComponent event={event} isEditable={true} onSave={updateEvent} onDelete={deleteEvent} />
                        <div className="container py-5">
                            <MapComponent position={{ lat: event.latitude, lng: event.longitude }} />
                            
                        </div>
                    </div>

                ) : (
                    <div>
                        <EventComponent event={event} />

                        <div className="container py-5">
                            <SubscribeComponent event={event} isSubscribed={isSubscribed} />
                            <MapComponent position={{ lat: event.latitude, lng: event.longitude }} />
                        </div>
                    </div>


        )
        ) :
        <>Something went wrong</>}
    </div >


    </>
}
export default EventPage;