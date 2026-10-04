import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateUserAddresses } from "@/lib/cache/revalidate";

export const dynamic = "force-dynamic";

// Helper to resolve user ID from query or fallback to default patron
async function resolveUserId(request: Request): Promise<string | null> {
  const { searchParams } = new URL(request.url);
  const explicitUserId = searchParams.get("userId");
  if (explicitUserId) return explicitUserId;

  const email = searchParams.get("email");
  const phone = searchParams.get("phone");

  if (email || phone) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });
    if (user) return user.id;
  }

  // Fallback to initial seeded patron for smooth client experience
  const fallback = await prisma.user.findFirst({
    where: { email: "farhana@inspire.com" },
  });
  return fallback?.id || null;
}

// GET /api/customer/addresses - List patron addresses
export async function GET(request: Request) {
  try {
    const userId = await resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ addresses: [] });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("GET /api/customer/addresses failed:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// POST /api/customer/addresses - Create a new address
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || (await resolveUserId(request));

    if (!userId) {
      return NextResponse.json({ error: "User authentication required" }, { status: 401 });
    }

    const {
      label,
      recipientName,
      phone,
      street,
      area,
      city,
      postalCode,
      isDefault = false,
    } = body;

    if (!label || !recipientName || !phone || !street || !area || !city || !postalCode) {
      return NextResponse.json({ error: "All address fields are required" }, { status: 400 });
    }

    // If marked as default, clear previous defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        label,
        recipientName,
        phone,
        street,
        area,
        city,
        postalCode,
        isDefault: Boolean(isDefault),
      },
    });

    revalidateUserAddresses(userId);
    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("POST /api/customer/addresses failed:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}

// PUT /api/customer/addresses - Update an existing address
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, isDefault, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: existing.userId },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        ...rest,
        isDefault: isDefault !== undefined ? Boolean(isDefault) : undefined,
      },
    });

    revalidateUserAddresses(existing.userId);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/customer/addresses failed:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

// DELETE /api/customer/addresses - Delete an address
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });
    revalidateUserAddresses(existing.userId);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/customer/addresses failed:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
