import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateProduct, revalidateProducts } from "@/lib/cache/revalidate";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id] - Fetch single product
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categoryRel: true,
        reviews: {
          where: { status: "approved" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] failed:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id] - Update existing product
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle !== undefined ? body.subtitle : undefined,
        description: body.description !== undefined ? body.description : undefined,
        price: body.price !== undefined ? Number(body.price) : undefined,
        compareAtPrice: body.compareAtPrice !== undefined ? (body.compareAtPrice ? Number(body.compareAtPrice) : null) : undefined,
        category: body.category !== undefined ? body.category : undefined,
        categoryId: body.categoryId !== undefined ? body.categoryId : undefined,
        image: body.image !== undefined ? body.image : undefined,
        gallery: Array.isArray(body.gallery) ? body.gallery : undefined,
        tag: body.tag !== undefined ? body.tag : undefined,
        inStock: body.inStock !== undefined ? Boolean(body.inStock) : undefined,
        stockCount: body.stockCount !== undefined ? Number(body.stockCount) : undefined,
        sku: body.sku !== undefined ? body.sku : undefined,
        sizes: Array.isArray(body.sizes) ? body.sizes : undefined,
        colors: body.colors !== undefined ? body.colors : undefined,
        specifications: body.specifications !== undefined ? body.specifications : undefined,
      },
    });

    revalidateProduct(id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/products/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    revalidateProducts();
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/products/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
