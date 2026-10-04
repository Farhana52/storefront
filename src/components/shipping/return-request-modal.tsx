"use client";

import React, { useState, useEffect } from "react";
import { CloseIcon, CheckIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { useAuth } from "@/context/auth-context";

export const ReturnRequestButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const [orderNumber, setOrderNumber] = useState("");
  const [identifier, setIdentifier] = useState(user?.identifier || "");
  const [reason, setReason] = useState("size_exchange");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const handleOpen = () => {
    if (!identifier && user?.identifier) {
      setIdentifier(user.identifier);
    }
    setIsOpen(true);
  };

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `RET-${Math.floor(10000 + Math.random() * 90000)}`;
      setReferenceId(generatedId);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setOrderNumber("");
    setNotes("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Primary Return Button */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
      >
        <ShieldCheckIcon size={16} />
        <span>Start a Return or Exchange</span>
      </button>

      {/* Return Request Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="return-modal-title"
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3
                  id="return-modal-title"
                  className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white"
                >
                  Initiate Return or Exchange
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Complimentary doorstep pickup within 30 days
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close dialog"
                className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Content: Form or Success */}
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Order Number */}
                <div className="space-y-1">
                  <label
                    htmlFor="return-order-number"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Order Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="return-order-number"
                    type="text"
                    required
                    placeholder="e.g. AUR-89210"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs sm:text-sm focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Contact Email or Phone */}
                <div className="space-y-1">
                  <label
                    htmlFor="return-contact"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Email or Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="return-contact"
                    type="text"
                    required
                    placeholder="name@example.com or 017XXXXXXXX"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs sm:text-sm focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Reason for Return */}
                <div className="space-y-1">
                  <label
                    htmlFor="return-reason"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Reason for Return / Exchange
                  </label>
                  <select
                    id="return-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs sm:text-sm focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="size_exchange">Size Exchange (Complimentary)</option>
                    <option value="color_style">Color or Style Preference</option>
                    <option value="defective">Item Damaged or Defective</option>
                    <option value="not_expected">Not as Expected</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1">
                  <label
                    htmlFor="return-notes"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="return-notes"
                    rows={2}
                    placeholder="Specify exchange size or details..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:border-zinc-950 dark:focus:border-white focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                >
                  {isSubmitting ? "Processing..." : "Schedule Free Doorstep Pickup"}
                </button>
              </form>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckIcon size={24} />
                </div>

                <div>
                  <h4 className="text-base font-bold text-zinc-950 dark:text-white">
                    Return Request Confirmed!
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Your reference number is{" "}
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">
                      #{referenceId}
                    </span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400">
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    What happens next:
                  </p>
                  <p>• Our courier will arrive at your address within 24–48 hours.</p>
                  <p>• A pre-paid digital return label has been emailed/sent to your contact.</p>
                  <p>• Instant size exchange or full refund will process upon pickup.</p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
