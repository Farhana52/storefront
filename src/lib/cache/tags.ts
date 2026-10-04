// Centralized cache tag registry for Next.js App Router
// Ensures consistent revalidation across mutations

export const CACHE_TAGS = {
  // Collections
  products: "products",
  categories: "categories",
  orders: "orders",
  coupons: "coupons",
  cms: "cms-settings",
  addresses: "addresses",

  // Entity factories
  product: (id: string) => `product:${id}`,
  order: (id: string) => `order:${id}`,
  userAddresses: (userId: string) => `addresses:${userId}`,
} as const;
