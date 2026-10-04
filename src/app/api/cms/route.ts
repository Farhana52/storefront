import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateCMS } from "@/lib/cache/revalidate";

export const dynamic = "force-dynamic";

// GET /api/cms - Retrieve global store settings and CMS blocks
export async function GET() {
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { id: "global_cms" },
    });

    if (!setting) {
      return NextResponse.json({
        heroSlides: [],
        announcement: {},
        footerConfig: {},
        sizes: [],
        colors: [],
      });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("GET /api/cms failed:", error);
    return NextResponse.json({ error: "Failed to fetch CMS settings" }, { status: 500 });
  }
}

// POST /api/cms - Update store settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { heroSlides, announcement, footerConfig, sizes, colors } = body;

    const updated = await prisma.storeSetting.upsert({
      where: { id: "global_cms" },
      update: {
        heroSlides: heroSlides !== undefined ? heroSlides : undefined,
        announcement: announcement !== undefined ? announcement : undefined,
        footerConfig: footerConfig !== undefined ? footerConfig : undefined,
        sizes: sizes !== undefined ? sizes : undefined,
        colors: colors !== undefined ? colors : undefined,
      },
      create: {
        id: "global_cms",
        heroSlides: heroSlides || [],
        announcement: announcement || {},
        footerConfig: footerConfig || {},
        sizes: sizes || [],
        colors: colors || [],
      },
    });

    revalidateCMS();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/cms failed:", error);
    return NextResponse.json({ error: "Failed to update CMS settings" }, { status: 500 });
  }
}
