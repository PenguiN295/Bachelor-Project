import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import LoadingState from "../components/LoadingState";
import EventComponent from "../components/EventComponent";
import HomeButton from "../components/HomeButton";
import { useEffect, useState } from "react";
import url from "../../config";
import { useAuth } from "../context/AuthContext";

const EventPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const { event, loading, refreshEvent } = useEvent(id!);
    const handleStatus = async () => {
        try {
            if (event) {
                console.log(event);
                const response = await fetch(`${url}/subscribed-status/${event.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'Subscribed') {
                        setIsSubscribed(true);
                    }
                    else {
                        setIsSubscribed(false);
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }

    }
    useEffect(() => {
        handleStatus();
    }, [event])

    const handleRefresh = async () => {
        await refreshEvent();
        await handleStatus();
    };
    return <>
        <div className=" d-flex justify-content-center align-items-center vh-100">
            {loading ? (
                <LoadingState />
            ) : event ? (<EventComponent event={event} isSubscribed={isSubscribed} onStatusChange={handleRefresh}/>) :
                <>Something went wrong</>}
        </div>
    </>
}
export default EventPage;