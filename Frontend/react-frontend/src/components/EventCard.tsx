
import { useNavigate } from 'react-router-dom';
import type Event from '../Interfaces/Event';
import noPhoto from '../assets/nophoto.svg';
import { formatDate } from '../utils/dateUtils';
interface EventCardProps {
    event: Event;
}



const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const navigate = useNavigate();
    const handleEventPress = () => {
        if(event.slug)
            navigate(`/event/${event.slug}`)
    }
    return (
        <button
            onClick={handleEventPress}
            className="text-start w-100"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
            <div className="card h-100 shadow-sm">
                {event.imageUrl ? (
                    <img src={event.imageUrl} className="card-img-top"
                        style={{ objectFit: 'cover', height: '180px' }} />
                ) : (
                    <div className="card h-100 shadow-sm">
                        <img src={noPhoto} className="card-img-top" style={{ objectFit: 'cover', height: '180px' }} />
                    </div>
                )}
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0 text-truncate">{event.title}</h5>
                        <span className="badge bg-primary ms-2">
                            {event.price === 0 ? "Free" : `$${event.price}`}
                        </span>
                    </div>
                    <p className="card-text mb-1 small">
                        <i className="bi bi-geo-alt me-1 text-primary"></i>
                        {event.city}, {event.county}
                    </p>
                    <p className="card-text text-muted small mb-2">
                        <i className="bi bi-calendar-event me-1 text-primary"></i>
                        {formatDate(event.startAt)}
                    </p>
                    <p className="card-text text-muted small mb-0">
                        <i className="bi bi-people me-1 text-primary"></i>
                        {event.currentAttendees} / {event.maxAttendees}
                    </p>
                </div>
            </div>
        </button>

    );
};
export default EventCard;