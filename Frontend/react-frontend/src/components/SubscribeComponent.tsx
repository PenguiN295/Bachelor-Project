import type Event from "../Interfaces/Event"
import { useAuth } from "../context/AuthContext";
import url from "../../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateGoogleCalendarLink, downloadIcsFile } from "../utils/calendarUtils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarPlus, Download, Calendar as CalendarIcon, CheckCircle2, XCircle } from "lucide-react";

interface SubscribeProp {
    isSubscribed: boolean,
    event: Event,
}

const SubscribeComponent: React.FC<SubscribeProp> = ({ isSubscribed, event }) => {
    const { id, maxAttendees, currentAttendees, slug, endAt } = event;
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
        <div className="flex flex-col gap-3 mb-6 relative z-10 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-1">Registration</h3>
            <Button
                variant={isSubscribed ? "destructive" : "default"}
                className="w-full text-base h-12"
                disabled={(!isSubscribed && isFull) || isPast || isPending} 
                onClick={() => mutate(!isSubscribed)}
            >
                {isSubscribed ? (
                    isPast ? "You Attended" : (
                        <>
                            <XCircle className="w-5 h-5 mr-2" />
                            Unsubscribe
                        </>
                    )
                ) : isPast ? "Event Finished" : isFull ? "Sold Out" : (
                    <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Register Now
                    </>
                )}
            </Button>

            {isSubscribed && !isPast && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full text-base h-12 text-slate-700">
                            <CalendarPlus className="w-5 h-5 mr-2 text-primary" />
                            Add to Calendar
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-[calc(100vw-2rem)] sm:w-80">
                        <DropdownMenuItem asChild className="cursor-pointer py-3">
                            <a 
                                href={generateGoogleCalendarLink(event)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center w-full"
                            >
                                <CalendarIcon className="w-4 h-4 mr-3 text-red-500" />
                                <span className="font-medium">Google Calendar</span>
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadIcsFile(event)} className="cursor-pointer py-3">
                            <div className="flex items-center w-full">
                                <Download className="w-4 h-4 mr-3 text-primary" />
                                <span className="font-medium">Download (.ics)</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}

export default SubscribeComponent;