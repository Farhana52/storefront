import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

interface UserRecord {
  id: string;
  name: string;
  identifier: string;
  email?: string;
  phone?: string;
  cart: unknown[];
  wishlist: unknown[];
  version: number;
}

interface SyncState {
  cart: unknown[];
  wishlist: unknown[];
  version: number;
  users: Record<string, UserRecord>;
}

const SYNC_FILE = path.join(process.cwd(), ".sync-store.json");

// Read saved state from local disk on cold start
function readStore(): SyncState {
  try {
    if (fs.existsSync(SYNC_FILE)) {
      const data = fs.readFileSync(SYNC_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return {
        cart: Array.isArray(parsed.cart) ? parsed.cart : [],
        wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
        version: typeof parsed.version === "number" ? parsed.version : 1,
        users: parsed.users && typeof parsed.users === "object" ? parsed.users : {},
      };
    }
  } catch {
    // Fall back to empty store
  }
  return { cart: [], wishlist: [], version: 1, users: {} };
}

// Persist state to local disk
function writeStore(state: SyncState) {
  try {
    fs.writeFileSync(SYNC_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch {
    // Disk write error ignored
  }
}

// In-memory store shared across all active client connections
const memoryStore: SyncState = readStore();

// Sanitize identifier (lowercase email or digits-only phone)
function cleanIdentifier(idStr: string): string {
  const str = idStr.trim();
  if (str.includes("@")) {
    return str.toLowerCase();
  }
  return str.replace(/[^0-9+]/g, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userParam = searchParams.get("user");

  // User-specific store
  if (userParam) {
    const key = cleanIdentifier(userParam);
    if (!memoryStore.users[key]) {
      const isEmail = key.includes("@");
      memoryStore.users[key] = {
        id: `usr-${Date.now().toString(36)}`,
        name: isEmail ? key.split("@")[0] : "Patron",
        identifier: key,
        email: isEmail ? key : undefined,
        phone: !isEmail ? key : undefined,
        cart: [],
        wishlist: [],
        version: 1,
      };
      writeStore(memoryStore);
    }
    return NextResponse.json(memoryStore.users[key], {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  }

  // Fallback global session
  return NextResponse.json(
    {
      cart: memoryStore.cart,
      wishlist: memoryStore.wishlist,
      version: memoryStore.version,
    },
    {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userIdentifier = body.user ? cleanIdentifier(body.user) : null;

    // 1. Authentication Handshake (Login / Register)
    if (body.action === "auth" && body.identifier) {
      const key = cleanIdentifier(body.identifier);
      const isEmail = key.includes("@");
      let record = memoryStore.users[key];

      if (!record) {
        // Create user
        record = {
          id: `usr-${Date.now().toString(36)}`,
          name: body.name && body.name.trim() ? body.name.trim() : (isEmail ? key.split("@")[0] : "Patron"),
          identifier: key,
          email: isEmail ? key : undefined,
          phone: !isEmail ? key : undefined,
          cart: Array.isArray(body.cart) ? body.cart : [],
          wishlist: Array.isArray(body.wishlist) ? body.wishlist : [],
          version: 1,
        };
        memoryStore.users[key] = record;
      } else {
        // Update name if provided
        if (body.name && body.name.trim()) {
          record.name = body.name.trim();
        }
        // Merge guest cart/wishlist into user cart if server has empty
        if (record.cart.length === 0 && Array.isArray(body.cart) && body.cart.length > 0) {
          record.cart = body.cart;
          record.version += 1;
        }
        if (record.wishlist.length === 0 && Array.isArray(body.wishlist) && body.wishlist.length > 0) {
          record.wishlist = body.wishlist;
          record.version += 1;
        }
      }

      writeStore(memoryStore);
      return NextResponse.json({
        user: {
          id: record.id,
          name: record.name,
          identifier: record.identifier,
          email: record.email,
          phone: record.phone,
          isLoggedIn: true,
        },
        cart: record.cart,
        wishlist: record.wishlist,
        version: record.version,
      });
    }

    // 2. User-specific cart/wishlist sync
    if (userIdentifier) {
      const record = memoryStore.users[userIdentifier];
      if (record) {
        let changed = false;
        if (Array.isArray(body.cart)) {
          record.cart = body.cart;
          changed = true;
        }
        if (Array.isArray(body.wishlist)) {
          record.wishlist = body.wishlist;
          changed = true;
        }
        if (changed) {
          record.version += 1;
          writeStore(memoryStore);
        }
        return NextResponse.json(record);
      }
    }

    // 3. Fallback global store sync
    let changed = false;
    if (Array.isArray(body.cart)) {
      memoryStore.cart = body.cart;
      changed = true;
    }
    if (Array.isArray(body.wishlist)) {
      memoryStore.wishlist = body.wishlist;
      changed = true;
    }
    if (changed) {
      memoryStore.version += 1;
      writeStore(memoryStore);
    }

    return NextResponse.json({
      cart: memoryStore.cart,
      wishlist: memoryStore.wishlist,
      version: memoryStore.version,
    });
  } catch {
    return NextResponse.json({ error: "Invalid sync payload" }, { status: 400 });
  }
}
