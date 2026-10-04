import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateCoupons } from "@/lib/cache/revalidate";

export const dynamic = "force-dynamic";

// GET /api/coupons - List all vouchers/coupons
export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("GET /api/coupons failed:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

// POST /api/coupons - Create, toggle, or delete coupon
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action = "create", code, discount, minSpend, expiry, description, active, id } = body;

    if (action === "toggle" && id) {
      const existing = await prisma.coupon.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

      const updated = await prisma.coupon.update({
        where: { id },
        data: { active: !existing.active },
      });
      revalidateCoupons();
      return NextResponse.json(updated);
    }

    if (action === "delete" && id) {
      await prisma.coupon.delete({ where: { id } });
      revalidateCoupons();
      return NextResponse.json({ success: true, id });
    }

    if (!code || !discount) {
      return NextResponse.json({ error: "Code and discount are required" }, { status: 400 });
    }

    const created = await prisma.coupon.upsert({
      where: { code: code.toUpperCase() },
      update: {
        discount,
        minSpend,
        expiry,
        description,
        active: active !== undefined ? Boolean(active) : true,
      },
      create: {
        code: code.toUpperCase(),
        discount,
        minSpend,
        expiry,
        description,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    revalidateCoupons();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/coupons failed:", error);
    return NextResponse.json({ error: "Failed to process coupon action" }, { status: 500 });
  }
}
