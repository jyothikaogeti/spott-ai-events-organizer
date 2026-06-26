"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Loader2,
  MapPin,
  QrCode,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendeeCard from "../_components/AttendeeCard";
import QRScannerModal from "../_components/QRScannerModal";

export default function EventDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId;

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  const { isLoading, data: dashboardData } = useConvexQuery(
    api.dashboard.getEventDashboard,
    { eventId },
  );

  const { isLoading: isLoadingRegistrations, data: registrations } =
    useConvexQuery(api.registrations.getEventRegistrations, { eventId });

  function handleExportCSV() {
    if (!registrations || registrations.length === 0) {
      toast.error("No Registrations to Export");
      return;
    }

    const csvContent = [
      [
        "Name",
        "Email",
        "Registerd At",
        "Checked In",
        "Checked In At",
        "QR Code",
      ],
      ...registrations.map((registration) => [
        registration.attendeeName,
        registration.attendeeEmail,
        new Date(registration.registeredAt).toLocaleString(),
        registration.checkedIn ? "Yes" : "No",
        registration.checkedInAt
          ? new Date(registration.checkedInAt).toLocaleString()
          : "-",
        registration.qrCode,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${dashboardData?.event.title || "event"}_registrations.csv`;
    a.click();
    toast.success("CSV Exported Successfully");
  }

  if (isLoading || isLoadingRegistrations) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!dashboardData) {
    notFound();
  }

  const { event, stats } = dashboardData;

  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      registration.attendeeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      registration.attendeeEmail
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      registration.qrCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all")
      return matchesSearch && registration.status === "confirmed";
    if (activeTab === "checked-in")
      return (
        matchesSearch &&
        registration.checkedIn &&
        registration.status === "confirmed"
      );
    if (activeTab === "pending")
      return (
        matchesSearch &&
        !registration.checkedIn &&
        registration.status === "confirmed"
      );

    return matchesSearch;
  });

  return (
    <div className="min-h-screen px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="gap-2 -ml-2"
            onClick={() => router.push("/my-events")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Events
          </Button>
        </div>

        {event.coverImage && (
          <div className="relative h-87.5 rounded-2xl overflow-hidden mb-6">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-5 justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">{event.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <Badge variant="outline">
                {getCategoryIcon(event.category)}{" "}
                {getCategoryLabel(event.category)}
              </Badge>

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(event.startDate, "PPP")}</span>
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {event.locationType === "online"
                    ? "Online"
                    : `${event.city}, ${event.state || event.country}`}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              className="gap-2 flex-1"
              onClick={() => router.push(`/events/${event.slug}`)}
            >
              <Eye className="w-4 h-4" />
              View
            </Button>
          </div>
        </div>

        {/* Show QR Scanner If Event is Today */}
        {stats.isEventToday && !stats.isEventPast && (
          <Button
            size="lg"
            className="w-full bg-linear-to-r from-orange-500 via-pink-500 to-red-500 text-white hover:scale-[1.02] gap-2 h-10 mb-8"
            onClick={() => setShowQRScanner(true)}
          >
            <QrCode className="w-6 h-6" />
            Scan QR Code to Check-In
          </Button>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card className="py-0">
            <CardContent className="flex items-center gap-3 p-6">
              <div className="bg-purple-100 rounded-lg p-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.totalRegistrations} / {stats.capacity}
                </p>
                <p className="text-muted-foreground text-sm">Capacity</p>
              </div>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardContent className="flex items-center gap-3 p-6">
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.checkedInCount}</p>
                <p className="text-muted-foreground text-sm">Checked In</p>
              </div>
            </CardContent>
          </Card>

          {event.ticketType === "paid" ? (
            <Card className="py-0">
              <CardContent className="flex items-center gap-3 p-6">
                <div className="bg-blue-100 rounded-lg p-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
                  <p className="text-muted-foreground text-sm">Revenue</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="py-0">
              <CardContent className="flex items-center gap-3 p-6">
                <div className="bg-orange-100 rounded-lg p-3">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.checkInRate}%</p>
                  <p className="text-muted-foreground text-sm">Check In Rate</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="py-0">
            <CardContent className="flex items-center gap-3 p-6">
              <div className="bg-amber-100 rounded-lg p-3">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.isEventPast
                    ? "Ended"
                    : stats.hoursUntilEvent > 24
                      ? `${Math.floor(stats.hoursUntilEvent / 24)}d`
                      : `${stats.hoursUntilEvent}h`}
                </p>
                <p className="text-muted-foreground text-sm">
                  {stats.isEventPast ? "Event Over" : "Time Left"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">Attendee Management</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All ({stats.totalRegistrations})
            </TabsTrigger>
            <TabsTrigger value="checked-in">
              Checked In ({stats.checkedInCount})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({stats.pendingCount})
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 top-1/2 left-3 text-muted-foreground transform -translate-y-1/2" />

              <Input
                placeholder="Search by Name, Email, or QR Code..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExportCSV}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          <TabsContent value={activeTab} className="space-y-3 mt-0">
            {filteredRegistrations && filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((registration) => (
                <AttendeeCard
                  key={registration._id}
                  registration={registration}
                />
              ))
            ) : (
              <div className="text-muted-foreground text-center py-12">
                No Attendess Found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {showQRScanner && (
        <QRScannerModal
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}
