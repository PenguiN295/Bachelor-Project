import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import LoadingState from "../components/LoadingState";
import EventComponent from "../components/EventComponent";
import SubscribeComponent from "../components/SubscribeComponent";
import MapComponent from "../components/MapComponent";


const EventPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { event, loading, isOwner, isSubscribed, updateEvent, deleteEvent, creator } = useEvent(slug!);
    return <>
        <div className=" bg-light min-vh-100">
            {loading ? (
                <LoadingState />
            ) : event ? (
                isOwner ? (
                    <div>
                        <EventComponent event={event} isEditable={true} 
                        onSave={updateEvent} onDelete={deleteEvent} creator={creator?.name} creatorId={creator?.id} />
                        <div className="container py-5">
                            <MapComponent position={{ lat: event.latitude, lng: event.longitude }} />
                            
                        </div>
                    </div>

                ) : (
                    <div>
                        <EventComponent event={event} creator={creator?.name} creatorId={creator?.id} />

                        <div className="container py-5">
                            <SubscribeComponent event={event} isSubscribed={isSubscribed} />
                            <MapComponent position={{ lat: event.latitude, lng: event.longitude }} />
                        </div>
                    </div>


        )
        ) :
        <div className="vh-100 d-flex justify-content-center align-items-center">Something went wrong</div>}
    </div >


    </>
}
export default EventPage;