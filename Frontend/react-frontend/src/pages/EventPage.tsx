import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import LoadingState from "../components/LoadingState";
import EventComponent from "../components/EventComponent";
import SubscribeComponent from "../components/SubscribeComponent";
import MapComponent from "../components/MapComponent";
import { useState } from "react";

const EventPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { event, loading, isOwner, isSubscribed, updateEvent, deleteEvent, error } = useEvent(id!);
    const [position, setPosition] = useState<any>({lat:30.00,lng:35.00});

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><LoadingState /></div>;
    if (error || !event) return <div className="vh-100 d-flex justify-content-center align-items-center">Something went wrong</div>;
    return <>
        <div className=" d-flex justify-content-center align-items-center vh-100">
            {loading ? (
                <LoadingState />
            ) : event ? (
                isOwner ? (
                    <div>
                        <EventComponent event={event} isEditable={true} onSave={updateEvent} onDelete={deleteEvent} />
                        <MapComponent id={event.id} position={position} readOnly={false} onPositionChange={setPosition}/>
                    </div>

                ) : (
                    <div>
                        <EventComponent event={event} />
                        <SubscribeComponent event={event} isSubscribed={isSubscribed}/>
                        <MapComponent id={event.id} position={{lat: 45.00 , lng: 27.00}} />
                    </div>
                )
            ) :
                <>Something went wrong</>}
        </div>


    </>
}
export default EventPage;