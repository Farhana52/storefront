// Navigation link definition
export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

// Comprehensive product model for UI showcase & detail pages
export interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  tag?: string;
  rating: number;
  inStock: boolean;
  sizes?: string[];
  gallery?: string[];
  colors?: ProductColor[];
  fullDescription?: string;
  specifications?: Record<string, string>;
  reviewsCount?: number;
  reviews?: ProductReview[];
}



// Cart item state for frontend preview
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// Theme mode
export type ThemeMode = "light" | "dark";

// Checkout types
export type DeliveryMethodId = "standard" | "express" | "concierge";

export interface DeliveryOption {
  id: DeliveryMethodId;
  name: string;
  timeEstimate: string;
  price: number;
  description: string;
}

export type PaymentMethodId = "card" | "cod" | "mobile";

export interface CheckoutFormData {
  email: string;
  phone: string;
  subscribeNews: boolean;
  fullName: string;
  country: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  stateProvince?: string;
  postalCode: string;
  saveAddress: boolean;
  sameBillingAddress: boolean;
  deliveryMethod: DeliveryMethodId;
  paymentMethod: PaymentMethodId;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  mobileProvider?: "bkash" | "nagad" | "applepay" | "googlepay";
  mobileWalletNumber?: string;
}

// Authentication types
export type AuthMode = "login" | "register" | "forgot";

export interface UserAccount {
  id: string;
  name: string;
  identifier: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isLoggedIn: boolean;
}
