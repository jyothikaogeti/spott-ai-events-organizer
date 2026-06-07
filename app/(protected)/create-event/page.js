/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { City, State } from "country-state-city";
import { format } from "date-fns";
import { CalendarIcon, Crown, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { useConvexMutation } from "@/hooks/useConvexMutation";
import { CATEGORIES } from "@/lib/data";
import { combineDateTime } from "@/lib/helper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AIEventCreator from "./_components/AIEventCreator";
import UnsplashImagePicker from "@/components/UnsplashImagePicker";
import UpgradeModal from "@/components/UpgradeModal";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),

  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
  endTime: z.string().regex(timeRegex, "End time must be HH:MM"),

  locationType: z.enum(["physical", "online"]).default("physical"),
  venue: z.url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),

  capacity: z.number().min(1, "Capacity must be at least 1"),
  ticketType: z.enum(["free", "paid"]).default("free"),
  ticketPrice: z.number().optional(),
  coverImage: z.string().optional(),
  themeColor: z.string().default("#1e3a8a"),
});

export default function CreateEventPage() {
  const router = useRouter();

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit");

  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro_user" });

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { isLoading, mutate: createEvent } = useConvexMutation(
    api.events.createEvent,
  );

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      locationType: "physical",
      ticketType: "free",
      capacity: 50,
      themeColor: "#1e3a8a",
      category: "",
      state: "",
      city: "",
      startTime: "",
      endTime: "",
    },
  });

  const themeColor = watch("themeColor");
  const coverImage = watch("coverImage");
  const ticketType = watch("ticketType");
  const selectedState = watch("state");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const indianStates = State.getStatesOfCountry("IN");

  const cities = useMemo(() => {
    if (!selectedState) return [];
    const state = indianStates.find((state) => state.name === selectedState);
    if (!state) return [];
    return City.getCitiesOfState("IN", state.isoCode);
  }, [selectedState, indianStates]);

  // COLOR PRESETS
  const colorPresets = [
    "#1e3a8a",
    ...(hasPro ? ["#4c1d95", "#065f46", "#92400e", "#7f1d1d", "#831843"] : []),
  ];

  function handleThemeColorClick(color) {
    if (color !== "#1e3a8a" && !hasPro) {
      setUpgradeReason("color");
      setShowUpgradeModal(true);
      return;
    }
    setValue("themeColor", color);
  }

  async function onSubmit(data) {
    try {
      const start = combineDateTime(data.startDate, data.startTime);
      const end = combineDateTime(data.endDate, data.endTime);

      if (!start || !end) {
        toast.error("Please select both date and time for start and end");
        return;
      }

      if (end.getTime() <= start.getTime()) {
        toast.error("End date/time must be after start date/time");
        return;
      }

      if (!hasPro && currentUser?.freeEventsCreated >= 1) {
        setUpgradeReason("limit");
        setShowUpgradeModal(true);
        return;
      }

      if (!hasPro && data.themeColor !== "#1e3a8a") {
        setUpgradeReason("color");
        setShowUpgradeModal(true);
        return;
      }

      await createEvent({
        title: data.title,
        description: data.description,
        category: data.category,
        tags: [data.category],
        startDate: start.getTime(),
        endDate: end.getTime(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locationType: data.locationType,
        venue: data.venue || undefined,
        address: data.address || undefined,
        state: data.state || undefined,
        city: data.city,
        country: "India",
        capacity: data.capacity,
        ticketType: data.ticketType,
        ticketPrice: data.ticketPrice || undefined,
        coverImage: data.coverImage || undefined,
        themeColor: data.themeColor,
      });

      toast.success("Event Created Successfully 🎉");
      router.push(`/my-events`);
    } catch (error) {
      toast.error(error.message || "Failed to Create Event");
    }
  }

  function handleAIEventGenerate(generatedData) {
    setValue("title", generatedData.title);
    setValue("description", generatedData.description);
    setValue("category", generatedData.category);
    setValue("capacity", generatedData.suggestedCapacity);
    setValue("ticketType", generatedData.suggestedTicketType);

    toast.success("Event Details Filled. Customize as Needed.");
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300 px-6 py-8 -mt-6 md:-mt-16 lg:rounded-md"
      style={{ backgroundColor: themeColor }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-5 mb-10">
        <div>
          <h1 className="text-4xl font-bold">Create Event</h1>
          {!hasPro && (
            <p className="text-muted-foreground text-sm mt-2">
              Free: {currentUser?.freeEventsCreated || 0} / 1 Events Created
            </p>
          )}
        </div>

        <AIEventCreator onEventGenerated={handleAIEventGenerate} />
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-[320px_1fr] gap-10">
        {/* LEFT - IMAGE & THEME */}
        <div className="space-y-6">
          <div
            className="w-full aspect-square border rounded-xl overflow-hidden flex justify-center items-center cursor-pointer"
            onClick={() => setShowImagePicker(true)}
          >
            {coverImage ? (
              <Image
                src={coverImage}
                alt="Cover Image"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm opacity-60">
                Click to add cover image
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm">Theme Color</Label>
              {!hasPro && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Crown className="w-3 h-3" />
                  Pro
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-10 h-10 border-2 rounded-full transition-all ${
                    !hasPro && color !== "#1e3a8a"
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:scale-110"
                  }`}
                  title={
                    !hasPro && color !== "#1e3a8a"
                      ? "Upgrade to Pro for Custom Colors"
                      : ""
                  }
                  style={{
                    backgroundColor: color,
                    borderColor: themeColor === color ? "white" : "transparent",
                  }}
                  onClick={() => handleThemeColorClick(color)}
                />
              ))}

              {!hasPro && (
                <button
                  type="button"
                  title="Unlock more colors with Pro"
                  className="w-10 h-10 border-2 border-dashed border-purple-300 rounded-full flex justify-center items-center transition-colors hover:border-purple-500"
                  onClick={() => {
                    setShowUpgradeModal(true);
                    setUpgradeReason("color");
                  }}
                >
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </button>
              )}
            </div>

            {!hasPro && (
              <p className="text-muted-foreground text-xs">
                Upgrade to Pro to Unlock Custom Theme Colors
              </p>
            )}
          </div>
        </div>

        {/* RIGHT - FORM */}
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* TITLE */}
          <div>
            <Input
              {...register("title")}
              placeholder="Event Name"
              className="bg-transparent text-3xl font-semibold border-none focus-visible:ring-0"
            />

            {errors.title && (
              <p className="text-red-400 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm">Start</Label>

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {startDate ? format(startDate, "PPP") : "Pick Date"}
                      <CalendarIcon className="w-4 h-4 opacity-60" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => setValue("startDate", date)}
                    />
                  </PopoverContent>
                </Popover>

                <Input
                  type="time"
                  {...register("startTime")}
                  placeholder="hh:mm"
                />
              </div>

              {(errors.startDate || errors.startTime) && (
                <p className="text-red-400 text-sm">
                  {errors.startDate?.message || errors.startTime?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm">End</Label>

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {endDate ? format(endDate, "PPP") : "Pick Date"}
                      <CalendarIcon className="w-4 h-4 opacity-60" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => setValue("endDate", date)}
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>

                <Input
                  type="time"
                  {...register("endTime")}
                  placeholder="hh:mm"
                />
              </div>

              {(errors.endDate || errors.endTime) && (
                <p className="text-red-400 text-sm">
                  {errors.endDate?.message || errors.endTime?.message}
                </p>
              )}
            </div>
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <Label className="text-sm">Category</Label>

            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placehold="Select Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.category && (
              <p className="text-red-400 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* LOCATION */}
          <div className="space-y-3">
            <Label className="text-sm">Location</Label>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("city", "");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>

                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state.isoCode} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedState}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          selectedState ? "Select City" : "Select State First"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2 mt-6">
              <Label className="text-sm">Venue Details</Label>

              <Input
                {...register("venue")}
                placeholder="Venue Link (Google Maps Link)"
                type="url"
              />
              {errors.venue && (
                <p className="text-red-400 text-sm">{errors.venue.message}</p>
              )}

              <Input
                {...register("address")}
                placeholder="Full Address / Street / Building (Optional)"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>

            <Textarea
              {...register("description")}
              placeholder="Tell people about your event..."
              rows={4}
            />

            {errors.description && (
              <p className="text-red-400 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* TICKETING */}
          <div className="space-y-3">
            <Label className="text-sm">Tickets</Label>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="free"
                  {...register("ticketType")}
                  defaultChecked
                />
                Free
              </label>

              <label className="flex items-center gap-2">
                <input type="radio" value="paid" {...register("ticketType")} />
                Paid
              </label>
            </div>

            {ticketType === "paid" && (
              <Input
                type="number"
                placeholder="Ticket Price ₹"
                {...register("ticketPrice", { valueAsNumber: true })}
              />
            )}
          </div>

          {/* CAPACITY */}
          <div className="space-y-2">
            <Label className="text-sm">Capacity</Label>

            <Input
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              placeholder="Ex: 100"
            />

            {errors.capacity && (
              <p className="text-red-400 text-sm">{errors.capacity.message}</p>
            )}
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full text-lg rounded-xl py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </form>
      </div>

      {/* UNSPLASH IMAGE PICKER MODAL */}
      {showImagePicker && (
        <UnsplashImagePicker
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={(url) => {
            setValue("coverImage", url);
            setShowImagePicker(false);
          }}
        />
      )}

      {/* UPGRADE MODAL */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={upgradeReason}
      />
    </div>
  );
}
