"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Truck, ShieldCheck } from "lucide-react";
import { CustomerOrder } from "../types";

interface TrackingModalProps {
  order: CustomerOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  order,
  open,
  onOpenChange,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              Live Atelier Logistics
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {order.courier}
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-zinc-950 dark:text-white mt-1">
            Tracking Consignment #{order.trackingNumber}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 font-mono">
            Associated with Order #{order.orderNumber} · Estimated Delivery:{" "}
            <span className="text-zinc-900 dark:text-zinc-200 font-semibold">
              {order.estimatedDelivery}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Vertical Delivery Timeline */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
            {order.trackingSteps.map((step, idx) => {
              const isCompleted = step.completed;
              const isCurrent = step.current;

              return (
                <div key={idx} className="relative group">
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-950 ${
                      isCompleted
                        ? isCurrent
                          ? "bg-amber-500 text-white animate-pulse"
                          : "bg-emerald-600 text-white"
                        : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          isCompleted
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-400 dark:text-zinc-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <span className="text-[11px] font-mono tabular-nums text-zinc-400">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Destination card */}
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-1">
            <p className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              Delivery Destination
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 font-mono">
              {order.shippingAddress}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close Tracking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
