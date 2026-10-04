import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateProducts } from "@/lib/cache/revalidate";

export const dynamic = "force-dynamic";

// GET /api/products - Retrieve products catalog with filtering and search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const inStock = searchParams.get("inStock");
    const sort = searchParams.get("sort");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // Build filter query
    const where: Record<string, unknown> = {};

    if (category && category !== "All") {
      where.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { subtitle: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (inStock !== null && inStock !== undefined) {
      if (inStock === "true") where.inStock = true;
      if (inStock === "false") where.inStock = false;
    }

    // Determine sort ordering
    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "rating") orderBy = { rating: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        categoryRel: {
          select: { name: true, slug: true },
        },
      },
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      products,
      total,
    });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      price,
      compareAtPrice,
      category,
      categoryId,
      image,
      gallery,
      tag,
      inStock,
      stockCount,
      sku,
      sizes,
      colors,
      specifications,
    } = body;

    if (!title || price === undefined) {
      return NextResponse.json({ error: "Title and price are required" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        category: category || "Fashion",
        categoryId: categoryId || null,
        image: image || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
        gallery: Array.isArray(gallery) ? gallery : [],
        tag: tag || null,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        stockCount: stockCount ? Number(stockCount) : 50,
        sku: sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
        sizes: Array.isArray(sizes) ? sizes : [],
        colors: colors || [],
        specifications: specifications || {},
      },
    });

    // Invalidate product caches
    revalidateProducts();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST /api/products failed:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
