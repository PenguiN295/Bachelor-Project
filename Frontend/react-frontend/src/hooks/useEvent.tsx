import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import url from "../../config";
import type Event from "../Interfaces/Event";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useEvent = (slug: string) => {
  const { token } = useAuth();
  const navgiate = useNavigate();
  const queryClient = useQueryClient();
  const eventQuery = useQuery({
    queryKey: ["event", slug],
    queryFn: async (): Promise<Event> => {
      const response = await fetch(`${url}/event/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch event");
      return response.json();
    },
    enabled: !!slug && !!token,
    staleTime: 5 * 60 * 1000,
  });

  const ownershipQuery = useQuery({
    queryKey: ["ownership", slug],
    queryFn: async (): Promise<boolean> => {
      const response = await fetch(`${url}/ownership-status/${slug}`, {
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
    enabled: !!slug && !!token && !!eventQuery.data,
    staleTime: 5 * 60 * 1000,
  });



  const subscriptionQuery = useQuery({
    queryKey: ["subscription", slug],
    queryFn: async (): Promise<boolean> => {
      const res = await fetch(`${url}/subscribed-status/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data.status === "Subscribed";
    },
    enabled: !!slug && !!token && !!eventQuery.data,
    staleTime: 5 * 60 * 1000,
  });
  const updateMutation = useMutation({
    mutationFn: async (updatedEvent: Event) => {
      const res = await fetch(`${url}/update-event/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEvent),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      return data.slug;
    },
    onMutate: async (updatedEvent: Event) => {
      await queryClient.cancelQueries({ queryKey: ["event", slug] });
      const previousEvent = queryClient.getQueryData(["event", slug]);
      queryClient.setQueryData(["event", slug], (old: Event | undefined) => ({
        ...old,
        ...updatedEvent,
        currentAttendants: old?.currentAttendees
      }));
      return { previousEvent };
    },
    onSuccess: (newSlug) => {
      toast.success("Event updated successfully");
      navgiate(`/event/${newSlug || slug}`);
    },
    onError: (_error, _, context) => {
      queryClient.setQueryData(["event", slug], context?.previousEvent);
      toast.error("Update failed. Reverting changes.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["event", slug] });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${url}/delete-event/${slug}`, {
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
  const creatorQuery = useQuery({
    queryKey: ["creator", slug],
    queryFn: async () => {
      const res = await fetch(`${url}/creator-name/${slug}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch creator");
      const data = await res.json();
      return data;
    },
    enabled: !!slug && !!token && !!eventQuery.data,
    staleTime: 5 * 60 * 1000,
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
    creator: creatorQuery.data ?? null,
  };
};