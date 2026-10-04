import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Neon PostgreSQL database seeding...");

  const defaultPasswordHash = await bcrypt.hash("Atelier2026!", 10);

  // 1. Create / Upsert Users
  console.log("Creating users...");
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@inspire.com" },
    update: {},
    create: {
      name: "Atelier Administrator",
      email: "admin@inspire.com",
      phone: "+880 1800-000000",
      role: "admin",
      tier: "VIP Patron",
      passwordHash: defaultPasswordHash,
      preferredSize: "M",
      notifySms: true,
      notifyWhatsapp: true,
      notifyNewsletter: true,
    },
  });

  const patronUser = await prisma.user.upsert({
    where: { email: "farhana@inspire.com" },
    update: {},
    create: {
      name: "Farhana Nasrin",
      email: "farhana@inspire.com",
      phone: "+880 1711-234567",
      role: "vip",
      tier: "VIP Patron",
      passwordHash: defaultPasswordHash,
      preferredSize: "M",
      notifySms: true,
      notifyWhatsapp: true,
      notifyNewsletter: true,
    },
  });

  // 2. Patron Addresses
  console.log("Creating addresses...");
  await prisma.address.deleteMany({ where: { userId: patronUser.id } });
  await prisma.address.createMany({
    data: [
      {
        userId: patronUser.id,
        label: "Primary Residence",
        recipientName: "Farhana Nasrin",
        phone: "+880 1711-234567",
        street: "House 42, Road 11, Block D",
        area: "Banani",
        city: "Dhaka",
        postalCode: "1213",
        isDefault: true,
      },
      {
        userId: patronUser.id,
        label: "Creative Atelier / Studio",
        recipientName: "Farhana Nasrin",
        phone: "+880 1711-234567",
        street: "Level 5, Concord Tower, Gulshan Avenue",
        area: "Gulshan-2",
        city: "Dhaka",
        postalCode: "1212",
        isDefault: false,
      },
    ],
  });

  // 3. Categories
  console.log("Creating categories...");
  const categoriesData = [
    {
      name: "Fashion",
      slug: "fashion",
      count: 24,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
    },
    {
      name: "Hijab",
      slug: "hijab",
      count: 16,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
    },
    {
      name: "Beauty",
      slug: "beauty",
      count: 12,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
    },
    {
      name: "Accessories",
      slug: "accessories",
      count: 18,
      image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=900&auto=format&fit=crop",
    },
    {
      name: "Collections",
      slug: "collections",
      count: 8,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop",
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.name.toLowerCase()] = createdCat.id;
  }

  // 4. Products
  console.log("Creating products...");
  const productsSeed = [
    {
      id: "prod-1",
      title: "Tailored Virgin Wool Blazer",
      subtitle: "Italian virgin wool tailored silhouette",
      description: "Artisanal single-breasted blazer cut from certified Italian virgin wool with silk blend lining and handcrafted horn buttons.",
      price: 3450,
      compareAtPrice: 4200,
      category: "Fashion",
      categoryId: categoryMap["fashion"],
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop",
      ],
      tag: "Bestseller",
      rating: 4.9,
      reviewsCount: 28,
      inStock: true,
      stockCount: 45,
      sku: "VW-BLZ-001",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Noir Black", hex: "#18181b" },
        { name: "Midnight Navy", hex: "#1e293b" },
      ],
      specifications: {
        Material: "100% Virgin Wool",
        Origin: "Milan, Italy",
        Care: "Specialist Dry Clean Only",
        Fit: "Structured Tailored Fit",
      },
    },
    {
      id: "prod-2",
      title: "Double-Faced Wool Coat",
      subtitle: "Hand-finished double-face virgin wool",
      description: "Exquisite unlined coat crafted using double-face construction with hand-sewn edges and a relaxed draped silhouette.",
      price: 4200,
      compareAtPrice: 4950,
      category: "Fashion",
      categoryId: categoryMap["fashion"],
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=900&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=900&auto=format&fit=crop",
      ],
      tag: "New Arrival",
      rating: 4.8,
      reviewsCount: 19,
      inStock: true,
      stockCount: 30,
      sku: "DF-COT-002",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Ivory Cream", hex: "#f5f5f0" },
        { name: "Camel", hex: "#c19a6b" },
      ],
      specifications: {
        Material: "90% Wool, 10% Cashmere",
        Origin: "Dhaka Atelier Heritage Line",
        Care: "Dry Clean Only",
      },
    },
    {
      id: "prod-3",
      title: "Minimalist Cashmere Crewneck",
      subtitle: "Grade-A Mongolian yarn in Bone White",
      description: "Featherlight yet insulating crewneck sweater spun from ethically sourced Grade-A Mongolian cashmere fibers.",
      price: 2150,
      compareAtPrice: 2600,
      category: "Fashion",
      categoryId: categoryMap["fashion"],
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop",
      ],
      tag: "New Arrival",
      rating: 4.8,
      reviewsCount: 34,
      inStock: true,
      stockCount: 60,
      sku: "MC-CRW-003",
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Bone White", hex: "#f4f1ea" },
        { name: "Charcoal Slate", hex: "#334155" },
      ],
      specifications: {
        Material: "100% Cashmere (2-ply 12gg)",
        Origin: "Ulaanbaatar Spun",
        Care: "Hand wash cold or dry clean",
      },
    },
    {
      id: "prod-4",
      title: "Ribbed Merino Turtleneck",
      subtitle: "Extra-fine Australian merino wool knit",
      description: "Fine gauge turtleneck crafted from ultra-soft 19.5-micron Australian merino wool with delicate ribbed collar and cuffs.",
      price: 1850,
      compareAtPrice: 2200,
      category: "Fashion",
      categoryId: categoryMap["fashion"],
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop",
      ],
      tag: "Limited",
      rating: 4.9,
      reviewsCount: 15,
      inStock: true,
      stockCount: 25,
      sku: "RM-TRT-004",
      sizes: ["S", "M", "L"],
      colors: [{ name: "Noir Black", hex: "#18181b" }],
      specifications: {
        Material: "100% Extra-fine Merino Wool",
        Origin: "Melbourne Origin Wool",
      },
    },
    {
      id: "prod-5",
      title: "Luminous Silk Georgette Hijab",
      subtitle: "Hand-rolled hems on pure mulberry silk",
      description: "Featherweight georgette weave that provides effortless drape, zero slippage, and subtle natural luminescence.",
      price: 1250,
      compareAtPrice: 1500,
      category: "Hijab",
      categoryId: categoryMap["hijab"],
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
      ],
      tag: "Bestseller",
      rating: 4.9,
      reviewsCount: 42,
      inStock: true,
      stockCount: 80,
      sku: "HJ-GEO-005",
      sizes: ["Standard 180x75cm"],
      colors: [
        { name: "Champagne Gold", hex: "#d4af37" },
        { name: "Dusty Rose", hex: "#dcae96" },
        { name: "Olive Sage", hex: "#556b2f" },
      ],
      specifications: {
        Material: "100% Silk Georgette",
        Dimensions: "180 cm x 75 cm",
        Hemming: "Artisan Hand-rolled Stitch",
      },
    },
    {
      id: "prod-6",
      title: "Pure Modal Cashmere Blend Wrap",
      subtitle: "Micro-modal fibers with thermal regulating weave",
      description: "Ultra-breathable wrap combining modal soft fibers with fine cashmere touch for all-day comfort in tropical climates.",
      price: 950,
      compareAtPrice: 1200,
      category: "Hijab",
      categoryId: categoryMap["hijab"],
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=900&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=900&auto=format&fit=crop",
      ],
      tag: "Essential",
      rating: 4.8,
      reviewsCount: 22,
      inStock: true,
      stockCount: 50,
      sku: "HJ-MOD-006",
      sizes: ["Standard 190x80cm"],
      colors: [
        { name: "Noir Black", hex: "#18181b" },
        { name: "Ivory Cream", hex: "#f5f5f0" },
      ],
      specifications: {
        Material: "85% Lenzing Modal, 15% Cashmere",
        Dimensions: "190 cm x 80 cm",
      },
    },
    {
      id: "prod-7",
      title: "Damask Rose Botanical Face Elixir",
      subtitle: "Cold-pressed organic rosehip & marula oils",
      description: "Restorative face oil infusion loaded with vitamins A, C, and essential fatty acids for lasting skin radiance.",
      price: 1850,
      compareAtPrice: 2250,
      category: "Beauty",
      categoryId: categoryMap["beauty"],
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
      ],
      tag: "Organic",
      rating: 4.9,
      reviewsCount: 38,
      inStock: true,
      stockCount: 40,
      sku: "BT-ROS-007",
      sizes: ["30ml Dropper Bottle", "50ml Luxury Flacon"],
      colors: [],
      specifications: {
        Volume: "30 ml / 1 fl oz",
        Certification: "100% Organic USDA",
        Formula: "Cruelty Free, Vegan",
      },
    },
    {
      id: "prod-8",
      title: "Artisanal Full-Grain Leather Tote",
      subtitle: "Vegetable-tanned calfskin with brass hardware",
      description: "Structured architectural leather tote handcrafted by veteran artisans with suede interior and laptop sleeve.",
      price: 5400,
      compareAtPrice: 6500,
      category: "Accessories",
      categoryId: categoryMap["accessories"],
      image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=900&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=900&auto=format&fit=crop",
      ],
      tag: "Handcrafted",
      rating: 5.0,
      reviewsCount: 16,
      inStock: true,
      stockCount: 15,
      sku: "AC-TOT-008",
      sizes: ["One Size"],
      colors: [
        { name: "Cognac Brown", hex: "#8b4513" },
        { name: "Noir Black", hex: "#18181b" },
      ],
      specifications: {
        Material: "Full-Grain Italian Calfskin",
        Hardware: "Solid Antiqued Brass",
      },
    },
  ];

  for (const p of productsSeed) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }

  // 5. Coupons
  console.log("Creating coupons...");
  const couponsSeed = [
    {
      code: "ATELIER15",
      discount: "15% OFF",
      minSpend: "Min. spend ৳5,000",
      expiry: "Valid till Oct 31, 2026",
      description: "Exclusive seasonal privilege on all Autumn/Winter bespoke collections.",
      active: true,
    },
    {
      code: "VIPPATRON10",
      discount: "৳1,000 FLAT",
      minSpend: "Min. spend ৳6,500",
      expiry: "Valid till Nov 15, 2026",
      description: "Loyalty milestone appreciation voucher for Gold & VIP patrons.",
      active: true,
    },
    {
      code: "CONCIERGEFREE",
      discount: "COMPLIMENTARY SHIPPING",
      minSpend: "No minimum spend",
      expiry: "Permanent VIP Privilege",
      description: "White-glove courier service across all 64 districts in Bangladesh.",
      active: true,
    },
    {
      code: "INSPIRE10",
      discount: "10% OFF",
      minSpend: "Min. spend ৳3,000",
      expiry: "Valid till Dec 31, 2026",
      description: "10% off on all luxury apparel",
      active: true,
    },
  ];

  for (const c of couponsSeed) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  // 6. Orders
  console.log("Creating patron orders...");
  const order1 = await prisma.order.upsert({
    where: { orderNumber: "IL-89218" },
    update: {},
    create: {
      orderNumber: "IL-89218",
      userId: patronUser.id,
      customerName: "Farhana Nasrin",
      customerEmail: "farhana@inspire.com",
      customerPhone: "+880 1711-234567",
      subtotal: 7650,
      deliveryFee: 0,
      discount: 500,
      totalAmount: 7150,
      paymentMethod: "bKash Online Payment",
      paymentStatus: "Paid",
      orderStatus: "shipped",
      statusLabel: "In Transit",
      shippingAddress: "House 42, Road 11, Block D, Banani, Dhaka 1213",
      shippingCity: "Dhaka",
      courier: "Steadfast Express",
      trackingCode: "SF-89218042",
      estimatedDelivery: "Tomorrow by 3:00 PM",
      timeline: [
        {
          title: "Order Placed & Confirmed",
          description: "Your sartorial selection was verified and sent to our Dhaka Atelier.",
          timestamp: "Oct 02, 2026 · 11:20 AM",
          completed: true,
        },
        {
          title: "Atelier Inspection & Gift Box Packed",
          description: "Hand-finished, quality inspected, and packaged in signature luxury box.",
          timestamp: "Oct 03, 2026 · 02:45 PM",
          completed: true,
        },
        {
          title: "Handed over to Steadfast Express",
          description: "Consignment dispatched from Tejgaon Fulfillment Hub.",
          timestamp: "Oct 04, 2026 · 09:30 AM",
          completed: true,
          current: true,
        },
        {
          title: "Out for Concierge Delivery",
          description: "Our dedicated courier will contact you prior to delivery.",
          timestamp: "Estimated Oct 05, 2026",
          completed: false,
        },
      ],
      items: {
        create: [
          {
            productId: "prod-1",
            title: "Tailored Virgin Wool Blazer",
            price: 3450,
            quantity: 1,
            size: "M",
            color: "Noir Black",
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
            sku: "VW-BLZ-001-M",
          },
          {
            productId: "prod-2",
            title: "Double-Faced Wool Coat",
            price: 4200,
            quantity: 1,
            size: "L",
            color: "Ivory Cream",
            image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80",
            sku: "DF-COT-004-L",
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.upsert({
    where: { orderNumber: "IL-86410" },
    update: {},
    create: {
      orderNumber: "IL-86410",
      userId: patronUser.id,
      customerName: "Farhana Nasrin",
      customerEmail: "farhana@inspire.com",
      customerPhone: "+880 1711-234567",
      subtotal: 4000,
      deliveryFee: 0,
      discount: 0,
      totalAmount: 4000,
      paymentMethod: "Credit Card (Visa ···· 4242)",
      paymentStatus: "Paid",
      orderStatus: "delivered",
      statusLabel: "Delivered",
      shippingAddress: "House 42, Road 11, Block D, Banani, Dhaka 1213",
      shippingCity: "Dhaka",
      courier: "Pathao Logistics",
      trackingCode: "PT-86410991",
      estimatedDelivery: "Delivered on Sep 20, 2026",
      timeline: [
        {
          title: "Order Placed & Confirmed",
          description: "Payment confirmed via Visa card.",
          timestamp: "Sep 18, 2026 · 04:10 PM",
          completed: true,
        },
        {
          title: "Quality Check & Dispatch",
          description: "Inspected and sealed in tamper-proof garment bag.",
          timestamp: "Sep 19, 2026 · 10:00 AM",
          completed: true,
        },
        {
          title: "Delivered & Signed",
          description: "Received by patron at Banani residence.",
          timestamp: "Sep 20, 2026 · 01:15 PM",
          completed: true,
          current: false,
        },
      ],
      items: {
        create: [
          {
            productId: "prod-3",
            title: "Minimalist Cashmere Crewneck",
            price: 2150,
            quantity: 1,
            size: "M",
            color: "Champagne Gold",
            image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80",
            sku: "MC-CRW-009-M",
          },
        ],
      },
    },
  });

  // 7. Store CMS Settings
  console.log("Creating store CMS settings...");
  await prisma.storeSetting.upsert({
    where: { id: "global_cms" },
    update: {},
    create: {
      id: "global_cms",
      heroSlides: [
        {
          id: "autumn-winter",
          badge: "Autumn / Winter '26",
          title: "Curated Wardrobe Collection",
          description: "Hand-finished double-face virgin wool, pure cashmere, and sculpted tailoring.",
          ctaText: "Shop Collection",
          href: "/shop",
          image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400&auto=format&fit=crop",
          alt: "Autumn fashion showcase with premium outerwear",
          active: true,
        },
        {
          id: "minimalist-artisan",
          badge: "Signature Editorial",
          title: "Contemporary Style & Elegance",
          description: "Monochrome aesthetics with tactile natural fibers engineered for modern living.",
          ctaText: "Explore Lookbook",
          href: "/shop",
          image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1400&auto=format&fit=crop",
          alt: "Minimalist fashion editorial showcase",
          active: true,
        },
      ],
      announcement: {
        enabled: true,
        text: "Complimentary Concierge Delivery Across Bangladesh on Orders Over ৳5,000",
        linkText: "Explore Collection",
        linkHref: "/shop",
      },
      footerConfig: {
        brandName: "INSPIRE LIFESTYLE",
        tagline: "Curated architectural garments, knitwear, and lifestyle goods designed with enduring proportion and tactile luxury.",
        phone: "+880 1800-000000",
        email: "support@inspirelifestyle.com",
        address: "Road 11, Block D, Banani, Dhaka-1213",
        copyright: "© 2026 INSPIRE LIFESTYLE. All rights reserved.",
      },
      sizes: [
        { id: "size-xs", name: "Extra Small", code: "XS", description: "Chest 34-36 in · Waist 28-30 in", active: true },
        { id: "size-s", name: "Small", code: "S", description: "Chest 36-38 in · Waist 30-32 in", active: true },
        { id: "size-m", name: "Medium", code: "M", description: "Chest 38-40 in · Waist 32-34 in", active: true },
        { id: "size-l", name: "Large", code: "L", description: "Chest 40-42 in · Waist 34-36 in", active: true },
        { id: "size-xl", name: "Extra Large", code: "XL", description: "Chest 42-44 in · Waist 36-38 in", active: true },
      ],
      colors: [
        { id: "col-noir", name: "Noir Black", hex: "#18181b", description: "Deep midnight jet black textile", active: true },
        { id: "col-ivory", name: "Ivory Cream", hex: "#f5f5f0", description: "Luminous unbleached silk and organic cotton", active: true },
        { id: "col-navy", name: "Midnight Navy", hex: "#1e293b", description: "Regal deep maritime navy hue", active: true },
        { id: "col-gold", name: "Champagne Gold", hex: "#d4af37", description: "Warm metallic gold thread accent", active: true },
      ],
    },
  });

  console.log("✅ Neon PostgreSQL seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
