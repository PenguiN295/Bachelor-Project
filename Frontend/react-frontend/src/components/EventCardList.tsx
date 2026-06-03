import EventCard from "./EventCard";
import type Event from '../Interfaces/Event';

interface EventListProps {
    events: Event[];
}

const EventCardList: React.FC<EventListProps> = ({ events }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
}

export default EventCardList;