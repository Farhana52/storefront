import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Sanitize user identifier (email or phone)
function cleanIdentifier(idStr: string): string {
  const str = idStr.trim();
  if (str.includes("@")) {
    return str.toLowerCase();
  }
  return str.replace(/[^0-9+]/g, "");
}

// GET /api/sync - Retrieve state from Neon PostgreSQL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userParam = searchParams.get("user");

    if (userParam) {
      const key = cleanIdentifier(userParam);
      const isEmail = key.includes("@");

      // Find user in Neon DB
      let user = await prisma.user.findFirst({
        where: isEmail ? { email: key } : { phone: key },
        include: {
          cartItems: {
            include: { product: true },
          },
          wishlistItems: {
            include: { product: true },
          },
        },
      });

      if (!user) {
        // Automatically create account for customer
        user = await prisma.user.create({
          data: {
            name: isEmail ? key.split("@")[0] : "Patron",
            email: isEmail ? key : null,
            phone: !isEmail ? key : null,
            tier: "VIP Patron",
          },
          include: {
            cartItems: { include: { product: true } },
            wishlistItems: { include: { product: true } },
          },
        });
      }

      // Map cart items
      const cart = user.cartItems.map((ci) => ({
        product: ci.product,
        quantity: ci.quantity,
        selectedSize: ci.selectedSize || undefined,
        selectedColor: ci.selectedColor || undefined,
      }));

      // Map wishlist items
      const wishlist = user.wishlistItems.map((wi) => wi.product);

      return NextResponse.json({
        id: user.id,
        name: user.name,
        identifier: key,
        email: user.email,
        phone: user.phone,
        tier: user.tier,
        cart,
        wishlist,
        version: 1,
      });
    }

    // Unauthenticated guest fallback
    return NextResponse.json({
      cart: [],
      wishlist: [],
      version: 1,
    });
  } catch (error) {
    console.error("GET /api/sync error:", error);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}

// POST /api/sync - Synchronize cart/wishlist or authenticate with Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userIdentifier = body.user ? cleanIdentifier(body.user) : null;

    // 1. Authentication Handshake (Login / Register / Patron session)
    if (body.action === "auth" && body.identifier) {
      const key = cleanIdentifier(body.identifier);
      const isEmail = key.includes("@");

      let user = await prisma.user.findFirst({
        where: isEmail ? { email: key } : { phone: key },
        include: {
          cartItems: { include: { product: true } },
          wishlistItems: { include: { product: true } },
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: body.name && body.name.trim() ? body.name.trim() : (isEmail ? key.split("@")[0] : "Patron"),
            email: isEmail ? key : null,
            phone: !isEmail ? key : null,
            tier: "VIP Patron",
          },
          include: {
            cartItems: { include: { product: true } },
            wishlistItems: { include: { product: true } },
          },
        });
      } else if (body.name && body.name.trim() && user.name !== body.name.trim()) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name: body.name.trim() },
          include: {
            cartItems: { include: { product: true } },
            wishlistItems: { include: { product: true } },
          },
        });
      }

      // If user had empty cart on server but client has guest items, persist them to Neon DB
      if (user.cartItems.length === 0 && Array.isArray(body.cart) && body.cart.length > 0) {
        for (const item of body.cart) {
          const prodId = item.product?.id || item.productId;
          if (prodId) {
            // Verify product exists
            const exists = await prisma.product.findUnique({ where: { id: prodId } });
            if (exists) {
              await prisma.cartItem.create({
                data: {
                  userId: user.id,
                  productId: prodId,
                  quantity: item.quantity || 1,
                  selectedSize: item.selectedSize || null,
                  selectedColor: item.selectedColor || null,
                },
              });
            }
          }
        }
      }

      // Re-fetch user cart
      const updatedCartItems = await prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { product: true },
      });

      const updatedWishlistItems = await prisma.wishlistItem.findMany({
        where: { userId: user.id },
        include: { product: true },
      });

      const cart = updatedCartItems.map((ci) => ({
        product: ci.product,
        quantity: ci.quantity,
        selectedSize: ci.selectedSize || undefined,
        selectedColor: ci.selectedColor || undefined,
      }));

      const wishlist = updatedWishlistItems.map((wi) => wi.product);

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          identifier: key,
          email: user.email,
          phone: user.phone,
          tier: user.tier,
          isLoggedIn: true,
        },
        cart,
        wishlist,
        version: 1,
      });
    }

    // 2. User-specific cart/wishlist sync to Neon DB
    if (userIdentifier) {
      const isEmail = userIdentifier.includes("@");
      const user = await prisma.user.findFirst({
        where: isEmail ? { email: userIdentifier } : { phone: userIdentifier },
      });

      if (user) {
        // Sync cart if provided
        if (Array.isArray(body.cart)) {
          // Replace cart items in DB
          await prisma.cartItem.deleteMany({ where: { userId: user.id } });
          for (const item of body.cart) {
            const prodId = item.product?.id || item.productId;
            if (prodId) {
              const prod = await prisma.product.findUnique({ where: { id: prodId } });
              if (prod) {
                await prisma.cartItem.create({
                  data: {
                    userId: user.id,
                    productId: prodId,
                    quantity: item.quantity || 1,
                    selectedSize: item.selectedSize || null,
                    selectedColor: item.selectedColor || null,
                  },
                });
              }
            }
          }
        }

        // Sync wishlist if provided
        if (Array.isArray(body.wishlist)) {
          await prisma.wishlistItem.deleteMany({ where: { userId: user.id } });
          for (const item of body.wishlist) {
            const prodId = item.id || item.productId;
            if (prodId) {
              const prod = await prisma.product.findUnique({ where: { id: prodId } });
              if (prod) {
                await prisma.wishlistItem.create({
                  data: {
                    userId: user.id,
                    productId: prodId,
                  },
                });
              }
            }
          }
        }

        return NextResponse.json({ success: true, version: Date.now() });
      }
    }

    return NextResponse.json({ success: true, version: 1 });
  } catch (error) {
    console.error("POST /api/sync error:", error);
    return NextResponse.json({ error: "Invalid sync payload" }, { status: 400 });
  }
}
