
import type Event from "../Interfaces/Event"
import { useAuth } from "../context/AuthContext";
import url from "../../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SubscribeProp {
    isSubscribed: boolean,
    event: Event,
}

const SubscribeComponent: React.FC<SubscribeProp> = ({ isSubscribed, event: { id,
    maxAttendees,
    currentAttendees,
} }) => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (intent: boolean) => {
            const response = await fetch(`${url}/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ Subscribe: intent, EventId: id }),
            });

            if (!response.ok) throw new Error("Subscription request failed");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            alert(isSubscribed ? "Unsubscribed successfully" : "Subscribed successfully");
        },
        onError: (error) => {
            console.error(error);
            alert("Action failed. You may already be subscribed or the server is unreachable.");
        },
    });

    const isFull = currentAttendees >= maxAttendees;

    return <>

        <button
            className={`btn ${isSubscribed ? "btn-danger" : "btn-primary"} w-100 fw-semibold`}
            disabled={isPending || (!isSubscribed && isFull)}
            onClick={() => mutate(!isSubscribed)}
        >
            {isPending ? "Processing..." : isSubscribed ? "Unsubscribe" : isFull ? "Sold Out" : "Register Now"}
        </button>

    </>
}
export default SubscribeComponent