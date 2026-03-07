
import { useState } from "react";
import type Event from "../Interfaces/Event"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface EventProp {
    event: Event;  
    isEditable?: boolean;
    onSave?: (updatedEvent: Event) => void;
    onDelete?: () => void;
}

const EventComponent: React.FC<EventProp> = ({ event, isEditable,onSave,onDelete}) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [tempEvent, setTempEvent] = useState<Event>(event);
    console.log(event);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setTempEvent(prev => ({ ...prev, [name]: name === 'price' || name === 'maxAttendees' ? Number(value) : value }));
    };

    const handleSave = () => {
        onSave?.(tempEvent);
        setIsEditing(false);
    };
    const handleDelete = () =>{
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setShowDeleteConfirm(false);
        setIsEditing(false);
        toast.success("Event deleted successfully");
        onDelete?.();
        navigate("/dashboard");
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleCancel = () => {
        setTempEvent({ ...event }); 
        setIsEditing(false);
        
    };
    const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};
   return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
                <div className="flex-grow-1 me-4">
                    {isEditing ? (
                        <input 
                            className="form-control form-control-lg fw-bold mb-2" 
                            name="title" 
                            value={tempEvent.title} 
                            onChange={handleInputChange} 
                        />
                    ) : (
                        <h1 className="display-5 fw-bold text-dark">{event.title}</h1>
                    )}
                    <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-people me-2"></i>
                        {isEditing ? (
                            <div className="d-flex align-items-center">
                                <span>{event.currentAttendees} / </span>
                                <input type="number" name="maxAttendees" className="form-control form-control-sm ms-2" style={{ width: '80px' }} value={tempEvent.maxAttendees} onChange={handleInputChange} />
                            </div>
                        ) : (
                            <span className="lead">{event.currentAttendees} / {event.maxAttendees} Attendees Registered</span>
                        )}
                    </div>
                </div>

                <div className="text-end">
                    {isEditing ? (
                        <div className="input-group input-group-lg mb-3">
                            <span className="input-group-text">$</span>
                            <input type="number" name="price" className="form-control" value={tempEvent.price} onChange={handleInputChange} />
                        </div>
                    ) : (
                        <div className="badge bg-primary p-3 fs-4 shadow-sm mb-3">
                           {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                        </div>
                    )}
                    
                    {isEditable && (
                        <div className="d-flex gap-2 justify-content-end">
                            {isEditing ? (
                                <>
                                    <button className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
                                    <button className="btn btn-success" onClick={handleSave}>Save</button>
                                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                </>
                            ) : (
                                <button className="btn btn-outline-primary" onClick={() => setIsEditing(true)}>
                                    <i className="bi bi-pencil me-1"></i> Edit Event
                                </button>
                            )}
                        </div>
                    )}
                    {showDeleteConfirm && (
                        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirm Delete</h5>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to delete this event?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                                        <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="row g-5">
                <div className="col-lg-7">
                    <section className="mb-5">
                        <h3 className="h5 text-uppercase fw-bold text-primary border-start border-4 border-primary ps-3 mb-3">Description</h3>
                        {isEditing ? (
                            <textarea 
                                className="form-control" 
                                name="description" 
                                rows={8} 
                                value={tempEvent.description} 
                                onChange={handleInputChange} 
                            />
                        ) : (
                            <p className="lead text-secondary lh-lg">{event.description}</p>
                        )}
                    </section>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="p-3 bg-light rounded shadow-sm">
                                <label className="d-block text-uppercase text-muted fw-bold small">Start Date</label>
                                {isEditing ? (
                                    <input type="datetime-local" name="startAt" className="form-control mt-2" value={tempEvent.startAt} onChange={handleInputChange} />
                                ) : (
                                    <div className="fs-5 fw-medium">{formatDate(event.startAt)}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-3 bg-light rounded shadow-sm">
                                <label className="d-block text-uppercase text-muted fw-bold small">End Date</label>
                                {isEditing ? (
                                    <input type="datetime-local" name="endAt" className="form-control mt-2" value={tempEvent.endAt} onChange={handleInputChange} />
                                ) : (
                                    <div className="fs-5 fw-medium">{formatDate(event.endAt)}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EventComponent