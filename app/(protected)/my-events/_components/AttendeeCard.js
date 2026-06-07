"use client";

import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/useConvexMutation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AttendeeCard({ registration }) {
  const { isLoading, mutate: checkInAttendee } = useConvexMutation(
    api.registrations.checkInAttendee,
  );

  async function handleManualCheckIn() {
    try {
      const result = await checkInAttendee({ qrCode: registration.qrCode });

      if (result.success) {
        toast.success("Attendee Checked In Successfully");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to Check In Attendee");
    }
  }

  return (
    <Card className="py-0">
      <CardContent className="flex items-start gap-4 p-4">
        <div
          className={`rounded-full p-2 mt-1 ${
            registration.checkedIn ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          {registration.checkedIn ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{registration.attendeeName}</h3>

          <p className="text-muted-foreground text-sm mb-2">
            {registration.attendeeEmail}
          </p>

          <div className="flex flex-wrap gap-3 text-muted-foreground text-xs">
            <span>
              {registration.checkedIn ? "⏰ Checked In" : "📅 Registered"}
              {registration.checkedIn && registration.checkedInAt
                ? format(registration.checkedInAt, "PPp")
                : format(registration.registeredAt, "PPp")}
            </span>

            <span className="font-mono">QR: {registration.qrCode}</span>
          </div>
        </div>

        {!registration.checkedIn && (
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={handleManualCheckIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Check In
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
