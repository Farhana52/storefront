export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  href: string;
  image: string;
  alt: string;
  active: boolean;
}

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  linkText: string;
  linkHref: string;
}

export interface FooterConfig {
  brandName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  copyright: string;
}

export interface CouponConfig {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  active: boolean;
  minSpend?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  itemCount?: number;
  featured?: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  productTitle: string;
  authorName: string;
  authorEmail?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  createdAt: string;
  status: "approved" | "pending" | "hidden";
  verifiedPurchase: boolean;
}

export interface VariationSize {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
}

export interface VariationColor {
  id: string;
  name: string;
  hex: string;
  description?: string;
  active: boolean;
}
