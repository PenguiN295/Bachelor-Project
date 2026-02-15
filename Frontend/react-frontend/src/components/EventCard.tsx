
import type Event from '../Interfaces/Event';
interface EventCardProps {
    event : Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <div className="card h-100 shadow-sm">
            <img src={event.imageUrl} className="card-img-top"
                alt={event.name} style={{ objectFit: 'cover', height: '180px' }} />
            <div className="card-body">
                <h5 className="card-title">{event.name}</h5>
                <p className="card-text mb-1">
                    <i className="bi bi-geo-alt me-1"></i>
                    {event.location}
                </p>
                <p className="card-text text-muted small">
                <i className="bi bi-calendar-event me-1"></i>
                {new Date(event.date).toLocaleDateString()}
                </p>
            </div>
        </div>

    );
};
export default EventCard;