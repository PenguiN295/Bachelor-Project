import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import EventComponent from "../components/EventComponent";
import LoadingState from "../components/LoadingState";


const EditEventPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { event, loading } = useEvent(id!);
    return <>
        {loading ? (<LoadingState />) : (
            event ? (
                <EventComponent event={event}/>
            ) : (<div> Something went wrong </div >)
        )}
    </>
}
export default EditEventPage;