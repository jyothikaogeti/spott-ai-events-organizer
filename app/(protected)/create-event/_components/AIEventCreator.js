"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AIEventCreator({ onEventGenerated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function generateEvent() {
    if (!prompt.trim()) {
      toast.error("Please describe your event");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-event", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503) {
          toast.error(
            "AI is currently busy. Please try again in a few moments.",
          );
        } else if (response.status === 429) {
          toast.error("AI usage limit reached. Please try again later.");
        } else {
          toast.error("Failed to generate event");
        }
        return;
      }

      onEventGenerated(data);

      toast.success("Event Details Generated. Review and Customize Below.");

      setIsOpen(false);
      setPrompt("");
    } catch (error) {
      toast.error("Failed to Generate Event. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Event Creator
          </DialogTitle>

          <DialogDescription>
            Describe your event idea and let AI create the details for you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={prompt}
            placeholder="Example: A tech meetup about React 19 for developers in Bangalore. It should cover new features like Actions and use hook improvements..."
            className="resize-none"
            rows={6}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="flex-1 gap-2"
              onClick={generateEvent}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
