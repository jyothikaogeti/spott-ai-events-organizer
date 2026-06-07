"use client";

import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { useConvexMutation } from "@/hooks/useConvexMutation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EventCard from "@/components/EventCard";

export default function MyEventsPage() {
  const router = useRouter();

  const { isLoading, data: events } = useConvexQuery(api.events.getMyEvents);
  const { mutate: deleteEvent } = useConvexMutation(api.events.deleteEvent);

  async function handleDeleteEvent(eventId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone and will permanently delete the event and all associated registrations.",
    );

    if (!confirmed) return;

    try {
      await deleteEvent({ eventId });
      toast.success("Event Deleted Successfully");
    } catch (error) {
      toast.error(error.message || "Failed to Delete Event");
    }
  }

  function handleEventClick(eventId) {
    router.push(`/my-events/${eventId}`);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Events</h1>
            <p className="text-muted-foreground">Manage Your Created Events</p>
          </div>
        </div>

        {events?.length === 0 ? (
          <Card className="text-center p-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl mb-4">📅</div>

              <h2 className="text-2xl font-bold">No Events Yet</h2>

              <p className="text-muted-foreground">
                Create your first event and start managing attendees
              </p>

              <Button asChild className="gap-2">
                <Link href="/create-event">
                  <Plus className="w-4 h-4" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                action="event"
                onClick={() => handleEventClick(event._id)}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
