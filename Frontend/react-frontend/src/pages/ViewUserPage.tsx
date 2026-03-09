import { useParams } from "react-router-dom";
import EventCardList from "../components/EventCardList";
import LoadingState from "../components/LoadingState";
import { useEvents } from "../hooks/useEvents";






const ViewUserPage: React.FC= () => {
    const { userId } = useParams<{ userId: string }>();
    const { events, loading } = useEvents( userId ? { userId } : undefined);
    return <>
        <div className="container mt-5">
            <main className="col-md-9">
                {loading ? (
                    <LoadingState />
                ) : events.length > 0 ? (<>
                    <EventCardList events={events} /></>)
                    : <>
                        <div> This user hasn't created any events. </div>
                    </>}

            </main>
        </div>
    </>
}

export default ViewUserPage;