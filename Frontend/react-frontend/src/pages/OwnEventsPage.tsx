import { CreateEventButton } from "../components/CreateEventButton";
import EventCardList from "../components/EventCardList";
import HomeButton from "../components/HomeButton";
import LoadingState from "../components/LoadingState";
import { useEvents } from "../hooks/useEvents"


const OwnEventsPage: React.FC = () => {
    const { events, loading } = useEvents({ createdByMe: true });
    console.log(events)

    return <>
    <div className="container mt-5">
        <main className="col-md-9">
            {loading ? (
                <LoadingState />
            ) : events.length > 0 ? (<>
                <EventCardList events={events} /></>)

                : <> 
                
                <div> You haven't created any events. Make One!
                    <CreateEventButton />
                </div></>}

        </main>
        </div>
    </>
}

export default OwnEventsPage