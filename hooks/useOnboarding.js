/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "./useConvexQuery";

const ATTENDEE_PAGES = ["/explore", "/events", "/my-tickets"];

export function useOnboarding() {
  const pathname = usePathname();
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isLoading, data: currentUser } = useConvexQuery(
    api.users.getCurrentUser,
  );

  useEffect(() => {
    if (isLoading || !currentUser) return;

    if (!currentUser.hasCompletedOnboarding) {
      const requiresOnboarding = ATTENDEE_PAGES.some((page) =>
        pathname.startsWith(page),
      );

      if (requiresOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [isLoading, currentUser, pathname]);

  function handleOnboardingComplete() {
    setShowOnboarding(false);
    router.refresh();
  }

  function handleOnboardingSkip() {
    setShowOnboarding(false);
    router.push("/");
  }

  return {
    showOnboarding,
    setShowOnboarding,
    handleOnboardingComplete,
    handleOnboardingSkip,
    needsOnboarding: currentUser && !currentUser.hasCompletedOnboarding,
  };
}
