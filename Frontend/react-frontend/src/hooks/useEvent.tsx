import { useEffect, useState } from "react";
import url from "../../config";
import type Event from "../Interfaces/Event"
import { useAuth } from "../context/AuthContext";

export const useEvent = (id: string) => {
    const {token} = useAuth()
    const [event, setEv] = useState<Event | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true)
            
            try {
                const response = await fetch(`${url}/event/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if(response.ok)
            {
                const data = await response.json();
                setEv( data);
            }


            } catch (err) {
                console.log(err)
            }
            finally {
                setLoading(false)
            }
        }
        fetchEvent()
    }, [id,token]);

    return {event,loading};
}