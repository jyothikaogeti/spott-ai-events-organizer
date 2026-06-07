"use client";

import { PricingTable } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function UpgradeModal({ isOpen, onClose, trigger = "limit" }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <DialogTitle className="text-2xl">Upgrade to Pro</DialogTitle>
          </div>

          <DialogDescription>
            {trigger === "header" && "Create Unlimited Events with Pro."}
            {trigger === "limit" && "You've reached your free event limit."}
            {trigger === "color" && "Custom Theme Colors are a Pro Feature."}
            Unlock Unlimited Events and Premium Features.
          </DialogDescription>
        </DialogHeader>

        <PricingTable
          checkoutProps={{
            appearance: {
              elements: {
                drawerRoot: {
                  zIndex: 10000,
                },
              },
            },
          }}
        />

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
