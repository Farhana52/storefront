import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "./tags";

// Centralized cache invalidation helpers

export function revalidateProducts() {
  revalidateTag(CACHE_TAGS.products, "default");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export function revalidateProduct(id: string) {
  revalidateTag(CACHE_TAGS.product(id), "default");
  revalidatePath(`/product/${id}`);
  revalidateProducts();
}

export function revalidateCategories() {
  revalidateTag(CACHE_TAGS.categories, "default");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export function revalidateOrders() {
  revalidateTag(CACHE_TAGS.orders, "default");
  revalidatePath("/account/orders");
  revalidatePath("/admin/orders");
}

export function revalidateOrder(id: string) {
  revalidateTag(CACHE_TAGS.order(id), "default");
  revalidateOrders();
}

export function revalidateCMS() {
  revalidateTag(CACHE_TAGS.cms, "default");
  revalidatePath("/");
  revalidatePath("/admin/content");
}

export function revalidateCoupons() {
  revalidateTag(CACHE_TAGS.coupons, "default");
  revalidatePath("/checkout");
  revalidatePath("/admin/marketing/coupons");
}

export function revalidateUserAddresses(userId: string) {
  revalidateTag(CACHE_TAGS.userAddresses(userId), "default");
  revalidatePath("/account/addresses");
}
