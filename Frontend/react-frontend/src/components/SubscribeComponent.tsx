import { useState } from "react";
import type Event from "../Interfaces/Event"
import { useAuth } from "../context/AuthContext";
import url from "../../config";

interface SubscribeProp {
    isSubscribed: boolean,
    event: Event,
    onStatusChange: () => void
}

const SubscribeComponent: React.FC<SubscribeProp> = ({ isSubscribed, event: { id,
    maxAttendees,
    currentAttendees,
},onStatusChange}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const { token } = useAuth();
    const handleSubscribe = async (intent: boolean) => {
        try {
            setLoading(true);
            const response = await fetch(`${url}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    Subscribe: intent,
                    EventId: id
                })
            })
            if (!response.ok) {
                alert("Already Subscribed to this event");
            }
            else {
                !isSubscribed ? (alert("Subscribed successfully")) : (alert("Unsubscribed successfully"))
                onStatusChange();
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }

    }

    return <>

        {isSubscribed ? (<button
            className="btn btn-danger w-100 fw-semibold"
            disabled={currentAttendees >= maxAttendees || loading == true}
            onClick={() => handleSubscribe(false)}>
            Unsubscribe

        </button>) : (
            <button
                className="btn btn-primary w-100 fw-semibold"
                disabled={currentAttendees >= maxAttendees || loading == true}
                onClick={() => handleSubscribe(true)}>
                {currentAttendees >= maxAttendees ? 'Sold Out' : 'Register Now'}

            </button>)
        }

    </>
}
export default SubscribeComponent