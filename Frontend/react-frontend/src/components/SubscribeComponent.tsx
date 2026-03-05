
import type Event from "../Interfaces/Event"
import { useAuth } from "../context/AuthContext";
import url from "../../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SubscribeProp {
    isSubscribed: boolean,
    event: Event,
}

const SubscribeComponent: React.FC<SubscribeProp> = ({ isSubscribed, event: { id,
    maxAttendees,
    currentAttendees,
    slug
} }) => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
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
        onMutate: async (intent: boolean) => {
            await queryClient.cancelQueries({ queryKey: ["subscription", slug] });
            const previousSubscription = queryClient.getQueryData(["subscription", slug]);
            queryClient.setQueryData(["subscription", slug], intent);
            toast.loading(intent ? "Subscribing..." : "Unsubscribing...", { id: "sub-action" });

            return { previousSubscription };
        },
        onSuccess: (_, intent) => {
            toast.success(intent ? "Subscribed successfully" : "Unsubscribed successfully", {
                id: "sub-action"
            });
        },
        onError: (_error, _intent, context) => {
            queryClient.setQueryData(["subscription", slug], context?.previousSubscription);
            toast.error("Action failed. Reverting changes.", { id: "sub-action" });
        },
        onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["subscription", slug] });
        queryClient.invalidateQueries({ queryKey: ["event", slug] });
    },
    });

    const isFull = currentAttendees >= maxAttendees;

    return <>

       <button
            className={`btn ${isSubscribed ? "btn-danger" : "btn-primary"} w-100 fw-semibold`}
            disabled={!isSubscribed && isFull} 
            onClick={() => mutate(!isSubscribed)}
        >
            {isSubscribed ? "Unsubscribe" : isFull ? "Sold Out" : "Register Now"}
        </button>

    </>
}
export default SubscribeComponent