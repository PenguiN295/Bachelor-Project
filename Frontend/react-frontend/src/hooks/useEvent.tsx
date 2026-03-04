import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import url from "../../config";
import type Event from "../Interfaces/Event";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useEvent = (id: string) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const eventQuery = useQuery({
    queryKey: ["event", id],
    queryFn: async (): Promise<Event> => {
      const response = await fetch(`${url}/event/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch event");
      return response.json();
    },
    enabled: !!id && !!token,
  });

  const ownershipQuery = useQuery({
    queryKey: ["ownership", id],
    queryFn: async (): Promise<boolean> => {
      const response = await fetch(`${url}/ownership-status/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to verify ownership");
      const data = await response.json();
      return data.status === "Owner";
    },
    enabled: !!id && !!token && !!eventQuery.data,
  });



  const subscriptionQuery = useQuery({
    queryKey: ["subscription", id],
    queryFn: async (): Promise<boolean> => {
      const res = await fetch(`${url}/subscribed-status/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data.status === "Subscribed";
    },
    enabled: !!id && !!token && !!eventQuery.data,
  });
  const updateMutation = useMutation({
    mutationFn: async (updatedEvent: Event) => {
      const res = await fetch(`${url}/update-event/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEvent),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onMutate: async (updatedEvent: Event) =>{
      await queryClient.cancelQueries({ queryKey: ["event", id] });
      const previousEvent = queryClient.getQueryData(["event", id]);
      queryClient.setQueryData(["event", id], updatedEvent);
      return { previousEvent };
    },
    onSuccess: (_) => {
      toast.success("Event updated successfully");
      
    },
    onError: (_error ,_, context) => {
      queryClient.setQueryData(["event", id], context?.previousEvent);
      toast.error("Update failed. Reverting changes.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async () => {
        console.log(id);
      const res = await fetch(`${url}/delete-event/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Deletion failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return {
    event: eventQuery.data ?? null,
    isOwner: !!ownershipQuery.data,
    isSubscribed: !!subscriptionQuery.data,
    loading: eventQuery.isLoading || ownershipQuery.isLoading || subscriptionQuery.isLoading,
    error: eventQuery.error || ownershipQuery.error || subscriptionQuery.error,
    updateEvent: updateMutation.mutate,
    deleteEvent: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};