"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { Loader2, MapPin } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { parseLocationSlug } from "@/lib/helper";
import { CATEGORIES } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import EventCard from "@/components/EventCard";

export default function DynamicExplorePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;

  const categoryInfo = CATEGORIES.find((category) => category.id === slug);
  const isCategory = !!categoryInfo;

  const { city, state, isValid } = !isCategory
    ? parseLocationSlug(slug)
    : { city: null, state: null, isValid: false };

  if (!isCategory && !isValid) {
    notFound();
  }

  const { isLoading, data: events } = useConvexQuery(
    isCategory
      ? api.explore.getEventsByCategory
      : api.explore.getEventsByLocation,
    isCategory
      ? { category: slug, limit: 50 }
      : city && state
        ? { city, state, limit: 50 }
        : "skip",
  );

  function handleEventClick(slug) {
    router.push(`/events/${slug}`);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (isCategory) {
    return (
      <>
        <div className="pb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{categoryInfo.icon}</div>

            <div>
              <h1 className="text-5xl md:text-6xl font-bold">
                {categoryInfo.label}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {categoryInfo.description}
              </p>
            </div>
          </div>

          {events && events.length > 0 && (
            <p className="text-muted-foreground">
              {events.length} Event{events.length !== 1 ? "s" : ""} Found
            </p>
          )}
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => handleEventClick(event.slug)}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No Events found in this Category.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <div className="pb-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl">📍</div>

          <div>
            <h1 className="text-5xl md:text-6xl font-bold">Events in {city}</h1>
            <p className="text-lg text-muted-foreground mt-2">{state}, India</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-2">
            <MapPin className="w-3 h-3" />
            {city}, {state}
          </Badge>

          {events && events.length > 0 && (
            <p className="text-muted-foreground">
              {events.length} Event{events.length !== 1 ? "s" : ""} Found
            </p>
          )}
        </div>
      </div>

      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onClick={() => handleEventClick(event.slug)}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No Events in {city}, {state} yet.
        </p>
      )}
    </>
  );
}
