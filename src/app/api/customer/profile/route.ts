import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/customer/profile - Retrieve patron profile details
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const id = searchParams.get("id");

    const where: Record<string, unknown> = {};
    if (id) {
      where.id = id;
    } else if (email || phone) {
      where.OR = [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ];
    } else {
      // Default to seeded patron Farhana Nasrin
      where.email = "farhana@inspire.com";
    }

    const user = await prisma.user.findFirst({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        tier: true,
        preferredSize: true,
        notifySms: true,
        notifyWhatsapp: true,
        notifyNewsletter: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/customer/profile failed:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// PUT /api/customer/profile - Update profile and preferences
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, email, phone, name, preferredSize, notifySms, notifyWhatsapp, notifyNewsletter } = body;

    // Find target user
    let targetId = id;
    if (!targetId) {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            ...(email ? [{ email }] : []),
            ...(phone ? [{ phone }] : []),
            { email: "farhana@inspire.com" },
          ],
        },
      });
      targetId = user?.id;
    }

    if (!targetId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id: targetId },
      data: {
        name: name !== undefined ? name : undefined,
        preferredSize: preferredSize !== undefined ? preferredSize : undefined,
        notifySms: notifySms !== undefined ? Boolean(notifySms) : undefined,
        notifyWhatsapp: notifyWhatsapp !== undefined ? Boolean(notifyWhatsapp) : undefined,
        notifyNewsletter: notifyNewsletter !== undefined ? Boolean(notifyNewsletter) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        tier: true,
        preferredSize: true,
        notifySms: true,
        notifyWhatsapp: true,
        notifyNewsletter: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/customer/profile failed:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
