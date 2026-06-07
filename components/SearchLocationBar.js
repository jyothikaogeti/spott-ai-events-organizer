/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { City, State } from "country-state-city";
import { Calendar, Loader2, MapPin, Search } from "lucide-react";
import { format } from "date-fns";
import debounce from "lodash.debounce";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { useConvexMutation } from "@/hooks/useConvexMutation";
import { createLocationSlug } from "@/lib/helper";
import { getCategoryIcon } from "@/lib/data";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function SearchLocationBar() {
  const router = useRouter();
  const searchRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { isLoading, data: currentUser } = useConvexQuery(
    api.users.getCurrentUser,
  );

  const { mutate: updateLocation } = useConvexMutation(
    api.users.completeOnboarding,
  );

  const { isLoading: searchLoading, data: searchResults } = useConvexQuery(
    api.search.searchEvents,
    searchQuery.trim().length >= 2 ? { query: searchQuery, limit: 5 } : "skip",
  );

  const indianStates = State.getStatesOfCountry("IN");

  const cities = useMemo(() => {
    if (!selectedState) return [];

    const state = indianStates.find((state) => state.name === selectedState);

    if (!state) return [];

    return City.getCitiesOfState("IN", state.isoCode);
  }, [selectedState, indianStates]);

  useEffect(() => {
    if (currentUser?.location) {
      setSelectedState(currentUser.location.state || "");
      setSelectedCity(currentUser.location.city || "");
    }
  }, [isLoading, currentUser]);

  const debouncedSetQuery = useRef(
    debounce((value) => setSearchQuery(value), 300),
  ).current;

  function handleSearchInput(e) {
    const value = e.target.value;
    debouncedSetQuery(value);
    setShowSearchResults(value.length >= 2);
  }

  function handleEventClick(slug) {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(`/events/${slug}`);
  }

  async function handleLocationSelect(city, state) {
    try {
      if (currentUser?.interests && currentUser?.location) {
        await updateLocation({
          interests: currentUser.interests,
          location: { city, state, country: "India" },
        });
      }

      const slug = createLocationSlug(city, state);
      router.push(`/explore/${slug}`);
    } catch (error) {
      console.error("Failed to Update Location", error);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center">
      <div className="relative flex w-full" ref={searchRef}>
        <div className="flex-1">
          <Search className="w-4 h-4 absolute top-1/2 left-3 text-muted-foreground transform -translate-y-1/2" />
          <Input
            type="input"
            className="w-full rounded-none rounded-l-md h-9 pl-10"
            placeholder="Search Events..."
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={() => {
              if (searchQuery.length >= 2) setShowSearchResults(true);
            }}
          />
        </div>

        {showSearchResults && (
          <div className="absolute top-full w-96 bg-background border rounded-lg shadow-lg overflow-y-auto max-h-100 z-50 mt-2">
            {searchLoading ? (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="py-2">
                <p className="text-muted-foreground text-xs font-semibold px-4 py-2">
                  SEARCH RESULTS
                </p>

                {searchResults.map((event) => (
                  <button
                    key={event._id}
                    className="w-full hover:bg-muted/50 text-left transition-colors px-4 py-3"
                    onClick={() => handleEventClick(event.slug)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-0.5">
                        {getCategoryIcon(event.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1 mb-1">
                          {event.title}
                        </p>

                        <div className="text-muted-foreground text-xs flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(event.startDate, "MMM dd")}
                          </span>

                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.city}
                          </span>
                        </div>
                      </div>

                      {event.ticketType === "free" && (
                        <Badge variant="secondary" className="text-xs">
                          Free
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <Select
        value={selectedState}
        onValueChange={(value) => {
          setSelectedState(value);
          setSelectedCity("");
        }}
      >
        <SelectTrigger className="border-l-0 rounded-none w-32 h-9">
          <SelectValue placeholder="State" />
        </SelectTrigger>

        <SelectContent>
          {indianStates.map((state) => (
            <SelectItem key={state.isoCode} value={state.name}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedCity}
        onValueChange={(value) => {
          setSelectedCity(value);
          if (value && selectedState) {
            handleLocationSelect(value, selectedState);
          }
        }}
        disabled={!selectedState}
      >
        <SelectTrigger className="rounded-none rounded-r-md w-32 h-9">
          <SelectValue placeholder="City" />
        </SelectTrigger>

        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.name} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
