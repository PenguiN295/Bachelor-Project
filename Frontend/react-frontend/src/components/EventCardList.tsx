import EventCard from "./EventCard";
import type Event from '../Interfaces/Event';
interface EventListProps {
    events: Event[];
}

const EventCardList: React.FC<EventListProps> = ({ events }) => {
    return (
        <>
            <div className="row g-4">
                {events.map(event => (
                    <div key={event.id} className="col-12 col-md-6 col-lg-4">
                        <EventCard event={event} />
                    </div>
                ))}
            </div>
        </>
    );
}
export default EventCardList;