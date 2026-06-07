"use client";

import { useMemo, useState } from "react";
import { City, State } from "country-state-city";
import { ArrowLeft, ArrowRight, Heart, MapPin } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/useConvexMutation";
import { CATEGORIES } from "@/lib/data";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "India",
  });

  const progress = (step / 2) * 100;

  const { isLoading, mutate: completeOnboarding } = useConvexMutation(
    api.users.completeOnboarding,
  );

  const indianStates = State.getStatesOfCountry("IN");

  const cities = useMemo(() => {
    if (!location.state) return [];

    const selectedState = indianStates.find(
      (state) => state.name === location.state,
    );

    if (!selectedState) return [];

    return City.getCitiesOfState("IN", selectedState.isoCode);
  }, [location.state, indianStates]);

  function handleToggleInterest(categoryId) {
    setSelectedInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  }

  async function handleOnboardingComplete() {
    try {
      await completeOnboarding({
        interests: selectedInterests,
        location: {
          city: location.city,
          state: location.state,
          country: location.country,
        },
      });

      toast.success("Welcome to Spott 🎉");
      onComplete();
    } catch (error) {
      toast.error("Failed to Complete Onboarding");
      console.error(error);
    }
  }

  function handleNextStep() {
    if (step == 1 && selectedInterests.length < 3) {
      toast.error("Please select at least 3 interests");
      return;
    }
    if (step === 2 && (!location.city || !location.state)) {
      toast.error("Please select both city and state");
      return;
    }
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleOnboardingComplete();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-4">
            <Progress value={progress} className="h-1" />
          </div>

          <DialogTitle className="text-2xl flex items-center gap-2">
            {step === 1 ? (
              <>
                <Heart className="w-6 h-6 text-purple-500" />
                What interests you?
              </>
            ) : (
              <>
                <MapPin className="w-6 h-6 text-purple-500" />
                Where are you located?
              </>
            )}
          </DialogTitle>

          <DialogDescription>
            {step == 1
              ? "Select at least 3 categories to personalize your experience"
              : "We'll show you events happening near you"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className={`border-2 rounded-lg transition-all p-4 hover:scale-105 ${
                      selectedInterests.includes(category.id)
                        ? "bg-purple-500/10 border-purple-500 shadow-purple-500/20 shadow-lg"
                        : "border-border hover:border-purple-300"
                    }`}
                    onClick={() => handleToggleInterest(category.id)}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedInterests.length >= 3 ? "default" : "secondary"
                  }
                >
                  {selectedInterests.length} Selected
                </Badge>

                {selectedInterests.length >= 3 && (
                  <span className="text-sm text-green-500">
                    ✓ Ready to Continue
                  </span>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>

                  <Select
                    value={location.state}
                    onValueChange={(value) => {
                      setLocation({ ...location, state: value, city: "" });
                    }}
                  >
                    <SelectTrigger id="state" className="w-full h-11">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>

                  <Select
                    value={location.city}
                    onValueChange={(value) => {
                      setLocation({ ...location, city: value });
                    }}
                    disabled={!location.state}
                  >
                    <SelectTrigger id="city" className="w-full h-11">
                      <SelectValue
                        placeholder={
                          location.state ? "Select City" : "Select State First"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {cities.length > 0 ? (
                        cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-cities" disabled>
                          No Cities Available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {location.state && location.city && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-500 mt-0.5" />

                    <div>
                      <p className="font-medium">Your Location</p>
                      <p className="text-muted-foreground text-sm">
                        {location.city}, {location.state}, {location.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}

          <Button
            className="flex-1 gap-2"
            onClick={handleNextStep}
            disabled={isLoading}
          >
            {isLoading
              ? "Completing..."
              : step === 2
                ? "Complete Setup"
                : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
