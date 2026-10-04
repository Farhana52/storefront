import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateOrders } from "@/lib/cache/revalidate";

export const dynamic = "force-dynamic";

// GET /api/orders - Fetch orders (supports patron or admin filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const customerEmail = searchParams.get("customerEmail");
    const customerPhone = searchParams.get("customerPhone");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const where: Record<string, unknown> = {};

    if (userId) {
      where.userId = userId;
    } else if (customerEmail || customerPhone) {
      where.OR = [
        ...(customerEmail ? [{ customerEmail: { equals: customerEmail, mode: "insensitive" } }] : []),
        ...(customerPhone ? [{ customerPhone: { contains: customerPhone.replace(/[^0-9]/g, "") } }] : []),
      ];
    }

    if (status && status !== "all") {
      where.orderStatus = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
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

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET /api/orders failed:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders - Create a new order (from storefront checkout or admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      deliveryFee = 0,
      discount = 0,
      totalAmount,
      paymentMethod = "cod",
      paymentStatus = "unpaid",
      shippingAddress,
      shippingCity = "Dhaka",
      courier = "Steadfast Express",
      notes,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required order details" }, { status: 400 });
    }

    // Generate unique order number: IL-XXXXX
    const orderNumber = `IL-${Math.floor(10000 + Math.random() * 90000)}`;

    const initialTimeline = [
      {
        title: "Order Placed & Confirmed",
        description: `Order received via ${paymentMethod.toUpperCase()}.`,
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

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        customerName,
        customerEmail: customerEmail || null,
        customerPhone,
        subtotal: Number(subtotal),
        deliveryFee: Number(deliveryFee),
        discount: Number(discount),
        totalAmount: Number(totalAmount),
        paymentMethod,
        paymentStatus,
        orderStatus: "pending",
        statusLabel: "Pending Confirmation",
        shippingAddress,
        shippingCity,
        courier,
        notes: notes || null,
        timeline: initialTimeline,
        items: {
          create: items.map((item: {
            productId?: string;
            title: string;
            price: number;
            quantity: number;
            size?: string;
            color?: string;
            image?: string;
            sku?: string;
          }) => ({
            productId: item.productId || null,
            title: item.title,
            price: Number(item.price),
            quantity: Number(item.quantity) || 1,
            size: item.size || null,
            color: item.color || null,
            image: item.image || null,
            sku: item.sku || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    revalidateOrders();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders failed:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
