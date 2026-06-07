/* eslint-disable react-hooks/purity */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Loader2, MapPin, Ticket } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { useConvexMutation } from "@/hooks/useConvexMutation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventCard from "@/components/EventCard";

export default function MyTicketsPage() {
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { isLoading, data: registrations } = useConvexQuery(
    api.registrations.getMyRegistrations,
  );

  console.log(registrations);

  const { isLoading: isCancellingRegistartion, mutate: cancelRegistration } =
    useConvexMutation(api.registrations.cancelRegistration);

  const now = Date.now();

  const upcomingTickets = registrations?.filter(
    (registration) =>
      registration.event &&
      (registration.event.startDate >= now ||
        (registration.event.startDate <= now &&
          registration.event.endDate >= now)) &&
      registration.status === "confirmed",
  );

  const pastTickets = registrations?.filter(
    (registration) =>
      registration.event &&
      (registration.event.endDate < now || registration.status === "cancelled"),
  );

  async function handleCancelRegistration(registrationId) {
    if (!window.confirm("Are you sure want to cancel this registration ?"))
      return;

    try {
      await cancelRegistration({ registrationId });
      toast.success("Registration Cancelled Succesfully");
    } catch (error) {
      toast.error(error.message || "Failed to Cancel Registration");
    }
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            View and Manage your Event Registrations
          </p>
        </div>

        {upcomingTickets?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTickets.map((registration) => (
                <EventCard
                  key={registration._id}
                  event={registration.event}
                  action="ticket"
                  onClick={() => setSelectedTicket(registration)}
                  onDelete={() => handleCancelRegistration(registration._id)}
                />
              ))}
            </div>
          </div>
        )}

        {pastTickets?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Past Events</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((registration) => (
                <EventCard
                  key={registration._id}
                  event={registration.event}
                  action={null}
                  className="opacity-60"
                />
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {upcomingTickets?.length === 0 && pastTickets?.length === 0 && (
          <Card className="text-center p-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl mb-4">🎟️</div>

              <h2 className="text-2xl font-bold">No Tickets Yet</h2>

              <p className="text-muted-foreground">
                Register for Events to see your Tickets Here
              </p>

              <Button asChild className="gap-2">
                <Link href="/explore">
                  <Ticket className="w-4 h-4" /> Browse Events
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* QR CODE MODAL */}
      {selectedTicket && (
        <Dialog
          open={!!selectedTicket}
          onOpenChange={() => setSelectedTicket(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Your Ticket</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-center">
                <p className="font-semibold mb-1">
                  {selectedTicket.attendeeName}
                </p>

                <p className="text-muted-foreground text-sm mb-4">
                  {selectedTicket.event.title}
                </p>
              </div>

              <div className="bg-white flex justify-center rounded-lg p-6">
                <QRCode value={selectedTicket.qrCode} size={200} level="H" />
              </div>

              <div className="text-center">
                <p className="text-muted-foreground text-xs mb-1">Ticket ID</p>
                <p className="font-mono text-sm">{selectedTicket.qrCode}</p>
              </div>

              <div className="bg-muted text-sm rounded-lg space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(selectedTicket.event.startDate, "PPP, h:mm a")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedTicket.event.locationType === "online"
                      ? "Online Event"
                      : `${selectedTicket.event.city}, ${selectedTicket.event.state || selectedTicket.event.country}`}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground text-xs text-center">
                Show this QR Code at the event entrance for Check-In
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
