import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidateOrder } from "@/lib/cache/revalidate";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id] - Fetch single order by id or orderNumber
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            tier: true,
            avatar: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("GET /api/orders/[id] failed:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PATCH /api/orders/[id] - Update order status or logistics details
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Determine status label
    let statusLabel = existing.statusLabel;
    if (body.orderStatus) {
      const labels: Record<string, string> = {
        pending: "Pending Confirmation",
        processing: "Processing in Atelier",
        shipped: "In Transit",
        delivered: "Delivered",
        cancelled: "Cancelled",
      };
      statusLabel = labels[body.orderStatus] || body.orderStatus;
    }

    // Append to timeline if status changed
    let updatedTimeline = existing.timeline as Array<Record<string, unknown>> || [];
    if (body.orderStatus && body.orderStatus !== existing.orderStatus) {
      updatedTimeline = [
        ...updatedTimeline,
        {
          title: `Status updated to ${statusLabel}`,
          description: body.statusNote || `Order status marked as ${statusLabel}.`,
          timestamp: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          completed: true,
          current: true,
        },
      ];
    }

    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: {
        orderStatus: body.orderStatus !== undefined ? body.orderStatus : undefined,
        statusLabel: body.orderStatus !== undefined ? statusLabel : undefined,
        paymentStatus: body.paymentStatus !== undefined ? body.paymentStatus : undefined,
        courier: body.courier !== undefined ? body.courier : undefined,
        trackingCode: body.trackingCode !== undefined ? body.trackingCode : undefined,
        estimatedDelivery: body.estimatedDelivery !== undefined ? body.estimatedDelivery : undefined,
        notes: body.notes !== undefined ? body.notes : undefined,
        timeline: updatedTimeline as unknown as Prisma.InputJsonValue,
      },
      include: {
        items: true,
      },
    });

    revalidateOrder(existing.id);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/orders/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
