"use client";

import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { Building, Crown, Plus, Ticket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useStoreUser } from "@/hooks/useStoreUser";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import SearchLocationBar from "./SearchLocationBar";
import OnboardingModal from "./OnboardingModal";
import UpgradeModal from "./UpgradeModal";

export default function Header() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { isLoading } = useStoreUser();
  const { showOnboarding, handleOnboardingComplete, handleOnboardingSkip } =
    useOnboarding();

  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro_user" });

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 border-b backdrop-blur-xl z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/spott.png"
              alt="Spott Logo"
              width={500}
              height={500}
              className="w-full h-11"
              priority
            />

            {hasPro && (
              <Badge className="bg-linear-to-r from-pink-500 to-orange-500 text-white gap-1 ml-3">
                <Crown className="w-3 h-3" />
                Pro
              </Badge>
            )}
          </Link>

          {/* SEARCH & LOCATION (DESKTOP) */}
          <div className="hidden md:flex flex-1 justify-center">
            <SearchLocationBar />
          </div>

          {/* PRICING & EXPLORE & SIGNIN */}
          <div className="flex items-center">
            {!hasPro && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowUpgradeModal(true)}
              >
                Pricing
              </Button>
            )}

            <Button size="sm" variant="ghost" className="mr-2" asChild>
              <Link href="/explore">Explore</Link>
            </Button>

            <Authenticated>
              <Button size="sm" className="flex gap-2 mr-4" asChild>
                <Link href="/create-event">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Event</span>
                </Link>
              </Button>

              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Tickets"
                    labelIcon={<Ticket size={16} />}
                    href="/my-tickets"
                  />

                  <UserButton.Link
                    label="My Events"
                    labelIcon={<Building size={16} />}
                    href="/my-events"
                  />

                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </Authenticated>

            <Unauthenticated>
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>

        {/* SEARCH & LOCATION (MOBILE) */}
        <div className="md:hidden border-t p-3">
          <SearchLocationBar />
        </div>

        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width="100%" color="#a855f7" />
          </div>
        )}
      </nav>

      {/* MODALS */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingSkip}
        onComplete={handleOnboardingComplete}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="header"
      />
    </>
  );
}
