
import { useNavigate } from 'react-router-dom';
import type Event from '../Interfaces/Event';
import noPhoto from '../assets/nophoto.svg';
interface EventCardProps {
    event: Event;
}



const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const navigate = useNavigate();
    const handleEventPress = () => {
        if(event.id)
            navigate(`/event/${event.id}`)
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
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text mb-1">
                        <i className="bi bi-geo-alt me-1"></i>
                        {event.location}
                    </p>
                    <p className="card-text text-muted small">
                        <i className="bi bi-calendar-event me-1"></i>
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}
                        {event.startDate !== event.endDate && (
                            <>
                                {" — "}
                                {new Date(event.endDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </>
                        )}
                    </p>
                </div>
            </div>
        </button>

    );
};
export default EventCard;