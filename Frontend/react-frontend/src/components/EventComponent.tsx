
import { useState } from "react";
import type Event from "../Interfaces/Event"

export interface EventProp {
    event: Event;  
    isEditable?: boolean;
    onSave?: (updatedEvent: Event) => void;
}

const EventComponent: React.FC<EventProp> = ({ event, isEditable,onSave}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [tempEvent, setTempEvent] = useState<Event>(event);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTempEvent(prev => ({ ...prev, [name]: name === 'price' || name === 'maxAttendees' ? Number(value) : value }));
    };

    const handleSave = () => {
        onSave?.(tempEvent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempEvent({ ...event }); 
        setIsEditing(false);
    };
    return (
        <div className="card shadow-sm border-0" style={{ maxWidth: '400px' }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    {isEditing ? (
                        <input 
                            className="form-control form-control-sm fw-bold me-2" 
                            name="title" 
                            value={tempEvent.title} 
                            onChange={handleInputChange} 
                        />
                    ) : (
                        <h5 className="card-title fw-bold mb-0 text-truncate" title={event.title}>
                            {event.title}
                        </h5>
                    )}
                    
                    {isEditing ? (
                        <div className="input-group input-group-sm" style={{ width: '100px' }}>
                            <span className="input-group-text">$</span>
                            <input 
                                type="number" 
                                name="price" 
                                className="form-control" 
                                value={tempEvent.price} 
                                onChange={handleInputChange} 
                            />
                        </div>
                    ) : (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                            ${event.price.toFixed(2)}
                        </span>
                    )}
                </div>

                {isEditing ? (
                    <textarea 
                        className="form-control form-control-sm mb-4" 
                        name="description" 
                        rows={2} 
                        value={tempEvent.description} 
                        onChange={handleInputChange} 
                    />
                ) : (
                    <p className="card-text text-muted small mb-4" style={{ minHeight: '3rem' }}>
                        {event.description}
                    </p>
                )}

                <div className="row g-2 mb-4">
                    <div className="col-6">
                        <div className="p-2 border-start border-primary border-4 bg-light rounded-end">
                            <label className="d-block text-uppercase text-muted fw-bold" style={{ fontSize: '0.65rem' }}>Start Date</label>
                            {isEditing ? (
                                <input type="date" name="startDate" className="form-control form-control-sm border-0 bg-transparent p-0" value={tempEvent.startDate} onChange={handleInputChange} />
                            ) : (
                                <span className="small fw-medium">{event.startDate}</span>
                            )}
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-2 border-start border-secondary border-4 bg-light rounded-end">
                            <label className="d-block text-uppercase text-muted fw-bold" style={{ fontSize: '0.65rem' }}>End Date</label>
                            {isEditing ? (
                                <input type="date" name="endDate" className="form-control form-control-sm border-0 bg-transparent p-0" value={tempEvent.endDate} onChange={handleInputChange} />
                            ) : (
                                <span className="small fw-medium">{event.endDate}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row g-2 mb-4">
                    <div className="col-6">
                        <div className="p-2 border-start border-primary border-4 bg-light rounded-end">
                            <label className="d-block text-uppercase text-muted fw-bold" style={{ fontSize: '0.65rem' }}>Start Time</label>
                            {isEditing ? (
                                <input type="time" name="startTime" className="form-control form-control-sm border-0 bg-transparent p-0" value={tempEvent.startTime} onChange={handleInputChange} />
                            ) : (
                                <span className="small fw-medium">{event.startTime}</span>
                            )}
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-2 border-start border-secondary border-4 bg-light rounded-end">
                            <label className="d-block text-uppercase text-muted fw-bold" style={{ fontSize: '0.65rem' }}>End Time</label>
                            {isEditing ? (
                                <input type="time" name="endTime" className="form-control form-control-sm border-0 bg-transparent p-0" value={tempEvent.endTime} onChange={handleInputChange} />
                            ) : (
                                <span className="small fw-medium">{event.endTime}</span>
                            )}
                        </div>
                    </div>
                </div>




                <div className="mb-3">
                    <div className="d-flex align-items-center mb-3 text-secondary">
                        <i className="bi bi-geo-alt-fill me-2"></i>
                        {isEditing ? (
                            <input name="location" className="form-control form-control-sm" value={tempEvent.location} onChange={handleInputChange} />
                        ) : (
                            <span className="small">{event.location}</span>
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-bold text-dark">Registration</span>
                        {isEditing ? (
                            <div className="d-flex align-items-center">
                                <span className="small text-muted me-1">{event.currentAttendees} / </span>
                                <input type="number" name="maxAttendees" className="form-control form-control-sm" style={{ width: '70px' }} value={tempEvent.maxAttendees} onChange={handleInputChange} />
                            </div>
                        ) : (
                            <span className="small text-muted">
                                {event.currentAttendees} / {event.maxAttendees}
                            </span>
                        )}
                    </div>
                </div>
                {isEditable && (
                    <div className="border-top pt-3 d-flex justify-content-end gap-2">
                        {isEditing ? (
                            <>
                                <button className="btn btn-sm btn-outline-secondary" onClick={handleCancel}>Cancel</button>
                                <button className="btn btn-sm btn-primary" onClick={handleSave}>Save Changes</button>
                            </>
                        ) : (
                            <button className="btn btn-sm btn-outline-primary" onClick={() => setIsEditing(true)}>
                                <i className="bi bi-pencil-square me-1"></i> Edit Event
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
export default EventComponent