import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import LoadingState from "../components/LoadingState";
import EventComponent from "../components/EventComponent";
import HomeButton from "../components/HomeButton";

const EventPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { event, loading } = useEvent(id!);
    
    return <>
        <div >
            <HomeButton />
        </div>
        <div className=" d-flex justify-content-center align-items-center vh-100">
            {loading ? (
                <LoadingState />
            ) : event ? (<EventComponent event={event} />) :
                <>Something went wrong</>}
        </div>
    </>
}
export default EventPage;