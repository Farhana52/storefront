// Store synchronization manager across devices (mobile, laptop, tabs)
import { UserAccount } from "@/types";

const CART_STORAGE_KEY = "aura_cart";
const WISHLIST_STORAGE_KEY = "aura_wishlist";
const USER_STORAGE_KEY = "aura_user";

let lastSeenVersion = 0;
let isSyncing = false;

// Get current logged-in user identifier
export function getActiveUser(): UserAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Authenticate user with email or phone number and restore their cart/wishlist
export async function syncAuthUser(
  identifier: string,
  name?: string
): Promise<{ user: UserAccount; cart: unknown[]; wishlist: unknown[] } | null> {
  if (typeof window === "undefined") return null;
  try {
    const localCartRaw = localStorage.getItem(CART_STORAGE_KEY);
    const localWishlistRaw = localStorage.getItem(WISHLIST_STORAGE_KEY);

    const localCart = localCartRaw ? JSON.parse(localCartRaw) : [];
    const localWishlist = localWishlistRaw ? JSON.parse(localWishlistRaw) : [];

    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "auth",
        identifier: identifier.trim(),
        name: name?.trim(),
        cart: localCart,
        wishlist: localWishlist,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      if (Array.isArray(data.cart)) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data.cart));
      }
      if (Array.isArray(data.wishlist)) {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(data.wishlist));
      }
      if (typeof data.version === "number") {
        lastSeenVersion = data.version;
      }

      window.dispatchEvent(new Event("auth_change"));
      window.dispatchEvent(new Event("cart_change"));
      window.dispatchEvent(new Event("wishlist_change"));
      return data;
    }
  } catch {
    // Network errors fail gracefully
  }
  return null;
}

// Clear user session on logout
export function logoutUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_STORAGE_KEY);
  lastSeenVersion = 0;
  window.dispatchEvent(new Event("auth_change"));
}

// Send local cart change to server
export async function pushCartSync(cart: unknown[]) {
  if (typeof window === "undefined") return;
  const user = getActiveUser();
  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart,
        user: user?.identifier,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.version === "number") {
        lastSeenVersion = data.version;
      }
    }
  } catch {
    // Network errors fail silently
  }
}

// Send local wishlist change to server
export async function pushWishlistSync(wishlist: unknown[]) {
  if (typeof window === "undefined") return;
  const user = getActiveUser();
  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wishlist,
        user: user?.identifier,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.version === "number") {
        lastSeenVersion = data.version;
      }
    }
  } catch {
    // Network errors fail silently
  }
}

// Pull latest changes from server and synchronize local storage
export async function pullSync() {
  if (isSyncing || typeof window === "undefined") return;
  try {
    isSyncing = true;
    const user = getActiveUser();
    const endpoint = user?.identifier
      ? `/api/sync?user=${encodeURIComponent(user.identifier)}`
      : "/api/sync";

    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) return;

    const data = await res.json();
    const serverVersion = data.version || 1;

    // If server has newer changes, update local state
    if (serverVersion > lastSeenVersion) {
      lastSeenVersion = serverVersion;

      if (Array.isArray(data.cart)) {
        const localCartRaw = localStorage.getItem(CART_STORAGE_KEY);
        const serverCartRaw = JSON.stringify(data.cart);
        if (localCartRaw !== serverCartRaw) {
          localStorage.setItem(CART_STORAGE_KEY, serverCartRaw);
          window.dispatchEvent(new Event("cart_change"));
        }
      }

      if (Array.isArray(data.wishlist)) {
        const localWishlistRaw = localStorage.getItem(WISHLIST_STORAGE_KEY);
        const serverWishlistRaw = JSON.stringify(data.wishlist);
        if (localWishlistRaw !== serverWishlistRaw) {
          localStorage.setItem(WISHLIST_STORAGE_KEY, serverWishlistRaw);
          window.dispatchEvent(new Event("wishlist_change"));
        }
      }
    } else if (lastSeenVersion === 0) {
      // First handshake on client boot
      lastSeenVersion = serverVersion;
      const localCart = localStorage.getItem(CART_STORAGE_KEY);
      const localWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);

      const parsedLocalCart = localCart ? JSON.parse(localCart) : [];
      const parsedLocalWishlist = localWishlist ? JSON.parse(localWishlist) : [];

      if (data.cart?.length === 0 && parsedLocalCart.length > 0) {
        pushCartSync(parsedLocalCart);
      } else if (data.cart?.length > 0 && parsedLocalCart.length === 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data.cart));
        window.dispatchEvent(new Event("cart_change"));
      }

      if (data.wishlist?.length === 0 && parsedLocalWishlist.length > 0) {
        pushWishlistSync(parsedLocalWishlist);
      } else if (data.wishlist?.length > 0 && parsedLocalWishlist.length === 0) {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(data.wishlist));
        window.dispatchEvent(new Event("wishlist_change"));
      }
    }
  } catch {
    // Network errors fail silently
  } finally {
    isSyncing = false;
  }
}
