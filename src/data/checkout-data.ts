import { DeliveryOption } from "@/types";

// Supported countries for global checkout
export const CHECKOUT_COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "BD", name: "Bangladesh" },
  { code: "CA", name: "Canada" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
  { code: "IT", name: "Italy" },
];

// Delivery shipping methods
export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "standard",
    name: "Standard Ground Delivery",
    timeEstimate: "2–3 Business Days",
    price: 80,
    description: "Doorstep tracked courier delivery inside Dhaka & nationwide.",
  },
  {
    id: "express",
    name: "Express Courier Service",
    timeEstimate: "24–48 Hours",
    price: 150,
    description: "Priority express courier with live tracking and doorstep dispatch.",
  },
  {
    id: "concierge",
    name: "White Glove Inspire Concierge",
    timeEstimate: "Same-Day Guaranteed",
    price: 250,
    description: "Dedicated personal hand-delivery in protective garment boxes.",
  },
];

// Accepted payment badges
export const ACCEPTED_PAYMENT_METHODS = [
  { id: "visa", label: "Visa", icon: "VISA" },
  { id: "mastercard", label: "Mastercard", icon: "MC" },
  { id: "amex", label: "Amex", icon: "AMEX" },
  { id: "applepay", label: "Apple Pay", icon: "Pay" },
  { id: "bkash", label: "bKash", icon: "bKash" },
  { id: "nagad", label: "Nagad", icon: "Nagad" },
];
