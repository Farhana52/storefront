import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateCategories } from "@/lib/cache/revalidate";

export const dynamic = "force-dynamic";

// GET /api/categories - Retrieve all categories with product count
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: cat._count.products,
      image: cat.image,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/categories - Create or update a category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, image } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const category = await prisma.category.upsert({
      where: { slug },
      update: { name, image },
      create: { name, slug, image },
    });

    revalidateCategories();
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories failed:", error);
    return NextResponse.json({ error: "Failed to save category" }, { status: 500 });
  }
}
