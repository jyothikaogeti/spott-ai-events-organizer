/* eslint-disable react-hooks/purity */
"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Share2,
  Ticket,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { darkenThemeColor } from "@/lib/helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RegisterEventModal from "./_components/RegisterEventModal";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { isLoading, data: event } = useConvexQuery(api.events.getEventBySlug, {
    slug: params.slug,
  });

  const { data: registration } = useConvexQuery(
    api.registrations.checkRegistration,
    event?._id ? { eventId: event._id } : "skip",
  );

  function handleRegisterEvent() {
    if (!user) {
      toast.error("Please Sign In to Register");
      return;
    }
    setShowRegisterModal(true);
  }

  async function handleShareEvent(parms) {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description.slice(0, 100) + "...",
          url: url,
        });
      } catch (error) {
        console.error("User Cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link Copied to Clipboard");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  const isEventFull = event.registrationCount >= event.capacity;
  const isEventPast = event.endDate < Date.now();
  const isOrganizer = user?.id === event.organizerId;

  return (
    <div
      className="min-h-screen py-8 -mt-6 md:-mt-16 lg:-mx-5"
      style={{
        backgroundColor: event.themeColor || "#1e3a8a",
      }}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">
            {getCategoryIcon(event.category)}
            <span className="ml-1">{getCategoryLabel(event.category)}</span>
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{format(event.startDate, "EEEE, MMMM dd, yyyy")}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {format(event.startDate, "h:mm a")} -
                {format(event.endDate, "h:mm a")}
              </span>
            </div>
          </div>
        </div>

        {event.coverImage && (
          <div className="relative h-62.5 md:h-100 rounded-2xl overflow-hidden mb-6">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-8">
            <Card
              className="pt-0"
              style={{
                backgroundColor: event.themeColor
                  ? darkenThemeColor(event.themeColor, 0.04)
                  : "#1e3a8a",
              }}
            >
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>

                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            <Card
              className="pt-0"
              style={{
                backgroundColor: event.themeColor
                  ? darkenThemeColor(event.themeColor, 0.04)
                  : "#1e3a8a",
              }}
            >
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                  <MapPin className="w-6 h-6 text-purple-500" />
                  Location
                </h2>

                <div className="space-y-3">
                  <p className="font-medium">
                    {event.city}, {event.state || event.country}
                  </p>

                  {event.address && (
                    <p className="text-muted-foreground text-sm">
                      {event.address}
                    </p>
                  )}

                  {event.venue && (
                    <Button asChild variant="outline" className="gap-2">
                      <Link
                        href={event.venue}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on MapPin
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card
              className="pt-0"
              style={{
                backgroundColor: event.themeColor
                  ? darkenThemeColor(event.themeColor, 0.04)
                  : "#1e3a8a",
              }}
            >
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Organizer</h2>

                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {event.organizerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold">{event.organizerName}</p>
                    <p className="text-muted-foreground text-sm">
                      Event Organizer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:top-24 lg:sticky h-fit">
            <Card
              className="overflow-hidden py-0"
              style={{
                backgroundColor: event.themeColor
                  ? darkenThemeColor(event.themeColor, 0.04)
                  : "#1e3a8a",
              }}
            >
              <CardContent className="space-y-4 p-6">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Price</p>

                  <p className="text-3xl font-bold">
                    {event.ticketType === "free"
                      ? "Free"
                      : `₹${event.ticketPrice}`}
                  </p>

                  {event.ticketType === "paid" && (
                    <p className="text-muted-foreground text-xs mt-1">
                      Pay at Event Offline
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Attendees</span>
                    </div>
                    <p className="font-semibold">
                      {event.registrationCount} / {event.capacity}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Date</span>
                    </div>
                    <p className="font-semibold text-sm">
                      {format(event.startDate, "MMM dd")}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Time</span>
                    </div>
                    <p className="font-semibold text-sm">
                      {format(event.startDate, "h:mm a")}
                    </p>
                  </div>
                </div>

                <Separator />

                {registration ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 text-green-600 rounded-lg flex items-center gap-2 p-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        You&apos;ve Registered
                      </span>
                    </div>

                    <Button
                      className="w-full gap-2"
                      onClick={() => router.push("/my-tickets")}
                    >
                      <Ticket className="w-4 h-4" />
                      View Ticket
                    </Button>
                  </div>
                ) : isEventPast ? (
                  <Button className="w-full" disabled>
                    Event Ended
                  </Button>
                ) : isEventFull ? (
                  <Button className="w-full" disabled>
                    Event Full
                  </Button>
                ) : isOrganizer ? (
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/events/${event.slug}/manage`)}
                  >
                    Manage Event
                  </Button>
                ) : (
                  <Button
                    className="w-full gap-2"
                    onClick={handleRegisterEvent}
                  >
                    <Ticket className="w-4 h-4" />
                    Register for Event
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleShareEvent}
                >
                  <Share2 className="w-4 h-4" />
                  Share Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showRegisterModal && (
        <RegisterEventModal
          event={event}
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}
