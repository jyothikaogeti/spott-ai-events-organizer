"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowRight, Calendar, Loader2, MapPin, Users } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { CATEGORIES } from "@/lib/data";
import { createLocationSlug } from "@/lib/helper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import EventCard from "@/components/EventCard";

export default function ExplorePage() {
  const router = useRouter();
  const autoplay = Autoplay({ delay: 2000, stopOnInteraction: true });

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  const { isLoading: loadingFeatuedEvents, data: featuredEvents } =
    useConvexQuery(api.explore.getFeaturedEvents, { limit: 5 });

  const { isLoading: loadingPopularEvents, data: popularEvents } =
    useConvexQuery(api.explore.getPopularEvents, { limit: 6 });

  const { isLoading: loadingLocalEvents, data: localEvents } = useConvexQuery(
    api.explore.getEventsByLocation,
    {
      city: currentUser?.location?.city || "Hyderabad",
      state: currentUser?.location?.state || "Telangana",
      limit: 4,
    },
  );

  const { data: categoryCounts } = useConvexQuery(
    api.explore.getCategoryCounts,
  );

  const categoriesWithCounts = CATEGORIES.map((category) => ({
    ...category,
    count: categoryCounts?.[category.id] || 0,
  }));

  function handleEventClick(slug) {
    router.push(`/events/${slug}`);
  }

  function handleCategoryClick(categoryId) {
    router.push(`/explore/${categoryId}`);
  }

  function handleViewLocalEvents() {
    const city = currentUser?.location?.city || "Hyderabad";
    const state = currentUser?.location?.state || "Telangana";
    const slug = createLocationSlug(city, state);

    router.push(`/explore/${slug}`);
  }

  // LOADING STATE
  const isLoading =
    loadingFeatuedEvents || loadingPopularEvents || loadingLocalEvents;

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="text-center pb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Events</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore featured events, find what&apos;s happening locally, or browse
          events across India
        </p>
      </div>

      {/* FEATURED EVENTS CAROUSEL */}
      {featuredEvents && featuredEvents.length > 0 && (
        <div className="mb-16">
          <Carousel
            className="w-full"
            plugins={[autoplay]}
            onMouseEnter={() => autoplay.stop()}
            onMouseLeave={() => autoplay.reset()}
          >
            <CarouselContent>
              {featuredEvents.map((featuredEvent) => (
                <CarouselItem key={featuredEvent._id}>
                  <div
                    className="relative h-100 rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => handleEventClick(featuredEvent.slug)}
                  >
                    {featuredEvent.coverImage ? (
                      <Image
                        src={featuredEvent.coverImage}
                        alt={featuredEvent.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: featuredEvent.themeColor }}
                      />
                    )}

                    <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/30" />

                    <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                      <Badge variant="secondary" className="w-fit mb-4">
                        {featuredEvent.city},{" "}
                        {featuredEvent.state || featuredEvent.country}
                      </Badge>

                      <h2 className="text-3xl md:text-5xl text-white font-bold mb-3">
                        {featuredEvent.title}
                      </h2>

                      <p className="text-lg text-white/90 max-w-2xl line-clamp-2 mb-4">
                        {featuredEvent.description}
                      </p>

                      <div className="flex items-center gap-4 text-white/80">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {format(featuredEvent.startDate, "PPP")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{featuredEvent.city}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {featuredEvent.registrationCount} registered
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      )}

      {/* LOCAL EVENTS */}
      {localEvents && localEvents.length > 0 && (
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-1">Events Near You</h2>
              <p className="text-muted-foreground">
                Happening in {currentUser?.location?.city || "Your Area"}
              </p>
            </div>

            <Button
              variant="outline"
              className="gap-2"
              onClick={handleViewLocalEvents}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {localEvents.map((localEvent) => (
              <EventCard
                key={localEvent._id}
                event={localEvent}
                variant="grid"
                onClick={() => handleEventClick(localEvent.slug)}
              />
            ))}
          </div>
        </div>
      )}

      {/* BROWSE BY CATEGORY */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoriesWithCounts.map((category) => (
            <Card
              key={category.id}
              className="group transition-all cursor-pointer py-2 hover:border-purple-500/50 hover:shadow-lg"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="flex items-center gap-3 px-3 sm:p-6">
                <div className="text-3xl sm:text-4xl">{category.icon}</div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-purple-400 transition-colors mb-1">
                    {category.label}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.count} Event{category.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* POPULAR EVENTS ACROSS COUNTRY */}
      {popularEvents && popularEvents.length > 0 && (
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-1">Popular Across India</h2>
            <p className="text-muted-foreground">Trending Events Nationwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularEvents.map((popularEvent) => (
              <EventCard
                key={popularEvent._id}
                event={popularEvent}
                variant="list"
                onClick={() => handleEventClick(popularEvent.slug)}
              />
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loadingFeatuedEvents &&
        !loadingPopularEvents &&
        !loadingLocalEvents &&
        (!featuredEvents || featuredEvents.length === 0) &&
        (!popularEvents || popularEvents.length === 0) &&
        (!localEvents || localEvents.length === 0) && (
          <Card className="text-center p-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold">No Events Yet</h2>
              <p className="text-muted-foreground">
                Be the first to create an event in your area!
              </p>
              <Button asChild className="gap-2">
                <Link href="/create-event">Create Event</Link>
              </Button>
            </div>
          </Card>
        )}
    </>
  );
}
