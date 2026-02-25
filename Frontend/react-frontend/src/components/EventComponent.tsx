import { useEffect, useState } from "react"
import url from "../../config"
import { useAuth } from "../context/AuthContext"
import type Event from "../Interfaces/Event"

interface EventProp {
    event: Event
}

const EventComponent: React.FC<EventProp> = ({ event: { 
    id,
    title, 
    description, 
    startDate, 
    endDate, 
    maxAttendees, 
    currentAttendees, 
    price, 
    location 
  } }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const {token} = useAuth();
    const handleSubscribe = async(intent : boolean) =>{
        try{
            setLoading(true);
            const response = await fetch(`${url}/subscribe`,{
                method: 'POST',
                headers: {
                 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body : JSON.stringify({Subscribe : intent,
                    EventId : id
                })
            })
            if(!response.ok)
            {
                alert("Already Subscribed to this event");
            }
            else
                alert("Subscribed successfully");
        }
        catch(err)
        {
            console.error(err);
        }
        finally{
            setLoading(false);
        }

    }
    return <>

        <div className="card shadow-sm border-0" style={{ maxWidth: '400px' }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold mb-0 text-truncate" title={title}>
                        {title}
                    </h5>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        ${price.toFixed(2)}
                    </span>
                </div>

                <p className="card-text text-muted small mb-4" style={{ minHeight: '3rem' }}>
                    {description}
                </p>
                <div className="row g-2 mb-4">
                    <div className="col-6">
                        <div className="p-2 border-start border-primary border-4 bg-light rounded-end">
                            <label className="d-block text-uppercase text-muted fw-bold" style={{ fontSize: '0.65rem' }}>
                                Start Date
                            </label>
                            <span className="small fw-medium">{startDate}</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-2 border-start border-secondary border-4 bg-light rounded-end">
                            <label className="d-block text-uppercase text-muted fw-bold" style={{ fontSize: '0.65rem' }}>
                                End Date
                            </label>
                            <span className="small fw-medium">{endDate}</span>
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="d-flex align-items-center mb-3 text-secondary">
                        <i className="bi bi-geo-alt-fill me-2"></i>
                        <span className="small">{location}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-bold text-dark">Registration</span>
                        <span className="small text-muted">
                            {currentAttendees} / {maxAttendees}
                        </span>
                    </div>
                </div>

                <button
                    className="btn btn-primary w-100 fw-semibold"
                    disabled={currentAttendees >= maxAttendees || loading == true}
                    onClick = {() => handleSubscribe(true)}
                >
                    {currentAttendees >= maxAttendees ? 'Sold Out' : 'Register Now'}
                    
                </button>
            </div>
        </div>
    </>
}
export default EventComponent