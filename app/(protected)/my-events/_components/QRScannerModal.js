"use client";

import { useEffect, useState } from "react";
import { Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/useConvexMutation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function QRScannerModal({ isOpen, onClose }) {
  const [scannerReady, setScannerReady] = useState(false);
  const [error, setError] = useState(null);

  const { mutate: checkInAttendee } = useConvexMutation(
    api.registrations.checkInAttendee,
  );

  async function handleCheckIn(qrCode) {
    try {
      const result = await checkInAttendee({ qrCode });

      if (result.success) {
        toast.success("Attendee Checked In Successfully");
        onClose();
      } else {
        toast.error(result.message || "Check In Failed");
      }
    } catch (error) {
      toast.error(error.message || "Invalid QR Code");
    }
  }

  useEffect(() => {
    let scanner = null;
    let mounted = true;

    const initScanner = async () => {
      if (!isOpen) return;

      try {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          console.log("Camera Permission Granted");
        } catch (permError) {
          console.error("Camera Permission Denied:", permError);
          setError("Camera Permission Denied. Please Enable Camera Access.");
          return;
        }

        const { Html5QrcodeScanner } = await import("html5-qrcode");

        if (!mounted) return;

        console.log("Creating Scanner Instance...");

        scanner = new Html5QrcodeScanner("qr-reader", {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          videoConstraints: { facingMode: "environment" },
        });

        const onScanSuccess = (decodedText) => {
          console.log("QR Code Detected:", decodedText);
          if (scanner) {
            scanner.clear().catch(console.error);
          }
          handleCheckIn(decodedText);
        };

        const onScanError = (error) => {
          if (error && !error.includes("NotFoundException")) {
            console.debug("Scan Error:", error);
          }
        };

        scanner.render(onScanSuccess, onScanError);
        setScannerReady(true);
        setError(null);
        console.log("Scanner Rendered Successfully");
      } catch (error) {
        console.error("Failed to Initialize Scanner:", error);
        setError(`Failed to Start Camera: ${error.message}`);
        toast.error("Camera Failed. Please Use Manual Entry.");
      }
    };

    initScanner();

    return () => {
      mounted = false;
      if (scanner) {
        console.log("Cleaning Up Scanner...");
        scanner.clear().catch(console.error);
      }
      setScannerReady(false);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-500" />
            Check In Attendee
          </DialogTitle>

          <DialogDescription>
            Scan QR Code or Enter Ticket ID Manually
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <>
            <div
              id="qr-reader"
              className="w-full"
              style={{ minHeight: "350px" }}
            ></div>

            {!scannerReady && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                <span className="text-muted-foreground text-sm ml-2">
                  Starting Camera...
                </span>
              </div>
            )}

            <p className="text-muted-foreground text-sm text-center">
              {scannerReady
                ? "Position the QR Code within the frame"
                : "Please allow the camera access when prompted"}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
