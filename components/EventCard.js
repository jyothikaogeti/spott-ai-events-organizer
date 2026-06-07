"use client";

import { Calendar, Eye, MapPin, QrCode, Trash2, Users, X } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function EventCard({
  event,
  variant = "grid",
  onClick,
  onDelete,
  action = null,
  className = "",
}) {
  // Variant - list
  if (variant === "list") {
    return (
      <Card
        className={`group transition-all cursor-pointer py-0 hover:border-purple-500/50 hover:shadow-lg ${className}`}
        onClick={onClick}
      >
        <CardContent className="flex gap-3 p-3">
          <div className="w-20 h-20 relative rounded-lg overflow-hidden shrink-0">
            {event.coverImage ? (
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="absolute text-3xl flex justify-center items-center inset-0"
                style={{ backgroundColor: event.themeColor }}
              >
                {getCategoryIcon(event.category)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold transition-colors line-clamp-2 group-hover:text-purple-400 mb-1">
              {event.title}
            </h3>

            <p className="text-muted-foreground text-xs mb-1">
              {format(event.startDate, "EEE, dd MMM, HH:mm")}
            </p>

            <div className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">
                {event.locationType === "online" ? "Online Event" : event.city}
              </span>
            </div>

            <div className="text-muted-foreground text-xs flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{event.registrationCount} attending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Variant - Grid
  return (
    <Card
      className={`group overflow-hidden pt-0 ${onClick ? "cursor-pointer transition-all hover:border-purple-500/50 hover:shadow-lg" : ""} ${className}`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-48">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            width={500}
            height={192}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            priority
          />
        ) : (
          <div
            className="w-full h-full text-4xl flex justify-center items-center"
            style={{ backgroundColor: event.themeColor }}
          >
            {getCategoryIcon(event.category)}
          </div>
        )}

        <div className="absolute top-3 right-3">
          <Badge variant="secondary">
            {event.ticketType === "free" ? "Free" : "Paid"}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-3">
        <div>
          <Badge variant="outline" className="mb-2">
            {getCategoryIcon(event.category)}
            <span className="ml-1">{getCategoryLabel(event.category)}</span>
          </Badge>

          <h3 className="text-lg font-semibold transition-colors line-clamp-2 group-hover:text-purple-400">
            {event.title}
          </h3>
        </div>

        <div className="text-muted-foreground text-sm space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(event.startDate, "PPP")}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">
              {event.locationType === "online"
                ? "Online Event"
                : `${event.city}, ${event.state || event.country}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {event.registrationCount} / {event.capacity} registered
            </span>
          </div>
        </div>

        {action && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
              }}
            >
              {action === "event" ? (
                <>
                  <Eye className="w-4 h-4" />
                  View
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  Show Ticket
                </>
              )}
            </Button>

            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event._id);
                }}
              >
                {action === "event" ? (
                  <Trash2 className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
