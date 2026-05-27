import type Event from "../Interfaces/Event"
import { useAuth } from "../context/AuthContext";
import url from "../../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateGoogleCalendarLink, downloadIcsFile } from "../utils/calendarUtils";

interface SubscribeProp {
    isSubscribed: boolean,
    event: Event,
}

const SubscribeComponent: React.FC<SubscribeProp> = ({ isSubscribed, event }) => {
    const { id, maxAttendees, currentAttendees, slug, endAt } = event;
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
    const isPast = new Date(endAt) < new Date();

    return (
        <div className="d-flex flex-column gap-2 mb-4" style={{ position: 'relative', zIndex: 1050 }}>
            <button
                className={`btn ${isSubscribed ? "btn-danger" : "btn-primary"} w-100 fw-semibold`}
                disabled={(!isSubscribed && isFull) || isPast} 
                onClick={() => mutate(!isSubscribed)}
            >
                {isSubscribed ? (isPast ? "You Attended" : "Unsubscribe") : isPast ? "Event Finished" : isFull ? "Sold Out" : "Register Now"}
            </button>

            {isSubscribed && !isPast && (
                <div className="dropdown">
                    <button 
                        className="btn btn-outline-secondary w-100 fw-semibold dropdown-toggle" 
                        type="button" 
                        id="calendarDropdown" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                    >
                        <i className="bi bi-calendar-plus me-2"></i>Add to Calendar
                    </button>
                    <ul className="dropdown-menu w-100 shadow-sm" aria-labelledby="calendarDropdown" style={{ zIndex: 1060 }}>
                        <li>
                            <a 
                                className="dropdown-item d-flex align-items-center" 
                                href={generateGoogleCalendarLink(event)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-google me-2 text-danger"></i>Google Calendar
                            </a>
                        </li>
                        <li>
                            <button 
                                className="dropdown-item d-flex align-items-center" 
                                onClick={() => downloadIcsFile(event)}
                            >
                                <i className="bi bi-download me-2 text-primary"></i>Download (.ics)
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SubscribeComponent;
