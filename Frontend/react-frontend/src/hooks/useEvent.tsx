import { useEffect, useState } from "react";
import url from "../../config";
import type Event from "../Interfaces/Event"
import { useAuth } from "../context/AuthContext";

export const useEvent = (id: string) => {
    const { token } = useAuth()
    const [event, setEvent] = useState<Event | null>(null);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const fetchEvent = async (): Promise<Event | null> => {
        setLoading(true)

        try {
            const response = await fetch(`${url}/event/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if (response.ok) {
                const data = await response.json();
                setEvent(data);
                return data;
            }

        } catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
        return null;
    }



    const verifyOwnership = async (currentEvent: Event | null) => {
        if (!currentEvent) return;
        try {
            setLoading(true)  
                const response = await fetch(`${url}/ownership-status/${currentEvent.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'Owner') {
                        console.log("here")
                        setIsOwner(true);
                    }
                    else {
                        setIsOwner(false);
                    }
                }
                else {
                    alert("fail");
                }
            
        } catch (error) {
            alert(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }

    };
    useEffect(() => {
        healthCheck()
    }, [id, token]);
    const healthCheck = async ()=>
    {
        const fetchedEvent = await fetchEvent()
        await verifyOwnership(fetchedEvent)
    }
    return { event, loading, refreshEvent: fetchEvent, isOwner };
}