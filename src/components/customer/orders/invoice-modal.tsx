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
import { Printer, X } from "lucide-react";
import { CustomerOrder } from "../types";

interface InvoiceModalProps {
  order: CustomerOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  open,
  onOpenChange,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-row items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
              Official Tax Invoice
            </span>
            <DialogTitle className="text-xl font-bold text-zinc-950 dark:text-white mt-0.5">
              Invoice #{order.orderNumber}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 font-mono">
              Issued on {order.date} · Inspire Lifestyle Dhaka Atelier
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Letterhead & Details */}
        <div id="printable-invoice" className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto print:max-h-none print:p-0">
          {/* Atelier Brand Header */}
          <div className="flex items-start justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-6">
            <div>
              <p className="text-lg font-bold tracking-widest text-zinc-950 dark:text-white uppercase">
                Inspire Lifestyle
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Dhaka Flagship Atelier · Gulshan-2, Dhaka
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                BIN: 004819273-0101 · Tax Reg: 82910-DH
              </p>
            </div>

            <div className="text-right font-mono text-xs space-y-1">
              <p className="text-zinc-500">Order ID: <span className="font-semibold text-zinc-900 dark:text-white">{order.orderNumber}</span></p>
              <p className="text-zinc-500">Payment: <span className="text-emerald-600 font-semibold">{order.paymentStatus}</span></p>
              <p className="text-zinc-500">Method: <span className="text-zinc-700 dark:text-zinc-300">{order.paymentMethod}</span></p>
            </div>
          </div>

          {/* Delivery & Patron Address */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                Billed / Shipped To
              </p>
              <p className="font-bold text-zinc-900 dark:text-white mt-1">
                Farhana Nasrin
              </p>
              <p className="text-zinc-500 leading-relaxed mt-0.5">
                {order.shippingAddress}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                Consignment Details
              </p>
              <p className="font-semibold text-zinc-900 dark:text-white mt-1">
                {order.courier}
              </p>
              <p className="text-zinc-500">Tracking: {order.trackingNumber}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="p-3">Sartorial Piece</th>
                  <th scope="col" className="p-3">Variation</th>
                  <th scope="col" className="p-3 text-center">Qty</th>
                  <th scope="col" className="p-3 text-right">Unit Price</th>
                  <th scope="col" className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-mono">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="p-3">
                      <p className="font-bold text-zinc-900 dark:text-white text-xs">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-zinc-400">{item.sku}</p>
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-300">
                      {item.size} · {item.color}
                    </td>
                    <td className="p-3 text-center tabular-nums">{item.quantity}</td>
                    <td className="p-3 text-right tabular-nums">৳{item.price.toLocaleString()}</td>
                    <td className="p-3 text-right font-semibold text-zinc-900 dark:text-white tabular-nums">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="tabular-nums">৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>VIP Patron Courtesy</span>
                  <span className="tabular-nums">-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Concierge Delivery</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Complimentary
                </span>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between text-sm font-bold text-zinc-950 dark:text-white">
                <span>Grand Total</span>
                <span className="tabular-nums">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Atelier Warranty & Notice */}
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 text-center text-[10px] text-zinc-400 leading-relaxed font-sans">
            Thank you for being a valued patron of Inspire Lifestyle. Every piece is handcrafted with archival quality materials.
            For concierge exchanges or private salon fittings, contact +880 1711-234567.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
